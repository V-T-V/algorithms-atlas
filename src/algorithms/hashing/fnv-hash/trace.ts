// =============================================================================
// FNV-1a 哈希 · 录制帧序列
// 用 setAux 展示每处理一字节后哈希值的演化，以及当前字节。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fnv1a, FNV_OFFSET_BASIS_32, FNV_PRIME_32, type FnvHashHooks } from './impl.ts';

export const DEFAULT_INPUT = 'foobar';

/** 把 number 格式化为 8 位 hex（32 位）。 */
function hex8(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

/** 录制演示帧序列。 */
export function buildTrace(input: string | number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const data = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  const displayInput = typeof input === 'string' ? `"${input}"` : `[${input.join(', ')}]`;

  // 初始帧：展示常量与初始值
  rec
    .begin({
      zh: `输入 ${displayInput}（${data.length} 字节）。offset_basis=${hex8(
        FNV_OFFSET_BASIS_32,
      )}，prime=${FNV_PRIME_32}`,
      en: `Input ${displayInput} (${data.length} bytes). offset_basis=${hex8(
        FNV_OFFSET_BASIS_32,
      )}, prime=${FNV_PRIME_32}`,
    })
    .setAux([
      {
        label: '当前 hash',
        value: hex8(FNV_OFFSET_BASIS_32),
        role: 'frontier' as BarRole,
      },
      { label: '已处理字节', value: '0', role: 'default' as BarRole },
      { label: '字节流', value: data.join(' '), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: FnvHashHooks = {
    onOctet: (i, byte, hash) => {
      rec
        .begin({
          zh: `字节[${i}] = ${byte} (0x${byte
            .toString(16)
            .padStart(2, '0')})：先异或，再乘 prime → hash=${hex8(hash)}`,
          en: `byte[${i}] = ${byte} (0x${byte
            .toString(16)
            .padStart(2, '0')}): XOR then multiply by prime → hash=${hex8(hash)}`,
        })
        .setAux([
          { label: '当前 hash', value: hex8(hash), role: 'final' as BarRole },
          {
            label: '当前字节',
            value: `${byte} (0x${byte.toString(16).padStart(2, '0')})`,
            role: 'pivot' as BarRole,
          },
          {
            label: '已处理字节',
            value: `${i + 1}/${data.length}`,
            role: 'default' as BarRole,
          },
          {
            label: '剩余字节流',
            value: data.slice(i + 1).join(' ') || '∅',
            role: 'compare' as BarRole,
          },
        ])
        .commit();
    },
    onResult: (hash) => {
      rec
        .begin({
          zh: `完成：FNV-1a(${displayInput}) = ${hex8(hash)} (${hash >>> 0})`,
          en: `Done: FNV-1a(${displayInput}) = ${hex8(hash)} (${hash >>> 0})`,
        })
        .setAux([
          { label: '最终 hash', value: hex8(hash), role: 'final' as BarRole },
          {
            label: '十进制',
            value: String(hash >>> 0),
            role: 'default' as BarRole,
          },
          {
            label: '输入',
            value: displayInput,
            role: 'compare' as BarRole,
          },
        ])
        .commit();
    },
  };

  fnv1a(input, hooks);

  return rec.build();
}
