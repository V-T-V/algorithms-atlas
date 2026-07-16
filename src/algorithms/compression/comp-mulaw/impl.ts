export interface MuHooks {
  onSample?: (i: number, lin: number, enc: number) => void;
}
const MU = 255;
export function mulawEncode(samples: number[], hooks: MuHooks = {}): number[] {
  return samples.map((s, i) => {
    const sign = s < 0 ? 0x80 : 0;
    const x = Math.abs(s) / 32768;
    const enc = sign | Math.round((Math.log(1 + MU * x) / Math.log(1 + MU)) * 127);
    hooks.onSample?.(i, s, enc);
    return enc;
  });
}
export function mulawDecode(data: number[]): number[] {
  return data.map((b) => {
    const sign = b & 0x80 ? -1 : 1;
    const v = b & 0x7f;
    return Math.round((sign * 32768 * (Math.pow(1 + MU, v / 127) - 1)) / MU);
  });
}
