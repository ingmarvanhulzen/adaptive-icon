var svgson = require('svgson');

function parse(paths) {
    return Promise.all(paths.map(svgson.parse));
}

module.exports = parse;
