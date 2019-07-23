var Vector = require('../utils/Vector');

function vectorize(elements) {
    return elements.map(node => new Vector(node));
}

module.exports = vectorize;
