const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const {
  width,
  height,
  editionCount,
  description,
  addLayers
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

const signImage = (_sig) => {
  ctx.fillStyle = "#000000";
  ctx.font = "bold 8pt Courier";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(_sig, 40, 40);
}

// add metadata for individual nft edition
const generateMetadata = (_dna, _edition) => {
  console.log(JSON.stringify(_dna));
  let dateTime = Date.now();
  let tempMetadata = {
    name: `${_edition}`,
    symbol: "",
    description: description,
    seller_fee_basis_points: 0,
    image: "image.png",
    animation_url: "",
    external_url: "",
    uri:`${_edition}.png`,
    attributes: [{dna: _dna.dnaId}],
    createdDate: dateTime,
    collection: {
      name: "Kodama",
      family: "RAF"
    },
    properties: {
      files: [
        {
          uri: "image.png",
          type: "image/png",
        }
      ],
      category: "image",
      creators: [
        {  
          address: wallet_addr,
          verified: false,
          share: 100
        }
      ]
    }
  };
  fs.writeFileSync(
    `./output/${_edition}.json`,
    JSON.stringify(tempMetadata)
  );
  return tempMetadata;
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

const clearOutput = () => {
  fs.stat('./output/*', function(err, stats) {
    console.log(stats);

    if (err) {
      return console.error(err);
    }

    fs.unlink('./output/*', function(err){
      if (err) return console.log(err);
      console.log('file deleted successfully');
    });
  });
};

const startCreating = async () => {

  console.log('##################');
  console.log('# Generative Art');
  console.log('# - Create your NFT collection');
  console.log('##################');

  console.log('Begin creating NFTs at Date.now()')
  
  clearOutput();
  const allDNA = addLayers(editionCount);

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
      ctx.drawImage(imgFile, 0, 0, width, height);
    }
    const dnaID = allDNA.allDNA[idx].dnaId;
    //signImage(allDNA.allDNAIds[idx]);
    //Save the file to the file system.
    saveImage(idx);
    generateMetadata(allDNA.allDNA[idx], idx);

  }
}
// Initiate creation
startCreating();
