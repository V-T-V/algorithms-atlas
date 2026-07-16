// 划分字母区间 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyPartitionLabels, type GreedyPartitionLabelsHooks } from './impl.ts';

export const DEFAULT_INPUT = 'ababcbacadefegdehijhklij';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const last = new Map<string, number>();
  for (let i = 0; i < input.length; i++) last.set(input[i]!, i);

  rec
    .begin({ zh: `字符串长度 ${input.length}`, en: `String length ${input.length}` })
    .setBars(
      input.split('').map((ch) => ({
        value: last.get(ch)!,
        role: 'default' as BarRole,
      })),
    )
    .setAux([{ label: '说明', value: '柱高 = 该字母最后出现下标', role: 'pivot' }])
    .commit();

  const hooks: GreedyPartitionLabelsHooks = {
    onExtend: (right, ch) => {
      rec
        .begin({ zh: `见 ${ch} → 右端延至 ${right}`, en: `See ${ch} → extend right to ${right}` })
        .setAux([{ label: 'right', value: String(right), role: 'pivot' }])
        .commit();
    },
    onCut: (start, end, size) => {
      rec
        .begin({
          zh: `切分 [${start},${end}] 长度 ${size}`,
          en: `Cut [${start},${end}] size ${size}`,
        })
        .setBars(
          input.split('').map((_, i) => ({
            value: 1,
            role: (i >= start && i <= end ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
  };

  const sizes = greedyPartitionLabels(input, hooks);

  rec
    .begin({ zh: `完成：${sizes.length} 段`, en: `Done: ${sizes.length} parts` })
    .setBars(sizes.map((s) => ({ value: s, role: 'final' as BarRole })))
    .setAux([{ label: '段长', value: sizes.join(','), role: 'final' }])
    .commit();

  return rec.build();
}
