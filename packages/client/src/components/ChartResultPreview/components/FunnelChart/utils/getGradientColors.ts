const rgbToHex = (r: number, g: number, b: number) => {
  let hex = ((r << 16) | (g << 8) | b).toString(16);
  return `#${new Array(Math.abs(hex.length - 7)).join("0")}${hex}`;
};

// hex to rgb
const hexToRgb = (hex: string) => {
  let rgb = [];
  for (let i = 1; i < 7; i += 2) {
    rgb.push(parseInt(`0x${hex.slice(i, i + 2)}`));
  }
  return rgb;
};

export const getGradientColors = (
  startColor: string,
  endColor: string,
  step: number
) => {
  // 将 hex 转换为rgb
  let sColor = hexToRgb(startColor);
  let eColor = hexToRgb(endColor);

  // 计算R\G\B每一步的差值
  let rStep = (eColor[0] - sColor[0]) / step;
  let gStep = (eColor[1] - sColor[1]) / step;
  let bStep = (eColor[2] - sColor[2]) / step;

  let gradientColorArr = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < step; i++) {
    // 计算每一步的hex值
    gradientColorArr.push(
      rgbToHex(
        Math.floor(rStep * i + sColor[0]),
        Math.floor(gStep * i + sColor[1]),
        Math.floor(bStep * i + sColor[2])
      )
    );
  }
  return gradientColorArr;
};
