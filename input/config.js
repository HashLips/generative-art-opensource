/**************************************************************
 * UTILITY FUNCTIONS
 * - scroll to BEGIN CONFIG to provide the config values
 *************************************************************/
const fs = require("fs");
const dir = __dirname;
const max_items = 1000;
const max_layers = 10; //Maximum number of layers for the project
//Rarity definitions.  Represents the chance of 
//pulling from this specific folder 
const rarity_types = { 
  1: "08_unique",
  5: "07_extra_legendary",
  15: "06_legendary",
  20: "05_extra_rare",
  25: "04_rare",
  45: "03_extra_special",
  50: "02_special",
  90: "01_common"
};

const newAddLayers = (max_items) => {
  const allDNA = [];
  const itemDNA = [];
  //TODO: Get a background
  for (let item = 0; item < max_items; item++) {
    //Get the random number for this layer
    for (let currLayer = 0; currLayer < max_layers; currLayer++) {
      let layerSelected = false;
      console.log(`Calculating layer ${currLayer} for edition ${item}`);
      let randSeed = Math.floor(Math.random() * 100);
    //Get the layer by rarity folder name
      const numRarityTypes = Object.keys(rarity_types).length;
      for (let rarityType = 0; rarityType < numRarityTypes; rarityType++) {
        if (!layerSelected) {
            console.log(`Calculating rarity for this layer`);
            const rarityValues = Object.keys(rarity_types);
            let selectedRarityValue = parseInt(rarityValues[rarityType]);
        //If the rarity is above the current type, then select it.
            if (!layerSelected && selectedRarityValue >= randSeed) {
              const thisNFT = {
                "layer": currLayer == 0 ? 'background' : `layer${currLayer}`,
                "rarity": rarity_types[selectedRarityValue],
              }
              console.log(`Go get ${JSON.stringify(thisNFT)} and add it to _dna`);
              itemDNA.push({...thisNFT});
              layerSelected = true;
        //make sure it ends when one is pushed.
            }  
          }
        }
      }
      console.log(`This item's DNA is ${itemDNA}`);
      allDNA.push({itemId: item, dna: {itemDNA}});
  }
  return allDNA;
}

module.exports = {
  //layers,
  //width,
  //height,
  //description,
  //baseImageUri,
  //editionSize,
  //startEditionFrom,
  //rarityWeights,
  newAddLayers
};
