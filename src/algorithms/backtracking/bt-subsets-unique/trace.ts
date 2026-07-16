// 去重子集 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btSubsetsUnique, type BtSubsetsUniqueHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sorted = [...input].sort((a, b) => a - b);
  const count = sorted.length;

  rec
    .begin({
      zh: `数组 ${JSON.stringify(input)}（排序后 ${JSON.stringify(sorted)}）`,
      en: `Array ${JSON.stringify(input)} (sorted ${JSON.stringify(sorted)})`,
    })
    .setBars(rec.barsFrom(sorted.map((v) => v + 0)))
    .setAux([{ label: '目标', value: '枚举所有不重复子集', role: 'pivot' }])
    .commit();

  const hooks: BtSubsetsUniqueHooks = {
    onPick: (index, current) => {
      const roles: BarRole[] = sorted.map((_, i) => (i === index ? 'compare' : 'default'));
      rec
        .begin({
          zh: `选 nums[${index}]=${sorted[index]}`,
          en: `Pick nums[${index}]=${sorted[index]}`,
        })
        .setBars(
          rec.barsFrom(
            sorted.map((v) => v + 0),
            Object.fromEntries(current.map((_, k) => [k, 'frontier'])),
          ),
        )
        .setArray(sorted, roles, [{ index, label: 'i' }])
        .setAux([{ label: '当前路径', value: JSON.stringify(current), role: 'frontier' }])
        .commit();
    },
    onSkip: (index) => {
      const roles: BarRole[] = sorted.map((_, i) => (i === index ? 'warn' : 'default'));
      rec
        .begin({
          zh: `跳过 nums[${index}]=${sorted[index]}（同层重复）`,
          en: `Skip nums[${index}]=${sorted[index]} (dup)`,
        })
        .setArray(sorted, roles, [{ index, label: 'i' }])
        .setAux([
          { label: '同层去重', value: `sorted[${index}]==sorted[${index - 1}]`, role: 'warn' },
        ])
        .commit();
    },
    onEmit: (subset) => {
      rec
        .begin({
          zh: `收集子集 ${JSON.stringify(subset)}`,
          en: `Emit subset ${JSON.stringify(subset)}`,
        })
        .setAux([{ label: '收集', value: JSON.stringify(subset), role: 'final' }])
        .commit();
    },
  };

  const result = btSubsetsUnique(input, hooks);

  rec
    .begin({ zh: `完成：共 ${result.length} 个子集`, en: `Done: ${result.length} subsets` })
    .setAux([
      { label: '子集总数', value: String(result.length), role: 'final' },
      { label: '子集', value: result.map((s) => JSON.stringify(s)).join(' '), role: 'final' },
    ])
    .commit();

  void count;
  return rec.build();
}
