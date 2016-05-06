"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Test = function () {
  function Test() {
    _classCallCheck(this, Test);

    this.state = "test";
  }

  _createClass(Test, [{
    key: "printName",
    value: function printName() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? "Colin" : arguments[0];

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
  }]);

  return Test;
}();
//# sourceMappingURL=maps/main.js.map