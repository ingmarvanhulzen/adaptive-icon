var GROUP = {
    translateX: 'android:translateX',
    translateY: 'android:translateY',
};

var PATH = {
    d: 'android:pathData',
    fill: 'android:fillColor',
    stroke: 'android:strokeColor',
    'stroke-width': 'android:strokeWidth',
    'stroke-opacity': 'android:strokeAlpha',
    opacity: 'android:fillAlpha',
    'stroke-linecap': 'android:strokeLineCap',
    'stroke-linejoin': 'android:strokeLineJoin',
    'stroke-miterlimit': 'android:strokeMiterLimit',
};

function Vector({ attributes, children }) {
    this.children = this.handleChildren(children, attributes);
}

Vector.prototype.toPath = function({ attributes }) {
    return Object.keys(PATH).reduce((prev, key) => {
        if (attributes.hasOwnProperty(key)) {
            return Object.assign({}, prev, { [key]: attributes[key] });
        }

        return prev;
    }, {});
};

Vector.prototype.toGroup = function({ attributes, children }) {
    var childAttributes = Object.keys(PATH).reduce((prev, key) => {
        if (attributes.hasOwnProperty(key)) {
            return Object.assign({}, prev, { [key]: attributes[key] });
        }

        return prev;
    }, {});

    var mergedChildren = children.map(child => {
        child.attributes = Object.assign({}, childAttributes, child.attributes);
        return child;
    });

    if (attributes.transform) {
        var transform = str
            .match(/[0-9.\s]/g)
            .join('')
            .split(' ');

        return {
            translateX: transform[0],
            translateY: transform[1],
            children: this.handleChildren(mergedChildren),
        };
    }

    return this.handleChildren(mergedChildren);
};

Vector.prototype.toPolygon = function({ attributes }) {
    return this.toPath({
        attributes: Object.keys(attributes).reduce((prev, key) => {
            if (key === 'points') {
                return Object.assign({}, prev, { d: attributes[key] });
            }

            return Object.assign({}, prev, { [key]: attributes[key] });
        }, {}),
    });
};

Vector.prototype.handleChild = function(child) {
    if (child.name === 'g') return this.toGroup(child);
    if (child.name === 'path') return this.toPath(child);
    if (child.name === 'polygon') return this.toPolygon(child);
};

Vector.prototype.handleChildren = function(children, attributes = {}) {
    var elements = [];

    if (attributes.style && attributes.style.includes('background:')) {
        var styles = attributes.style
            .replace(' ', '')
            .split(';')
            .map(selector => selector.split(':'))
            .reduce((a, [key, value]) => ({ [key]: value }), {});

        elements.push(
            this.toPath({
                attributes: {
                    d: 'M0,0h108v108h-108z',
                    fill: styles.background,
                },
            })
        );
    }

    children.forEach(child => {
        var handled = this.handleChild(child);

        if (Array.isArray(handled)) {
            handled.forEach(element => {
                elements.push(element);
            });
        } else {
            elements.push(handled);
        }
    });

    return elements;
};

Vector.prototype.pathToVector = function(data, indent = '') {
    var path = ['<path'];
    Object.keys(data).forEach((key, index, { length }) => {
        if (index === length - 1) {
            path.push('    ' + PATH[key] + '="' + data[key] + '" />');
        } else {
            path.push('    ' + PATH[key] + '="' + data[key] + '"');
        }
    });
    path.map(str => indent + str);
    return path.join('\n');
};

Vector.prototype.groupToVector = function(data) {
    var keys = Object.keys(data);
    var group = [];

    if (keys.length > 1) {
        group.push('<group');
        keys.forEach((key, index, { length }) => {
            if (index === length - 1) {
                group.push('    ' + GROUP[key] + '="' + data[key] + '" >');
            } else {
                group.push('    ' + GROUP[key] + '="' + data[key] + '"');
            }
        });
    } else {
        group.push('<group>');
    }

    data.children.forEach(child => {
        group.push(this.pathToVector(child, '    '));
    });

    group.push('</group>');

    return group.join('\n');
};

// PUBLIC
Vector.prototype.toVectorContent = function() {
    return this.children
        .map(data => {
            if (data.hasOwnProperty('children')) {
                return this.groupToVector(data);
            }

            return this.pathToVector(data);
        })
        .join('\n');
};

module.exports = Vector;
