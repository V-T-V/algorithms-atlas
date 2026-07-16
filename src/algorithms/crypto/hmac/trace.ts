// HMAC · 录制帧序列：双层哈希构造。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hmac, type HmacHooks } from './impl.ts';

export interface HmacInput {
  message: number[];
  key: number[];
}

export const DEFAULT_INPUT: HmacInput = {
  message: [72, 101, 108, 108, 111], // "Hello"
  key: [0x0b, 0x0b, 0x0b, 0x0b],
};

const hex = (xs: number[]): string => xs.map((x) => x.toString(16).padStart(2, '0')).join(' ');

/** 录制演示帧序列。 */
export function buildTrace(input: HmacInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { message, key } = input;

  rec
    .begin({ zh: `消息 + 密钥`, en: `Message + key` })
    .setMap([
      { key: '消息', value: hex(message), role: 'default' as BarRole },
      { key: '密钥', value: hex(key), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: HmacHooks = {
    onKeyPad: (_k, pad) => {
      rec
        .begin({ zh: `生成 ${pad}（K 与常量异或）`, en: `Build ${pad} (K XOR const)` })
        .setMap([{ key: pad, value: pad, role: 'compare' as BarRole }])
        .commit();
    },
    onInner: (digest) => {
      rec
        .begin({ zh: `内层哈希 = ${hex(digest)}`, en: `Inner hash = ${hex(digest)}` })
        .setBars(digest.map((v) => ({ value: v, role: 'frontier' as BarRole })))
        .commit();
    },
    onOuter: (digest) => {
      rec
        .begin({ zh: `外层哈希 = ${hex(digest)}`, en: `Outer hash = ${hex(digest)}` })
        .setBars(digest.map((v) => ({ value: v, role: 'swap' as BarRole })))
        .commit();
    },
  };

  const { digest } = hmac(message, key, hooks);

  rec
    .begin({ zh: `完成：HMAC = ${hex(digest)}`, en: `Done: HMAC = ${hex(digest)}` })
    .setBars(digest.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setMap([{ key: 'HMAC', value: hex(digest), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
