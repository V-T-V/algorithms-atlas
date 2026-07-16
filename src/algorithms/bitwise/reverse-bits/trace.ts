// =============================================================================
// 反转位 · 录制帧序列
// 可视化：setArray 渲染二进制位（width 位），pointers 标当前读取/写入位；
// setAux 展示当前 n / result。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reverseBits, toBinaryArray, type ReverseBitsHooks } from './impl.ts';

export const DEFAULT_INPUT = 22; // 00010110 → 01101000 = 104
export const DEFAULT_WIDTH = 8;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT, width: number = DEFAULT_WIDTH): Frame[] {
  const rec = new TraceRecorder();
  let result = 0;
  let readBitIndex = -1; // 当前从 n 读取的低位下标
  let writtenBits: number[] = []; // 已写入 result 的高位（左起）

  const render = (
    note: { zh: string; en: string },
    rolesOverride?: { readIdx?: number; writeIdx?: number },
  ): void => {
    // 上方：n 的位（高位在前），指针标读取位
    const nBits = toBinaryArray(n, width);
    const nRoles: BarRole[] = nBits.map((b) => (b === 1 ? 'frontier' : 'default'));
    const ri = rolesOverride?.readIdx ?? readBitIndex;
    const nPointers: Array<{ index: number; label: string }> = [];
    if (ri >= 0) {
      nPointers.push({ index: width - 1 - ri, label: '读' });
      nRoles[width - 1 - ri] = 'compare';
    }
    rec
      .begin(note)
      .setArray(nBits, nRoles, nPointers)
      .setAux([
        { label: 'n', value: `${n} (二进制 ${nBits.join('')})`, role: 'pivot' },
        {
          label: 'result',
          value: `${result} (二进制 ${toBinaryArray(result, width).join('')})`,
          role: 'final',
        },
        {
          label: '已写入',
          value: writtenBits.length === 0 ? '空' : writtenBits.join(''),
          role: 'frontier',
        },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `反转 ${n}（${width} 位，二进制 ${toBinaryArray(n, width).join('')}）的位顺序`,
      en: `Reverse the bits of ${n} (${width}-bit, binary ${toBinaryArray(n, width).join('')})`,
    })
    .setArray(
      toBinaryArray(n, width),
      toBinaryArray(n, width).map((b) => (b === 1 ? 'frontier' : 'default') as BarRole),
      [],
    )
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' },
      { label: '位宽', value: String(width) },
      { label: 'result', value: '0', role: 'final' },
    ])
    .commit();

  const hooks: ReverseBitsHooks = {
    onReadBit: (i, bit) => {
      readBitIndex = i;
      render({
        zh: `读取 n 的第 ${i} 位（自右起）= ${bit}`,
        en: `Read bit ${i} of n (from LSB) = ${bit}`,
      });
    },
    onAccumulate: (res, _bitIndex) => {
      result = res & ((1 << width) - 1);
      writtenBits = toBinaryArray(result, width).slice(width - (_bitIndex + 1));
      render({
        zh: `result = (result << 1) | ${_bitIndex >= 0 ? (n >>> _bitIndex) & 1 : 0} → ${result}`,
        en: `result = (result << 1) | bit → ${result}`,
      });
    },
    onResult: (res) => {
      result = res;
      writtenBits = toBinaryArray(res, width);
      rec
        .begin({
          zh: `完成：反转后 = ${res}（二进制 ${toBinaryArray(res, width).join('')}）`,
          en: `Done: reversed = ${res} (binary ${toBinaryArray(res, width).join('')})`,
        })
        .setArray(
          toBinaryArray(res, width),
          toBinaryArray(res, width).map((b) => (b === 1 ? 'final' : 'default') as BarRole),
          [],
        )
        .setAux([
          { label: 'n (原)', value: `${n} (${toBinaryArray(n, width).join('')})`, role: 'default' },
          {
            label: 'result',
            value: `${res} (${toBinaryArray(res, width).join('')})`,
            role: 'final',
          },
        ])
        .commit();
    },
  };

  reverseBits(n, width, hooks);

  return rec.build();
}
