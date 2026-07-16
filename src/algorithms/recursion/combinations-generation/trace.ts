// 递归生成 C(n,k) 组合 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { generateCombinations, type CombinationsHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 5, k: 3 };

export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, k } = input;
  let cur: number[] = [];
  const solutions: number[][] = [];
  let pickIdx = -1;

  const render = (note: { zh: string; en: string }): void => {
    const values = Array.from({ length: n }, (_, i) => i + 1);
    const roles: BarRole[] = values.map(() => 'default' as BarRole);
    cur.forEach((idx) => {
      if (idx < n) roles[idx] = 'final';
    });
    if (pickIdx >= 0 && pickIdx < n && roles[pickIdx] === 'default') roles[pickIdx] = 'compare';
    rec
      .begin(note)
      .setBars(values.map((v, i) => ({ value: v, role: roles[i]!, label: String(v) })))
      .setAux([
        { label: '当前组合', value: `[${cur.join(', ')}]`, role: 'compare' as BarRole },
        { label: '已生成', value: String(solutions.length), role: 'frontier' as BarRole },
        { label: '目标 k', value: String(k), role: 'pivot' as BarRole },
        ...solutions.slice(-3).map((s, i) => ({
          label: `解 ${solutions.length - 3 + i + 1 >= 1 ? solutions.length - 3 + i + 1 : '-'}`,
          value: `[${s.join(', ')}]`,
          role: 'sorted' as BarRole,
        })),
      ])
      .commit();
    pickIdx = -1;
  };

  render({
    zh: `生成 C(${n},${k}) 的所有 ${k} 元组合`,
    en: `Generate all ${k}-subsets of {1..${n}}`,
  });

  const hooks: CombinationsHooks = {
    onPick: (c, idx) => {
      cur = [...c];
      pickIdx = idx;
      render({ zh: `选入下标 ${idx}`, en: `Pick index ${idx}` });
    },
    onBacktrack: (c) => {
      cur = [...c];
      render({ zh: `回溯，弹出末位 → [${c.join(', ')}]`, en: `Backtrack → [${c.join(', ')}]` });
    },
    onSolution: (s) => {
      cur = [...s];
      solutions.push([...s]);
      render({
        zh: `找到一组解：[${s.join(', ')}]（第 ${solutions.length} 组）`,
        en: `Solution found: [${s.join(', ')}] (#${solutions.length})`,
      });
    },
  };

  generateCombinations(n, k, hooks);

  const values = Array.from({ length: n }, (_, i) => i + 1);
  rec
    .begin({ zh: `完成：共 ${solutions.length} 组`, en: `Done: ${solutions.length} combinations` })
    .setBars(values.map((v) => ({ value: v, role: 'sorted' as BarRole, label: String(v) })))
    .setAux([{ label: '总数 C(n,k)', value: String(solutions.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
