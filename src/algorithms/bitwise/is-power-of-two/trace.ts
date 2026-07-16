// =============================================================================
// 判断 2 的幂 · 录制帧序列
// 可视化：setAux 展示 n / n-1 / n&(n-1) 的二进制与判断结论。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPowerOfTwo, toBinaryArray, type IsPowerOfTwoHooks } from './impl.ts';

export const DEFAULT_INPUT = 8; // 1000 → 是 2 的幂

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const width = n <= 0xffff ? 16 : 32;
  let curBits: number[] = [];

  const renderBits = (
    label: string,
    value: number,
    role: BarRole,
    note: { zh: string; en: string },
  ): void => {
    const bits = toBinaryArray(value < 0 ? value >>> 0 : value, width);
    curBits = bits;
    rec
      .begin(note)
      .setArray(
        bits,
        bits.map((b) => (b === 1 ? 'frontier' : 'default') as BarRole),
        [],
      )
      .setAux([
        { label, value: String(value), role },
        { label: '二进制', value: bits.join(''), role: 'pivot' },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `判断 ${n} 是否为 2 的幂`,
      en: `Check whether ${n} is a power of two`,
    })
    .setAux([
      { label: '输入 n', value: String(n), role: 'pivot' },
      { label: '二进制', value: toBinaryArray(n < 0 ? n >>> 0 : n, width).join(''), role: 'pivot' },
    ])
    .commit();

  const hooks: IsPowerOfTwoHooks = {
    onBinary: (v, bits) => {
      curBits = bits;
      renderBits('n', v, 'pivot', {
        zh: `n = ${v}，二进制 ${bits.join('')}`,
        en: `n = ${v}, binary ${bits.join('')}`,
      });
    },
    onMinusOne: (_v, minusOne, bits) => {
      renderBits('n - 1', minusOne, 'compare', {
        zh: `n - 1 = ${minusOne}，二进制 ${bits.join('')}`,
        en: `n - 1 = ${minusOne}, binary ${bits.join('')}`,
      });
    },
    onAnd: (andResult, bits) => {
      renderBits('n & (n-1)', andResult, 'swap', {
        zh: `n & (n - 1) = ${andResult}，二进制 ${bits.join('')}`,
        en: `n & (n - 1) = ${andResult}, binary ${bits.join('')}`,
      });
    },
    onResult: (v, isPow2) => {
      rec
        .begin({
          zh: isPow2
            ? `n & (n-1) === 0，且 n > 0 → ${v} 是 2 的幂`
            : `${v} 不是 2 的幂（n <= 0 或 n & (n-1) !== 0）`,
          en: isPow2
            ? `n & (n-1) === 0 and n > 0 → ${v} is a power of two`
            : `${v} is not a power of two (n <= 0 or n & (n-1) !== 0)`,
        })
        .setArray(
          curBits,
          curBits.map((b) => (b === 1 ? 'final' : 'default') as BarRole),
          [],
        )
        .setAux([
          { label: '结论', value: isPow2 ? '是 2 的幂' : '不是 2 的幂', role: 'final' },
          { label: 'n & (n-1)', value: isPow2 ? '0' : '≠ 0', role: 'final' },
        ])
        .commit();
    },
  };

  const result = isPowerOfTwo(n, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：${n} ${result ? '是' : '不是'} 2 的幂`,
      en: `Done: ${n} is ${result ? '' : 'not '}a power of two`,
    })
    .setAux([{ label: 'isPowerOfTwo', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
