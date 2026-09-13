/* 由 jsmixin build-tool 生成，勿手改。源: V2.mark.ts */
window.__mixin.register({
  "modid": "v2-mod",
  "version": "0.1.0",
  "mixins": [
    {
      "file": "sample-es6.js",
      "patches": [
        {
          "name": "RedirectMark.redirectHelper",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "calc"
            }
          ],
          "op": "redirect",
          "code": "return $args[0] * 10;",
          "call": "helper"
        },
        {
          "name": "WrapMark.wrapHelper",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "calc2"
            }
          ],
          "op": "wrapCall",
          "code": "return $orig($args[0] + 1);",
          "call": "helper"
        },
        {
          "name": "ModifyArgMark.modifyArgHelper",
          "path": [
            {
              "wrap": "cjs"
            },
            {
              "name": "calc3"
            }
          ],
          "op": "modifyArg",
          "code": "return $arg + 100;",
          "call": "helper",
          "arg": 0
        }
      ]
    }
  ],
  "name": "V2Mod",
  "priority": 100
});
