// Blowfish 完整版 · 实现（基于已有 blowfish-schedule）
import { blowfishKeySchedule, blowfishEncrypt } from '../blowfish-schedule/impl.ts';
export interface BfHooks {
  onEncrypt?: (l: number, r: number) => void;
}
export function blowfishEncryptBlock(
  key: number[],
  block: number[],
  hooks: BfHooks = {},
): number[] {
  const keyStr = String.fromCharCode(...key.map((b) => b & 0xff));
  const state = blowfishKeySchedule(keyStr);
  const lIn = ((block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!) >>> 0;
  const rIn = ((block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!) >>> 0;
  const { l, r } = blowfishEncrypt(state, lIn, rIn);
  hooks.onEncrypt?.(l, r);
  return [
    (l >>> 24) & 0xff,
    (l >>> 16) & 0xff,
    (l >>> 8) & 0xff,
    l & 0xff,
    (r >>> 24) & 0xff,
    (r >>> 16) & 0xff,
    (r >>> 8) & 0xff,
    r & 0xff,
  ];
}
