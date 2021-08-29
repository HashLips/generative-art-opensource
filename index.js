const { startCreating } = require('./generate');
const fs = require('fs');

(function main() {
  try {
    fs.rmdirSync('output', { recursive: true });
  } catch {
    // ignore if folder doesn't exist
  }
  fs.mkdirSync('output');
  startCreating();
})();
