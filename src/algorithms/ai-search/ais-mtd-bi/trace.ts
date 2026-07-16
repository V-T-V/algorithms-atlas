import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mtdBi, type BiNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: BiNode = {
    id: 'r',
    children: [
      {
        id: 'a',
        children: [
          { id: 'a1', utility: 3 },
          { id: 'a2', utility: 7 },
        ],
      },
      {
        id: 'b',
        children: [
          { id: 'b1', utility: 5 },
          { id: 'b2', utility: 2 },
        ],
      },
    ],
  };
  rec
    .begin({ zh: 'MTD(bi) 启动 f=0', en: 'MTD(bi) start f=0' })
    .setBars(
      [3, 7, 5, 2].map((v, i) => ({
        value: v,
        role: 'default' as BarRole,
        label: ['a1', 'a2', 'b1', 'b2'][i],
      })),
    )
    .commit();
  mtdBi(tree, 0, 2, 64, {
    onTest: (beta, v, b) => {
      rec
        .begin({ zh: `Test β=${beta} → ${b}=${v}`, en: `Test β=${beta} → ${b}=${v}` })
        .setAux([
          {
            label: b === 'lower' ? '下界' : '上界',
            value: String(v),
            role: (b === 'lower' ? 'final' : 'compare') as BarRole,
          },
        ])
        .commit();
    },
    onConverge: (v, it) => {
      rec
        .begin({ zh: `收敛=${v} (${it}次)`, en: `converged=${v} (${it} iters)` })
        .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
        .commit();
    },
  });
  return rec.build();
}
