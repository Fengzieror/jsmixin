/* 由 jsmixin build-tool 生成，勿手改。源: V3.mark.ts */
window.__mixin.register({
  "modid": "v3-mod",
  "version": "0.1.0",
  "mixins": [
    {
      "file": "sample-es6.js",
      "patches": [
        {
          "name": "MethodArgMark.logTick",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "Cls"
            },
            {
              "method": "tick"
            }
          ],
          "op": "inject",
          "at": "head",
          "code": "console.log('[v3] tick enter');"
        },
        {
          "name": "MethodArgMark.wrapDist",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "Cls"
            },
            {
              "method": "dist"
            }
          ],
          "op": "wrap",
          "code": "return $orig() + 100;"
        },
        {
          "name": "GateMark.target",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "gate"
            }
          ],
          "op": "inject",
          "at": "head",
          "cancellable": true,
          "code": "if (open === 'force') {\n      console.log('[v3] gate cancelled');\n      return 'cancelled';\n    }"
        },
        {
          "name": "CounterMark.target",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "counter"
            }
          ],
          "op": "modifyReturn",
          "code": "return $value * 2;"
        },
        {
          "name": "ExprCallMark.target",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "caller"
            }
          ],
          "op": "wrapValue",
          "code": "return $value * 10;",
          "call": "helper",
          "nth": 1
        },
        {
          "name": "ExprFindAndArgsMark.retargetArgs",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "caller2"
            }
          ],
          "op": "modifyArgs",
          "code": "return [$args[0] + 5];",
          "call": "helper",
          "nth": 0
        },
        {
          "name": "ExprFindAndArgsMark.wrapSecond",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "caller2"
            }
          ],
          "op": "wrapValue",
          "code": "return $value + 1000;",
          "find": "helper(2)"
        },
        {
          "name": "ShareLocalMark.declareTotal",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "counter2"
            }
          ],
          "op": "inject",
          "at": "head",
          "code": "var total = 42;"
        },
        {
          "name": "ShareLocalMark.readAll",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "counter2"
            }
          ],
          "op": "inject",
          "at": "tail",
          "code": "console.log('[v3] counter2 tail: bonus=' + bonus + ' total=' + total);"
        },
        {
          "name": "ExportMark.target$export",
          "path": [
            {
              "wrap": "cjs"
            }
          ],
          "op": "inject",
          "at": "tail",
          "code": "\nwindow.__mixin_exports = window.__mixin_exports || {};\nObject.defineProperty(window.__mixin_exports, \"stepFn\", { get: function () { return step; }, set: function (v) { step = v; }, configurable: !0 });"
        }
      ]
    }
  ],
  "name": "V3Mod",
  "priority": 100
});
