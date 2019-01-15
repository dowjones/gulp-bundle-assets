require = require("esm")(module, {
    // Caching is best reserved for projects not dev tool libraries
    cache: false
});
module.exports = require("./main");
