// =============================================================================
// 字符串哈希 · 录制帧序列
// setArray 展示字符串（字符码），pointer 标注当前 i；setAux 展示 prefix 哈希值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashString, buildPowB, subHash, type HashStringHooks } from './impl.ts';

export const DEFAULT_INPUT = 'abcabcabc';

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  let i = -1;
  let roleI: BarRole = 'default';
  const prefix: number[] = new Array<number>(n + 1).fill(0);

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 's', value: s },
    { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    { label: 'prefix[i+1]', value: i < 0 ? '-' : String(prefix[i + 1]), role: 'frontier' },
    { label: 'BASE/MOD', value: '131 / 1e9+7' },
  ];

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
    }
    rec.begin(note).setArray(CODE(s), roles, pointers).setAux(aux()).commit();
    roleI = 'default';
  };

  snap({ zh: `构造前缀哈希：${s}`, en: `Build prefix hash: ${s}` });

  const hooks: HashStringHooks = {
    onPrefix: (idx, hash) => {
      i = idx;
      prefix[idx + 1] = hash;
      snap({
        zh: `prefix[${idx + 1}] = (prefix[${idx}]*B + ${s.charCodeAt(idx)}) mod M = ${hash}`,
        en: `prefix[${idx + 1}] = (prefix[${idx}]*B + ${s.charCodeAt(idx)}) mod M = ${hash}`,
      });
    },
    onDone: () => {
      /* 终态 */
    },
  };

  hashString(s, hooks);

  // 演示子串哈希：s[0..2] 与 s[3..5]
  const powB = buildPowB(n + 1);
  const h0 = subHash(prefix, powB, 0, Math.min(2, n - 1));
  const h3 = n >= 6 ? subHash(prefix, powB, 3, 5) : h0;
  i = -1;
  rec
    .begin({
      zh: `子串哈希：s[0..2]=${h0}${n >= 6 ? `, s[3..5]=${h3}（相等）` : ''}`,
      en: `subHash: s[0..2]=${h0}${n >= 6 ? `, s[3..5]=${h3} (equal)` : ''}`,
    })
    .setArray(CODE(s), new Array(n).fill('final'), [])
    .setAux(aux())
    .commit();

  return rec.build();
}
