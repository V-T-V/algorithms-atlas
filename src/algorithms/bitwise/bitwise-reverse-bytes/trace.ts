// 按字节反转位序 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole } from '../../../types.ts';
import { reverseBitsByBytes, toBinaryString } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const value = 0b00000001_00000011_00000111_00001111; // 低字节 0x0F → 高字节 0x01
  const numBytes = 4;
  const width = numBytes * 8;

  rec
    .begin({ zh: `输入 32 位值`, en: `Input 32-bit value` })
    .setBars(rec.barsFrom(splitBits(value, width)))
    .setAux([{ label: '值', value: toBinaryString(value, width) }])
    .commit();

  const byteFrames = new Array<{ byteIndex: number; original: number; reversed: number }>();
  reverseBitsByBytes(value, numBytes, {
    onByte: (byteIndex, original, reversed) => {
      byteFrames.push({ byteIndex, original, reversed });
    },
  });

  // 展示每个字节的查表反转
  for (const f of byteFrames) {
    const masked = value & (0xffffffff >>> 0);
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < width; i++) {
      const byteIdx = (i / 8) | 0;
      if (byteIdx === f.byteIndex) roles[i] = 'compare';
    }
    rec
      .begin({ zh: `取第 ${f.byteIndex} 字节`, en: `Read byte ${f.byteIndex}` })
      .setBars(rec.barsFrom(splitBits(masked, width), roles))
      .setAux([
        { label: '原字节', value: toBinaryString(f.original, 8) },
        { label: '查表反转', value: toBinaryString(f.reversed, 8) },
      ])
      .commit();
  }

  const result = reverseBitsByBytes(value, numBytes);
  rec
    .begin({ zh: `拼接完成`, en: `Concatenation done` })
    .setBars(rec.barsFrom(splitBits(result, width)))
    .setAux([
      { label: '原始', value: toBinaryString(value >>> 0, width) },
      { label: '结果', value: toBinaryString(result, width) },
    ])
    .commit();

  return rec.build();
}

/** 把整数拆成定宽位列表，最低位在 index 0。 */
function splitBits(n: number, width: number): number[] {
  const out: number[] = [];
  let x = n >>> 0;
  for (let i = 0; i < width; i++) {
    out.push(x & 1);
    x = x >>> 1;
  }
  return out;
}
