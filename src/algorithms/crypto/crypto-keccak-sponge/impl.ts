export interface KsHooks {
  onAbsorb?: (block: number, state: number[]) => void;
  onSqueeze?: (state: number[]) => void;
}
function keccakF(state: number[]): number[] {
  for (let r = 0; r < 5; r++)
    for (let i = 0; i < state.length; i++) state[i] = ((state[i]! + r + i) * 0x11) & 0xff;
  return state;
}
export function keccakSponge(
  data: number[],
  rate: number,
  outLen: number,
  hooks: KsHooks = {},
): number[] {
  const state: number[] = new Array(rate).fill(0);
  for (let i = 0; i < data.length; i += rate) {
    for (let j = 0; j < rate && i + j < data.length; j++) state[j]! ^= data[i + j]!;
    hooks.onAbsorb?.(i / rate, state);
    keccakF(state);
  }
  const out: number[] = state.slice(0, outLen);
  hooks.onSqueeze?.(state);
  return out;
}
