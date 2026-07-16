import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { robberCircular, type RobHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, 2, 5, 4];

export function buildTrace(nums: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const taken = new Array<boolean>(nums.length).fill(false);
  rec
    .begin({ zh: `${nums.length} 家环形排列`, en: `${nums.length} houses in a circle` })
    .setBars(nums.map((v, i) => ({ value: v, role: 'default' as BarRole, label: String(i) })))
    .commit();
  const hooks: RobHooks = {
    onHouse: (i, robVal, _skipVal) => {
      taken[i] = robVal > _skipVal;
      rec
        .begin({ zh: `考虑第 ${i} 家`, en: `Consider house ${i}` })
        .setBars(
          nums.map((v, j) => ({
            value: v,
            role: (j === i ? 'compare' : taken[j] ? 'sorted' : 'default') as BarRole,
            label: String(j),
          })),
        )
        .commit();
    },
  };
  const ans = robberCircular(nums, hooks);
  rec
    .begin({ zh: `最大金额=${ans}`, en: `Max loot=${ans}` })
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();
  return rec.build();
}
