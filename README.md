# generative-art-opensource
Create generative art by using the canvas api and node js, feel free to contribute to this repo with new ideas.

# Project Setup
- install `node.js` on your local system (https://nodejs.org/en/)
- clone the repository to your local system `git@github.com:HashLips/generative-art-opensource.git`
- run `yarn add all` to install dependencies

# How to use
## Run the code
1. Run `node index.js`
2. Open the `./output` folder to find your generated images to use as NFTs, as well as the metadata to use for NFT marketplaces.

## Adjust the provided configuration and resources
### Configuration file
The file `./input/config.js` contains the following properties that can be adjusted to your preference in order to change the behavior of the NFT generation procedure:
- width: - of your image in pixels. Default: `1000px`
- height: - of your image in pixels. Default: `1000px`
- dir: - where image parts are stored. Default: `./input`
- description: - of your generated NFT. Default: `This is an NFT made by the coolest generative code.`
- baseImageUri: - URL base to access your NFTs from. This will be used by platforms to find your image resource. This expects the image to be accessible by it's id like `${baseImageUri}/${id}`.
- startEditionFrom: - number (int) to start naming NFTs from. Default: `1`
- editionSize: - number (int) to end edition at. Default: `10`
- editionDnaPrefix: - value (number or string) that indicates which dna from an edition is used there. I.e. dna `0` from to independent batches in the same edition may differ, and can be differentiated using this. Default: `0`
- rarityWeights: - allows to provide rarity categories and how many of each type to include in an edition. Default: `1 super_rare, 4 rare, 5 original`
- layers: list of layers that should be used to render the image. See next section for detail.

### Image layers 
The image layers are different parts that make up a full image by overlaying on top of each other. E.g. in the example input content of this repository we start with the eyeball and layer features like the eye lids or iris on top to create the completed and unique eye, which we can then use as part of our NFT collection.
To ensure uniqueness, we want to add various features and multiple options for each of them in order to allow enough permutations for the amount of unique images we require.

To start, copy the layers/features and their images in a flat hierarchy at a directory of your choice (by default we expect them in `./input/`). The features should contain options for each rarity that is provided via the config file.

After adding the `layers`, adjust them accordingly in the `config.js` by providing the directory path, positioning and sizes.
Use the existing `addLayers` calls as guidance for how to add layers. This can either only use the name of the layer and will use default positioning (x=0, y=0) and sizes (width=configured width, height=configure height), or positioning and sizes can be provided for more flexibility.

### Allowing different rarities for certain rarity/layer combinations
It is possible to provide a percentage at which e.g. a rare item would contain a rare vs. common part in a given layer. This can be done via the `addRarityPercentForLayer` that can be found in the `config.js` as well. 
This allows for more fine grained control over how much randomness there should be during the generation process, and allows a combination of common and rare parts.

# Development suggestions
- Preferably use VSCode with the prettifier plugin for a consistent coding style (or equivalent js formatting rules)