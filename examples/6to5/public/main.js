"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Test = (function () {
  function Test() {
    _classCallCheck(this, Test);

    this.state = "test";
  }

  _prototypeProperties(Test, null, {
    printName: {
      value: function printName() {
        var name = arguments[0] === undefined ? "Colin" : arguments[0];
        var nameBlock = "John";

        if (true) {
          var name = "Max";
          var _nameBlock = "Min";

          console.log(name); //Max
          console.log(_nameBlock); //Min
        }

        console.log(name); // Max
        console.log(nameBlock); // John
      },
      writable: true,
      configurable: true
    }
  });

  return Test;
})();
//# sourceMappingURL=maps/main.js.map