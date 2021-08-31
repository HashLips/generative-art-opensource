const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const {
    layersOrder,
    format,
    description,
    baseImageUri,
    edition,
    rarityWeights
} = require("./config.js");
const console = require("console");
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

const buildDir = `${process.env.PWD}/build`;
const metDataFile = '_metadata.json';
const layersDir = `${process.env.PWD}/layers`;

let metadataList = [];
let attributesList = [];
let dnaList = [];

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const signImage = (_sig) => {
  ctx.fillStyle = "#000000";
  ctx.font = "bold 30pt Courier";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(_sig, 40, 40);
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: _dna.join(""),
    name: `#${_edition}`,
    description: description,
    image: `${baseImageUri}/${_edition}`,
    edition: _edition,
    date: dateTime,
    attributes: attributesList,
  };
  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    name: selectedElement.name,
    rarity: selectedElement.rarity,
  });
};

const loadLayerImg = async (_layer) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    
    return {
        layer: _layer,
        loadedImage: image
    }
};

const drawElement = (_element) => {
  ctx.drawImage(
    _element.loadedImage,
    _element.layer.position.x,
    _element.layer.position.y,
    _element.layer.size.width,
    _element.layer.size.height
  );
  addAttributes(_element);
};

const constructLayerToDna = (_dna = [], _layers = [], _rarity) => {
  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements[_rarity][_dna[index]];
    return {
      location: layer.location,
      position: layer.position,
      size: layer.size,
      selectedElement: selectedElement,
    };
  });

  return mappedDnaToLayers;
};

const getRarity = (_editionCount) => {
  let rarity = "";
  rarityWeights.forEach((rarityWeight) => {
    if (
      _editionCount >= rarityWeight.from &&
      _editionCount <= rarityWeight.to
    ) {
      rarity = rarityWeight.value;
    }
  });
  return rarity;
};

const isDnaUnique = (_DnaList = [], _dna = []) => {
  let foundDna = _DnaList.find((i) => i.join("") === _dna.join(""));
  return foundDna == undefined ? true : false;
};

const createDna = (_layers, _rarity) => {
  let randNum = [];
  _layers.forEach((layer) => {
    let num = Math.floor(Math.random() * layer.elements[_rarity].length);
    randNum.push(num);
  });
  return randNum;
};

const buildSetup = () => {
    if (fs.existsSync(buildDir)) {
      fs.rmdirSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir);
};

const writeMetaData = (data) => {
    fs.stat(`${buildDir}/${metDataFile}`, (err) => {
      if(err == null || err.code === 'ENOENT') {
        fs.writeFileSync(`${buildDir}/${metDataFile}`, data);
      } else {
          console.log('Oh no, error: ', err.code);
      }
    });
};

const cleanName = (_str) => {
    let name = _str.slice(0, -4);

    return name;
  };
  
  const getElements = (path) => {
    return fs
      .readdirSync(path)
      .filter((item) => !/(^|\/)\.[^/.]/g.test(item))
      .map((i) => {
        return {
          name: cleanName(i),
          path: `${path}/${i}`,
        };
      });
};

const layersSetup = layersOrder => {
    const layers = layersOrder.map((layer) => ({
      elements: {
        original: getElements(`${layersDir}/${layer}/original`),
        rare: getElements(`${layersDir}/${layer}/rare`),
        super_rare: getElements(`${layersDir}/${layer}/super_rare`),
      },
      position: { x: 0, y: 0 },
      size: { width: format.width, height: format.height },
    }));
  
    return layers;
};

const startCreating = async () => {
    const layers = layersSetup(layersOrder);

    buildSetup();
    let editionCount = edition.start;
    while (editionCount <= edition.end) {
        console.log(editionCount);

        let rarity = getRarity(editionCount);
        console.log(rarity);

        let newDna = createDna(layers, rarity);
        console.log(dnaList);

        if (isDnaUnique(dnaList, newDna)) {
            let results = constructLayerToDna(newDna, layers, rarity);
            let loadedElements = []; //promise array

            results.forEach((layer) => {
                loadedElements.push(loadLayerImg(layer));
            });

            await Promise.all(loadedElements).then((elementArray) => {
                ctx.clearRect(0, 0, format.width, format.height);
                drawBackground();
                elementArray.forEach((element) => {
                drawElement(element);
                });
                signImage(`#${editionCount}`);
                saveImage(editionCount);
                addMetadata(newDna, editionCount);
                console.log(`Created edition: ${editionCount} with DNA: ${newDna}`);
            });
            dnaList.push(newDna);
            editionCount++;
        } else {
            console.log("DNA exists!");
        }
    }
    writeMetaData(JSON.stringify(metadataList));
};

module.exports = { startCreating };
