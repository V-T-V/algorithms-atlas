// =============================================================================
// Rabin-Karp 滚动哈希 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinKarpSearch, type RkHooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; pat: string } = {
  text: 'AABAACAADAABAABA',
  pat: 'AABA',
};

export function buildTrace(input: { text: string; pat: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;

  rec
    .begin({
      zh: `Rabin-Karp 在 "${text}" 中找 "${pat}"`,
      en: `Rabin-Karp find "${pat}" in "${text}"`,
    })
    .setAux([
      { label: 'text', value: text, role: 'frontier' },
      { label: 'pat', value: pat, role: 'compare' },
    ])
    .commit();

  const hooks: RkHooks = {
    onWindow: (i) => {
      const roles: BarRole[] = new Array(text.length).fill('default');
      for (let k = 0; k < pat.length && i + k < text.length; k++) roles[i + k] = 'pivot';
      rec
        .begin({ zh: `窗口起点 ${i}`, en: `Window at ${i}` })
        .setArray(
          Array.from(text, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .setAux([{ label: '窗口', value: String(i), role: 'frontier' }])
        .commit();
    },
    onVerify: (i, ok) => {
      const roles: BarRole[] = new Array(text.length).fill('default');
      for (let k = 0; k < pat.length; k++) roles[i + k] = ok ? 'final' : 'swap';
      rec
        .begin({
          zh: `哈希相等，校验位置 ${i} → ${ok ? '真命中' : '冲突'}`,
          en: `Hash match, verify ${i} → ${ok ? 'real' : 'collision'}`,
        })
        .setArray(
          Array.from(text, (c) => c.charCodeAt(0)),
          roles,
          [],
        )
        .commit();
    },
    onFound: (pos) => {
      rec
        .begin({ zh: `命中位置 ${pos}`, en: `Found at ${pos}` })
        .setAux([{ label: '命中', value: String(pos), role: 'final' }])
        .commit();
    },
  };

  const res = rabinKarpSearch(text, pat, hooks);
  rec
    .begin({ zh: `完成，命中 [${res.join(', ')}]`, en: `Done, hits [${res.join(', ')}]` })
    .setAux([{ label: '命中', value: `[${res.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
