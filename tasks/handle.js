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

                    children.forEach(({ attributes }) => {
                        paths.push(attributes);
                    });

                    resolve(paths);
                })
        )
    );
}

module.exports = handle;
