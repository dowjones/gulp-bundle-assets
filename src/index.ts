require = require("esm")(module, {
    // Caching is best reserved for projects not dev tool libraries
    cache: false,
    mode: "all",
});
module.exports = require("./main.js");
