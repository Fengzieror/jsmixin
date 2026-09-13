/* 由 jsmixin build-tool 生成，勿手改。源: Demo.mark.ts */
(typeof window !== 'undefined' ? window : globalThis).__mixin.register({
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
          "code": "\n(typeof window !== 'undefined' ? window : globalThis).__mixin_exports = (typeof window !== 'undefined' ? window : globalThis).__mixin_exports || {};\n(typeof window !== 'undefined' ? window : globalThis).__mixin_exports[\"stepFn\"] = step;"
        },
        {
          "name": "ModifyMark.target",
          "path": [
            {
              "module": "7"
            },
            {
              "name": "helper"
            }
          ],
          "op": "modify",
          "find": "return x + 1;",
          "replace": "return x + 2;"
        }
      ]
    }
  ],
  "name": "DemoMod",
  "priority": 100
});
