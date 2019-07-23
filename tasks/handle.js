function handle(elements) {
    return Promise.all(
        elements.map(
            ({ children, attributes }) =>
                new Promise(resolve => {
                    var paths = [];

                    if (
                        attributes.style &&
                        attributes.style.includes('background:')
                    ) {
                        var styles = attributes.style
                            .replace(' ', '')
                            .split(';')
                            .map(selector => selector.split(':'))
                            .reduce(
                                (a, [key, value]) => ({ [key]: value }),
                                {}
                            );

                        paths.push({
                            d: 'M0,0h108v108h-108z',
                            fill: styles.background,
                        });
                    }

                    children.forEach(node => {
                        if (node.name === 'g' && node.children.length > 0) {
                            node.children.forEach(child => {
                                if (child.name === 'path') {
                                    paths.push(child.attributes);
                                }
                                if (child.name === 'polygon' && child.attributes.points) {
                                    paths.push({
                                        fill: child.attributes.fill,
                                        path: 'M' + child.attributes.points
                                    });
                                }
                            });
                        } else if (node.name === 'path') {
                            paths.push(node.attributes);
                        }
                    });

                    resolve(paths);
                })
        )
    );
}

module.exports = handle;
