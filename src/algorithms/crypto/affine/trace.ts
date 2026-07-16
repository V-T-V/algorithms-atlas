// 仿射密码 · 录制帧序列：逐字符 E(x) = (a*x+b) mod 26。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { affine, type AffineHooks } from './impl.ts';

export interface AffineInput {
  text: string;
  a: number;
  b: number;
}

export const DEFAULT_INPUT: AffineInput = { text: 'AFFINE', a: 5, b: 8 };

function toCodes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0));
}

/** 录制演示帧序列。 */
export function buildTrace(input: AffineInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, a, b } = input;
  const codes = toCodes(text);
  const display = [...codes];
  const final = new Set<number>();
  let cursor = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = codes.map((_, i) =>
      final.has(i) ? 'final' : i === cursor ? 'compare' : 'default',
    );
    const pointers = cursor >= 0 ? [{ index: cursor, label: 'i' }] : [];
    rec
      .begin(note)
      .setArray([...display], roles, pointers)
      .commit();
  };

  snapshot({ zh: `明文「${text}」，a=${a}, b=${b}`, en: `Plaintext "${text}", a=${a}, b=${b}` });

  const hooks: AffineHooks = {
    onEncrypt: (i, original, enc) => {
      cursor = i;
      display[i] = enc.charCodeAt(0);
      snapshot({ zh: `'${original}' → '${enc}'`, en: `'${original}' -> '${enc}'` });
      final.add(i);
    },
    onSkip: (i, ch) => {
      cursor = i;
      snapshot({ zh: `'${ch}' 非字母，保留`, en: `'${ch}' non-alpha, kept` });
      final.add(i);
    },
  };

  const { text: cipher } = affine(text, a, b, hooks);

  rec
    .begin({ zh: `完成：密文「${cipher}」`, en: `Done: ciphertext "${cipher}"` })
    .setMap([
      { key: '明文 / plaintext', value: text, role: 'default' as BarRole },
      { key: '密文 / ciphertext', value: cipher, role: 'final' as BarRole },
      { key: 'a, b', value: `${a}, ${b}`, role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
