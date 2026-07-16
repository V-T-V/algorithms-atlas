// =============================================================================
// Pearson 哈希 · 录制帧序列
// 用 setArray 展示逐字节 (h = T[h ^ b]) 的演化；setAux 显示 h/T[i]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pearson8, getTable, type PearsonHooks } from './impl.ts';

export const DEFAULT_INPUT = 'hello';

function hex2(n: number): string {
  return '0x' + (n & 0xff).toString(16).padStart(2, '0');
}

/** 录制演示帧序列。 */
export function buildTrace(input: string | number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const data = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  const displayInput = typeof input === 'string' ? `"${input}"` : `[${input.join(', ')}]`;
  const T = getTable();

  rec
    .begin({
      zh: `输入 ${displayInput}（${data.length} 字节）。256 字节置换表 T，h 初值 0。逐字节执行 h = T[h ^ b]`,
      en: `Input ${displayInput} (${data.length} bytes). 256-byte permutation T, h starts at 0. Per byte: h = T[h ^ b]`,
    })
    .setAux([
      { label: '当前 h', value: '0x00', role: 'pivot' as BarRole },
      { label: '字节数', value: String(data.length), role: 'default' as BarRole },
      { label: '表大小', value: '256', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: PearsonHooks = {
    onByte: (i, b, prevH, h) => {
      const idx = (prevH ^ b) & 0xff;
      const roles: BarRole[] = data.map((_, j) =>
        j < i ? 'sorted' : j === i ? 'compare' : 'default',
      );
      rec
        .begin({
          zh: `字节[${i}]=${hex2(b)}：h ^ b = ${hex2(prevH)} ^ ${hex2(b)} = ${hex2(idx)} → T[${hex2(idx)}] = ${hex2(h)}`,
          en: `byte[${i}]=${hex2(b)}: h ^ b = ${hex2(prevH)} ^ ${hex2(b)} = ${hex2(idx)} → T[${hex2(idx)}] = ${hex2(h)}`,
        })
        .setArray(data, roles, [{ index: i, label: 'b' }])
        .setAux([
          { label: '当前 h', value: hex2(h), role: 'final' as BarRole },
          { label: '上一 h', value: hex2(prevH), role: 'compare' as BarRole },
          { label: '输入字节', value: hex2(b), role: 'pivot' as BarRole },
          { label: 'T 索引', value: hex2(idx), role: 'compare' as BarRole },
          { label: '进度', value: `${i + 1}/${data.length}`, role: 'default' as BarRole },
        ])
        .commit();
    },
    onResult: (h) => {
      rec
        .begin({
          zh: `最终 8 位 Pearson 哈希 = ${hex2(h)} (${h})`,
          en: `Final 8-bit Pearson hash = ${hex2(h)} (${h})`,
        })
        .setArray(
          data,
          data.map(() => 'sorted' as BarRole),
          [],
        )
        .setAux([
          { label: '最终 hash', value: hex2(h), role: 'final' as BarRole },
          { label: '十进制', value: String(h), role: 'default' as BarRole },
          { label: '输入', value: displayInput, role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  void T;
  pearson8(input, 0, hooks);

  return rec.build();
}
