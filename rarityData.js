'use strict';

const fs = require('fs');
const {
  layers,
  editionSize
} = require("./input/config.js");

let rarityChart = [];

// initialize rarity chart
layers.forEach((layer) => {
	let elementsList = [];
	let rarityForLayer = {
		traits: elementsList
	};
	for(let i = 0; i < layer.elements.length; i++)
	{
		elementsList = {
			value : layer.elements[i].name,
			occurence : 0,
		};
		rarityForLayer.traits.push(elementsList);
	}

	rarityChart[layer.id] = rarityForLayer;
});

console.log(rarityChart)

// read metadata data
let rawdata = fs.readFileSync('./output/_metadata.json');
let data = JSON.parse(rawdata);

// fill up rarity chart with occurences from metadata
data.forEach((element) => {

	for(let i = 0; i < element.attributes.length; i++)
	{
		let traitType = element.attributes[i].name;
		let value = element.attributes[i].value;

		console.log(element)
		console.log(element.attributes.length)
		console.log(element.attributes)
		console.log(traitType)
		console.log(rarityChart[traitType])

		let rarityChartTrait = rarityChart[traitType];

		for (let i = 0; i < rarityChartTrait.traits.length; i++)
		{
			if (rarityChartTrait.traits[i].value == value){
				rarityChartTrait.traits[i].occurence++;
			}
		}
	}

});

// iterate through rarity list and convert the occurences to percentages
for (const [layer, traits] of Object.entries(rarityChart)) {
	for (const [trait, value] of Object.entries(traits)) {
		for (const [key, val] of Object.entries(value)) {
			val.occurence = (val.occurence / NUM_OF_EDITIONS) * 100
		}
	}
}

// print out rarity data to console
for (const [layer, traits] of Object.entries(rarityChart)) {
	console.log(`Layer: ${layer}`)
	for (const [trait, value] of Object.entries(traits)) {
		console.log(value)
	}
}
