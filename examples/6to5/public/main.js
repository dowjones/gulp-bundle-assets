"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Test = (function () {
  var Test = function Test() {
    this.state = "test";
  };

  _classProps(Test, null, {
    printName: {
      writable: true,
      value: function (name) {
        if (name === undefined) name = "Colin";
        var nameBlock = "John";

        if (true) {
          var name = "Max";
          var _nameBlock = "Min";

          console.log(name); //Max
          console.log(_nameBlock); //Min
        }

        console.log(name); // Max
        console.log(nameBlock); // John
      }
    }
  });

  return Test;
})();
//# sourceMappingURL=maps/main.js.map