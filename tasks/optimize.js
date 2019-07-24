const SVGO = require('svgo');

const SvgOmg = new SVGO({
    plugins: [
        { removeDoctype: true },
        { removeXMLProcInst: true },
        { removeComments: true },
        { removeMetadata: true },
        { removeXMLNS: false },
        { removeEditorsNSData: true },
        { cleanupAttrs: true },
        { inlineStyles: true },
        { minifyStyles: true },
        { convertStyleToAttrs: true },
        { cleanupIDs: true },
        { prefixIds: true },
        { removeRasterImages: false },
        { removeUselessDefs: true },
        { cleanupNumericValues: true },
        { cleanupListOfValues: true },
        { convertColors: true },
        { removeUnknownsAndDefaults: true },
        { removeNonInheritableGroupAttrs: true },
        { removeUselessStrokeAndFill: true },
        { removeViewBox: false },
        { cleanupEnableBackground: true },
        { removeHiddenElems: true },
        { removeEmptyText: true },
        { convertShapeToPath: true },
        { moveElemsAttrsToGroup: true },
        { moveGroupAttrsToElems: true },
        { collapseGroups: true },
        { convertPathData: true },
        { convertTransform: true },
        { removeEmptyAttrs: true },
        { removeEmptyContainers: true },
        { mergePaths: true },
        { removeUnusedNS: true },
        { sortAttrs: true },
        { removeTitle: true },
        { removeDesc: true },
        { removeDimensions: false },
        { removeAttrs: true },
        { removeElementsByAttr: true },
        { addClassesToSVGElement: false },
        { removeStyleElement: true },
        { removeScriptElement: true },
        { addAttributesToSVGElement: false },
    ],
});

function optimize([bacground, foreground, base]) {
    return Promise.all([
        SvgOmg.optimize(bacground).then(({ data }) => data),
        SvgOmg.optimize(foreground).then(({ data }) => data),
        base,
    ]);
}

module.exports = optimize;
