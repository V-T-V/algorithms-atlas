import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { depthSumInverse, type NestedItem } from './impl.ts';

export const DEFAULT_LIST: NestedItem[] = [[1, 1], 2, [1, 1]];

export function buildTrace(opts: { list?: NestedItem[] } = {}): Frame[] {
  const list = opts.list ?? DEFAULT_LIST;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化嵌套列表`, en: `Init nested list` })
    .setAux([{ label: 'JSON', value: JSON.stringify(list), role: 'compare' as BarRole }])
    .commit();

  depthSumInverse(list, {
    onInteger: (value, depth, weight) => {
      rec
        .begin({
          zh: `整数 ${value} 深度=${depth} 权重=${weight}`,
          en: `int ${value} depth=${depth} weight=${weight}`,
        })
        .setBars([
          { value, role: 'pivot' as BarRole, label: `值${value}` },
          { value: weight, role: 'final' as BarRole, label: `权重${weight}` },
          { value: value * weight, role: 'compare' as BarRole, label: `贡献${value * weight}` },
        ])
        .commit();
    },
  });

  const result = depthSumInverse(list);
  rec
    .begin({ zh: `完成：反向权重和=${result}`, en: `Done: inverse-weighted sum=${result}` })
    .setAux([{ label: '结果', value: String(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
