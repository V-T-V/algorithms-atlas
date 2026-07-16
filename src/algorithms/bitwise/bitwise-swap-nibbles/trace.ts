// 半字节交换 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole } from '../../../types.ts';
import { swapNibbles, toByteBinary } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const byte = 0b1010_0011; // 高 1010，低 0011 → 交换后 0011_1010

  rec
    .begin({ zh: `输入字节`, en: `Input byte` })
    .setBars(rec.barsFrom(splitByte(byte)))
    .setAux([{ label: `值`, value: toByteBinary(byte) }])
    .commit();

  let low = 0;
  let high = 0;
  swapNibbles(byte, {
    onLowNibble: (l) => (low = l),
    onHighNibble: (h) => (high = h),
  });

  // 高亮低半字节
  const lowRoles: Record<number, BarRole> = {
    0: 'compare',
    1: 'compare',
    2: 'compare',
    3: 'compare',
  };
  rec
    .begin({ zh: `取低 4 位`, en: `Extract low nibble` })
    .setBars(rec.barsFrom(splitByte(byte), lowRoles))
    .setAux([{ label: `低半字节`, value: toByteBinary(low).slice(4) }])
    .commit();

  // 高亮高半字节
  const highRoles: Record<number, BarRole> = {
    4: 'compare',
    5: 'compare',
    6: 'compare',
    7: 'compare',
  };
  rec
    .begin({ zh: `取高 4 位`, en: `Extract high nibble` })
    .setBars(rec.barsFrom(splitByte(byte), highRoles))
    .setAux([{ label: `高半字节`, value: toByteBinary(high).slice(4) }])
    .commit();

  const result = swapNibbles(byte);
  rec
    .begin({ zh: `移位 + 或运算得到结果`, en: `Shift + OR → result` })
    .setBars(rec.barsFrom(splitByte(result)))
    .setAux([
      { label: `原字节`, value: toByteBinary(byte) },
      { label: `结果`, value: toByteBinary(result) },
    ])
    .commit();

  return rec.build();
}

/** 把字节拆成 8 位列表，最低位在 index 0。 */
function splitByte(byte: number): number[] {
  const out: number[] = [];
  let x = byte & 0xff;
  for (let i = 0; i < 8; i++) {
    out.push(x & 1);
    x = x >> 1;
  }
  return out;
}
