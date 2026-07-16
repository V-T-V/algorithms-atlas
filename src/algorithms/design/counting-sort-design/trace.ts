// =============================================================================
// 计数排序 · 录制帧序列
// 用 setAux 展示 count 数组、setBars 展示输出。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countingSort, type CountingSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 2, 8, 3, 3, 1];

interface TraceOptions {
  arr: number[];
}

export function buildTrace(input: Partial<TraceOptions> = {}): Frame[] {
  const arr = input.arr ?? DEFAULT_INPUT;
  const rec = new TraceRecorder();
  let counts: number[] = [];
  let output: number[] = new Array(arr.length).fill(0);
  let phase = 'init';

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        {
          label: 'count 数组',
          value: `[${counts.join(', ')}]`,
          role: 'pivot' as BarRole,
        },
        {
          label: '阶段',
          value: phase,
          role: 'compare' as BarRole,
        },
        {
          label: '输出',
          value: `[${output.map((v) => (v === 0 ? '_' : v)).join(', ')}]`,
          role: 'final' as BarRole,
        },
      ])
      .setBars(
        (output.some((v) => v !== 0) ? output.map((v) => (v === 0 ? 0.1 : v)) : arr).map(
          (v, i) => ({
            value: v,
            role: (phase === 'done'
              ? 'sorted'
              : i < output.length && output[i] !== 0
                ? 'final'
                : 'default') as BarRole,
            label: String(v),
          }),
        ),
      )
      .commit();
  };

  render({ zh: `初始化：输入 [${arr.join(', ')}]`, en: `Init: input [${arr.join(', ')}]` });

  const hooks: CountingSortHooks = {
    onCount: (v, c) => {
      counts = [...c];
      phase = '1.计数';
      render({ zh: `值 ${v} 计数 +1`, en: `Count value ${v} +1` });
    },
    onPrefixSum: (c) => {
      counts = [...c];
      phase = '2.前缀和';
      render({
        zh: `count 做前缀和（值 v 的末位 = count[v]）`,
        en: `Prefix-sum count (v's last pos = count[v])`,
      });
    },
    onPlace: (ii, v, pos, out) => {
      output = [...out];
      phase = '3.回填';
      render({ zh: `a[${ii}]=${v} → out[${pos}]`, en: `a[${ii}]=${v} → out[${pos}]` });
    },
    onDone: (out) => {
      output = [...out];
      phase = 'done';
      render({
        zh: `完成：稳定排序结果 [${out.join(', ')}]`,
        en: `Done: stable sorted [${out.join(', ')}]`,
      });
    },
  };

  countingSort(arr, undefined, hooks);

  rec
    .begin({ zh: `完成：[${output.join(', ')}]`, en: `Done: [${output.join(', ')}]` })
    .setBars(output.map((v) => ({ value: v, role: 'sorted' as BarRole, label: String(v) })))
    .setAux([{ label: '结果', value: `[${output.join(', ')}]`, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
