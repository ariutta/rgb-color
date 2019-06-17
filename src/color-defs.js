const colorDefs = [
  {
    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
    example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
    process(bits) {
      return [
        parseInt(bits[1], 10),
        parseInt(bits[2], 10),
        parseInt(bits[3], 10),
      ];
    },
  },
  {
    re: /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i,
    example: ['hsl(180,100%,50%)', 'hsl(90, 90%, 30%)'],
    process(bits) {
      let hsl = bits[0];
      const sep = hsl.indexOf(',') > -1 ? ',' : ' ';
      hsl = hsl.substr(4).split(')')[0].split(sep);

      let h = hsl[0];
      const s = hsl[1].substr(0, hsl[1].length - 1) / 100;
      const l = hsl[2].substr(0, hsl[2].length - 1) / 100;

      // strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
      else if (h.indexOf('rad') > -1) h = Math.round(h.substr(0, h.length - 3) / (2 * Math.PI) * 360);
      else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
      // keep hue fraction of 360 if ending up over
      if (h >= 360) h %= 360;

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r = 0;
      let g = 0;
      let b = 0;

      if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
      } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
      } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
      } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
      } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return [r, g, b];
    },
  },
  {
    re: /^(\w{2})(\w{2})(\w{2})$/,
    example: ['#00ff00', '336699'],
    process(bits) {
      return [
        parseInt(bits[1], 16),
        parseInt(bits[2], 16),
        parseInt(bits[3], 16),
      ];
    },
  },
  {
    re: /^(\w{1})(\w{1})(\w{1})$/,
    example: ['#fb0', 'f0f'],
    process(bits) {
      return [
        parseInt(bits[1] + bits[1], 16),
        parseInt(bits[2] + bits[2], 16),
        parseInt(bits[3] + bits[3], 16),
      ];
    },
  },
];

export default colorDefs;
