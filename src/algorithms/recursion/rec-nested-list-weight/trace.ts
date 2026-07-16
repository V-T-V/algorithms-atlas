import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { depthSum, type NestedItem } from './impl.ts';

export const DEFAULT_LIST: NestedItem[] = [[1, 1], 2, [1, 1]];

export function buildTrace(opts: { list?: NestedItem[] } = {}): Frame[] {
  const list = opts.list ?? DEFAULT_LIST;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化嵌套列表`, en: `Init nested list` })
    .setAux([{ label: 'JSON', value: JSON.stringify(list), role: 'compare' as BarRole }])
    .commit();

  depthSum(list, 1, {
    onInteger: (value, depth) => {
      rec
        .begin({
          zh: `整数 ${value} 深度=${depth} 贡献=${value * depth}`,
          en: `int ${value} depth=${depth} contrib=${value * depth}`,
        })
        .setBars([
          { value, role: 'pivot' as BarRole, label: `值${value}` },
          { value: depth, role: 'compare' as BarRole, label: `深度${depth}` },
          { value: value * depth, role: 'final' as BarRole, label: `贡献${value * depth}` },
        ])
        .commit();
    },
  });

  const result = depthSum(list);
  rec
    .begin({ zh: `完成：权重和=${result}`, en: `Done: weighted sum=${result}` })
    .setAux([{ label: '结果', value: String(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
