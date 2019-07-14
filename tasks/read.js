var fs = require('fs');

function read(options) {
    var background = fs.readFileSync(options.background, 'utf8');
    var foreground = fs.readFileSync(options.foreground, 'utf8');
    return [background, foreground];
}

module.exports = read;
