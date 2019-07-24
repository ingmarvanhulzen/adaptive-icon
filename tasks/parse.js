var svgson = require('svgson');

function parse([background, foreground, base]) {
    return Promise.all([
        svgson.parse(background),
        svgson.parse(foreground),
        base,
    ]);
}

module.exports = parse;
