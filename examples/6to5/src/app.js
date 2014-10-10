class Test {
  constructor() {
    this.state = "test";
  }
  printName(name = "Colin") {
    let nameBlock = "John";

    if(true){
      var name = "Max";
      let nameBlock = "Min";

      console.log(name); //Max
      console.log(nameBlock); //Min
    }

    console.log(name); // Max
    console.log(nameBlock); // John
  }
}