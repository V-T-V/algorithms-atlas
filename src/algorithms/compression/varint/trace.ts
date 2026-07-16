// =============================================================================
// varint (LEB128) · 录制帧序列
// setArray 展示已编码字节流（每位 0/1 的 bit 视图太繁琐，直接展示字节值），
// setAux 展示当前数值与其字节分解。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { varintEncode, type VarintHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 300, 16384, 42];

function byteBin(b: number): string {
  return b.toString(2).padStart(8, '0');
}

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const allBytes: number[] = [];

  rec
    .begin({ zh: `编码 ${input.length} 个整数`, en: `Encode ${input.length} integers` })
    .setAux([{ label: '说明', value: 'LEB128: 7 payload bits + 1 continuation', role: 'pivot' }])
    .commit();

  for (const v of input) {
    const perValueBytes: number[] = [];
    const hooks: VarintHooks = {
      onByte: (_value, byte, isLast) => {
        perValueBytes.push(byte);
        allBytes.push(byte);
        const roles: BarRole[] = allBytes.map((b, i) =>
          i < allBytes.length - 1 ? 'final' : isLast ? 'pivot' : 'compare',
        );
        const pointers = [{ index: allBytes.length - 1, label: '新字节' }];
        rec
          .begin({
            zh: `值 ${v}：输出字节 0b${byteBin(byte)}（${isLast ? '结束' : '继续'}）`,
            en: `Value ${v}: byte 0b${byteBin(byte)} (${isLast ? 'last' : 'more'})`,
          })
          .setArray([...allBytes], roles, pointers)
          .setAux([
            { label: '当前值', value: String(v), role: 'pivot' as BarRole },
            {
              label: '已编码字节',
              value: allBytes.map((b) => '0x' + b.toString(16).padStart(2, '0')).join(' '),
              role: 'final' as BarRole,
            },
            {
              label: '二进制',
              value: perValueBytes.map(byteBin).join(' '),
              role: 'compare' as BarRole,
            },
          ])
          .commit();
      },
    };
    varintEncode(v, hooks);
  }

  rec
    .begin({ zh: `完成：共 ${allBytes.length} 字节`, en: `Done: ${allBytes.length} bytes total` })
    .setMap([
      { key: '输入', value: input.join(','), role: 'default' as BarRole },
      {
        key: '编码字节',
        value: allBytes.map((b) => '0x' + b.toString(16).padStart(2, '0')).join(' '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
