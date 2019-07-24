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
        var transform = attributes.transform
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

Vector.prototype.toCircle = function({ attributes }) {
    var cx = attributes.cx || 0;
    var cy = attributes.cy || 0;
    var r = attributes.r || 0;

    var attrs = attributes;
    attrs.d = `M${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r *
        2},0 a ${r},${r} 0 1,0 -${r * 2},0`;

    return this.toPath({
        attributes: attrs,
    });
};

Vector.prototype.toEllipse = function({ attributes }) {
    var rx = attributes.rx || 0;
    var cx = attributes.cx || 0;
    var ry = attributes.ry || 0;
    var cy = attributes.cy || 0;

    var attrs = attributes;
    attrs.d = `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${rx *
        2},0a${rx},${ry} 0 1,0 -${rx * 2},0`;

    return this.toPath({
        attributes: attrs,
    });
};

Vector.prototype.handleChild = function(child) {
    if (child.name === 'g') return this.toGroup(child);
    if (child.name === 'path') return this.toPath(child);
    if (child.name === 'polygon') return this.toPolygon(child);
    if (child.name === 'circle') return this.toCircle(child);
    if (child.name === 'ellipse') return this.toEllipse(child);
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

Vector.prototype.pathToString = function(data, attributes, indent = '') {
    var path = ['<path'];
    Object.keys(data).forEach((key, index, { length }) => {
        if (index === length - 1) {
            path.push(`    ${attributes[key]}="${data[key]}" />`);
        } else {
            path.push(`    ${attributes[key]}="${data[key]}"`);
        }
    });

    path = path.map(str => indent + str);
    return path.join('\n');
};

Vector.prototype.groupToString = function(data, attrs, indent = '') {
    var keys = Object.keys(data).filter(key => attrs.group.hasOwnProperty(key));
    var groupKey = 'g';
    var group = [];

    if (attrs.path.d === PATH.d) {
        groupKey = 'group';
    }

    if (keys.length > 0) {
        group.push(`${indent}<${groupKey}`);
        if (groupKey === 'g') {
            group.push(
                `${indent}    transform="translate(${data.translateX} ${data.translateY})" >`
            );
        } else {
            group.push(
                `${indent}    ${attrs.group['translateX']}="${data.translateX}"`
            );
            group.push(
                `${indent}    ${attrs.group['translateY']}="${
                    data.translateY
                }" >`
            );
        }
    } else {
        group.push(`${indent}<${groupKey}>`);
    }

    data.children.forEach(child => {
        if (child.hasOwnProperty('children')) {
            group.push(this.groupToString(child, attrs, indent + '    '));
        } else {
            group.push(this.pathToString(child, attrs.path, indent + '    '));
        }
    });

    group.push(`${indent}</${groupKey}>`);

    return group.join('\n');
};

// PUBLIC
Vector.prototype.toVectorContent = function(indent = '') {
    return this.children
        .map(data => {
            if (data.hasOwnProperty('children')) {
                return this.groupToString(
                    data,
                    { group: GROUP, path: PATH },
                    indent
                );
            }

            return this.pathToString(data, PATH, indent);
        })
        .join('\n');
};

Vector.prototype.toSvgContent = function(indent = '') {
    const group = Object.keys(GROUP).reduce((prev, key) => {
        return Object.assign({}, prev, { [key]: key });
    }, {});

    const path = Object.keys(PATH).reduce((prev, key) => {
        return Object.assign({}, prev, { [key]: key });
    }, {});

    return this.children
        .map(data => {
            if (data.hasOwnProperty('children')) {
                return this.groupToString(data, { group, path }, indent);
            }

            return this.pathToString(data, path, indent);
        })
        .join('\n')
        .replace('group', 'g');
};

module.exports = Vector;
