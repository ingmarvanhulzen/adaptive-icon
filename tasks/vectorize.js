var Vector = require('../utils/Vector');

function vectorize([bacground, foreground, base]) {
    return [new Vector(bacground), new Vector(foreground), base];
}

module.exports = vectorize;
