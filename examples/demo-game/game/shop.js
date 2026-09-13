'use strict';

// ── 宿主"游戏"代码：IIFE 工厂形态（真实压缩 bundle 的典型样子）──────
// module.exports = (function(){ ... })(); 闭包状态 gold 外界不可见，
// 只能靠 @Export（defineProperty get/set 直达闭包绑定）把它开出来。

module.exports = (function () {
    var gold = 100;

    function applyDiscount(price) {
        return price;
    }

    function buy(item, price) {
        var cost = applyDiscount(price);
        gold -= cost;
        return 'bought ' + item + ' for ' + cost + ', gold=' + gold;
    }

    function goldLeft() {
        return gold;
    }

    return { buy: buy, goldLeft: goldLeft };
})();
