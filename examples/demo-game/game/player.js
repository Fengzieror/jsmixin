'use strict';

// ── 宿主"游戏"代码：ES6 class + CommonJS ─────────────────────────────
// 这是"被 mod 的目标"，一切改动都发生在内存里（mixin 变换），本文件永远不被修改。

class Player {
    constructor(name, hp, speed) {
        this.name = name;
        this.hp = hp;
        this.maxHp = hp;
        this.speed = speed;
    }
    takeDamage(n) {
        this.hp -= n;
        return this.hp;
    }
    heal(n) {
        if (this.hp + n > this.maxHp) this.hp = this.maxHp;
        else this.hp += n;
        return this.hp;
    }
    getSpeed() {
        return this.speed;
    }
    describe() {
        return this.name + ' (hp ' + this.hp + '/' + this.maxHp + ')';
    }
}

module.exports = { Player: Player };
