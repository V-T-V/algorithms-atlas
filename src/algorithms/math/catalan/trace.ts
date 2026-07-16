// =============================================================================
// 卡特兰数 · 录制帧序列
// 通过 catalan 的钩子，把递推过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { catalan, type CatalanHooks } from './impl.ts';

export const DEFAULT_INPUT = 8;

/** 录制演示帧序列：计算 C_0 .. C_n。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const values: bigint[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(rec.barsFrom(values.map((v) => Number(v))))
      .commit();
  };

  rec
    .begin({
      zh: `用卷积递推 C_{n+1} = Σ C_i·C_{n-i} 计算 C_0 .. C_${n}`,
      en: `Compute C_0 .. C_${n} via convolution recurrence`,
    })
    .commit();

  const hooks: CatalanHooks = {
    onComputed: (i) => {
      values.push(catalanList[i]!);
      snapshot({ zh: `C_${i} = ${values[i]}`, en: `C_${i} = ${values[i]}` });
    },
  };

  // 先完整计算一次用于钩子内引用（避免闭包时序问题）
  const catalanList = catalan(n, hooks);

  rec
    .begin({ zh: `计算完成：C_${n} = ${catalanList[n]}`, en: `Done: C_${n} = ${catalanList[n]}` })
    .setBars(catalanList.map((v) => ({ value: Number(v), role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
