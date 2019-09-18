import { Symbolizer } from 'geostyler-style';
declare class MapboxStyleUtil {
    static getResolutions(): number[];
    static getScaleForResolution(resolution: number): number;
    static getZoomForResolution(resolution: number): number;
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
    static getResolutionForScale(scale: number): number;
    static zoomToScale(zoom: number): number;
    /**
     * Checks if all keys of an object are undefined.
     * Returns true if so.
     *
     * @param obj The object to be checked
     */
    static allUndefined(obj: any): boolean;
    /**
     * Checks if all keys of a Symbolizer are undefined except 'kind'.
     *
     * @param symbolizer A GeoStylerStyle Symbolizer
     */
    static symbolizerAllUndefined(symbolizer: Symbolizer): boolean;
    /**
     * Replaces the mapbox api placeholder with its actual url.
     *
     * @param url URL
     */
    static getUrlForMbPlaceholder(url: string): string;
    /**
     * Replaces the actual mapbox url with its api placeholder.
     *
     * @param url URL
     */
    static getMbPlaceholderForUrl(url: string): string;
    /**
     * Resolves a mapbox text-field placeholder string to a geostyler-style
     * placeholder string. I.e. replaces {varname} with {{varname}}.
     *
     * @param template Template string that should be resolved
     */
    static resolveMbTextPlaceholder(template: string): string;
}
export default MapboxStyleUtil;
