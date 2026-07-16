export interface SvbHooks {
  onLen?: (idx: number, len: number) => void;
}
export function streamVByteEncode(
  values: number[],
  hooks: SvbHooks = {},
): { ctrl: number[]; data: number[] } {
  const ctrl: number[] = [];
  const data: number[] = [];
  values.forEach((v, i) => {
    const len = v <= 0xff ? 1 : v <= 0xffff ? 2 : v <= 0xffffff ? 3 : 4;
    hooks.onLen?.(i, len);
    for (let b = 0; b < len; b++) data.push((v >>> (b * 8)) & 0xff);
  });
  for (let i = 0; i < values.length; i += 4) {
    let c = 0;
    for (let k = 0; k < 4 && i + k < values.length; k++) {
      const v = values[i + k]!;
      const len = v <= 0xff ? 1 : v <= 0xffff ? 2 : v <= 0xffffff ? 3 : 4;
      c |= (len - 1) << (k * 2);
    }
    ctrl.push(c);
  }
  return { ctrl, data };
}
