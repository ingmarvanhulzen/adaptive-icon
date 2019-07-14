var fs = require('fs');
var path = require('path');
var svg_to_png = require('svg-to-png');

var MIPMAPS = {
    ldpi: 36,
    mdpi: 48,
    hdpi: 72,
    xhdpi: 96,
    xxhdpi: 144,
    xxxhdpi: 192,
};

const TEMPLATES = {
    base: path.join(__dirname, '..', 'templates', 'base.svg'),
    round: path.join(__dirname, '..', 'templates', 'base_round.svg'),
    launcher: path.join(__dirname, '..', 'templates', 'ic_launcher.xml'),
    vector: path.join(__dirname, '..', 'templates', 'vector.xml'),
};

const DIRECTORYS = {
    static: path.join(__dirname, '..', 'static'),
    res: path.join(__dirname, '..', 'static', 'res'),
    drawable: path.join(__dirname, '..', 'static', 'res', 'drawable'),
    mipmap: path.join(__dirname, '..', 'static', 'res', 'mipmap-anydpi-v26'),
    ...Object.keys(MIPMAPS).reduce(
        (prev, key) => ({
            ...prev,
            [key]: path.join(__dirname, '..', 'static', 'res', `mipmap-${key}`),
        }),
        {}
    ),
};

function makeDirs(dirs) {
    Object.keys(dirs).reduce((prev, key) => {
        const dir = dirs[key];

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        return {
            ...prev,
            [key]: dir,
        };
    }, {});

    return (key, ...rest) => (rest ? path.join(dirs[key], ...rest) : dirs[key]);
}

function readTemplates(templates) {
    return Object.keys(templates).reduce(
        (prev, key) => ({
            ...prev,
            [key]: fs.readFileSync(templates[key], 'utf8'),
        }),
        {}
    );
}

function xmlPath(attributes) {
    return `	<path\n${Object.keys(attributes)
        .map(next => {
            if (next === 'd') {
                return `		android:pathData="${attributes[next]}"`;
            } else if (next === 'fill') {
                return `		android:fillColor="${attributes[next].toUpperCase()}"`;
            }
            return false;
        })
        .filter(f => f)
        .join('\n')} />`;
}

function convert(from, path, size) {
    return svg_to_png.convert(from, path, {
        defaultHeight: size,
        defaultWidth: size,
    });
}

function write([background, foreground, paths]) {
    return new Promise(resolve => {
        const dir = makeDirs(DIRECTORYS);
        const templates = readTemplates(TEMPLATES);

        // Create temporary svgs
        fs.writeFileSync(
            dir('static', 'ic_launcher.svg'),
            templates.base.replace('{content}', paths.join('\n')),
            'utf8'
        );
        fs.writeFileSync(
            dir('static', 'ic_launcher_round.svg'),
            templates.round.replace('{content}', paths.join('\n')),
            'utf8'
        );

        // Create xml background and foreground
        const xmlBackground = background.map(xmlPath).join('\n');
        const xmlForeground = foreground.map(xmlPath).join('\n');

        fs.writeFileSync(
            dir('drawable', 'ic_launcher_background.xml'),
            templates.vector.replace('{content}', xmlBackground),
            'utf8'
        );
        fs.writeFileSync(
            dir('drawable', 'ic_launcher_foreground.xml'),
            templates.vector.replace('{content}', xmlForeground),
            'utf8'
        );

        // Copy v26 mipmap files
        fs.copyFileSync(TEMPLATES.launcher, dir('mipmap', 'ic_launcher.xml'));
        fs.copyFileSync(
            TEMPLATES.launcher,
            dir('mipmap', 'ic_launcher_round.xml')
        );

        // Create png's
        const promises = [
            convert(dir('static', 'ic_launcher.svg'), dir('static'), 512),
        ];

        Object.entries(MIPMAPS).forEach(([dpi, size]) => {
            promises.push(
                convert(dir('static', 'ic_launcher.svg'), dir(dpi), size)
            );
            promises.push(
                convert(dir('static', 'ic_launcher_round.svg'), dir(dpi), size)
            );
        });

        Promise.all(promises).then(() => {
            fs.unlinkSync(dir('static', 'ic_launcher.svg'));
            fs.unlinkSync(dir('static', 'ic_launcher_round.svg'));

            fs.renameSync(
                dir('static', 'ic_launcher.png'),
                dir('static', 'ic_launcher-web.png')
            );

            // Exit promise
            resolve();
        });
    });
}

module.exports = write;
