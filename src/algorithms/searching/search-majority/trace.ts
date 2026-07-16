import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { majorityElement, type MajorityHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 2, 1, 1, 1, 2, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `数组：[${input.join(',')}]`, en: `Array: [${input.join(',')}]` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: MajorityHooks = {
    onVote: (i, candidate, count) => {
      const roles: BarRole[] = new Array(input.length).fill('default');
      roles[i] = 'compare';
      rec
        .begin({
          zh: `a[${i}]=${input[i]} 候选=${candidate} 计数=${count}`,
          en: `a[${i}]=${input[i]} cand=${candidate} cnt=${count}`,
        })
        .setArray(input, roles, [{ index: i, label: 'i' }])
        .setAux([
          { label: 'cand', value: String(candidate), role: 'pivot' as BarRole },
          { label: 'cnt', value: String(count), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };
  const r = majorityElement(input, hooks);
  rec
    .begin({ zh: `多数元素 = ${r}`, en: `Majority = ${r}` })
    .setAux([{ label: 'majority', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
