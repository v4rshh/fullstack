//var generateName = require('sillyname');
// generate a silly name OR
import generateName from 'sillyname';
import {randomSuperhero} from 'superheroes';
var sillyName = generateName();
var heroName = randomSuperhero();

console.log(`my name is ${sillyName}.`);
console.log(`I AM ${heroName}!!`);
