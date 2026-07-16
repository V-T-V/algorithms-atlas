// =============================================================================
// 计数较小数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countSmaller, type CountSmallerHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 6, 1];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const merges: Array<{ idx: number; inc: number }> = [];

  rec
    .begin({
      zh: `输入 [${input.join(',')}]，统计每个右侧较小数`,
      en: `Input [${input.join(',')}], count smaller on right`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();

  const hooks: CountSmallerHooks = {
    onMerge: (idx, _rightIdx, inc) => merges.push({ idx, inc }),
  };

  const result = countSmaller(input, hooks);

  // 展示部分合并事件
  const show = merges.slice(0, 10);
  for (let i = 0; i < show.length; i++) {
    const m = show[i]!;
    rec
      .begin({
        zh: `合并事件：下标 ${m.idx} 的计数 +${m.inc}`,
        en: `Merge event: index ${m.idx} count += ${m.inc}`,
      })
      .setAux([
        { label: '元素下标', value: String(m.idx), role: 'compare' as BarRole },
        { label: '增量', value: String(m.inc), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `结果：[${result.join(',')}]`,
      en: `Result: [${result.join(',')}]`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      result.map((c, i) => ({ index: i, label: String(c) })),
    )
    .setAux(
      result.map((c, i) => ({
        label: `i${i}=${input[i]}`,
        value: `cnt=${c}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
