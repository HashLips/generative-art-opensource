const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const {
  width,
  height,
  description,
  editionSize,
  startEditionFrom,
  newAddLayers
} = require("./input/config.js");
const console = require("console");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");
const wallet_addr = `4dR8XYPgWy4ysCGs2mpAjjHEAuxu85qpQEhMiyqPus9c`;

// saves the generated image to the output folder, using the edition count as the name
const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `./output/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

// generate a random color hue
const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, width, height);
};

const drawElement = (_element) => {
  ctx.drawImage(
    _element.loadedImage,
    _element.layer.position.x,
    _element.layer.position.y,
    _element.layer.size.width,
    _element.layer.size.height
  );
};

const startCreating = async () => {

  console.log('##################');
  console.log('# Generative Art');
  console.log('# - Create your NFT collection');
  console.log('##################');

  console.log();
  console.log('start creating NFTs.')

  const allDNA = newAddLayers(100);
  console.log(`DNA Created`);
  const allItems = allDNA.allDNA;
 
  for (let idx = 0; idx < allItems.length; idx++) {
    let loadedElements = [];
    console.log(`----------->Item Number ${idx}<-----------`);
    
    let currDna = allItems[idx].dna;

    ctx.clearRect(0, 0, width, height);
    drawBackground();

    for (let layerNum = 0; layerNum < Object.keys(currDna).length; layerNum++) {
     
      let fileURI = currDna[layerNum].fileURI;
      const imgFile = await loadImage(fileURI);
      console.log(imgFile.height, imgFile.width);
      ctx.drawImage(imgFile, 0, 0, width, height);
    }
    
    saveImage(idx);

  }
}

const startCreatingOld = async () => {
  // clear meta data from previous run
  clearMetaData("");

  // create NFTs from startEditionFrom to editionSize
  let editionCount = startEditionFrom;
  while (editionCount <= editionSize) {
    console.log('-----------------')
    console.log('creating NFT %d of %d', editionCount, editionSize);

    // get rarity from to config to create NFT as
    let rarity = getRarity(editionCount);
    console.log('- rarity: ' + rarity);

    // calculate the NFT dna by getting a random part for each layer/feature 
    // based on the ones available for the given rarity to use during generation
    let newDna = createDna(layers, rarity);
  /*  while (!isDnaUnique(dnaListByRarity[rarity], newDna)) {
      // recalculate dna as this has been used before.
      console.log('found duplicate DNA ' + newDna.join('-') + ', recalculate...');
      newDna = createDna(layers, rarity);
    }
  */  console.log('- dna: ' + newDna.join('-'));

    // propagate information about required layer contained within config into a mapping object
    // = prepare for drawing
    let results = constructLayerToDna(newDna, layers, rarity);
    let loadedElements = [];

    // load all images to be used by canvas
    results.forEach((layer) => {
      loadedElements.push(loadLayerImg(layer));
    });

    // elements are loaded asynchronously
    // -> await for all to be available before drawing the image
    await Promise.all(loadedElements).then((elementArray) => {
      // create empty image
      ctx.clearRect(0, 0, width, height);
      // draw a random background color
      drawBackground();
      // store information about each layer to add it as meta information
      let attributesList = [];
      // draw each layer
      elementArray.forEach((element) => {
        drawElement(element);
        attributesList.push(getAttributeForElement(element));
      });
      // add an image signature as the edition count to the top left of the image
      signImage(`#${editionCount}`);
      // write the image to the output directory
      saveImage(editionCount);
      let nftMetadata = generateMetadata(newDna, editionCount, attributesList);
      writeMetaData(JSON.stringify(nftMetadata));
//      metadataList.push(nftMetadata)
      console.log('- metadata: ' + JSON.stringify(nftMetadata));
      console.log('- edition ' + editionCount + ' created.');
      console.log();
    });
    dnaListByRarity[rarity].push(newDna);
    editionCount++;
  }
  writeMetaData(JSON.stringify(metadataList));
};

// Initiate creation
startCreating();
