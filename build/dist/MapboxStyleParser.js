"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MapboxStyleUtil_1 = require("./Util/MapboxStyleUtil");
var _cloneDeep = require('lodash/cloneDeep');
var _isEqual = require('lodash/isEqual');
var MapboxStyleParser = /** @class */ (function () {
    function MapboxStyleParser(options) {
        // looks like there's no way to access static properties from an instance
        // without a reference to the constructor function, so we have to duplicate
        // the title here
        this.title = 'Mapbox';
        this.ignoreConversionErrors = false;
        if (options && options.ignoreConversionErrors) {
            this.ignoreConversionErrors = options.ignoreConversionErrors;
        }
    }
    MapboxStyleParser.prototype.isSymbolType = function (s) {
        return s.iconSymbolizer ? true : s.textSymbolizer ? true : false;
    };
    /**
     * Parses the GeoStylerStyle-SymbolizerKind from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {SymbolizerKind} A GeoStylerStyle-SymbolizerKind
     */
    MapboxStyleParser.prototype.getSymbolizerKindFromMapboxLayer = function (type) {
        switch (type) {
            case 'fill':
                return 'Fill';
            case 'line':
                return 'Line';
            case 'symbol':
                return 'Symbol';
            case 'circle':
                return 'Circle';
            default:
                if (this.ignoreConversionErrors) {
                    return 'Circle';
                }
                throw new Error("Could not parse mapbox style. Unsupported layer type.\n                We support types 'fill', 'line', 'circle' and 'symbol' only.");
        }
    };
    /**
     * Creates a GeoStylerStyle-TextSymbolizer label from a Mapbox Layer Paint Symbol text-field
     *
     * @param {string | any[]} label A Mapbox Layer Paint Symbol text-field
     * @return {string} A GeoStylerStyle-TextSymbolizer label
     */
    MapboxStyleParser.prototype.getLabelFromTextField = function (label) {
        if (typeof label === 'undefined') {
            return;
        }
        if (typeof label === 'string') {
            return MapboxStyleUtil_1.default.resolveMbTextPlaceholder(label);
        }
        if (label[0] !== 'format' && !this.ignoreConversionErrors) {
            throw new Error("Cannot parse mapbox style. Unsupported text format.");
        }
        var gsLabel = '';
        // ignore all even indexes since we cannot handle them
        for (var i = 1; i < label.length; i = i + 2) {
            if (typeof label[i] === 'string') {
                gsLabel += label[i];
            }
            else {
                if (label[i][0] !== 'get' && !this.ignoreConversionErrors) {
                    throw new Error("Cannot parse mapbox style. Unsupported lookup type.");
                }
                gsLabel += '{{' + label[i][1] + '}}';
            }
        }
        return gsLabel;
    };
    /**
     * Creates a GeoStylerStyle-MarkSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {MarkSymbolizer} A GeoStylerStyle-MarkSymbolizer
     */
    MapboxStyleParser.prototype.getMarkSymbolizerFromMapboxLayer = function (paint, layout) {
        // TODO parse MarkSymbolizer
        return {
            kind: 'Mark',
            wellKnownName: 'Circle'
        };
    };
    /**
     * Creates an image url based on the sprite baseurl and the sprite name.
     *
     * @param {string} spriteName Name of the sprite
     * @return {string} the url that returns the single image
     */
    MapboxStyleParser.prototype.getIconImage = function (spriteName) {
        if (!spriteName) {
            return;
        }
        if (!this._spriteBaseUrl) {
            return;
        }
        // TODO update endpoint as soon as api specification was made
        var url = '/sprites/?';
        url += 'name=' + spriteName;
        url += '&baseurl=' + encodeURIComponent(this._spriteBaseUrl);
        return url;
    };
    /**
     * Creates a GeoStylerStyle-MarkSymbolizer with wellKnownName 'circle'
     * from a Mapbox Style Layer. This one will be handled explicitly
     * because mapbox has a dedicated layer type for circles. Other shapes are covered
     * in layer type 'symbol' using fonts.
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {MarkSymbolizer} A GeoStylerStyle-MarkSymbolizer
     */
    MapboxStyleParser.prototype.getCircleSymbolizerFromMapboxLayer = function (paint, layout) {
        return {
            kind: 'Mark',
            wellKnownName: 'Circle',
            visibility: layout['visibility'],
            radius: paint['circle-radius'],
            color: paint['circle-color'],
            blur: paint['circle-blur'],
            opacity: paint['circle-opacity'],
            translate: paint['circle-translate'],
            translateAnchor: paint['circle-translate-anchor'],
            pitchScale: paint['circle-pitch-scale'],
            pitchAlignment: paint['circle-pitch-alignment'],
            strokeWidth: paint['circle-stroke-width'],
            strokeColor: paint['circle-stroke-color'],
            strokeOpacity: paint['circle-stroke-opacity']
        };
    };
    /**
     * Creates a GeoStylerStyle-IconSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {IconSymbolizer} A GeoStylerStyle-IconSymbolizer
     */
    MapboxStyleParser.prototype.getIconSymbolizerFromMapboxLayer = function (paint, layout) {
        return {
            kind: 'Icon',
            spacing: layout['symbol-spacing'],
            avoidEdges: layout['symbol-avoid-edges'],
            allowOverlap: layout['icon-allow-overlap'],
            ignorePlacement: layout['icon-ignore-placement'],
            optional: layout['icon-optional'],
            rotationAlignment: layout['icon-rotation-alignment'],
            size: layout['icon-size'],
            textFit: layout['icon-text-fit'],
            textFitPadding: layout['icon-text-fit-padding'],
            image: this.getIconImage(layout['icon-image']),
            rotate: layout['icon-rotate'],
            padding: layout['icon-padding'],
            keepUpright: layout['icon-keep-upright'],
            offset: layout['icon-offset'],
            anchor: layout['icon-anchor'],
            pitchAlignment: layout['icon-pitch-alignment'],
            visibility: layout['visibility'],
            opacity: paint['icon-opacity'],
            color: paint['icon-color'],
            haloColor: paint['icon-halo-color'],
            haloWidth: paint['icon-halo-width'],
            haloBlur: paint['icon-halo-blur'],
            translate: paint['icon-translate'],
            translateAnchor: paint['icon-translate-anchor']
        };
    };
    /**
     * Creates a GeoStylerStyle-TextSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {TextSymbolizer} A GeoStylerStyle-TextSymbolizer
     */
    MapboxStyleParser.prototype.getTextSymbolizerFromMapboxLayer = function (paint, layout) {
        return {
            kind: 'Text',
            spacing: layout['symbol-spacing'],
            avoidEdges: layout['symbol-avoid-edges'],
            pitchAlignment: layout['text-pitch-alignment'],
            rotationAlignment: layout['text-rotation-alignment'],
            label: this.getLabelFromTextField(layout['text-field']),
            font: layout['text-font'],
            size: layout['text-size'],
            maxWidth: layout['text-max-width'],
            lineHeight: layout['text-line-height'],
            letterSpacing: layout['text-letter-spacing'],
            justify: layout['text-justify'],
            anchor: layout['text-anchor'],
            maxAngle: layout['text-max-angle'],
            rotate: layout['text-rotate'],
            padding: layout['text-padding'],
            keepUpright: layout['text-keep-upright'],
            transform: layout['text-transform'],
            offset: layout['text-offset'],
            allowOverlap: layout['text-allow-overlap'],
            ignorePlacement: layout['text-ignore-placement'],
            optional: layout['text-optional'],
            visibility: layout['visibility'],
            opacity: paint['text-opacity'],
            color: paint['text-color'],
            haloColor: paint['text-halo-color'],
            haloWidth: paint['text-halo-width'],
            haloBlur: paint['text-halo-blur'],
            translate: paint['text-translate'],
            translateAnchor: paint['text-translate-anchor']
        };
    };
    /**
     * Creates a GeoStylerStyle-FillSymbolizer from a Mapbox Style Layer.
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {FillSymbolizer} A GeoStylerStyle-FillSymbolizer
     */
    MapboxStyleParser.prototype.getFillSymbolizerFromMapboxLayer = function (paint, layout) {
        return {
            kind: 'Fill',
            visibility: layout['visibility'],
            antialias: paint['fill-antialias'],
            opacity: paint['fill-opacity'],
            color: paint['fill-color'],
            outlineColor: paint['fill-outline-color'],
            translate: paint['fill-translate'],
            translateAnchor: paint['fill-translate-anchor'],
            graphicFill: this.getPatternOrGradientFromMapboxLayer(paint['fill-pattern'])
        };
    };
    MapboxStyleParser.prototype.getPatternOrGradientFromMapboxLayer = function (icon) {
        if (Array.isArray(icon) && !this.ignoreConversionErrors) {
            throw new Error("Cannot parse pattern or gradient. No Mapbox expressions allowed");
        }
        if (!icon) {
            return;
        }
        return this.getIconSymbolizerFromMapboxLayer({}, { 'icon-image': icon });
    };
    /**
     * Creates a GeoStylerStyle-LineSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {LineSymbolizer} A GeoStylerStyle-LineSymbolizer
     */
    MapboxStyleParser.prototype.getLineSymbolizerFromMapboxLayer = function (paint, layout) {
        return {
            kind: 'Line',
            visibility: layout.visibility,
            cap: layout['line-cap'],
            join: layout['line-join'],
            miterLimit: layout['line-miter-limit'],
            roundLimit: layout['line-round-limit'],
            opacity: paint['line-opacity'],
            color: paint['line-color'],
            translate: paint['line-translate'],
            translateAnchor: paint['line-translate-anchor'],
            width: paint['line-width'],
            gapWidth: paint['line-gap-width'],
            perpendicularOffset: paint['line-offset'],
            blur: paint['line-blur'],
            dasharray: paint['line-dasharray'],
            gradient: paint['line-gradient'],
            graphicFill: this.getPatternOrGradientFromMapboxLayer(paint['line-pattern'])
        };
    };
    /**
     * Creates GeoStyler-Style TextSymbolizer and IconSymbolizer from
     * a mapbox layer paint object.
     *
     * @param paint The paint object of a mapbox layer
     */
    MapboxStyleParser.prototype.getIconTextSymbolizersFromMapboxLayer = function (paint, layout) {
        return {
            textSymbolizer: this.getTextSymbolizerFromMapboxLayer(paint, layout),
            iconSymbolizer: this.getIconSymbolizerFromMapboxLayer(paint, layout)
        };
    };
    /**
     * Creates a GeoStylerStyle-Symbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {Symbolizer} A GeoStylerStyle-Symbolizer
     */
    MapboxStyleParser.prototype.getSymbolizerFromMapboxLayer = function (paint, layout, type) {
        var symbolizer = {};
        var kind = this.getSymbolizerKindFromMapboxLayer(type);
        switch (kind) {
            case 'Fill':
                symbolizer = this.getFillSymbolizerFromMapboxLayer(paint, layout);
                break;
            case 'Line':
                symbolizer = this.getLineSymbolizerFromMapboxLayer(paint, layout);
                break;
            case 'Symbol':
                return this.getIconTextSymbolizersFromMapboxLayer(paint, layout);
            case 'Circle':
                return this.getCircleSymbolizerFromMapboxLayer(paint, layout);
            case 'Mark':
                symbolizer = this.getMarkSymbolizerFromMapboxLayer(paint, layout);
                break;
            default:
                if (this.ignoreConversionErrors) {
                    return;
                }
                throw new Error("Cannot parse mapbox style. Unsupported Symbolizer kind.");
        }
        return symbolizer;
    };
    /**
     * Creates a GeoStylerStyle-Filter from a Mapbox Style Layer Filter
     *
     * @param filter A Mapbox Style Layer Filter
     * @return {Filter} A GeoStylerStyle-Filter
     */
    MapboxStyleParser.prototype.getFilterFromMapboxFilter = function (filter) {
        var _this = this;
        var operatorMapping = {
            'all': true,
            'any': true,
            '!': true
        };
        var operator = filter[0];
        var isNestedFilter = false;
        if (operatorMapping[operator]) {
            isNestedFilter = true;
        }
        if (isNestedFilter) {
            switch (filter[0]) {
                case 'all':
                    filter[0] = '&&';
                    break;
                case 'any':
                    filter[0] = '||';
                    break;
                default:
                    break;
            }
            var restFilter = filter.slice(1);
            restFilter.forEach(function (f) {
                _this.getFilterFromMapboxFilter(f);
            });
        }
        return filter;
    };
    /**
     * Creates a GeoStylerStyle-ScaleDenominator from a Mapvox Style Layer Min/Max Zoom
     *
     * @param {number} minZoom A Mapbox Style Layer minZoom property
     * @param {number} maxZoom A Mapbox Style Layer maxZoom property
     * @return {ScaleDenominator} A GeoStylerStyle-ScaleDenominator
     */
    MapboxStyleParser.prototype.getScaleDenominatorFromMapboxZoom = function (minZoom, maxZoom) {
        var scaleDenominator = {};
        if (typeof minZoom !== 'undefined') {
            scaleDenominator.max = MapboxStyleUtil_1.default.zoomToScale(minZoom);
        }
        if (typeof maxZoom !== 'undefined') {
            scaleDenominator.min = MapboxStyleUtil_1.default.zoomToScale(maxZoom);
        }
        if (typeof scaleDenominator.min === 'undefined' && typeof scaleDenominator.max === 'undefined') {
            return undefined;
        }
        return scaleDenominator;
    };
    /**
     * Merges the baseFilter and the attribute filter to a single filter.
     * If both filters are defined, they will be merged via '&&' operator.
     * If only one of the filters is defined, the defined filter will be returned.
     *
     * @param baseFilter The value of the mapbox layer's filter property
     * @param filter The value of the mapbox paint attribute filter
     */
    MapboxStyleParser.prototype.mergeFilters = function (baseFilter, filter) {
        var gsBaseFilter = undefined;
        var gsFilter = undefined;
        if (baseFilter && filter) {
            gsBaseFilter = this.getFilterFromMapboxFilter(baseFilter);
            gsFilter = this.getFilterFromMapboxFilter(filter);
            return [
                '&&',
                gsBaseFilter,
                gsFilter
            ];
        }
        if (filter) {
            gsFilter = this.getFilterFromMapboxFilter(filter);
            return gsFilter;
        }
        if (baseFilter) {
            gsBaseFilter = this.getFilterFromMapboxFilter(baseFilter);
            return gsBaseFilter;
        }
        return undefined;
    };
    /**
     * Compares an arbitrary number of filters for equality
     *
     * @param filters Array of mapbox filters
     */
    MapboxStyleParser.prototype.equalMapboxAttributeFilters = function (filters) {
        // convert filters to strings
        var filterStrings = [];
        var equal = true;
        var _loop_1 = function (i) {
            var filterString = [];
            filters[i].forEach(function (exp, index, f) {
                if (index % 2 === 1 && index !== f.length - 1) {
                    filterString.push(JSON.stringify(exp));
                }
            });
            filterStrings.forEach(function (filter) {
                if (!_isEqual(filterString, filter)) {
                    equal = false;
                }
            });
            if (equal) {
                filterStrings.push(filterString);
            }
            else {
                return "break";
            }
        };
        for (var i = 0; i < filters.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        return equal;
    };
    /**
     * Creates valid GeoStyler-Style Symbolizers from possibly invalid Symbolizers.
     * Symbolizers are invalid if at least one of their attributes' values is a mapbox filter expression.
     * This function detects such expressions and creates a symbolizer for each possible outcome.
     * Related property values will be set accordingly. Thus, creating valid Symbolizers.
     *
     * IMPORTANT: Currently only the 'case' filter expression is supported. Furthermore, handling of multiple properties
     * with filter expressions is only supported if all filter expressions are equal. Otherwise errors will be thrown.
     *
     * @param tmpSymbolizer A possibly invalid GeoStyler-Style Symbolizer
     * @return {{filter?: Filter; symbolizers: Symbolizer[]}} Array of valid Symbolizers and optional mapbox filters
     */
    MapboxStyleParser.prototype.mapboxAttributeFiltersToSymbolizer = function (tmpSymbolizer) {
        var _this = this;
        var pseudoRules = [];
        var props = Object.keys(tmpSymbolizer);
        var filterProps = [];
        var filters = [];
        props.forEach(function (prop) {
            if (typeof prop === 'undefined') {
                return;
            }
            if (!Array.isArray(tmpSymbolizer[prop])) {
                return;
            }
            if (typeof tmpSymbolizer[prop][0] !== 'string') {
                return;
            }
            if (prop === 'font' && !(tmpSymbolizer[prop].some(function (x) { return typeof x !== 'string'; }))) {
                return;
            }
            // is expression
            // switch (tmpSymbolizer[prop][0]) {
            //     case 'case':
            //         break;
            //     case 'match':
            //         break;
            //     default:
            //         throw new Error(`Unsupported expression.
            // Only expressions of type 'case' and 'match' are allowed.`);
            // }
            if (tmpSymbolizer[prop][0] !== 'case' && !_this.ignoreConversionErrors) {
                throw new Error("Unsupported expression. Only expressions of type 'case' are allowed.");
            }
            filterProps.push(prop);
            filters.push(tmpSymbolizer[prop]);
        });
        if (filters.length > 0) {
            var equalFilters = this.equalMapboxAttributeFilters(filters);
            if (!equalFilters && !this.ignoreConversionErrors) {
                throw new Error("Cannot parse attributes. Filters do not match");
            }
            // iterate over each value in a single filter
            // we can use filters[0] as we checked beforehand if all filters are equal.
            filters[0].forEach(function (filter, index) {
                // ignore all even indexes as we are not interested in the values at this point
                if (index % 2 !== 1) {
                    return;
                }
                // make a deep clone to avoid call-by-reference issues
                var symbolizer = _cloneDeep(tmpSymbolizer);
                var values = [];
                // iterate over each filter and push the corresponding value of the current filter expression
                filters.forEach(function (f) {
                    values.push(f[index + 1]);
                });
                // set the value of the corresponding symbolizer property to value of current filter expression
                values.forEach(function (val, i) {
                    var p = filterProps[i];
                    symbolizer[p] = val;
                });
                // push the created symbolizers and the corresponding filter expression.
                // Results in an object containing a single Filter expression (in mapbox expression format)
                // and the corresponding symbolizers only containing values.
                // Number of symbolizers corresponds to the number of outcomes of a filter expression.
                pseudoRules.push({
                    symbolizers: [symbolizer],
                    filter: filter
                });
            });
        }
        else {
            pseudoRules.push({
                symbolizers: [tmpSymbolizer]
            });
        }
        return pseudoRules;
    };
    /**
     * Creates GeoStyler-Style Rules from a mapbox paint object.
     *
     * @param {any} paint A mapbox layer paint object
     * @param {string} type The type of the mapbox layer
     * @return {Rule[]} Array of GeoStyler-Style Rules
     */
    MapboxStyleParser.prototype.mapboxPaintToGeoStylerRules = function (paint, layout, type) {
        var rules = [];
        var tmpSymbolizer = this.getSymbolizerFromMapboxLayer(paint, layout, type);
        if (tmpSymbolizer === undefined) {
            return rules;
        }
        var pseudoRules = [];
        if (this.isSymbolType(tmpSymbolizer)) {
            // Concatenates all pseudorules.
            if (tmpSymbolizer.hasOwnProperty('iconSymbolizer')) {
                // check if all properties except 'kind' are undefined. If so, skip
                if (!MapboxStyleUtil_1.default.symbolizerAllUndefined(tmpSymbolizer.iconSymbolizer)) {
                    pseudoRules.push.apply(pseudoRules, this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer.iconSymbolizer));
                }
            }
            if (tmpSymbolizer.hasOwnProperty('textSymbolizer')) {
                // check if all properties except 'kind' are undefined. If so, skip
                if (!MapboxStyleUtil_1.default.symbolizerAllUndefined(tmpSymbolizer.textSymbolizer)) {
                    pseudoRules.push.apply(pseudoRules, this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer.textSymbolizer));
                }
            }
        }
        else {
            pseudoRules.push.apply(pseudoRules, this.mapboxAttributeFiltersToSymbolizer(tmpSymbolizer));
        }
        pseudoRules.forEach(function (rule) {
            var filter = rule.filter, symbolizers = rule.symbolizers;
            rules.push({
                name: '',
                filter: filter,
                symbolizers: symbolizers
            });
        });
        return rules;
    };
    /**
     * Creates a GeoStyler-Style Rule from a mapbox layer.
     *
     * @param {any} layer The mapbox Layer
     * @return {Rule[]} A GeoStyler-Style Rule Array
     */
    MapboxStyleParser.prototype.mapboxLayerToGeoStylerRules = function (layer) {
        var _this = this;
        var rules = [];
        if (!layer.layout) {
            layer.layout = {};
        }
        if (!layer.paint) {
            layer.paint = {};
        }
        // returns array of rules where one rule contains one symbolizer
        var symbolizerRules = this.mapboxPaintToGeoStylerRules(layer.paint, layer.layout, layer.type);
        symbolizerRules.forEach(function (rule, index) {
            var filter = layer.filter ? _cloneDeep(layer.filter) : undefined;
            var ruleFilter = _cloneDeep(rule.filter);
            rules.push({
                name: layer.id,
                scaleDenominator: _this.getScaleDenominatorFromMapboxZoom(layer.minzoom, layer.maxzoom),
                // merge layer filter with attribute filters
                filter: _this.mergeFilters(filter, ruleFilter),
                symbolizers: rule.symbolizers
            });
        });
        return rules;
    };
    /**
     * Creates a GeoStylerStyle-Style from a Mapbox Style
     *
     * @param {any} mapboxStyle The Mapbox Style object
     * @return {Style} A GeoStylerStyle-Style
     */
    MapboxStyleParser.prototype.mapboxLayerToGeoStylerStyle = function (mapboxStyle) {
        var _this = this;
        if (!(mapboxStyle instanceof Object)) {
            mapboxStyle = JSON.parse(mapboxStyle);
        }
        var style = {};
        style.name = mapboxStyle.name;
        style.rules = [];
        if (mapboxStyle.sprite) {
            this._spriteBaseUrl = MapboxStyleUtil_1.default.getUrlForMbPlaceholder(mapboxStyle.sprite);
        }
        if (mapboxStyle.layers) {
            mapboxStyle.layers.forEach(function (layer) {
                var rules = _this.mapboxLayerToGeoStylerRules(layer);
                style.rules = style.rules.concat(rules);
            });
        }
        return style;
    };
    /**
     * The readStyle implementation of the GeoStyler-Style StylerParser interface.
     * It reads a Mapbox Style and returns a Promise resolving with a GeoStylerStyle-ReadResponse.
     *
     * @param mapboxLayer The Mapbox Style object
     * @return {Promise<ReadResponse>} The Promise resolving with a GeoStylerStyle-ReadResponse
     */
    MapboxStyleParser.prototype.readStyle = function (mapboxStyle) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var mbStyle = _cloneDeep(mapboxStyle);
                var geoStylerStyle = _this.mapboxLayerToGeoStylerStyle(mbStyle);
                resolve(geoStylerStyle);
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads a GeoStyler-Style Style and returns a Promise.
     *
     * @param {Style} geoStylerStyle A GeoStylerStyle-Style
     * @return {Promise<any>} The Promise resolving with an mapbox style object
     */
    MapboxStyleParser.prototype.writeStyle = function (geoStylerStyle) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var gsStyle = _cloneDeep(geoStylerStyle);
                var mapboxStyle = _this.geoStylerStyleToMapboxObject(gsStyle);
                resolve(JSON.stringify(mapboxStyle));
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * Write a Mapbox Style Object based on a GeoStylerStyle.
     *
     * @param {Style} geoStylerStyle A GeoStylerStyle-Style
     * @return {any} A Mapbox Style object
     */
    MapboxStyleParser.prototype.geoStylerStyleToMapboxObject = function (geoStylerStyle) {
        // Mapbox Style version
        var version = 8;
        var name = geoStylerStyle.name;
        var layers = this.getMapboxLayersFromRules(geoStylerStyle.rules);
        var sprite = MapboxStyleUtil_1.default.getMbPlaceholderForUrl(this._spriteBaseUrl);
        return {
            version: version,
            name: name,
            layers: layers,
            sprite: sprite
        };
    };
    /**
     * Creates a layer for each Rule and each Symbolizer.
     *
     * @param {Rule[]} rules An array of GeoStylerStyle-Rules
     * @return {any[]} An array of Mapbox Layers
     */
    MapboxStyleParser.prototype.getMapboxLayersFromRules = function (rules) {
        var _this = this;
        // one layer corresponds to a single symbolizer within a rule
        // so filters and scaleDenominators have to be set for each symbolizer explicitly
        var layers = [];
        rules.forEach(function (rule, i) {
            // create new layer object
            var layer = {};
            // just setting the temporary id here
            // after iterating over each symbolizer, we will add the index of each symbolizer
            // as a suffix to the layerId;
            var layerId = rule.name; // + '-gs-r' + i;
            // set filters and scaleDenominator
            if (rule.filter && rule.filter.length !== 0) {
                var filterClone = _cloneDeep(rule.filter);
                layer.filter = _this.getMapboxFilterFromFilter(filterClone);
            }
            if (rule.scaleDenominator) {
                // calculate zoomLevel from scaleDenominator
                if (typeof rule.scaleDenominator.min !== 'undefined') {
                    layer.maxzoom = _this.getMapboxZoomFromScaleDenominator(rule.scaleDenominator.min);
                }
                if (typeof rule.scaleDenominator.max !== 'undefined') {
                    layer.minzoom = _this.getMapboxZoomFromScaleDenominator(rule.scaleDenominator.max);
                }
            }
            rule.symbolizers.forEach(function (symbolizer, index) {
                // use existing layer properties
                var lyr = {};
                lyr.filter = layer.filter;
                lyr.minzoom = layer.minzoom;
                lyr.maxzoom = layer.maxzoom;
                // set name
                // lyr.id = layerId + '-s' + index;
                lyr.id = layerId;
                // get symbolizer type and paint
                var _a = _this.getStyleFromSymbolizer(symbolizer), layerType = _a.layerType, paint = _a.paint, layout = _a.layout;
                lyr.type = layerType;
                lyr.paint = !MapboxStyleUtil_1.default.allUndefined(paint) ? paint : undefined;
                lyr.layout = !MapboxStyleUtil_1.default.allUndefined(layout) ? layout : undefined;
                layers.push(lyr);
            });
        });
        return layers;
    };
    /**
     * Get the mapbox zoomlevel from a scaleDenominator.
     * Interpolates the zoomlevel if calculated resolutions do not match.
     *
     * @param scaleDenominator The scaleDenominator of the GeoStyler-Style Rule
     * @return number The corresponding zoom level
     */
    MapboxStyleParser.prototype.getMapboxZoomFromScaleDenominator = function (scaleDenominator) {
        // transform scaledenom to resolution
        var resolution = MapboxStyleUtil_1.default.getResolutionForScale(scaleDenominator);
        var pre = undefined;
        var post = undefined;
        var zoom;
        var resolutions = MapboxStyleUtil_1.default.getResolutions();
        zoom = resolutions.indexOf(resolution);
        if (zoom === -1) {
            zoom = MapboxStyleUtil_1.default.getZoomForResolution(resolution);
        }
        if (typeof pre !== 'undefined' && typeof post !== 'undefined') {
            // interpolate between zoomlevels
            var preVal = resolutions[pre];
            var postVal = resolutions[post];
            var range = preVal - postVal;
            var diff = resolution - postVal;
            var percentage = 1 - (diff / range);
            if (percentage === 0) {
                return pre;
            }
            zoom = pre + percentage;
        }
        return zoom;
    };
    /**
     * Writes a Mapbox-filter from a GeoStylerStyle-Filter
     *
     * @param {Filter} filter A GeoStylerStyle-Filter
     * @return {any[]} A Mapbox filter array
     */
    MapboxStyleParser.prototype.getMapboxFilterFromFilter = function (filter) {
        var _this = this;
        var operatorMapping = {
            '&&': true,
            '||': true,
            '!': true
        };
        var operator = filter[0];
        var isNestedFilter = false;
        if (operatorMapping[operator]) {
            isNestedFilter = true;
        }
        if (isNestedFilter) {
            switch (filter[0]) {
                case '&&':
                    filter[0] = 'all';
                    break;
                case '||':
                    filter[0] = 'any';
                    break;
                default:
                    break;
            }
            var restFilter = filter.slice(1);
            restFilter.forEach(function (f) {
                _this.getMapboxFilterFromFilter(f);
            });
        }
        return filter;
    };
    /**
     * Creates a Mapbox Layer Paint object and the layerType from a GeoStylerStyle-Symbolizer
     *
     * @param {Symbolizer} symbolizer A GeoStylerStyle-Symbolizer
     * @return {MapboxLayerType, any} {layertype, paint} An object consisting of the MapboxLayerType
     *                                                   and the Mapbox Layer Paint
     */
    MapboxStyleParser.prototype.getStyleFromSymbolizer = function (symbolizer) {
        var symbolizerClone = _cloneDeep(symbolizer);
        var layerType;
        var paint;
        var layout;
        switch (symbolizer.kind) {
            case 'Fill':
                layerType = 'fill';
                paint = this.getPaintFromFillSymbolizer(symbolizerClone);
                layout = this.getLayoutFromFillSymbolizer(symbolizerClone);
                break;
            case 'Line':
                layerType = 'line';
                paint = this.getPaintFromLineSymbolizer(symbolizerClone);
                layout = this.getLayoutFromLineSymbolizer(symbolizerClone);
                break;
            case 'Icon':
                layerType = 'symbol';
                paint = this.getPaintFromIconSymbolizer(symbolizerClone);
                layout = this.getLayoutFromIconSymbolizer(symbolizerClone);
                break;
            case 'Text':
                layerType = 'symbol';
                paint = this.getPaintFromTextSymbolizer(symbolizerClone);
                layout = this.getLayoutFromTextSymbolizer(symbolizerClone);
                break;
            case 'Mark':
                if (symbolizer.wellKnownName === 'Circle') {
                    layerType = 'circle';
                    paint = this.getPaintFromCircleSymbolizer(symbolizerClone);
                    layout = this.getLayoutFromCircleSymbolizer(symbolizerClone);
                    break;
                }
                else if (!this.ignoreConversionErrors) {
                    throw new Error("Cannot get Style. Unsupported MarkSymbolizer");
                }
                else {
                    layerType = 'symbol';
                }
                break;
            // TODO check if mapbox can generate regular shapes
            default:
                if (!this.ignoreConversionErrors) {
                    throw new Error("Cannot get Style. Unsupported kind.");
                }
                else {
                    layerType = 'symbol';
                }
        }
        return {
            layerType: layerType,
            paint: paint,
            layout: layout
        };
    };
    /**
     * Creates a Mapbox Layer Paint object from a GeostylerStyle-FillSymbolizer
     *
     * @param {FillSymbolizer} symbolizer A GeostylerStyle-FillSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    MapboxStyleParser.prototype.getPaintFromFillSymbolizer = function (symbolizer) {
        var opacity = symbolizer.opacity, color = symbolizer.color, outlineColor = symbolizer.outlineColor, graphicFill = symbolizer.graphicFill, antialias = symbolizer.antialias, translate = symbolizer.translate, translateAnchor = symbolizer.translateAnchor;
        var paint = {
            'fill-antialias': antialias,
            'fill-opacity': opacity,
            'fill-color': color,
            'fill-outline-color': outlineColor,
            'fill-translate': translate,
            'fill-translate-anchor': translateAnchor,
            'fill-pattern': this.getPatternOrGradientFromPointSymbolizer(graphicFill)
        };
        return paint;
    };
    /**
     * Creates a Mapbox Layer Layout object from a GeostylerStyle-FillSymbolizer
     *
     * @param {FillSymbolizer} symbolizer A GeostylerStyle-FillSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    MapboxStyleParser.prototype.getLayoutFromFillSymbolizer = function (symbolizer) {
        var visibility = symbolizer.visibility;
        var layout = {
            'visibility': this.getVisibility(visibility)
        };
        return layout;
    };
    /**
     * Creates a fill pattern or gradient from a GeoStylerStyle-Symbolizer
     *
     * @param {PointSymbolizer|undefined} symbolizer The Symbolizer that is being used for pattern or gradient
     * @return {string|undefined} The name of the sprite or undefined, if no image source was specified
     */
    MapboxStyleParser.prototype.getPatternOrGradientFromPointSymbolizer = function (symbolizer) {
        if (!symbolizer) {
            return undefined;
        }
        if (symbolizer.kind !== 'Icon') {
            if (this.ignoreConversionErrors) {
                return;
            }
            throw new Error("Cannot parse pattern or gradient. Mapbox only supports Icons.");
        }
        if (!symbolizer.image) {
            return undefined;
        }
        var sprite = this.handleSprite(symbolizer.image);
        return sprite;
    };
    /**
     * Adds a sprite to the Mapbox Style object
     *
     * @param {string} path The source of an image
     * @return {string} The name of the sprite
     */
    MapboxStyleParser.prototype.handleSprite = function (path) {
        var spritename = '';
        var baseurl = '';
        var query = path.split('?')[1];
        if (query.length === 0) {
            return;
        }
        var params = query.split('&');
        params.forEach(function (param) {
            var _a = param.split('='), key = _a[0], value = _a[1];
            if (key === 'name') {
                spritename = value;
            }
            else if (key === 'baseurl') {
                baseurl = decodeURIComponent(value);
            }
        });
        this._spriteBaseUrl = baseurl;
        return spritename;
    };
    /**
     * Transforms the visibility attribute of a GeoStylerStyle-Symbolizer to a Mapbox visibility attribute
     *
     * @param {boolean|undefined} visibility The visibility of a layer
     * @return {'none'|'visible'|undefined} The Mapbox visibility attribute. If undefined Mapbox's default will be used
     */
    MapboxStyleParser.prototype.getVisibility = function (visibility) {
        if (visibility === true) {
            return 'visible';
        }
        else if (visibility === false) {
            return 'none';
        }
        else {
            return undefined;
        }
    };
    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-LineSymbolizer
     *
     * @param {LineSymbolizer} symbolizer A GeoStylerStyle-LineSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    MapboxStyleParser.prototype.getPaintFromLineSymbolizer = function (symbolizer) {
        var opacity = symbolizer.opacity, color = symbolizer.color, perpendicularOffset = symbolizer.perpendicularOffset, width = symbolizer.width, blur = symbolizer.blur, dasharray = symbolizer.dasharray, graphicFill = symbolizer.graphicFill, gapWidth = symbolizer.gapWidth, gradient = symbolizer.gradient, translate = symbolizer.translate, translateAnchor = symbolizer.translateAnchor;
        var paint = {
            'line-opacity': opacity,
            'line-color': color,
            'line-translate': translate,
            'line-translate-anchor': translateAnchor,
            'line-width': width,
            'line-gap-width': gapWidth,
            'line-offset': perpendicularOffset,
            'line-blur': blur,
            'line-dasharray': dasharray,
            'line-pattern': this.getPatternOrGradientFromPointSymbolizer(graphicFill),
            'line-gradient': gradient
        };
        return paint;
    };
    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-LineSymbolizer
     *
     * @param {LineSymbolizer} symbolizer A GeoStylerStyle-LineSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    MapboxStyleParser.prototype.getLayoutFromLineSymbolizer = function (symbolizer) {
        var cap = symbolizer.cap, join = symbolizer.join, miterLimit = symbolizer.miterLimit, roundLimit = symbolizer.roundLimit, visibility = symbolizer.visibility;
        var layout = {
            'line-cap': cap,
            'line-join': join,
            'line-miter-limit': miterLimit,
            'line-round-limit': roundLimit,
            'visibility': this.getVisibility(visibility)
        };
        return layout;
    };
    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-IconSymbolizer
     *
     * @param {IconSymbolizer} symbolizer A GeoStylerStyle-IconSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    MapboxStyleParser.prototype.getPaintFromIconSymbolizer = function (symbolizer) {
        var haloBlur = symbolizer.haloBlur, haloColor = symbolizer.haloColor, haloWidth = symbolizer.haloWidth, color = symbolizer.color, opacity = symbolizer.opacity, translate = symbolizer.translate, translateAnchor = symbolizer.translateAnchor;
        var paint = {
            'icon-opacity': opacity,
            'icon-color': color,
            'icon-halo-color': haloColor,
            'icon-halo-width': haloWidth,
            'icon-halo-blur': haloBlur,
            'icon-translate': translate,
            'icon-translate-anchor': translateAnchor
        };
        return paint;
    };
    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-IconSymbolizer
     *
     * @param {IconSymbolizer} symbolizer A GeoStylerStyle-IconSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    MapboxStyleParser.prototype.getLayoutFromIconSymbolizer = function (symbolizer) {
        var spacing = symbolizer.spacing, avoidEdges = symbolizer.avoidEdges, allowOverlap = symbolizer.allowOverlap, ignorePlacement = symbolizer.ignorePlacement, optional = symbolizer.optional, rotationAlignment = symbolizer.rotationAlignment, size = symbolizer.size, textFit = symbolizer.textFit, textFitPadding = symbolizer.textFitPadding, image = symbolizer.image, rotate = symbolizer.rotate, padding = symbolizer.padding, keepUpright = symbolizer.keepUpright, offset = symbolizer.offset, anchor = symbolizer.anchor, pitchAlignment = symbolizer.pitchAlignment, visibility = symbolizer.visibility;
        var layout = {
            'symbol-spacing': spacing,
            'symbol-avoid-edges': avoidEdges,
            'icon-allow-overlap': allowOverlap,
            'icon-ignore-placement': ignorePlacement,
            'icon-optional': optional,
            'icon-rotation-alignment': rotationAlignment,
            'icon-size': size,
            'icon-text-fit': textFit,
            'icon-text-fit-padding': textFitPadding,
            'icon-image': image ? this.handleSprite(image) : undefined,
            'icon-rotate': rotate,
            'icon-padding': padding,
            'icon-keep-upright': keepUpright,
            'icon-offset': offset,
            'icon-anchor': anchor,
            'icon-pitch-alignment': pitchAlignment,
            'visibility': this.getVisibility(visibility)
        };
        return layout;
    };
    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-TextSymbolizer
     *
     * @param {TextSymbolizer} symbolizer A GeoStylerStyle TextSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    MapboxStyleParser.prototype.getPaintFromTextSymbolizer = function (symbolizer) {
        var haloBlur = symbolizer.haloBlur, haloColor = symbolizer.haloColor, haloWidth = symbolizer.haloWidth, color = symbolizer.color, opacity = symbolizer.opacity, translate = symbolizer.translate, translateAnchor = symbolizer.translateAnchor;
        var paint = {
            'text-opacity': opacity,
            'text-color': color,
            'text-halo-color': haloColor,
            'text-halo-width': haloWidth,
            'text-halo-blur': haloBlur,
            'text-translate': translate,
            'text-translate-anchor': translateAnchor
        };
        return paint;
    };
    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-TextSymbolizer
     *
     * @param {TextSymbolizer} symbolizer A GeoStylerStyle TextSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    MapboxStyleParser.prototype.getLayoutFromTextSymbolizer = function (symbolizer) {
        var allowOverlap = symbolizer.allowOverlap, anchor = symbolizer.anchor, label = symbolizer.label, font = symbolizer.font, ignorePlacement = symbolizer.ignorePlacement, justify = symbolizer.justify, keepUpright = symbolizer.keepUpright, letterSpacing = symbolizer.letterSpacing, lineHeight = symbolizer.lineHeight, maxAngle = symbolizer.maxAngle, maxWidth = symbolizer.maxWidth, offset = symbolizer.offset, optional = symbolizer.optional, padding = symbolizer.padding, pitchAlignment = symbolizer.pitchAlignment, rotate = symbolizer.rotate, rotationAlignment = symbolizer.rotationAlignment, size = symbolizer.size, transform = symbolizer.transform, avoidEdges = symbolizer.avoidEdges, spacing = symbolizer.spacing, visibility = symbolizer.visibility;
        var paint = {
            'symbol-spacing': spacing,
            'symbol-avoid-edges': avoidEdges,
            'text-pitch-alignment': pitchAlignment,
            'text-rotation-alignment': rotationAlignment,
            'text-field': label ? this.getTextFieldFromLabel(label) : undefined,
            'text-font': font,
            'text-size': size,
            'text-max-width': maxWidth,
            'text-line-height': lineHeight,
            'text-letter-spacing': letterSpacing,
            'text-justify': justify,
            'text-anchor': anchor,
            'text-max-angle': maxAngle,
            'text-rotate': rotate,
            'text-padding': padding,
            'text-keep-upright': keepUpright,
            'text-transform': transform,
            'text-offset': offset,
            'text-allow-overlap': allowOverlap,
            'text-ignore-placement': ignorePlacement,
            'text-optional': optional,
            'visibility': this.getVisibility(visibility)
        };
        return paint;
    };
    /**
     * Creates a Mapbox text Format from a GeoStylerStyle-TextSymbolizer Label
     *
     * @param {string} template A GeoStylerStyle-TextSymbolizer Label
     * @return {string|any[]} The static text as string if no template was used, or
     *                        a Mapbox text Format array
     */
    MapboxStyleParser.prototype.getTextFieldFromLabel = function (template) {
        // prefix indicating that a template is being used
        var prefix = '\\{\\{';
        // suffix indicating that a template is being used
        var suffix = '\\}\\}';
        // RegExp to match all occurences encapsuled between two curly braces
        // including the curly braces
        var regExp = new RegExp(prefix + '.*?' + suffix, 'g');
        return template.replace(regExp, function (match) {
            return match.slice(1, -1);
        });
    };
    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-MarkSymbolizer
     * that uses the wellKnownName 'circle'. This one will be handled explicitly
     * because mapbox has a dedicated layer type for circles. Other shapes are covered
     * in layer type 'symbol' using fonts.
     *
     * @param {MarkSymbolizer} symbolizer A GeoStylerStyle MarkSymbolizer with wkn 'circle'
     * @return {any} A Mapbox Layer Paint object
     */
    MapboxStyleParser.prototype.getPaintFromCircleSymbolizer = function (symbolizer) {
        var radius = symbolizer.radius, color = symbolizer.color, blur = symbolizer.blur, opacity = symbolizer.opacity, translate = symbolizer.translate, translateAnchor = symbolizer.translateAnchor, pitchScale = symbolizer.pitchScale, pitchAlignment = symbolizer.pitchAlignment, strokeWidth = symbolizer.strokeWidth, strokeColor = symbolizer.strokeColor, strokeOpacity = symbolizer.strokeOpacity;
        var paint = {
            'circle-radius': radius,
            'circle-color': color,
            'circle-blur': blur,
            'circle-opacity': opacity,
            'circle-translate': translate,
            'circle-translate-anchor': translateAnchor,
            'circle-pitch-scale': pitchScale,
            'circle-pitch-alignment': pitchAlignment,
            'circle-stroke-width': strokeWidth,
            'circle-stroke-color': strokeColor,
            'circle-stroke-opacity': strokeOpacity
        };
        return paint;
    };
    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-MarkSymbolizer
     * that uses the wellKnownName 'circle'. This one will be handled explicitly
     * because mapbox has a dedicated layer type for circles. Other shapes are covered
     * in layer type 'symbol' using fonts.
     *
     * @param {MarkSymbolizer} symbolizer A GeoStylerStyle MarkSymbolizer with wkn 'circle'
     * @return {any} A Mapbox Layer Layout object
     */
    MapboxStyleParser.prototype.getLayoutFromCircleSymbolizer = function (symbolizer) {
        var visibility = symbolizer.visibility;
        var layout = {
            'visibility': visibility
        };
        return layout;
    };
    MapboxStyleParser.title = 'Mapbox';
    /**
     * Object of unsupported properties.
     */
    MapboxStyleParser.unsupportedProperties = {
        Symbolizer: {
            FillSymbolizer: {
                outlineWidth: 'unsupported',
                outlineDasharray: 'unsupported'
            },
            LineSymbolizer: {
                dashOffset: 'unsupported',
                graphicStroke: 'unsupported'
            },
            MarkSymbolizer: 'unsupported'
        }
    };
    return MapboxStyleParser;
}());
exports.MapboxStyleParser = MapboxStyleParser;
exports.default = MapboxStyleParser;
//# sourceMappingURL=MapboxStyleParser.js.map