// =============================================================================
// 区间异或 · 录制帧序列
// 用 setArray 渲染区间 [lo,hi] 的每个整数，setAux 展示前缀异或与结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xorRange, xorRangeNaive, toBinaryString, type XorRangeHooks } from './impl.ts';

export const DEFAULT_LO = 3;
export const DEFAULT_HI = 9;

/** 录制演示帧序列。 */
export function buildTrace(lo: number = DEFAULT_LO, hi: number = DEFAULT_HI): Frame[] {
  const rec = new TraceRecorder();
  const values: number[] = [];
  for (let v = lo; v <= hi; v++) values.push(v);
  let result = 0;

  // 用朴素法逐步异或做可视化
  rec
    .begin({
      zh: `计算 [${lo}, ${hi}] 的区间异或`,
      en: `Compute XOR over [${lo}, ${hi}]`,
    })
    .setArray(values, new Array(values.length).fill('frontier'), [])
    .setAux([
      { label: 'lo', value: String(lo), role: 'pivot' },
      { label: 'hi', value: String(hi), role: 'pivot' },
    ])
    .commit();

  let acc = 0;
  values.forEach((v, i) => {
    acc ^= v;
    const roles: BarRole[] = values.map((_, j) => (j <= i ? 'sorted' : 'frontier'));
    roles[i] = 'compare';
    rec
      .begin({
        zh: `累异或 ^ ${v} = ${acc}（${toBinaryString(acc)}）`,
        en: `acc ^= ${v} = ${acc} (${toBinaryString(acc)})`,
      })
      .setArray(values, roles, [{ index: i, label: 'v' }])
      .setAux([{ label: '当前异或', value: String(acc), role: 'compare' }])
      .commit();
  });
  const naive = acc;

  const hooks: XorRangeHooks = {
    onPrefixXor: (n, value) => {
      rec
        .begin({
          zh: `公式：xor(1..${n}) = ${value}（${toBinaryString(value)}）`,
          en: `Formula: xor(1..${n}) = ${value}`,
        })
        .setAux([{ label: `xor(1..${n})`, value: String(value), role: 'pivot' }])
        .commit();
    },
    onDone: (r) => {
      result = r;
      rec
        .begin({
          zh: `O(1) 公式结果 = ${result}（朴素法 = ${naive}，${result === naive ? '一致 ✓' : '不一致 ✗'}）`,
          en: `Formula = ${result} (naive = ${naive})`,
        })
        .setAux([
          { label: '区间异或', value: String(result), role: 'final' },
          { label: '朴素法', value: String(naive), role: 'final' },
        ])
        .commit();
    },
  };
  xorRange(lo, hi, hooks);
  void xorRangeNaive;

  return rec.build();
}
