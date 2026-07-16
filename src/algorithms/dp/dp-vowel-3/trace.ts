import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countVowelStrings, type VowelHooks } from './impl.ts';

export const DEFAULT_N = 5;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  let dp = [1, 1, 1, 1, 1];
  rec
    .begin({ zh: `n=${n}`, en: `n=${n}` })
    .setBars(dp.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .setAux([{ label: 'dp[k=1]', value: `[${dp.join(',')}]`, role: 'frontier' }])
    .commit();
  const VOWELS = ['a', 'e', 'i', 'o', 'u'];
  const hooks: VowelHooks = {
    onLen: (k, next) => {
      dp = next;
      rec
        .begin({ zh: `k=${k} dp=[${next.join(',')}]`, en: `k=${k} dp=[${next.join(',')}]` })
        .setBars(next.map((v) => ({ value: v, role: 'frontier' as BarRole })))
        .setAux([{ label: `dp[k=${k}]`, value: `[${next.join(',')}]`, role: 'frontier' }])
        .commit();
    },
  };
  const ans = countVowelStrings(n, hooks);
  rec
    .begin({ zh: `总数=${ans}`, en: `Total=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
