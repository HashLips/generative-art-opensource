const description = "This is an NFT made by the coolest generative code.";
const baseImageUri = "https://hashlips/nft";
const editionSize = 10;
const format = {
  width: 1000,
  height: 1000
};
const rarityWeights = [
  {
    value: "super_rare",
    from: 1,
    to: 1,
  },
  {
    value: "rare",
    from: 2,
    to: 5,
  },
  {
    value: "original",
    from: 5,
    to: editionSize,
  },
];
const layersOrder = [
  'ball',
  'eye color',
  'iris',
  'shine',
  'shine',
  'bottom lid',
  'top lid'
];

module.exports = {
  layersOrder,
  format,
  description,
  baseImageUri,
  editionSize,
  rarityWeights,
};
