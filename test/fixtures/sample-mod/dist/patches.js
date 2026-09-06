/* 由 jsmixin build-tool 生成，勿手改。源: Demo.mark.ts */
window.__mixin.register({
  "modid": "demo-mod",
  "version": "0.1.0",
  "mixins": [
    {
      "file": "sample.js",
      "patches": [
        {
          "name": "CounterMark.tick",
          "path": [
            {
              "module": "7"
            },
            {
              "name": "App"
            },
            {
              "method": "tick"
            }
          ],
          "op": "inject",
          "at": "head",
          "code": "console.log('[demo] tick enter');"
        },
        {
          "name": "TickWrapMark.target",
          "path": [
            {
              "module": "7"
            },
            {
              "name": "App"
            },
            {
              "method": "tick"
            }
          ],
          "op": "wrap",
          "code": "console.log('[demo] tick wrap before');\n        return $orig();"
        },
        {
          "name": "BootMark.target",
          "path": [
            {
              "module": "7"
            },
            {
              "name": "boot"
            },
            {
              "anchor": {
                "calls": [
                  "helper"
                ],
                "params": 1
              }
            }
          ],
          "op": "inject",
          "at": "tail",
          "code": "console.log('[demo] boot tail');"
        },
        {
          "name": "ExportMark.target$export",
          "path": [
            {
              "module": "7"
            },
            {
              "name": "boot"
            }
          ],
          "op": "inject",
          "at": "tail",
          "code": "\nwindow.__mixin_exports = window.__mixin_exports || {};\nwindow.__mixin_exports[\"stepFn\"] = step;"
        }
      ]
    }
  ],
  "name": "DemoMod",
  "priority": 100
});
