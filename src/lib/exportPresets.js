/**
 * Export presets for the PNG export path.
 *
 * Print presets are described in millimetres, because that is how paper is
 * specified (ISO 216) and because the pixel size only exists once a DPI is
 * chosen. The social square is the exception: it targets a screen, so it is
 * described directly in pixels and is unaffected by the DPI selector.
 *
 * Nothing here touches how roads are drawn - these numbers only size the
 * export canvas.
 */

const MM_PER_INCH = 25.4;

/** DPI choices offered by the export panel. */
export const DPI_OPTIONS = Object.freeze([150, 300]);

/** 300 DPI is the usual "good print" default. */
export const DEFAULT_DPI = 300;

export const EXPORT_PRESETS = Object.freeze([
  Object.freeze({id: 'a4-portrait',   label: 'A4 portrait',    widthMm: 210, heightMm: 297}),
  Object.freeze({id: 'a4-landscape',  label: 'A4 landscape',   widthMm: 297, heightMm: 210}),
  Object.freeze({id: 'a3-portrait',   label: 'A3 portrait',    widthMm: 297, heightMm: 420}),
  Object.freeze({id: 'a3-landscape',  label: 'A3 landscape',   widthMm: 420, heightMm: 297}),
  Object.freeze({id: 'a2-portrait',   label: 'A2 portrait',    widthMm: 420, heightMm: 594}),
  Object.freeze({id: 'a2-landscape',  label: 'A2 landscape',   widthMm: 594, heightMm: 420}),
  Object.freeze({id: 'social-square', label: 'Social square',  widthPx: 1080, heightPx: 1080})
]);

export const DEFAULT_PRESET_ID = 'a4-portrait';

/**
 * @param {string} id
 * @returns {object|undefined} the preset, or undefined when the id is unknown.
 */
export function getPresetById(id) {
  return EXPORT_PRESETS.find(preset => preset.id === id);
}

/**
 * Pixel dimensions of the export canvas for a preset at a given DPI.
 *
 * Millimetre presets scale with the DPI; pixel presets (the social square)
 * ignore it, so that "1080x1080" stays 1080x1080 whatever the selector says.
 *
 * @param {object|string} preset a preset object or a preset id.
 * @param {number} [dpi=DEFAULT_DPI]
 * @returns {{width: number, height: number}} whole pixels, ready for a canvas.
 */
export function getPixelSize(preset, dpi = DEFAULT_DPI) {
  const resolved = typeof preset === 'string' ? getPresetById(preset) : preset;

  if (!resolved) {
    const name = typeof preset === 'string' ? preset : String(preset);
    throw new Error(`Unknown export preset: ${name}`);
  }

  if (Number.isFinite(resolved.widthPx) && Number.isFinite(resolved.heightPx)) {
    // Fixed pixel preset - DPI does not apply.
    return {width: resolved.widthPx, height: resolved.heightPx};
  }

  if (!Number.isFinite(resolved.widthMm) || !Number.isFinite(resolved.heightMm)) {
    throw new Error(
      `Export preset "${resolved.id || resolved.label}" declares neither millimetres nor pixels`
    );
  }

  if (typeof dpi !== 'number' || !Number.isFinite(dpi) || dpi <= 0) {
    throw new Error(`Export DPI must be a positive finite number, got: ${String(dpi)}`);
  }

  return {
    width: mmToPixels(resolved.widthMm, dpi),
    height: mmToPixels(resolved.heightMm, dpi)
  };
}

function mmToPixels(mm, dpi) {
  return Math.round((mm / MM_PER_INCH) * dpi);
}
