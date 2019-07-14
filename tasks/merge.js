function toSvgPath(attributes) {
    return `	<path\n${Object.keys(attributes)
        .map(next => {
            return `		${next}="${attributes[next]}"`;
        })
        .filter(f => f)
        .join('\n')} />`;
}

function merge(elements) {
    var combined = [];

    elements.forEach(element => {
        element.forEach(d => {
            combined.push(toSvgPath(d));
        });
    });

    return [...elements, combined];
}

module.exports = merge;
