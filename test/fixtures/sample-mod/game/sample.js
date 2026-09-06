({7:function(){
  function reg(C, ms) { for (var i = 0; i < ms.length; i++) C.prototype[ms[i].key] = ms[i].value; }
  function helper(x) { return x + 1; }
  function boot() {
    var step = function (a) { return helper(a) + '!'; };
    console.log(step(2));
    return 'booted';
  }
  function App() { this.v = 1; }
  reg(App, [{ key: "tick", value: function () { return 'tick-run'; } }]);
  boot();
  console.log(new App().tick());
}})[7]();
