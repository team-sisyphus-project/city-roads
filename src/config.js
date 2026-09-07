import tinycolor from 'tinycolor2';

/**
 * Named color presets for the poster. Each preset defines the three
 * colors that make up the look of the map: the page background, the
 * road/line color, and the highlight color used for the city name and
 * other emphasized text.
 */
export const COLOR_PRESETS = {
  light: {
    background: '#F7F2E8',
    roadColor: 'rgba(26, 26, 26, 0.8)',
    highlightColor: '#161616'
  },
  dark: {
    background: '#121212',
    roadColor: 'rgba(247, 242, 232, 0.85)',
    highlightColor: '#F7F2E8'
  }
};

export default {
  /**
   * This is our caching backend
   */
  // This used to work, but seems like GitHub no longer allows large website hosting:
  //areaServer: 'https://anvaka.github.io/index-large-cities/data',
  //areaServer: 'http://localhost:8085', // This is un-commented when I develop cache locally
  // So, using S3
  areaServer: 'https://d2uf7yjjctyxf.cloudfront.net/nov-02-2020',

  colorPresets: COLOR_PRESETS,

  getDefaultLineColor() {
    return tinycolor(COLOR_PRESETS.light.roadColor);
  },
  getLabelColor() {
    return tinycolor(COLOR_PRESETS.light.highlightColor);
  },

  getBackgroundColor() {
    return tinycolor(COLOR_PRESETS.light.background);
  }
}