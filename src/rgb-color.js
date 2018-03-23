import rgbHex from 'rgb-hex';
import namedColors from './named-colors';
import colorDefs from './color-defs';

/**
 * RGBColor
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
class RGBColor {
  constructor(color) {
    let colorString = color;
    this.ok = false;

    // just accept strings
    if (!(typeof colorString === 'string')) {
      return;
    }

    // strip any leading #
    if (colorString.charAt(0) === '#') {
      // remove # if any
      colorString = colorString.substr(1, 8);
    }

    colorString = colorString.replace(/ /g, '').toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    if (Object.prototype.hasOwnProperty.call(namedColors, colorString)) {
      ({ [colorString]: colorString } = namedColors);
    }
    // emd of simple type-in colors

    // search through the definitions to find a match
    for (let i = 0; i < colorDefs.length; i += 1) {
      const def = colorDefs[i];
      const bits = def.re.exec(colorString);
      if (bits) {
        [this.r, this.g, this.b, this.a] = def.process(bits);
        this.ok = true;
      }
    }

    // validate/cleanup values
    if (this.r < 0 || Number.isNaN(this.r) || this.r == null) {
      this.r = 0;
    } else if (this.r > 255) {
      this.r = 255;
    }
    if (this.g < 0 || Number.isNaN(this.g) || this.g == null) {
      this.g = 0;
    } else if (this.g > 255) {
      this.g = 255;
    }
    if (this.b < 0 || Number.isNaN(this.b) || this.b == null) {
      this.b = 0;
    } else if (this.b > 255) {
      this.b = 255;
    }
    if (this.a < 0 || Number.isNaN(this.a)) {
      this.a = undefined;
    } else if (this.a > 255) {
      this.a = 1;
    }
  }

  isValid() {
    return this.ok;
  }

  rgb() {
    const { r, g, b, a } = this; // eslint-disable-line object-curly-newline
    if (a) {
      return `rgb(${[r, g, b, a].join(', ')})`;
    }
    return `rgb(${[r, g, b].join(', ')})`;
  }

  hex() {
    return `#${rgbHex(this.r, this.g, this.b, this.a)}`;
  }

  channels() {
    const { ok, a, ...rest } = this;
    return a ? { a, ...rest } : rest;
  }
}

export default function rgbcolor(color) {
  return new RGBColor(color);
}
