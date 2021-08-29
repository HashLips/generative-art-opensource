const { startCreating } = require('./generate');
const fs = require('fs');
const { layers } = require('./input/config');

(async function main() {
  try {
    fs.rmdirSync('output', { recursive: true });
  } catch {
    // ignore if folder doesn't exist
  }
  fs.mkdirSync('output');
  const data = await startCreating(layers);
  fs.writeFileSync('./output/_metadata.json', JSON.stringify(data));
})();
