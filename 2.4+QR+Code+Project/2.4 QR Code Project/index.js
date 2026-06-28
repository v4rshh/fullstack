
/* 
1. Use the inquirer npm package to get user input.*/
import inquirer from "inquirer";
import qr from "qr-image";
// OR THIS --> 
// var qr = require('qr-image');
import fs from "fs"; // is this is used,then no need to add require('fs') in the qr_png.pipe() function ,instead we can use fs.createWriteStream() directly

inquirer
  .prompt([
    /* Pass your questions in here */
    {message: "What is your name? \n",
    name:"name"},
    {message: "Enter the URL!! \n",
    name:"URL"}
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    console.log(answers.name);
    const url = answers.URL;

    var qr_png = qr.image(url);//creates the qr-image and links it to the text and saves it as a png file by default and store that url as text
    qr_png.pipe(fs.createWriteStream('qr_image.png'));

    fs.writeFile('answers.txt', `${answers.name}\n${url}`, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
}); 
    console.log(url); 
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });



//2. Use the qr-image npm package to turn the user entered URL into a QR code image.

// var qr = require('qr-image');
 
// var qr_svg = qr.image('I love QR!');




/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
