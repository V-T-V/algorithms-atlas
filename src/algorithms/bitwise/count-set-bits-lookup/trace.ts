// =============================================================================
// 查表法 Popcount · 录制帧序列
// setArray 展示输入二进制位；setAux 展示当前字节与累计计数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { popcountLookup, toBinaryString, type LookupPopcountHooks } from './impl.ts';

export const DEFAULT_INPUT = 0b10110110_00111010; // 182 + 58 → 5 + 4 = 9

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const binStr = toBinaryString(n);
  const width = Math.max(8, binStr.length);

  const renderBits = (highlightBytes?: Set<number>): void => {
    const padded = toBinaryString(n).padStart(width, '0');
    const values: number[] = [];
    const roles: BarRole[] = [];
    for (let i = 0; i < width; i++) {
      const bit = Number(padded[i]!);
      values.push(bit);
      // 字节边界：高位在前，最后一个字节是低位
      const byteFromHigh = Math.floor(i / 8);
      roles.push(highlightBytes && highlightBytes.has(byteFromHigh) ? 'compare' : 'default');
    }
    rec
      .begin({
        zh: `n = ${n}（二进制 ${padded}）`,
        en: `n = ${n} (binary ${padded})`,
      })
      .setArray(values, roles, [])
      .commit();
  };

  rec
    .begin({
      zh: `目标：查表统计 ${n} 的二进制中 1 的个数`,
      en: `Goal: lookup-table popcount of ${n}`,
    })
    .setAux([
      { label: '输入 n', value: String(n), role: 'pivot' },
      { label: '二进制', value: binStr, role: 'pivot' },
    ])
    .commit();
  renderBits();

  let acc = 0;
  const hooks: LookupPopcountHooks = {
    onByte: (byteIndex, byteValue, count, newAcc) => {
      acc = newAcc;
      // 高亮该字节
      const highlight = new Set<number>();
      highlight.add(byteIndex);
      const byteBin = byteValue.toString(2).padStart(8, '0');
      rec
        .begin({
          zh: `字节[${byteIndex}] = 0b${byteBin}（${count} 个 1），累计 = ${acc}`,
          en: `Byte[${byteIndex}] = 0b${byteBin} (${count} ones), total = ${acc}`,
        })
        .setAux([
          { label: '当前字节', value: `0b${byteBin}`, role: 'compare' },
          { label: '本字节 1 数', value: String(count), role: 'frontier' },
          { label: '累计', value: String(acc), role: 'final' },
        ])
        .commit();
    },
  };

  const total = popcountLookup(n, hooks);

  rec
    .begin({ zh: `完成：共 ${total} 个 1`, en: `Done: ${total} one-bits` })
    .setAux([{ label: 'popcount', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
