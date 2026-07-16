import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mtdF, type MtdNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();

  const tree: MtdNode = {
    id: 'root',
    children: [
      {
        id: 'A',
        children: [
          { id: 'A1', utility: 3 },
          { id: 'A2', utility: 7 },
        ],
      },
      {
        id: 'B',
        children: [
          { id: 'B1', utility: 2 },
          { id: 'B2', utility: 9 },
        ],
      },
    ],
  };

  rec
    .begin({ zh: `初始化 MTD(f) guess=0`, en: `Init MTD(f) guess=0` })
    .setBars([3, 7, 2, 9].map((v, i) => ({ value: v, role: 'default' as BarRole, label: `L${i}` })))
    .setAux([{ label: '初始 f', value: '0', role: 'compare' as BarRole }])
    .commit();

  const result = mtdF(tree, 0, 2, 40, {
    onTest: (guess, bound, value) => {
      rec
        .begin({
          zh: `Test guess=${guess} ${bound}=${value}`,
          en: `Test guess=${guess} ${bound}=${value}`,
        })
        .setBars(
          [3, 7, 2, 9].map((v, i) => ({ value: v, role: 'default' as BarRole, label: `L${i}` })),
        )
        .setAux([
          { label: '猜测', value: String(guess), role: 'compare' as BarRole },
          {
            label: bound === 'lower' ? '下界' : '上界',
            value: String(value),
            role: 'final' as BarRole,
          },
        ])
        .commit();
    },
  });

  rec
    .begin({ zh: `完成：值=${result}`, en: `Done: value=${result}` })
    .setAux([{ label: '博弈值', value: String(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
