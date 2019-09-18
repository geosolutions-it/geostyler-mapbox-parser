import { PointSymbolizer, Rule, Style, StyleParser, Symbolizer, FillSymbolizer, LineSymbolizer, IconSymbolizer, TextSymbolizer, Filter, SymbolizerKind, MarkSymbolizer, ScaleDenominator, UnsupportedProperties } from 'geostyler-style';
declare type MapboxLayerType = 'fill' | 'line' | 'symbol' | 'circle' | 'heatmap' | 'fill-extrusion' | 'raster' | 'hillshade' | 'background';
declare type SymbolType = {
    textSymbolizer?: TextSymbolizer;
    iconSymbolizer?: IconSymbolizer;
};
declare type OptionsType = {
    ignoreConversionErrors?: boolean;
};
export declare class MapboxStyleParser implements StyleParser {
    title: string;
    static title: string;
    ignoreConversionErrors: boolean;
    constructor(options?: OptionsType);
    isSymbolType(s: Symbolizer | SymbolType): s is SymbolType;
    _spriteBaseUrl: string;
    /**
     * Object of unsupported properties.
     */
    static unsupportedProperties: UnsupportedProperties;
    /**
     * Parses the GeoStylerStyle-SymbolizerKind from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {SymbolizerKind} A GeoStylerStyle-SymbolizerKind
     */
    getSymbolizerKindFromMapboxLayer(type: string): SymbolizerKind | 'Symbol' | 'Circle';
    /**
     * Creates a GeoStylerStyle-TextSymbolizer label from a Mapbox Layer Paint Symbol text-field
     *
     * @param {string | any[]} label A Mapbox Layer Paint Symbol text-field
     * @return {string} A GeoStylerStyle-TextSymbolizer label
     */
    getLabelFromTextField(label: string | any[]): (string | undefined);
    /**
     * Creates a GeoStylerStyle-MarkSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {MarkSymbolizer} A GeoStylerStyle-MarkSymbolizer
     */
    getMarkSymbolizerFromMapboxLayer(paint: any, layout: any): MarkSymbolizer;
    /**
     * Creates an image url based on the sprite baseurl and the sprite name.
     *
     * @param {string} spriteName Name of the sprite
     * @return {string} the url that returns the single image
     */
    getIconImage(spriteName: string): (string | undefined);
    /**
     * Creates a GeoStylerStyle-MarkSymbolizer with wellKnownName 'circle'
     * from a Mapbox Style Layer. This one will be handled explicitly
     * because mapbox has a dedicated layer type for circles. Other shapes are covered
     * in layer type 'symbol' using fonts.
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {MarkSymbolizer} A GeoStylerStyle-MarkSymbolizer
     */
    getCircleSymbolizerFromMapboxLayer(paint: any, layout: any): MarkSymbolizer;
    /**
     * Creates a GeoStylerStyle-IconSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {IconSymbolizer} A GeoStylerStyle-IconSymbolizer
     */
    getIconSymbolizerFromMapboxLayer(paint: any, layout: any): IconSymbolizer;
    /**
     * Creates a GeoStylerStyle-TextSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {TextSymbolizer} A GeoStylerStyle-TextSymbolizer
     */
    getTextSymbolizerFromMapboxLayer(paint: any, layout: any): TextSymbolizer;
    /**
     * Creates a GeoStylerStyle-FillSymbolizer from a Mapbox Style Layer.
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {FillSymbolizer} A GeoStylerStyle-FillSymbolizer
     */
    getFillSymbolizerFromMapboxLayer(paint: any, layout: any): FillSymbolizer;
    getPatternOrGradientFromMapboxLayer(icon: any): IconSymbolizer | undefined;
    /**
     * Creates a GeoStylerStyle-LineSymbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {LineSymbolizer} A GeoStylerStyle-LineSymbolizer
     */
    getLineSymbolizerFromMapboxLayer(paint: any, layout: any): LineSymbolizer;
    /**
     * Creates GeoStyler-Style TextSymbolizer and IconSymbolizer from
     * a mapbox layer paint object.
     *
     * @param paint The paint object of a mapbox layer
     */
    getIconTextSymbolizersFromMapboxLayer(paint: any, layout: any): SymbolType;
    /**
     * Creates a GeoStylerStyle-Symbolizer from a Mapbox Style Layer
     *
     * @param {any} layer A Mapbox Style Layer
     * @return {Symbolizer} A GeoStylerStyle-Symbolizer
     */
    getSymbolizerFromMapboxLayer(paint: any, layout: any, type: string): Symbolizer | SymbolType | undefined;
    /**
     * Creates a GeoStylerStyle-Filter from a Mapbox Style Layer Filter
     *
     * @param filter A Mapbox Style Layer Filter
     * @return {Filter} A GeoStylerStyle-Filter
     */
    getFilterFromMapboxFilter(filter: any[]): Filter;
    /**
     * Creates a GeoStylerStyle-ScaleDenominator from a Mapvox Style Layer Min/Max Zoom
     *
     * @param {number} minZoom A Mapbox Style Layer minZoom property
     * @param {number} maxZoom A Mapbox Style Layer maxZoom property
     * @return {ScaleDenominator} A GeoStylerStyle-ScaleDenominator
     */
    getScaleDenominatorFromMapboxZoom(minZoom?: number, maxZoom?: number): ScaleDenominator | undefined;
    /**
     * Merges the baseFilter and the attribute filter to a single filter.
     * If both filters are defined, they will be merged via '&&' operator.
     * If only one of the filters is defined, the defined filter will be returned.
     *
     * @param baseFilter The value of the mapbox layer's filter property
     * @param filter The value of the mapbox paint attribute filter
     */
    mergeFilters(baseFilter: Filter | undefined, filter: Filter | undefined): Filter | undefined;
    /**
     * Compares an arbitrary number of filters for equality
     *
     * @param filters Array of mapbox filters
     */
    equalMapboxAttributeFilters(filters: any[]): boolean;
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
    mapboxAttributeFiltersToSymbolizer(tmpSymbolizer: Symbolizer): {
        filter?: Filter;
        symbolizers: Symbolizer[];
    }[];
    /**
     * Creates GeoStyler-Style Rules from a mapbox paint object.
     *
     * @param {any} paint A mapbox layer paint object
     * @param {string} type The type of the mapbox layer
     * @return {Rule[]} Array of GeoStyler-Style Rules
     */
    mapboxPaintToGeoStylerRules(paint: any, layout: any, type: string): Rule[];
    /**
     * Creates a GeoStyler-Style Rule from a mapbox layer.
     *
     * @param {any} layer The mapbox Layer
     * @return {Rule[]} A GeoStyler-Style Rule Array
     */
    mapboxLayerToGeoStylerRules(layer: any): Rule[];
    /**
     * Creates a GeoStylerStyle-Style from a Mapbox Style
     *
     * @param {any} mapboxStyle The Mapbox Style object
     * @return {Style} A GeoStylerStyle-Style
     */
    mapboxLayerToGeoStylerStyle(mapboxStyle: any): Style;
    /**
     * The readStyle implementation of the GeoStyler-Style StylerParser interface.
     * It reads a Mapbox Style and returns a Promise resolving with a GeoStylerStyle-ReadResponse.
     *
     * @param mapboxLayer The Mapbox Style object
     * @return {Promise<ReadResponse>} The Promise resolving with a GeoStylerStyle-ReadResponse
     */
    readStyle(mapboxStyle: any): Promise<Style>;
    /**
     * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads a GeoStyler-Style Style and returns a Promise.
     *
     * @param {Style} geoStylerStyle A GeoStylerStyle-Style
     * @return {Promise<any>} The Promise resolving with an mapbox style object
     */
    writeStyle(geoStylerStyle: Style): Promise<any>;
    /**
     * Write a Mapbox Style Object based on a GeoStylerStyle.
     *
     * @param {Style} geoStylerStyle A GeoStylerStyle-Style
     * @return {any} A Mapbox Style object
     */
    geoStylerStyleToMapboxObject(geoStylerStyle: Style): any;
    /**
     * Creates a layer for each Rule and each Symbolizer.
     *
     * @param {Rule[]} rules An array of GeoStylerStyle-Rules
     * @return {any[]} An array of Mapbox Layers
     */
    getMapboxLayersFromRules(rules: Rule[]): any[];
    /**
     * Get the mapbox zoomlevel from a scaleDenominator.
     * Interpolates the zoomlevel if calculated resolutions do not match.
     *
     * @param scaleDenominator The scaleDenominator of the GeoStyler-Style Rule
     * @return number The corresponding zoom level
     */
    getMapboxZoomFromScaleDenominator(scaleDenominator: number): number;
    /**
     * Writes a Mapbox-filter from a GeoStylerStyle-Filter
     *
     * @param {Filter} filter A GeoStylerStyle-Filter
     * @return {any[]} A Mapbox filter array
     */
    getMapboxFilterFromFilter(filter: Filter): any[];
    /**
     * Creates a Mapbox Layer Paint object and the layerType from a GeoStylerStyle-Symbolizer
     *
     * @param {Symbolizer} symbolizer A GeoStylerStyle-Symbolizer
     * @return {MapboxLayerType, any} {layertype, paint} An object consisting of the MapboxLayerType
     *                                                   and the Mapbox Layer Paint
     */
    getStyleFromSymbolizer(symbolizer: Symbolizer): {
        layerType: MapboxLayerType;
        paint: any;
        layout: any;
    };
    /**
     * Creates a Mapbox Layer Paint object from a GeostylerStyle-FillSymbolizer
     *
     * @param {FillSymbolizer} symbolizer A GeostylerStyle-FillSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromFillSymbolizer(symbolizer: FillSymbolizer): any;
    /**
     * Creates a Mapbox Layer Layout object from a GeostylerStyle-FillSymbolizer
     *
     * @param {FillSymbolizer} symbolizer A GeostylerStyle-FillSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromFillSymbolizer(symbolizer: FillSymbolizer): any;
    /**
     * Creates a fill pattern or gradient from a GeoStylerStyle-Symbolizer
     *
     * @param {PointSymbolizer|undefined} symbolizer The Symbolizer that is being used for pattern or gradient
     * @return {string|undefined} The name of the sprite or undefined, if no image source was specified
     */
    getPatternOrGradientFromPointSymbolizer(symbolizer: (PointSymbolizer | undefined)): (string | undefined);
    /**
     * Adds a sprite to the Mapbox Style object
     *
     * @param {string} path The source of an image
     * @return {string} The name of the sprite
     */
    handleSprite(path: string): (string | undefined);
    /**
     * Transforms the visibility attribute of a GeoStylerStyle-Symbolizer to a Mapbox visibility attribute
     *
     * @param {boolean|undefined} visibility The visibility of a layer
     * @return {'none'|'visible'|undefined} The Mapbox visibility attribute. If undefined Mapbox's default will be used
     */
    getVisibility(visibility: boolean | undefined): 'none' | 'visible' | undefined;
    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-LineSymbolizer
     *
     * @param {LineSymbolizer} symbolizer A GeoStylerStyle-LineSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromLineSymbolizer(symbolizer: LineSymbolizer): any;
    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-LineSymbolizer
     *
     * @param {LineSymbolizer} symbolizer A GeoStylerStyle-LineSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromLineSymbolizer(symbolizer: LineSymbolizer): any;
    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-IconSymbolizer
     *
     * @param {IconSymbolizer} symbolizer A GeoStylerStyle-IconSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromIconSymbolizer(symbolizer: IconSymbolizer): any;
    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-IconSymbolizer
     *
     * @param {IconSymbolizer} symbolizer A GeoStylerStyle-IconSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromIconSymbolizer(symbolizer: IconSymbolizer): any;
    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-TextSymbolizer
     *
     * @param {TextSymbolizer} symbolizer A GeoStylerStyle TextSymbolizer
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromTextSymbolizer(symbolizer: TextSymbolizer): any;
    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-TextSymbolizer
     *
     * @param {TextSymbolizer} symbolizer A GeoStylerStyle TextSymbolizer
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromTextSymbolizer(symbolizer: TextSymbolizer): any;
    /**
     * Creates a Mapbox text Format from a GeoStylerStyle-TextSymbolizer Label
     *
     * @param {string} template A GeoStylerStyle-TextSymbolizer Label
     * @return {string|any[]} The static text as string if no template was used, or
     *                        a Mapbox text Format array
     */
    getTextFieldFromLabel(template: string): (string | any[]);
    /**
     * Creates a Mapbox Layer Paint object from a GeoStylerStyle-MarkSymbolizer
     * that uses the wellKnownName 'circle'. This one will be handled explicitly
     * because mapbox has a dedicated layer type for circles. Other shapes are covered
     * in layer type 'symbol' using fonts.
     *
     * @param {MarkSymbolizer} symbolizer A GeoStylerStyle MarkSymbolizer with wkn 'circle'
     * @return {any} A Mapbox Layer Paint object
     */
    getPaintFromCircleSymbolizer(symbolizer: MarkSymbolizer): any;
    /**
     * Creates a Mapbox Layer Layout object from a GeoStylerStyle-MarkSymbolizer
     * that uses the wellKnownName 'circle'. This one will be handled explicitly
     * because mapbox has a dedicated layer type for circles. Other shapes are covered
     * in layer type 'symbol' using fonts.
     *
     * @param {MarkSymbolizer} symbolizer A GeoStylerStyle MarkSymbolizer with wkn 'circle'
     * @return {any} A Mapbox Layer Layout object
     */
    getLayoutFromCircleSymbolizer(symbolizer: MarkSymbolizer): any;
}
export default MapboxStyleParser;
