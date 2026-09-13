module.exports = (function () {
  function helper(x) { return x + 1; }
  function calc() { return helper(1) + 10; }
  function calc2() { return helper(2) + 10; }
  function calc3() { return helper(3) + 10; }
  return { helper: helper, calc: calc, calc2: calc2, calc3: calc3 };
})();
