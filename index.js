const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const {
  width,
  height,
  editionCount,
  description,
  traitDefinition,
  addLayers
} = require("./input/config.js");
const console = require("console");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// Descriptions of these can be viewed at
// https://medium.com/metaplex/metaplex-metadata-standard-45af3d04b541
const MPMD_name_prefix = `KODAMA`;
const MMPD_symbol = 'KODAMA';
const MMPD_description = description; 
const MPMD_seller_fee_basis_points = 0; //if you want royalties, put in a percentage value here.  500 = 5%
const MPMD_image = 'image.png';         // URL to the image - default to image.png for arweave
const MPMD_animation_url = 'image.png'; // URL to the animated image - default to image.png for arweave
const MPMD_external_url = 'image.png';  // URL to an external file - default to image.png for arweave
const MPMD_uri_extension = '.png';     // THE URL - this needs to resolve to the image file in output folder
const MPMD_creators = [{
  address: `64afd2ZPL9VUnivd95VDv1FoonUGjnMDhW3YRUANFyRQ`,
  verified: true,
  share: 100
}];

const MPMD_update_authority = `64afd2ZPL9VUnivd95VDv1FoonUGjnMDhW3YRUANFyRQ`;       //public key of the metadata owner  YOUR WALLET GOES HERE
// const MPMD_primary_sale_happened = ;  //


// saves the generated image to the output folder, using the edition count as the name
const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `./output/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

// adds a watermark to the image.  Fun, but no need really.
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
  let dateTime = new Date(); 
  let tempMetadata = {
    name: `${MPMD_name_prefix}${_edition}`,
    symbol: MMPD_symbol,
    description: MMPD_description,
    seller_fee_basis_points: MPMD_seller_fee_basis_points,
    image: MPMD_image,
    animation_url: MPMD_animation_url,
    external_url: MPMD_external_url,
    uri: `${_edition}${MPMD_uri_extension}`,
    attributes: _dna.attributes,
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
      creators: MPMD_creators
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

const startCreating = async () => {
  let currentdate = new Date(); 
  const startdatetime = (currentdate.getMonth()+1)  + "/" 
  + currentdate.getDate() + "/"
  + currentdate.getFullYear() + " @ "  
  + currentdate.getHours() + ":"  
  + currentdate.getMinutes() + ":" 
  + currentdate.getSeconds();

  console.log('##################');
  console.log('# Generative Art');
  console.log('# - Create your NFT collection');
  console.log('##################');

  console.log(`Begin creating NFTs at ${startdatetime}}`);
  
  //clearOutput();
  const allDNA = addLayers(editionCount);

  const allItems = allDNA.allDNA;
 
  for (let idx = 0; idx < allItems.length; idx++) {
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
    fs.writeFileSync('./input/masterDNA.json',JSON.stringify({'DNAList': allDNA.allDNAIds}));
  }

  currentdate = new Date(); 
  const endDateTime = (currentdate.getMonth()+1)  + "/" 
  + currentdate.getDate() + "/"
  + currentdate.getFullYear() + " @ "  
  + currentdate.getHours() + ":"  
  + currentdate.getMinutes() + ":" 
  + currentdate.getSeconds();
  console.log(`Generator finished at ${endDateTime}`);

}
// Initiate creation
startCreating();
