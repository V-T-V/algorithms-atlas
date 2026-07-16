// =============================================================================
// 格雷码生成 · 录制帧序列
// 用 setBars 展示逐个生成的 n 位格雷码（数值），setAux 显示二进制与单步变化位。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grayCodes, toBinaryString, type GrayCodeHooks } from './impl.ts';

export const DEFAULT_INPUT = 3;

/** 计算两数异或后置 1 的位数（单步变化的位）。 */
function changedBits(a: number, b: number): string {
  if (a === b) return '—';
  const x = a ^ b;
  // 找出唯一变化位（格雷码相邻项恰有 1 位不同）
  let pos = 0;
  let t = x;
  while (t > 1) {
    t >>>= 1;
    pos++;
  }
  return `bit ${pos}`;
}

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const collected: number[] = [];

  rec
    .begin({
      zh: `生成 ${n} 位格雷码（共 ${1 << n} 个）：g(i) = i ^ (i >> 1)，相邻项仅一位不同`,
      en: `Generate ${n}-bit Gray codes (${1 << n} total): g(i) = i ^ (i >> 1), adjacent codes differ by one bit`,
    })
    .setAux([
      { label: '位数 n', value: String(n), role: 'pivot' as BarRole },
      { label: '码数 2ⁿ', value: String(1 << n), role: 'frontier' as BarRole },
      { label: '公式', value: 'g = i ^ (i>>1)', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: GrayCodeHooks = {
    onCode: (i, g, bits) => {
      collected.push(g);
      const prev = collected.length >= 2 ? collected[collected.length - 2]! : g;
      const change = changedBits(prev, g);
      rec
        .begin({
          zh: `i=${i}：g = ${i} ^ ${i >>> 1} = ${g}（${toBinaryString(g, bits)}）${i > 0 ? `，与上一码相差 ${change}` : ''}`,
          en: `i=${i}: g = ${i} ^ ${i >>> 1} = ${g} (${toBinaryString(g, bits)})${i > 0 ? `, differs from previous by ${change}` : ''}`,
        })
        .setBars(
          collected.map((v, idx) => ({
            value: v,
            role: (idx === collected.length - 1 ? 'compare' : 'sorted') as BarRole,
            label: toBinaryString(v, bits),
          })),
        )
        .setAux([
          { label: '当前 i', value: String(i), role: 'pivot' as BarRole },
          { label: 'i >> 1', value: String(i >>> 1), role: 'compare' as BarRole },
          { label: '格雷码 g', value: toBinaryString(g, bits), role: 'final' as BarRole },
          { label: '十进制', value: String(g), role: 'default' as BarRole },
          ...(i > 0 ? [{ label: '变化位', value: change, role: 'frontier' as const }] : []),
        ])
        .commit();
    },
  };

  grayCodes(n, hooks);

  // 终态：完整序列
  const allCodes = grayCodes(n);
  rec
    .begin({
      zh: `完成。${n} 位格雷码序列：${allCodes.map((c) => toBinaryString(c, n)).join(', ')}`,
      en: `Done. ${n}-bit Gray code sequence: ${allCodes.map((c) => toBinaryString(c, n)).join(', ')}`,
    })
    .setBars(
      allCodes.map((v) => ({
        value: v,
        role: 'sorted' as BarRole,
        label: toBinaryString(v, n),
      })),
    )
    .setAux([
      { label: '码数', value: String(allCodes.length), role: 'final' as BarRole },
      { label: '位数', value: String(n), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
