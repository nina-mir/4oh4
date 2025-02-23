const data = require('../data/claude-Top-100-Tech-Companies-UserBase.json');
const path = require('path')
const url = require('node:url');

const urlMaker = require('../url-maker')

// for (const item of data){
//     console.log(item.url)
// }


const htmlStorage = path.join(__dirname, 'scraped-html')
const imageStorage = path.join(__dirname, 'screenshots')
console.log(htmlStorage, imageStorage)

const input = data[0].url;

// Define the regex pattern
const regex = /(?<=www\.).*/;

// Use the regex to extract the desired part
const match = input.match(regex);

if (match) {
    console.log(match[0], '\n', match); // Output: meta.com
} else {
    console.log("No match found");
}

// const address =  URL.parse(createURL())

const tryUrl = urlMaker('www.meta.com', 'trans-rights-are-human-rights')
console.log(tryUrl)
// console.log(address)