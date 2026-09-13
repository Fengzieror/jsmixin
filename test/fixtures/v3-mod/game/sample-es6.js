module.exports = (function () {
  function r(C, tbl) { for (var i = 0; i < tbl.length; i++) C.prototype[tbl[i].key] = tbl[i].value; return C; }
  var Cls = (function () {
    function Cls() { this.v = 1; }
    return r(Cls, [
      { key: 'tick', value: function () { return 'tick-run'; } },
      { key: 'dist', value: function (d) { return d * 2; } }
    ]), Cls;
  })();
  function gate(open) {
    if (!open) return 'closed';
    return 'opened:' + open;
  }
  function counter() {
    var bonus = 10;
    return 1 + bonus;
  }
  function counter2() {
    var bonus = 5;
    return 2 + bonus;
  }
  function helper(x) { return x + 1; }
  function caller() { return helper(1) + helper(2); }
  function caller2() { return helper(1) + helper(2); }
  function step() { return 'step-run'; }
  function echoStep() { return step(); }
  return { Cls: Cls, gate: gate, counter: counter, counter2: counter2, helper: helper, caller: caller, caller2: caller2, step: step, echoStep: echoStep };
})();
