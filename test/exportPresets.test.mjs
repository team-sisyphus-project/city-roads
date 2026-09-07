import test from 'node:test';
import assert from 'node:assert/strict';

import {
  EXPORT_PRESETS,
  DPI_OPTIONS,
  DEFAULT_DPI,
  DEFAULT_PRESET_ID,
  getPresetById,
  getPixelSize
} from '../src/lib/exportPresets.js';

const findPreset = (id) => EXPORT_PRESETS.find(preset => preset.id === id);

test('every preset carries a stable id and a human readable label', () => {
  const ids = new Set();
  for (const preset of EXPORT_PRESETS) {
    assert.equal(typeof preset.id, 'string', 'preset id must be a string');
    assert.ok(preset.id.length > 0, 'preset id must not be empty');
    assert.equal(typeof preset.label, 'string', `${preset.id} must have a label`);
    assert.ok(preset.label.length > 0, `${preset.id} label must not be empty`);
    assert.ok(!ids.has(preset.id), `duplicate preset id: ${preset.id}`);
    ids.add(preset.id);
  }
});

test('paper presets are described in millimetres, the social square in pixels', () => {
  for (const preset of EXPORT_PRESETS) {
    if (preset.id === 'social-square') {
      assert.equal(preset.widthPx, 1080);
      assert.equal(preset.heightPx, 1080);
      assert.equal(preset.widthMm, undefined, 'social square is not a paper size');
      assert.equal(preset.heightMm, undefined, 'social square is not a paper size');
    } else {
      assert.equal(typeof preset.widthMm, 'number', `${preset.id} needs widthMm`);
      assert.equal(typeof preset.heightMm, 'number', `${preset.id} needs heightMm`);
      assert.ok(preset.widthMm > 0 && preset.heightMm > 0, `${preset.id} must be positive`);
      assert.equal(preset.widthPx, undefined, `${preset.id} must not hardcode pixels`);
      assert.equal(preset.heightPx, undefined, `${preset.id} must not hardcode pixels`);
    }
  }
});

test('A4, A3 and A2 are offered in both portrait and landscape at ISO 216 sizes', () => {
  const expected = {
    'a4-portrait': [210, 297],
    'a4-landscape': [297, 210],
    'a3-portrait': [297, 420],
    'a3-landscape': [420, 297],
    'a2-portrait': [420, 594],
    'a2-landscape': [594, 420]
  };

  for (const [id, [widthMm, heightMm]] of Object.entries(expected)) {
    const preset = findPreset(id);
    assert.ok(preset, `missing preset ${id}`);
    assert.equal(preset.widthMm, widthMm, `${id} width`);
    assert.equal(preset.heightMm, heightMm, `${id} height`);
  }

  assert.ok(findPreset('social-square'), 'missing social-square preset');
  assert.equal(EXPORT_PRESETS.length, Object.keys(expected).length + 1);
});

test('landscape is the portrait preset with the sides swapped', () => {
  for (const size of ['a4', 'a3', 'a2']) {
    const portrait = findPreset(`${size}-portrait`);
    const landscape = findPreset(`${size}-landscape`);
    assert.equal(portrait.widthMm, landscape.heightMm, `${size} width/height mismatch`);
    assert.equal(portrait.heightMm, landscape.widthMm, `${size} height/width mismatch`);
    assert.ok(portrait.heightMm > portrait.widthMm, `${size} portrait must be taller than wide`);
  }
});

test('the DPI selector offers 150 and 300, defaulting to 300', () => {
  assert.deepEqual(DPI_OPTIONS, [150, 300]);
  assert.equal(DEFAULT_DPI, 300);
  assert.ok(DPI_OPTIONS.includes(DEFAULT_DPI));
});

test('the default preset id resolves to a real preset', () => {
  assert.ok(getPresetById(DEFAULT_PRESET_ID), 'default preset must exist');
});

test('getPresetById finds a preset by id and returns undefined otherwise', () => {
  assert.equal(getPresetById('a3-landscape'), findPreset('a3-landscape'));
  assert.equal(getPresetById('no-such-preset'), undefined);
  assert.equal(getPresetById(undefined), undefined);
});

test('millimetre presets convert to the standard pixel sizes at 300 DPI', () => {
  // 300 DPI is the print reference: A4 is famously 2480x3508 pixels.
  assert.deepEqual(getPixelSize(findPreset('a4-portrait'), 300), {width: 2480, height: 3508});
  assert.deepEqual(getPixelSize(findPreset('a4-landscape'), 300), {width: 3508, height: 2480});
  assert.deepEqual(getPixelSize(findPreset('a3-portrait'), 300), {width: 3508, height: 4961});
  assert.deepEqual(getPixelSize(findPreset('a2-portrait'), 300), {width: 4961, height: 7016});
});

test('millimetre presets convert to half the pixels at 150 DPI', () => {
  assert.deepEqual(getPixelSize(findPreset('a4-portrait'), 150), {width: 1240, height: 1754});
  assert.deepEqual(getPixelSize(findPreset('a3-landscape'), 150), {width: 2480, height: 1754});
});

test('pixel sizes are whole numbers a canvas can be sized with', () => {
  for (const preset of EXPORT_PRESETS) {
    for (const dpi of DPI_OPTIONS) {
      const {width, height} = getPixelSize(preset, dpi);
      assert.ok(Number.isInteger(width), `${preset.id}@${dpi} width must be an integer`);
      assert.ok(Number.isInteger(height), `${preset.id}@${dpi} height must be an integer`);
      assert.ok(width > 0 && height > 0, `${preset.id}@${dpi} must be positive`);
    }
  }
});

test('the social square stays 1080x1080 regardless of DPI', () => {
  const socialSquare = findPreset('social-square');
  for (const dpi of [150, 300, 72]) {
    assert.deepEqual(getPixelSize(socialSquare, dpi), {width: 1080, height: 1080});
  }
});

test('getPixelSize accepts a preset id as well as a preset object', () => {
  assert.deepEqual(getPixelSize('a4-portrait', 300), getPixelSize(findPreset('a4-portrait'), 300));
  assert.deepEqual(getPixelSize('social-square', 150), {width: 1080, height: 1080});
});

test('getPixelSize defaults to the default DPI when none is given', () => {
  assert.deepEqual(getPixelSize('a4-portrait'), getPixelSize('a4-portrait', DEFAULT_DPI));
});

test('getPixelSize rejects an unknown preset', () => {
  assert.throws(() => getPixelSize('no-such-preset', 300), /no-such-preset/);
  assert.throws(() => getPixelSize(undefined, 300), /preset/i);
  assert.throws(() => getPixelSize({label: 'Nonsense'}, 300), /millimetres|pixels/i);
});

test('getPixelSize rejects a DPI that cannot produce a canvas', () => {
  for (const dpi of [0, -300, NaN, Infinity, '300', null]) {
    assert.throws(() => getPixelSize('a4-portrait', dpi), /dpi/i, `dpi ${String(dpi)} must be rejected`);
  }
});

test('EXPORT_PRESETS is frozen so a caller cannot corrupt the shared list', () => {
  assert.ok(Object.isFrozen(EXPORT_PRESETS));
  for (const preset of EXPORT_PRESETS) {
    assert.ok(Object.isFrozen(preset), `${preset.id} must be frozen`);
  }
});
