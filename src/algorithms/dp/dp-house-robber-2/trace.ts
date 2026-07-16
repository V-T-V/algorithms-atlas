// =============================================================================
// 打家劫舍 II · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { houseRobber2, type HouseRobber2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 3, 2];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const active = new Set<number>(); // 当前考察范围
  const chosenRange = new Set<number>();
  let curRange: number[] | null = null;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < n; i++) {
      if (chosenRange.has(i)) roles[i] = 'final';
      else if (active.has(i)) roles[i] = 'frontier';
      if (i === 0 && curRange && curRange[1] === n - 2) roles[0] = roles[0] ?? 'frontier';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles))
      .setAux([
        {
          label: '当前范围',
          value: curRange ? `[${curRange[0]}, ${curRange[1]}]` : '∅',
          role: 'frontier',
        },
        { label: '答案', value: ans ? String(ans) : '（计算中）', role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `环形 nums = [${input.join(', ')}]`, en: `Circular nums = [${input.join(', ')}]` });

  const hooks: HouseRobber2Hooks = {
    onRange: (range, total) => {
      active.clear();
      const lo = range[0]!;
      const hi = range[1]!;
      for (let i = lo; i <= hi; i++) active.add(i);
      curRange = range;
      snap({
        zh: `范围 [${range[0]}, ${range[1]}] 最大 = ${total}`,
        en: `Range [${range[0]}, ${range[1]}] max = ${total}`,
      });
    },
    onResult: (t) => {
      ans = t;
      active.clear();
      curRange = null;
      snap({ zh: `环形最大 = ${t}`, en: `Circular max = ${t}` });
    },
  };

  houseRobber2(input, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
