// =============================================================================
// 子集异或和 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { subsetXorSum, type SubsetXorHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3]; // 子集：0,1,3,1^3=2 → 和 6；OR=3, 2^(2-1)=2 → 3*2=6

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  rec
    .begin({
      zh: `数组 [${input.join(', ')}]，n=${n}，求所有子集异或和之和`,
      en: `nums [${input.join(', ')}], n=${n}`,
    })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: SubsetXorHooks = {
    onBit: (bit, present) => {
      rec
        .begin({
          zh: `位 ${bit}：${present ? '出现过 1，贡献 2^' + bit + ' · 2^' + (n - 1) : '未出现，无贡献'}`,
          en: `Bit ${bit}: ${present ? 'present' : 'absent'}`,
        })
        .setAux([
          {
            label: `位 ${bit}`,
            value: present ? '贡献' : '无',
            role: present ? 'final' : 'default',
          },
        ])
        .commit();
    },
    onDone: (result) => {
      rec
        .begin({ zh: `子集异或和 = ${result}`, en: `Subset XOR sum = ${result}` })
        .setBars([{ value: result, role: 'final' as BarRole }])
        .commit();
    },
  };

  subsetXorSum(input, hooks);

  return rec.build();
}
