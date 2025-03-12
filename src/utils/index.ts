export const gcd = (a: number, b: number): number =>
  b === 0 ? a : gcd(b, a % b); // greatest common divisor
const A = (r: number, x: number, y: number, sweep = 1) =>
  `A${r},${r} 0,0,${sweep} ${x},${y}`;
const L = (x: number, y: number) => `L${x},${y}`;

export const fixed = (value: number) =>
  value % 1 === 0 ? value : +value.toFixed(2);

export const constraint = (setup: Setup, value: number) =>
  fixed(Math.max(0, Math.min(value, setup.width / 2, setup.height / 2)));

export const generatePath = (
  setup: Setup,
  cornerRadius: CornerRadius,
  invertedCorners: InvertedCorners
) => {
  const { width, height } = setup;
  const {
    tl: topLeft,
    tr: topRight,
    bl: bottomLeft,
    br: bottomRight,
  } = cornerRadius;
  const { tl, tr, bl, br } = invertedCorners;
  const x = 0,
    y = 0;

  let path = `M${x + topLeft},${y}`;

  // Top Side (with optional inverted notches)
  if (tr.inverted) {
    path += `H${x + (width - tr.width - tr.roundness)}`;
  } else path += `H${x + width - topRight}`;

  //   top right corner
  if (tr.inverted) {
    path +=
      A(tr.roundness, width - tr.width, tr.roundness) +
      L(width - tr.width, tr.height - tr.roundness) +
      A(tr.roundness, width - tr.width + tr.roundness, tr.height, 0) +
      L(width - tr.roundness, tr.height) +
      A(tr.roundness, width, tr.height + tr.roundness);
  } else path += A(topRight, x + width, y + topRight);

  // Right Side
  if (br.inverted) {
    path += `V${y + height - br.height - br.roundness}`;
  } else path += `V${y + height - bottomRight}`;

  // Bottom right corner
  if (br.inverted) {
    path +=
      A(br.roundness, x + width - br.roundness, y + height - br.height) +
      L(width - br.width + br.roundness, height - br.height) +
      A(br.roundness, width - br.width, height - br.height + br.roundness, 0) +
      L(width - br.width, height - br.roundness) +
      A(br.roundness, width - br.width - br.roundness, height);
  } else path += A(bottomRight, x + width - bottomRight, y + height);

  // Bottom Side
  if (bl.inverted) path += `H${x + bl.width + bl.roundness}`;
  else path += `H${x + bottomLeft}`;

  // Bottom Left corner
  if (bl.inverted) {
    path +=
      A(bl.roundness, bl.width, height - bl.roundness) +
      L(bl.width, height - bl.height + bl.roundness) +
      A(bl.roundness, bl.width - bl.roundness, height - bl.height, 0) +
      L(bl.roundness, height - bl.height) +
      A(bl.roundness, x, height - bl.height - bl.roundness);
  } else path += A(bottomLeft, x, y + height - bottomLeft);

  // Left Side
  if (tl.inverted) path += `V${y + tl.height + tl.roundness}`;
  else path += `V${y + topLeft}`;

  // top left corner
  if (tl.inverted) {
    path +=
      A(tl.roundness, tl.roundness, tl.height) +
      L(tl.width - tl.roundness, tl.height) +
      A(tl.roundness, tl.width, tl.height - tl.roundness, 0) +
      L(tl.width, tl.roundness) +
      A(tl.roundness, tl.width + tl.roundness, y);
  } else path += `A${topLeft},${topLeft} 0,0,1 ${x + topLeft},${y}Z`;

  return path;
};
