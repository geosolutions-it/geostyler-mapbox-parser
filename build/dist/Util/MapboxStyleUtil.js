"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MapboxStyleUtil = /** @class */ (function () {
    function MapboxStyleUtil() {
    }
    MapboxStyleUtil.getResolutions = function () {
        var resolutions = [];
        var res = 78271.51696402048;
        // adding resolution for arbitrary zoom level 0
        // This simplyfies working with zoom levels but might lead to unexpected
        // behaviour.
        resolutions.push(res * 2);
        for (res; resolutions.length < 22; res /= 2) {
            resolutions.push(res);
        }
        return resolutions;
    };
    // credits to
    // https://github.com/terrestris/ol-util/blob/de1b580c63454c8110806a3d73a5f6e972b2f2b0/src/MapUtil/MapUtil.js#L104
    MapboxStyleUtil.getScaleForResolution = function (resolution) {
        var dpi = 25.4 / 0.28;
        var mpu = 1;
        var inchesPerMeter = 39.37008;
        return resolution * mpu * inchesPerMeter * dpi;
    };
    // credits to
    // https://github.com/openlayers/ol-mapbox-style/blob/e632c935e7e34bd27079b7fc234202a9ac3b73ee/util.js
    MapboxStyleUtil.getZoomForResolution = function (resolution) {
        var i = 0;
        var resolutions = MapboxStyleUtil.getResolutions();
        var ii = resolutions.length;
        for (; i < ii; ++i) {
            var candidate = resolutions[i];
            if (candidate < resolution && i + 1 < ii) {
                var zoomFactor = resolutions[i] / resolutions[i + 1];
                return i + Math.log(resolutions[i] / resolution) / Math.log(zoomFactor);
            }
        }
        return ii - 1;
    };
    /**
     * Calculates the appropriate map resolution for a given scale in the given
     * units.
     *
     * See: https://gis.stackexchange.com/questions/158435/
     * how-to-get-current-scale-in-openlayers-3
     *
     * @method
     * @param {number} scale The input scale to calculate the appropriate
     *                       resolution for.
     * @return {number} The calculated resolution.
     */
    MapboxStyleUtil.getResolutionForScale = function (scale) {
        var dpi = 25.4 / 0.28;
        var mpu = 1;
        var inchesPerMeter = 39.37008;
        return scale / (mpu * inchesPerMeter * dpi);
    };
    MapboxStyleUtil.zoomToScale = function (zoom) {
        var resolutions = MapboxStyleUtil.getResolutions();
        // if zoom is integer
        if (zoom >= resolutions.length) {
            throw new Error("Cannot parse scaleDenominator. ZoomLevel does not exist.");
        }
        var resolution;
        if (Number.isInteger(zoom)) {
            resolution = resolutions[zoom];
        }
        else {
            // interpolate values
            var pre = Math.floor(zoom);
            var preVal = resolutions[pre];
            // after carefully rearranging
            // zoom = i + Math.log(resolutions[i] / resolution) / Math.log(zoomFactor)
            // with the zoomFactor being 2 I've arrived at this formula to properly
            // calculate the resolution:
            resolution = Math.pow(2, pre) * preVal / Math.pow(2, zoom);
            // this still gives some smallish rounding errors, but at the 8th digit after
            // the dot this is ok
        }
        return this.getScaleForResolution(resolution);
    };
    /**
     * Checks if all keys of an object are undefined.
     * Returns true if so.
     *
     * @param obj The object to be checked
     */
    MapboxStyleUtil.allUndefined = function (obj) {
        if (!obj) {
            return true;
        }
        var keys = Object.keys(obj);
        return !keys.some(function (k) {
            return typeof obj[k] !== 'undefined';
        });
    };
    /**
     * Checks if all keys of a Symbolizer are undefined except 'kind'.
     *
     * @param symbolizer A GeoStylerStyle Symbolizer
     */
    MapboxStyleUtil.symbolizerAllUndefined = function (symbolizer) {
        return !Object.keys(symbolizer)
            .filter(function (val) { return val !== 'kind'; })
            .some(function (val) { return typeof symbolizer[val] !== 'undefined'; });
    };
    /**
     * Replaces the mapbox api placeholder with its actual url.
     *
     * @param url URL
     */
    MapboxStyleUtil.getUrlForMbPlaceholder = function (url) {
        var mbPlaceholder = 'mapbox://';
        var mbUrl = 'https://api.mapbox.com/';
        if (url && url.startsWith(mbPlaceholder)) {
            return url.replace(mbPlaceholder, mbUrl);
        }
        return url;
    };
    /**
     * Replaces the actual mapbox url with its api placeholder.
     *
     * @param url URL
     */
    MapboxStyleUtil.getMbPlaceholderForUrl = function (url) {
        var mbPlaceholder = 'mapbox://';
        var mbUrl = 'https://api.mapbox.com/';
        if (url && url.startsWith(mbUrl)) {
            return url.replace(mbUrl, mbPlaceholder);
        }
        return url;
    };
    /**
     * Resolves a mapbox text-field placeholder string to a geostyler-style
     * placeholder string. I.e. replaces {varname} with {{varname}}.
     *
     * @param template Template string that should be resolved
     */
    MapboxStyleUtil.resolveMbTextPlaceholder = function (template) {
        // prefix indicating that a template is being used
        var prefix = '\\{';
        // suffix indicating that a template is being used
        var suffix = '\\}';
        var regExp = new RegExp(prefix + '.*?' + suffix, 'g');
        var gsLabel = template.replace(regExp, function (match) {
            return "{" + match + "}";
        });
        return gsLabel;
    };
    return MapboxStyleUtil;
}());
exports.default = MapboxStyleUtil;
//# sourceMappingURL=MapboxStyleUtil.js.map