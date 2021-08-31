import { readdirSync } from 'fs';
import path from 'path';
import { upperFirst } from 'lodash';
import fs from 'fs';

(function main() {
  const result = readdirSync(path.join(__dirname, '../assets'), {
    withFileTypes: true,
  })
    .filter((d) => d.isDirectory())
    .map((directory) => {
      return {
        gene: directory.name,
        images: readdirSync(
          path.join(__dirname, `../assets/${directory.name}`)
        ),
      };
    })
    .map((geneData) => {
      const geneName = formatName(geneData.gene.split('_')[0]);
      const geneOrder = Number(geneData.gene.split('_')[1]);
      const imageObj = geneData.images.map((imageInfo) =>
        extractTraitInfo(imageInfo)
      );
      return { geneName, geneOrder, traits: imageObj };
    });

  fs.writeFileSync('./genes/genes.json', JSON.stringify(result));
})();

function extractTraitInfo(imageInfo: string) {
  const name = formatName(imageInfo.split('_')[0]);
  const weight = Number(imageInfo.split('_')[1].slice(0, -4));
  return { name, weight };
}

function formatName(name: string): string {
  return name
    .replace('-', ' ')
    .split(' ')
    .map((word) => upperFirst(word))
    .join(' ');
}

// const weight = function (arr) {
//   return [].concat(
//     ...arr.map(
//         (obj) => Array(Math.ceil(obj.weight * 100)
//         ).fill(obj))
//   );
// };
