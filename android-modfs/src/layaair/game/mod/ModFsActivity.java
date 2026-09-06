package layaair.game.mod;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

/**
 * 透明辅助 Activity：承载两种授权流程的系统对话框（授权对话框/文件夹选择器
 * 都必须由 Activity 发起并接收结果，无法从 Application/后台发起）。
 *
 * - API 23..29：旧版运行时权限（READ/WRITE_EXTERNAL_STORAGE），manifest 已声明；
 *   Android 11 上由 application 的 requestLegacyExternalStorage=true 兜住。
 * - API 30+：scoped storage 强制，走 ACTION_OPEN_DOCUMENT_TREE 授权
 *   .battlecraft 文件夹（用户也可授权其上级目录），takePersistableUriPermission
 *   持久化并把 tree URI 存 shared_prefs（ModFs 读取时校验仍持有）。
 *
 * 由 ModFs.ensure() 从任意线程经 NEW_TASK 启动；对话框结束（无论成败）即 finish，
 * 结果状态由 JS 侧 modFsStatus() 轮询感知。
 */
public class ModFsActivity extends Activity {

    private static final int REQ_LEGACY_PERM = 7001;
    private static final int REQ_SAF_TREE = 7002;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        int sdk = Build.VERSION.SDK_INT;
        if (sdk < 23) {
            finish(); // 无运行时权限模型，真实路径本就可读
            return;
        }
        if (sdk >= 30) {
            try {
                // 选择器默认停在主存储根；用户选 .battlecraft（或其上级）即可
                Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
                i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION
                        | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION
                        | Intent.FLAG_GRANT_PREFIX_URI_PERMISSION);
                startActivityForResult(i, REQ_SAF_TREE);
            } catch (Throwable t) {
                finish();
            }
        } else {
            String[] perms = new String[] {
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE };
            boolean need = false;
            for (String p : perms) {
                if (checkSelfPermission(p) != PackageManager.PERMISSION_GRANTED) need = true;
            }
            if (need) {
                requestPermissions(perms, REQ_LEGACY_PERM);
            } else {
                finish();
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        // 无论授予/拒绝都直接结束；状态由 ModFs.legacyState() 反映，JS 侧重试
        finish();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_SAF_TREE && resultCode == RESULT_OK && data != null
                && data.getData() != null) {
            try {
                Uri treeUri = data.getData();
                // 持久化授权（读即可；写留待未来 mod 安装器，先一起持久化减少二次弹窗）
                getContentResolver().takePersistableUriPermission(treeUri,
                        Intent.FLAG_GRANT_READ_URI_PERMISSION);
                SharedPreferences sp = getSharedPreferences(ModFs.PREFS, 0);
                sp.edit().putString(ModFs.KEY_SAF_URI, treeUri.toString()).commit();
            } catch (Throwable t) { /* 用户仍可重试 */ }
        }
        finish();
    }
}
