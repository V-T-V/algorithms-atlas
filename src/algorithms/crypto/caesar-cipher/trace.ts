// =============================================================================
// 凯撒密码 · 录制帧序列
// 用 setArray（字符码作 values，pointer 标当前位移位置）展示逐字符位移过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { caesarCipher, type CaesarCipherHooks } from './impl.ts';

export interface CaesarInput {
  text: string;
  shift: number;
}

export const DEFAULT_INPUT: CaesarInput = { text: 'HELLO, World!', shift: 3 };

/** 字符串 → 字符码数组（保留非字母，用于 setArray 展示）。 */
function toCodes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0));
}

/** 录制演示帧序列。 */
export function buildTrace(input: CaesarInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, shift } = input;
  const codes = toCodes(text);
  // 当前展示的「已位移」字符码（初始与原文相同）
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

  snapshot({
    zh: `明文「${text}」，位移 = ${shift}`,
    en: `Plaintext "${text}", shift = ${shift}`,
  });

  const hooks: CaesarCipherHooks = {
    onShift: (i, original, shifted) => {
      cursor = i;
      display[i] = shifted.charCodeAt(0);
      snapshot({
        zh: `'${original}' → '${shifted}'（+${((shift % 26) + 26) % 26}）`,
        en: `'${original}' -> '${shifted}' (+${((shift % 26) + 26) % 26})`,
      });
      final.add(i);
    },
    onSkip: (i, ch) => {
      cursor = i;
      snapshot({
        zh: `'${ch}' 非字母，原样保留`,
        en: `'${ch}' is non-alphabetic, kept as-is`,
      });
      final.add(i);
    },
  };

  const { text: cipher } = caesarCipher(text, shift, hooks);

  // 终态：明文 → 密文对照（setMap）
  rec
    .begin({ zh: `完成：密文「${cipher}」`, en: `Done: ciphertext "${cipher}"` })
    .setMap([
      { key: '明文 / plaintext', value: text, role: 'default' as BarRole },
      { key: '密文 / ciphertext', value: cipher, role: 'final' as BarRole },
      { key: '位移 / shift', value: String(shift), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
