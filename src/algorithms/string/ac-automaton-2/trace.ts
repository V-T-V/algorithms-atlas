// =============================================================================
// AC 自动机增强 · 录制帧序列
// setArray 展示文本（字符码），命中区间高亮；setAux 展示每个模式的实时计数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { acAutomaton2, type AcAutomaton2Hooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string; patterns: string[] } = {
  text: 'abababab',
  patterns: ['ab', 'ba', 'abab'],
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string; patterns: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, patterns } = input;
  const n = text.length;
  let i = -1;
  let roleI: BarRole = 'default';
  // 实时计数
  const counts: number[] = patterns.map(() => 0);
  const lastPos: Record<string, number[]> = {};

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const entries: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'text', value: text },
      { label: 'i', value: i < 0 ? '-' : String(i), role: 'compare' },
    ];
    patterns.forEach((p, idx) => {
      entries.push({
        label: p,
        value: `×${counts[idx]}`,
        role: counts[idx]! > 0 ? 'final' : 'default',
      });
    });
    return entries;
  };

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) {
      pointers.push({ index: i, label: 'i' });
      roles[i] = roleI;
    }
    // 高亮已命中的所有位置
    patterns.forEach((p, idx) => {
      for (const start of lastPos[p] ?? []) {
        for (let k = 0; k < p.length; k++) roles[start + k] = 'final';
      }
      void idx;
    });
    rec.begin(note).setArray(CODE(text), roles, pointers).setAux(aux()).commit();
    roleI = 'default';
  };

  snap({ zh: `AC 增强：${patterns.join(', ')}`, en: `AC enhanced: ${patterns.join(', ')}` });

  const hooks: AcAutomaton2Hooks = {
    onInsertEdge: () => {},
    onInsertOutput: () => {},
    onFail: () => {},
    onTransfer: (t) => {
      i = t;
    },
    onFound: (t, pi) => {
      const pat = patterns[pi]!;
      const start = t - pat.length + 1;
      counts[pi] = (counts[pi] ?? 0) + 1;
      (lastPos[pat] ??= []).push(start);
      roleI = 'final';
      snap({
        zh: `命中 '${pat}' @${start}（第 ${counts[pi]} 次）`,
        en: `Found '${pat}' @${start} (#${counts[pi]})`,
      });
    },
    onStat: () => {},
  };

  acAutomaton2(text, patterns, hooks);

  const roles: BarRole[] = new Array(n).fill('default');
  patterns.forEach((p) => {
    for (const start of lastPos[p] ?? [])
      for (let k = 0; k < p.length; k++) roles[start + k] = 'final';
  });
  i = -1;
  rec
    .begin({
      zh: `完成：共 ${counts.reduce((a, b) => a + b, 0)} 次命中`,
      en: `Done: ${counts.reduce((a, b) => a + b, 0)} total hits`,
    })
    .setArray(CODE(text), roles, [])
    .setAux(aux())
    .commit();

  return rec.build();
}
