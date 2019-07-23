#!/usr/bin/env node
var inquirer = require('inquirer');
var PathPrompt = require('inquirer-path').PathPrompt;
var CLI = require('clui');

var read = require('../tasks/read');
var optimize = require('../tasks/optimize');
var parse = require('../tasks/parse');
var handle = require('../tasks/handle');
var vectorize = require('../tasks/vectorize');
var merge = require('../tasks/merge');
var write = require('../tasks/write');

var Spinner = CLI.Spinner;
var spinner = new Spinner('Generating assets...');

// inquirer.prompt.registerPrompt('path', PathPrompt);

// inquirer
//     .prompt([
//         {
//             type: 'path',
//             name: 'background',
//             message: 'Please enter youre background',
//         },
//         {
//             type: 'path',
//             name: 'foreground',
//             message: 'Please enter youre foreground',
//         },
//     ])
//     .then(options => {
//         spinner.start();
//         return options;
//     })
//     .then(read)
//     .then(optimize)
//     .then(parse)
//     .then(handle)
//     .then(merge)
//     .then(write)
//     .then(() => {
//         spinner.stop();
//     });

new Promise(resolve => {
    spinner.start();

    resolve({
        background: '/Users/ingmarvhulzen/Downloads/icons/Background.svg',
        foreground: '/Users/ingmarvhulzen/Downloads/icons/Eetdagboek.svg',
    });
})
    .then(read)
    .then(optimize)
    .then(parse)
    .then(vectorize)
    // .then(merge)
    // .then(write)
    .then(([a, b]) => {
        console.log(a.toVectorContent());
        console.log('-----------');
        console.log(b.toVectorContent());

        spinner.stop();
    });
