module.exports = Bundle;


function Bundle(options) {
  if (!options) options = {};
  this.name = options.name || null; // e.g. "main"
  this.type = options.type || null; // "scripts" | "styles"
}

