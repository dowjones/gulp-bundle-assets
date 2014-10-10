var Test = function() {
  function Test() {
    this.state = "test";
  }

  Test.prototype.printName = function(name) {
    if (name === undefined)
      name = "Colin";

    var nameBlock = "John";

    if(true){
      var name;

      (function() {
        name = "Max";
        var nameBlock = "Min";

        //Max
        console.log(name);
        //Min
        console.log(nameBlock);
      })();
    }

    // Max
    console.log(name);
    // John
    console.log(nameBlock);
  };

  return Test;
}();
//# sourceMappingURL=maps/main.js.map