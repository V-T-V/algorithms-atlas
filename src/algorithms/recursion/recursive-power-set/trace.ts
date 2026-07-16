// 递归生成幂集 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { generatePowerSet, type PowerSetHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 3 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;
  let cur: number[] = [];
  const solutions: number[][] = [];
  let lastDecide: { i: number; taken: boolean } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const values = Array.from({ length: n }, (_, i) => i + 1);
    const roles: BarRole[] = values.map(() => 'default' as BarRole);
    cur.forEach((idx) => {
      if (idx < n) roles[idx] = 'final';
    });
    if (lastDecide) {
      const r = lastDecide.taken ? 'swap' : 'warn';
      if (lastDecide.i < n) roles[lastDecide.i] = r;
    }
    rec
      .begin(note)
      .setBars(values.map((v, i) => ({ value: v, role: roles[i]!, label: String(v) })))
      .setAux([
        {
          label: '当前子集',
          value: `[${cur.map((x) => x + 1).join(', ')}]`,
          role: 'compare' as BarRole,
        },
        { label: '已生成', value: String(solutions.length), role: 'frontier' as BarRole },
        { label: '总数 2^n', value: String(2 ** n), role: 'pivot' as BarRole },
        ...solutions.slice(-4).map((s) => ({
          label: `子集`,
          value: `{${s.map((x) => x + 1).join(', ')}}`,
          role: 'sorted' as BarRole,
        })),
      ])
      .commit();
    lastDecide = null;
  };

  render({
    zh: `生成 ${n} 个元素的幂集（共 ${2 ** n} 个）`,
    en: `Generate power set of ${n} elements (${2 ** n} subsets)`,
  });

  const hooks: PowerSetHooks = {
    onDecide: (i, taken, c) => {
      cur = [...c];
      lastDecide = { i, taken };
      render({
        zh: `元素 ${i + 1}：${taken ? '选入 ✓' : '跳过 ✗'}`,
        en: `Element ${i + 1}: ${taken ? 'take ✓' : 'skip ✗'}`,
      });
    },
    onSolution: (s) => {
      cur = [...s];
      solutions.push([...s]);
      render({
        zh: `子集 {${s.map((x) => x + 1).join(', ')}}（第 ${solutions.length} 个）`,
        en: `Subset {${s.map((x) => x + 1).join(', ')}} (#${solutions.length})`,
      });
    },
  };

  generatePowerSet(n, hooks);

  const values = Array.from({ length: n }, (_, i) => i + 1);
  rec
    .begin({ zh: `完成：共 ${solutions.length} 个子集`, en: `Done: ${solutions.length} subsets` })
    .setBars(values.map((v) => ({ value: v, role: 'sorted' as BarRole, label: String(v) })))
    .setAux([{ label: '幂集大小', value: String(solutions.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
