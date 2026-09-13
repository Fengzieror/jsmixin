package layaair.game.mod;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.UriPermission;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.provider.DocumentsContract;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

/**
 * mod 文件系统：外部 mod 装载的存储访问（双模式授权），供 conch native 经 JNI 调用。
 *
 * 模式A 旧版存储权限：Android 10 及以下（manifest 声明 requestLegacyExternalStorage
 *       时含 Android 11）——运行时授权后真实路径 fopen 直读（native readFileSync）。
 * 模式B SAF 文件夹授权：Android 11+（scoped storage 强制）——用户经
 *       ACTION_OPEN_DOCUMENT_TREE 授权 .battlecraft 文件夹（或其上级）并持久化授权，
 *       读取经 ContentResolver（fopen 不支持 content://）。
 *
 * native 接口（JSGlobalExportCFun.cpp）：status() / ensure() / readSync(absPath)。
 * 本类由 APK 组装线以独立 dex 注入游戏 APK（jsmixin/tools/build_mixin_apk.py）；
 * 授权 UI 由透明辅助 Activity ModFsActivity 承担（manifest 组装时合并）。
 *
 * status() 返回 JSON（手工拼装，无 org.json 依赖）：
 *   {"sdk":33,"legacy":0|1|2,"saf":"content://...或空","root":"/storage/emulated/0"}
 *   legacy: 0=未授权 1=已授权(真实路径可直读) 2=不需要(API<23)
 *   readSync 可用性 = legacy==1 || legacy==2 || saf 非空
 */
public class ModFs {

    public static final String PREFS = "modfs";
    public static final String KEY_SAF_URI = "saf_uri";
    /** 存储根下的 mod 基目录名（与外部启动器的 mod 存储约定一致） */
    public static final String MOD_BASE = ".battlecraft";

    /** JS 侧判断"当前可读 mod 目录"用：legacy 已授权 / 不需要 / 已有 SAF 授权 */
    public static boolean hasAccess() {
        int lg = legacyState();
        if (lg == 1 || lg == 2) return true;
        return getSafUri() != null;
    }

    /**
     * 无可用访问时拉起授权流程（透明 Activity 内决定走旧版运行时权限还是 SAF）。
     * 可从任意线程调用（内部 post 到主线程）。返回 true=已有访问；false=已拉起流程。
     */
    public static boolean ensure() {
        if (hasAccess()) return true;
        final Context ctx = appContext();
        if (ctx == null) return false;
        Handler h = new Handler(ctx.getMainLooper());
        h.post(new Runnable() {
            public void run() {
                try {
                    Intent i = new Intent(ctx, ModFsActivity.class);
                    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    ctx.startActivity(i);
                } catch (Throwable t) { /* fail-safe */ }
            }
        });
        return false;
    }

    /** 读文件：真实路径优先（模式A），失败尝试 SAF（模式B）。失败返回 ""。 */
    public static String readSync(String absPath) {
        if (absPath == null || absPath.length() == 0) return "";
        // 模式A：真实路径直读（legacy 已授权时 fopen 本来就能读；这里兜底再试一次）
        String s = readRealPath(absPath);
        if (s != null) return s;
        // 模式B：SAF 授权树内读取
        return readSaf(absPath);
    }

    /* ---------- status ---------- */

    public static String status() {
        int lg = legacyState();
        String saf = getSafUri();
        String root = storageRoot();
        StringBuilder sb = new StringBuilder();
        sb.append("{\"sdk\":").append(android.os.Build.VERSION.SDK_INT);
        sb.append(",\"legacy\":").append(lg);
        sb.append(",\"saf\":\"").append(jsonEsc(saf == null ? "" : saf)).append('"');
        sb.append(",\"root\":\"").append(jsonEsc(root == null ? "" : root)).append('"');
        sb.append('}');
        return sb.toString();
    }

    private static int legacyState() {
        if (android.os.Build.VERSION.SDK_INT < 23) return 2; // 无运行时权限模型
        try {
            Context ctx = appContext();
            if (ctx == null) return 0;
            int r = ctx.checkSelfPermission("android.permission.READ_EXTERNAL_STORAGE");
            int w = ctx.checkSelfPermission("android.permission.WRITE_EXTERNAL_STORAGE");
            return (r == 0 && w == 0) ? 1 : 0;
        } catch (Throwable t) {
            return 0;
        }
    }

