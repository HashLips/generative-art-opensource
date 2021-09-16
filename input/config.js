/**************************************************************
 * UTILITY FUNCTIONS
 * - scroll to BEGIN CONFIG to provide the config values
 *************************************************************/

const fs = require("fs");
const editionCount = process.argv[2];
const width = 800;
const height = 800;
const description = 'Owning one of these guarantees you a random drop of the minted collection, all more individual and more artistic than any others before them.  Learn more about the project by visiting the link below https://kodamanft.art/';
const max_layers = 8; //Maximum number of layers for the project

//Rarity definitions.  Represents the chance of pulling from this specific folder 
const rarity_types = {
  1: "08_unique",
  5: "07_extra_legendary",
  15: "06_legendary",
  20: "05_extra_rare",
  25: "04_rare",
  45: "03_extra_special",
  50: "02_special",
  100: "01_common"
};

const layerRarities = [];

const compileStatistics = (stats, layer, selectedRarity, calculatedRarityPct) => {
  //TODO: figure out how to store layer and calculatedRarityPct
  console.log(`Layer is: ${layer}`);
  console.log(`RarityPct is: ${calculatedRarityPct}`);

  layerRarities[selectedRarity] = layerRarities[selectedRarity] + 1;
  return stats.push(layerRarities);
};

const addLayers = (max_items) => {
  const allDNA = [];
  const itemDNA = [];
  let stats = [];
  const allDNAIds = [];


  for (let item = 0; item < max_items; item++) {
    let dnaValue = '*';
    let thisNFT = {};
    let itemDNA = [];

    //Get the random number for this layer
    for (let currLayer = 0; currLayer < max_layers; currLayer++) {
      // For each layer
      let layerSelected = false;
      console.log(`Calculating layer ${currLayer} for edition ${item}`);
      let randSeed = Math.floor(Math.random() * 100);
      // Get the layer by rarity folder name
      const numRarityTypes = Object.keys(rarity_types).length;
      for (let rarityType = 0; rarityType <= numRarityTypes; rarityType++) {
        if (!layerSelected) {
          const rarityValues = Object.keys(rarity_types);
          let selectedRarityValue = parseInt(rarityValues[rarityType]);
          //If the rarity is above the current type, then select it.
          if (!layerSelected && selectedRarityValue >= randSeed) {
            const thisNFT = {
              "layer": currLayer == 0 ? 'background' : `layer${currLayer}`,
              "rarity": rarity_types[selectedRarityValue],
            }
            thisNFT.fileLocation = `./input/${thisNFT.layer}/${thisNFT.rarity}`;
            var fileList = fs.readdirSync(thisNFT.fileLocation);
            //pick one of the files in the directory to use
            if (fileList.length != 0) {
                let fileindex = Math.floor(Math.random() * fileList.length);
                thisNFT.fileURI = `${thisNFT.fileLocation}/${fileList[fileindex]}`;
                if (fs.existsSync(thisNFT.fileURI)) {
                  itemDNA.push({
                    layer: thisNFT.layer,
                    rarity: thisNFT.rarity,
                    fileLocation: thisNFT.fileLocation,
                    fileURI: thisNFT.fileURI,
                    filename: fileList[fileindex],
                  });
                  layerSelected = true;
                  dnaValue += parseInt(currLayer) + thisNFT.rarity.substring(0, 2) + fileindex + '*';
                }
              //TODO: compile stats
              //stats = compileStatistics(stats, currLayer, thisNFT.rarity.substring(0, 2), selectedRarityValue);
              //make sure it ends when one is pushed.
            } else {
              console.log(`File ${thisNFT.fileLocation} not found in /input.  Selecting another file for this layer.`);
            }
          } else {
            console.log(`rarity ${selectedRarityValue} is not greater than or equal to ${randSeed}`);
          }
        }
      }
      //End of rarity selection
    }
    //End of layer generation

      // Check to make sure that the DNA is unique 
     if (allDNAIds.indexOf(dnaValue) == -1) {
       try {
      //Check to make sure that the file exists for this file location
          allDNA.push({ itemId: item, dna: { ...itemDNA }, dnaId: dnaValue });
          allDNAIds.push(dnaValue);
       } catch (err) {
         console.log(err);
       }
    } else {
      console.log(`This DNA already exists: ${dnaValue}`);
      item = item - 1;
    } 
  }
  console.log(`DNA Generation Complete`);
  return { allDNA, allDNAIds };
}

module.exports = {
  //layers,
  width,
  height,
  editionCount,
  description,
  //baseImageUri,
  //editionSize,
  //startEditionFrom,
  //rarityWeights,
  addLayers
};
