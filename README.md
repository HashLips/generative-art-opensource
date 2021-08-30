# generative-art-opensource
Create generative art by using the canvas api and node js, feel free to contribute to this repo with new ideas.

# Project Setup
- install `node.js` on your local system (https://nodejs.org/en/)
- clone the repository to your local system `https://github.com/HashLips/generative-art-node.git`
- run `yarn add all` to install dependencies

# How to use
## Run the code
1. Run `node index.js <number-of-nfts>`
2. Open the `./output` folder to find your generated images to use as NFTs

## Adjust the provided configuration and resources
### Configuration file
The file `./input/config.js` contains the following properties that can be adjusted to your preference in order to change the behavior of the NFT generation procedure:
- width: - of your image in pixels. Default: `1000px`
- height: - of your image in pixels. Default: `1000px`
- dir: - where image parts are stored. Default: `./input`
- description: - of your generated NFT
- baseImageUri: - URL base to access your NFTs from. This will be used by platforms to find your image resource. This expects the image to be accessible by it's id like `${baseImageUri}/${id}`.
- startEditionFrom: - number (int) to start naming NFTs from.
- editionSize: - number (int) to end edition at.
- rarityWeights: - allows to provide rarity categories and how many of each type to include in an edition.
- layers: list of layers that should be used to render the image. See next section for detail.

### Image layers 
The image layers are different parts that make up a full image by overlaying on top of each other. E.g. in this example we start with the eyeball and layer features like the eye lids or iris on top to create the completed and unique eye, which we can then use as part of our NFT collection.
To ensure uniqueness, we want to add various features and multiple options for each of them in order to allow enough permutations for the amount of unique images we require.

To start, copy the layers/features and their images in a flat hierarchy at a directory of your choice (by default we expect them in `./input/`). The features should contain options for each rarity that is provided via the config file.

After adding the layers, adjust them accordingly in the `config.js` by providing the directory path, positioning and sizes.

# Development suggestions
- Preferably use VSCode with the prettifier plugin for a consistent coding style (or equivalent js formatting rules)