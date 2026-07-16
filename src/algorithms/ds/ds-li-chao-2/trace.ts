import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LiChaoTree, type LiChaoHooks, type Line } from './impl.ts';

export const DEFAULT_LO = 1;
export const DEFAULT_HI = 10;
export const DEFAULT_LINES: Line[] = [
  { k: 1, b: 0 }, // y = x
  { k: 2, b: -5 }, // y = 2x - 5
  { k: -1, b: 15 }, // y = -x + 15
];
export const DEFAULT_QUERY = [1, 5, 8, 10];

export function buildTrace(
  lo: number = DEFAULT_LO,
  hi: number = DEFAULT_HI,
  lines: Line[] = DEFAULT_LINES,
  queries: number[] = DEFAULT_QUERY,
): Frame[] {
  const rec = new TraceRecorder();
  const tree = new LiChaoTree(lo, hi);

  rec
    .begin({ zh: `空李超树 [${lo},${hi}]`, en: `Empty Li Chao [${lo},${hi}]` })
    .setAux([{ label: '值域', value: `[${lo},${hi}]`, role: 'frontier' }])
    .commit();

  const hooks: LiChaoHooks = {
    onInsert: (line) => {
      // 重算当前每个 x 的最大值
      const vals = Array.from({ length: hi - lo + 1 }, (_, i) => {
        const x = lo + i;
        return tree.query(x);
      });
      rec
        .begin({ zh: `插入 y=${line.k}x+${line.b}`, en: `Insert y=${line.k}x+${line.b}` })
        .setBars(vals.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .setAux([
          { label: '直线', value: `${line.k}x+${line.b}`, role: 'frontier' },
          { label: '已插入', value: String(lines.indexOf(line) + 1), role: 'final' },
        ])
        .commit();
    },
    onQuery: (x, value) => {
      rec
        .begin({ zh: `查询 x=${x} → max=${value}`, en: `Query x=${x} -> max=${value}` })
        .setBars([{ value, role: 'final' as BarRole }])
        .setAux([
          { label: 'x', value: String(x), role: 'frontier' },
          { label: '最大值', value: String(value), role: 'final' },
        ])
        .commit();
    },
  };
  tree.hooks = hooks;

  for (const line of lines) tree.insert(line);
  for (const x of queries) tree.query(x);

  rec
    .begin({ zh: `共 ${lines.length} 条直线`, en: `${lines.length} lines total` })
    .setAux([{ label: '直线数', value: String(lines.length), role: 'final' }])
    .commit();

  return rec.build();
}
