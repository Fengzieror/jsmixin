/* 由 jsmixin build-tool 生成，勿手改。源: Log.mark.ts */
(typeof window !== 'undefined' ? window : globalThis).__mixin.register({
  "modid": "log-mod",
  "version": "1.0.0",
  "mixins": [
    {
      "file": "ui.js",
      "patches": [
        {
          "name": "LogMark.spy",
          "path": [
            {
              "name": "UI.Toast.show"
            }
          ],
          "op": "inject",
          "at": "head",
          "code": "console.log('[log] Toast.show: ' + msg);"
        },
        {
          "name": "LogMark.rebrand",
          "path": [
            {
              "name": "UI.Toast.show"
            }
          ],
          "op": "modify",
          "find": "'[UI] ' + msg",
          "replace": "'[UI✦] ' + msg"
        }
      ]
    }
  ],
  "name": "LogMod",
  "priority": 10
});
