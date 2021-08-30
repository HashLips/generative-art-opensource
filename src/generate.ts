import fs from 'fs';
import { createCanvas, Image, loadImage } from 'canvas';
import {
  width,
  height,
  description,
  baseImageUri,
  startEditionFrom,
  endEditionAt,
  rarityWeights,
  Layer,
  Size,
  Position,
  Element,
  Rarity,
} from './config';
import console from 'console';

type ImageLayer = {
  layer: DNALayer;
  image: Image;
};

type Attribute = {
  name: string;
  rarity: string;
};

type DNALayer = {
  position: Position;
  size: Size;
  selectedElement: Element;
};

type Metadata = {
  dna: string;
  name: string;
  description: string;
  image: string;
  edition: number;
  date: number;
  attributes: Attribute[];
};

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

const saveImage = (editionCount: number) => {
  fs.writeFileSync(
    `./output/${editionCount}.png`,
    canvas.toBuffer('image/png')
  );
};

const signImage = (sig: string) => {
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30pt Courier';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(sig, 40, 40);
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, width, height);
};

const addMetadata = (dna: number[], edition: number) => {
  let dateTime = Date.now();
  return {
    dna: dna.join(''),
    name: `#${edition}`,
    description: description,
    image: `${baseImageUri}/${edition}`,
    edition: edition,
    date: dateTime,
    attributes: [],
  } as Metadata;
};

const generateAttribute = (element: ImageLayer) => {
  let selectedElement = element.layer.selectedElement;
  return {
    name: selectedElement.name,
    // rarity: selectedElement.rarity, TODO: need to put this back in
  } as Attribute;
};

const loadLayerImg = async (layer: DNALayer) => {
  const image = await loadImage(`${layer.selectedElement.path}`);
  return { layer, image: image } as ImageLayer;
};

const drawElement = (imageLayer: ImageLayer) => {
  ctx.drawImage(
    imageLayer.image,
    imageLayer.layer.position.x,
    imageLayer.layer.position.y,
    imageLayer.layer.size.width,
    imageLayer.layer.size.height
  );
};

const constructLayerToDna = (
  dna: number[],
  layers: Layer[],
  rarity: string
) => {
  return layers.map(
    (layer, index) =>
      ({
        position: layer.position,
        size: layer.size,
        selectedElement: layer.elements[rarity][dna[index]],
      } as DNALayer)
  );
};

const getRarity = (editionCount: number) => {
  return (rarityWeights.find(
    (rarityWeight) =>
      editionCount >= rarityWeight.from && editionCount <= rarityWeight.to
  )?.value ?? 'original') as Rarity;
};

const isDnaUnique = (_dnaList: number[][], _dna: number[]) => {
  return !_dnaList.find((i) => i.join('') === _dna.join(''));
};

const createDna = (layers: Layer[], rarity: string) => {
  return layers.map((layer) =>
    Math.floor(Math.random() * layer.elements[rarity].length)
  );
};

const startCreating = async (layers: Layer[]) => {
  const totalMetadata: Metadata[] = [];
  const dnaList: number[][] = [];
  let editionCount = startEditionFrom;
  while (editionCount <= endEditionAt) {
    console.log(editionCount);

    const rarity: Rarity = getRarity(editionCount);
    console.log(rarity);

    const newDna = createDna(layers, rarity);
    console.log(dnaList);

    if (isDnaUnique(dnaList, newDna)) {
      const dnaLayers = constructLayerToDna(newDna, layers, rarity);
      const imageLayersPromises: Promise<ImageLayer>[] = dnaLayers.map(
        (layer) => loadLayerImg(layer)
      );

      const imageLayers = await Promise.all(imageLayersPromises);

      ctx.clearRect(0, 0, width, height);
      drawBackground();
      const attributes = imageLayers.map((imageLayer) => {
        drawElement(imageLayer);
        return generateAttribute(imageLayer);
      });
      signImage(`#${editionCount}`);
      saveImage(editionCount);

      const metadata = addMetadata(newDna, editionCount);
      metadata.attributes = attributes;
      totalMetadata.push(metadata);
      console.log(`Created edition: ${editionCount} with DNA: ${newDna}`);
      dnaList.push(newDna);

      editionCount++;
    } else {
      console.log('DNA exists!');
    }
  }
  return totalMetadata;
};

export {
  saveImage,
  signImage,
  genColor,
  drawBackground,
  loadLayerImg,
  constructLayerToDna,
  startCreating,
  getRarity,
  isDnaUnique,
  createDna,
  ImageLayer,
  Attribute,
  DNALayer,
  Metadata,
};