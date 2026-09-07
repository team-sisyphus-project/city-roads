import {describe, it, expect} from 'vitest';
import tinycolor from 'tinycolor2';
import config, {COLOR_PRESETS} from './config.js';

describe('COLOR_PRESETS', () => {
  it('defines a light and a dark preset', () => {
    expect(COLOR_PRESETS.light).toBeDefined();
    expect(COLOR_PRESETS.dark).toBeDefined();
  });

  it('gives each preset a background, roadColor, and highlightColor', () => {
    ['light', 'dark'].forEach(name => {
      const preset = COLOR_PRESETS[name];
      expect(tinycolor(preset.background).isValid()).toBe(true);
      expect(tinycolor(preset.roadColor).isValid()).toBe(true);
      expect(tinycolor(preset.highlightColor).isValid()).toBe(true);
    });
  });

  it('is exposed next to the existing color state on the config object', () => {
    expect(config.colorPresets).toBe(COLOR_PRESETS);
  });

  it('keeps the existing color getters matching the light preset', () => {
    expect(config.getDefaultLineColor().toRgbString()).toBe(tinycolor(COLOR_PRESETS.light.roadColor).toRgbString());
    expect(config.getLabelColor().toRgbString()).toBe(tinycolor(COLOR_PRESETS.light.highlightColor).toRgbString());
    expect(config.getBackgroundColor().toRgbString()).toBe(tinycolor(COLOR_PRESETS.light.background).toRgbString());
  });

  it('sets the dark preset background near-black', () => {
    const {r, g, b} = tinycolor(COLOR_PRESETS.dark.background).toRgb();
    expect(r).toBeLessThan(30);
    expect(g).toBeLessThan(30);
    expect(b).toBeLessThan(30);
  });

  it('sets the dark preset road color to a warm off-white', () => {
    const hsl = tinycolor(COLOR_PRESETS.dark.roadColor).toHsl();
    // Off-white: high lightness, low-to-moderate saturation.
    expect(hsl.l).toBeGreaterThan(0.85);
    // Warm: hue in the red/orange/yellow range (or achromatic).
    expect(hsl.s === 0 || hsl.h <= 60 || hsl.h >= 300).toBe(true);
  });
});
