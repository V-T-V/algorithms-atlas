// =============================================================================
// H 指数 · 录制帧序列
// setAux 展示计数桶与累计；setArray 展示原始引用数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hIndex, type HIndexHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 0, 6, 1, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let cumDisplay = 0;
  let hFound = -1;

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'citations', value: values.join(', ') },
    { label: 'cum (>=i)', value: String(cumDisplay), role: 'compare' },
    { label: 'h', value: hFound < 0 ? '-' : String(hFound), role: 'final' },
  ];

  const snap = (note: { zh: string; en: string }, highlightIdx: number): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (highlightIdx >= 0 && highlightIdx < n) roles[highlightIdx] = 'compare';
    rec.begin(note).setArray(values, roles, []).setAux(aux()).commit();
  };

  snap({ zh: `H 指数`, en: `H-Index` }, -1);

  const hooks: HIndexHooks = {
    onCount: (idx, cum) => {
      cumDisplay = cum;
      snap(
        { zh: `i=${idx}：累计 ${cum} 篇 >= ${idx}`, en: `i=${idx}: ${cum} papers >= ${idx}` },
        idx,
      );
    },
    onScan: (idx, cum, isH) => {
      cumDisplay = cum;
      if (isH) hFound = idx;
    },
    onDone: (h) => {
      hFound = h;
    },
  };

  hIndex(input, hooks);

  const roles: BarRole[] = new Array(n).fill('final');
  rec
    .begin({ zh: `H 指数 = ${hFound}`, en: `H-Index = ${hFound}` })
    .setArray(values, roles, [])
    .setAux(aux())
    .commit();
  return rec.build();
}
