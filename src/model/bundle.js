module.exports = Bundle;

function Bundle(options) {
  if (!options) options = {};
  this.name = options.name || null; // "main", "vendor", etc.
  this.type = options.type || null; // "scripts" | "styles"
  this.result = options.result || {};
  this.srcFiles = options.srcFiles || null; // original (unprocessed) files - only complete after stream complete
}
