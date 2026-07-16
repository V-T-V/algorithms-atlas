// =============================================================================
// 铺砖 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numTilings, type TilingHooks } from './impl.ts';

export const DEFAULT_INPUT = 5;

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let curF = 1;
  let curP = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([{ value: curF, role: 'frontier' }])
      .setAux([
        { label: 'f[i]', value: String(curF), role: 'final' },
        { label: 'p[i]', value: String(curP), role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `n=${n}`, en: `n=${n}` });

  const hooks: TilingHooks = {
    onStep: (i, f, p) => {
      curF = f;
      curP = p;
      snap({ zh: `i=${i} f=${f} p=${p}`, en: `i=${i} f=${f} p=${p}` });
    },
  };

  const ans = numTilings(n, hooks);

  rec
    .begin({ zh: `方案数=${ans}`, en: `ways=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
