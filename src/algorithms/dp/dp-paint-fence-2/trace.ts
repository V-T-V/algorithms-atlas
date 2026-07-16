// =============================================================================
// 栅栏涂色 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numWaysPaintFence, type PaintFenceHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 4, k: 3 };

export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let same = input.k;
  let diff = input.k * (input.k - 1);

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'same', value: String(same), role: 'pivot' },
        { label: 'diff', value: String(diff), role: 'frontier' },
        { label: 'total', value: String(same + diff), role: 'final' },
      ])
      .commit();
  };

  snap({
    zh: `n=${input.n} k=${input.k}（前两根：same=${same} diff=${diff}）`,
    en: `n=${input.n} k=${input.k}`,
  });

  const hooks: PaintFenceHooks = {
    onStep: (i, s, d) => {
      same = s;
      diff = d;
      snap({
        zh: `i=${i} same=${s} diff=${d} 总=${s + d}`,
        en: `i=${i} same=${s} diff=${d} total=${s + d}`,
      });
    },
  };

  const ans = numWaysPaintFence(input.n, input.k, hooks);

  rec
    .begin({ zh: `方案数=${ans}`, en: `ways=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
