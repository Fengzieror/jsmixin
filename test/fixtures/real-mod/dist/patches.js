/* 由 jsmixin build-tool 生成，勿手改。源: Real.mark.ts */
window.__mixin.register({
  "modid": "real-smoke",
  "version": "0.0.1",
  "mixins": [
    {
      "file": "main.min.js",
      "patches": [
        {
          "name": "ModuleTailMark.target",
          "path": [
            {
              "module": "625"
            }
          ],
          "op": "inject",
          "at": "tail",
          "code": "window.__mixinBoot && window.__mixinBoot(Laya);"
        },
        {
          "name": "XsMark.target",
          "path": [
            {
              "module": "625"
            },
            {
              "name": "XS"
            }
          ],
          "op": "inject",
          "at": "head",
          "code": "console.log('[real-smoke] XS enter');"
        },
        {
          "name": "RetryMark.target",
          "path": [
            {
              "module": "625"
            },
            {
              "anchor": {
                "strings": [
                  "秒后重试"
                ]
              }
            },
            {
              "anchor": {
                "strings": [
                  "秒后重试"
                ],
                "params": 0
              }
            }
          ],
          "op": "inject",
          "at": "head",
          "code": "console.log('[real-smoke] retry-countdown enter');"
        }
      ]
    }
  ]
});
