'use strict';

// ── 宿主"游戏"代码：命名空间对象形态 ────────────────────────────────
// 真实游戏常见的 UI 聚合对象，演示点分命名空间寻址（UI.Toast.show）。

var UI = {
    version: '2.1.90',
    Toast: {
        show: function (msg) {
            return '[UI] ' + msg;
        }
    }
};

module.exports = UI;
