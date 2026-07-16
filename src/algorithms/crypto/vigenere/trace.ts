// =============================================================================
// 维吉尼亚密码 · 录制帧序列
// 用 setArray 展示明文/密文字符码（指针标当前处理位 + 密钥字母），
// 用 setMap 展示密钥字母对照表与密钥循环位置。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vigenere, normalizeKey, type VigenereHooks } from './impl.ts';

export interface VigenereInput {
  text: string;
  key: string;
}

export const DEFAULT_INPUT: VigenereInput = { text: 'HELLO WORLD', key: 'KEY' };

/** 字符串 → 字符码数组（保留非字母，用于 setArray 展示）。 */
function toCodes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0));
}

/** 录制演示帧序列。 */
export function buildTrace(input: VigenereInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, key } = input;
  const normKey = normalizeKey(key);
  const codes = toCodes(text);
  // 当前展示的字符码（初始为原文）
  const display = [...codes];
  const final = new Set<number>();
  let cursor = -1;
  let keyPos = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = codes.map((_, i) =>
      final.has(i) ? 'final' : i === cursor ? 'compare' : 'default',
    );
    const pointers = cursor >= 0 ? [{ index: cursor, label: 'i' }] : [];
    const keyMap = Array.from(normKey).map((c, idx) => ({
      key: c,
      value: idx === keyPos % normKey.length ? '↑ 当前' : '',
      role: (idx === keyPos % normKey.length ? 'pivot' : 'default') as BarRole,
    }));
    rec
      .begin(note)
      .setArray([...display], roles, pointers)
      .setMap(keyMap)
      .commit();
  };

  snapshot({
    zh: `明文「${text}」，密钥「${normKey}」（周期 ${normKey.length}）`,
    en: `Plaintext "${text}", key "${normKey}" (period ${normKey.length})`,
  });

  const hooks: VigenereHooks = {
    onShift: (i, original, shifted, keyChar) => {
      cursor = i;
      display[i] = shifted.charCodeAt(0);
      snapshot({
        zh: `'${original}' + '${keyChar}' → '${shifted}'`,
        en: `'${original}' + '${keyChar}' -> '${shifted}'`,
      });
      final.add(i);
      keyPos++;
    },
    onSkip: (i, ch) => {
      cursor = i;
      snapshot({
        zh: `'${ch}' 非字母，原样保留（不消耗密钥）`,
        en: `'${ch}' non-alpha, kept as-is (key not consumed)`,
      });
      final.add(i);
    },
  };

  const { text: cipher } = vigenere(text, key, false, hooks);

  // 终态：明文 → 密文对照
  rec
    .begin({ zh: `完成：密文「${cipher}」`, en: `Done: ciphertext "${cipher}"` })
    .setMap([
      { key: '明文 / plaintext', value: text, role: 'default' as BarRole },
      { key: '密钥 / key', value: normKey, role: 'pivot' as BarRole },
      { key: '密文 / ciphertext', value: cipher, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