    /** 持久化的 SAF 授权（含最近一次校验：权限可能被系统回收，回收后视同无授权） */
    private static String getSafUri() {
        try {
            Context ctx = appContext();
            if (ctx == null) return null;
            SharedPreferences sp = ctx.getSharedPreferences(PREFS, 0);
            String uri = sp.getString(KEY_SAF_URI, null);
            if (uri == null || uri.length() == 0) return null;
            Uri parsed = Uri.parse(uri);
            for (UriPermission p : ctx.getContentResolver().getPersistedUriPermissions()) {
                if (p.getUri().toString().equals(uri) && p.isReadPermission()) return uri;
            }
            return null; // 持久授权已失效
        } catch (Throwable t) {
            return null;
        }
    }

    private static String storageRoot() {
        try {
            return Environment.getExternalStorageDirectory().getAbsolutePath();
        } catch (Throwable t) {
            return "/storage/emulated/0";
        }
    }

    /* ---------- 模式A：真实路径 ---------- */

    private static String readRealPath(String absPath) {
        try {
            File f = new File(absPath);
            if (!f.isFile()) return null;
            FileInputStream in = new FileInputStream(f);
            return readAll(in);
        } catch (Throwable t) {
            return null;
        }
    }

    /* ---------- 模式B：SAF ---------- */

    /**
     * 绝对路径 → 授权树内文档读取。
     * tree 文档 id 形如 "primary:.battlecraft"（用户选的文件夹），绝对路径
     * /storage/emulated/0/.battlecraft/mods/x/patches.js 的树内相对段是
     * /mods/x/patches.js，拼成 "primary:.battlecraft/mods/x/patches.js"。
     * 用户若授权了更上层（如根目录），相对段从存储根算起，同样成立。
     */
    private static String readSaf(String absPath) {
        try {
            Context ctx = appContext();
            String uri = getSafUri();
            if (ctx == null || uri == null) return "";
            Uri treeUri = Uri.parse(uri);
            String treeDocId = DocumentsContract.getTreeDocumentId(treeUri); // "primary:.battlecraft"
            String treeDir = null; // treeDocId 中 "primary:" 之后的真实目录路径
            int colon = treeDocId.indexOf(':');
            String volume = colon >= 0 ? treeDocId.substring(0, colon) : null; // "primary"
            if (colon >= 0 && treeDocId.length() > colon + 1) {
                treeDir = treeDocId.substring(colon + 1); // ".battlecraft"（可为空=卷根）
            }
            String root = storageRoot();
            if (!absPath.startsWith(root + "/")) return "";
            String rel = absPath.substring(root.length() + 1); // ".battlecraft/mods/x/patches.js"
            String docId;
            if (treeDir != null && treeDir.length() > 0) {
                if (!rel.startsWith(treeDir + "/") && !rel.equals(treeDir)) return "";
                rel = rel.substring(treeDir.length()); // "/mods/x/patches.js"
                docId = treeDocId + rel;
            } else {
                docId = volume + ":" + rel; // 授权的是卷根
            }
            Uri doc = DocumentsContract.buildDocumentUriUsingTree(treeUri, docId);
            InputStream in = ctx.getContentResolver().openInputStream(doc);
            return readAll(in);
        } catch (Throwable t) {
            return "";
        }
    }

    /* ---------- 工具 ---------- */

    /** 应用 Context：经 ActivityThread 反射获取（无静态注册的初始化入口可挂） */
    public static Context appContext() {
        try {
            Class<?> at = Class.forName("android.app.ActivityThread");
            Object app = at.getMethod("currentApplication").invoke(null);
            return app instanceof Context ? (Context) app : null;
        } catch (Throwable t) {
            return null;
        }
    }

    private static String readAll(InputStream in) throws Exception {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return new String(out.toByteArray(), "UTF-8");
        } finally {
            try { in.close(); } catch (Throwable ignore) {}
        }
    }

    private static String jsonEsc(String s) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"' || c == '\\') { sb.append('\\').append(c); }
            else if (c < 0x20) { sb.append(String.format("\\u%04x", (int) c)); }
            else sb.append(c);
        }
        return sb.toString();
    }
}
