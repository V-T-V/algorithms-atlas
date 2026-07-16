// =============================================================================
// CRC32 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crc32, type Crc32Hooks } from './impl.ts';

export const DEFAULT_INPUT = '123456789'.split('').map((c) => c.charCodeAt(0));

function hex32(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(bytes: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `对 ${bytes.length} 个字节计算 CRC32（多项式 0xEDB88320）`,
      en: `Compute CRC32 over ${bytes.length} byte(s) (poly 0xEDB88320)`,
    })
    .setArray(bytes.slice(), undefined, [])
    .setAux([
      { label: '初值 crc', value: '0xffffffff', role: 'pivot' },
      { label: '字节数', value: String(bytes.length), role: 'frontier' },
    ])
    .commit();

  let idx = 0;
  const hooks: Crc32Hooks = {
    onByte: (bv, crc) => {
      const roles: BarRole[] = bytes.map((_, i) => (i <= idx ? 'sorted' : 'default'));
      rec
        .begin({
          zh: `字节[${idx}] = 0x${bv.toString(16).padStart(2, '0')} → crc = ${hex32(crc)}`,
          en: `byte[${idx}] = 0x${bv.toString(16).padStart(2, '0')} → crc = ${hex32(crc)}`,
        })
        .setArray(bytes.slice(), roles, [{ index: idx, label: 'cur' }])
        .setAux([
          { label: '当前 crc', value: hex32(crc), role: 'compare' },
          { label: '已处理', value: String(idx + 1) + '/' + bytes.length, role: 'frontier' },
        ])
        .commit();
      idx++;
    },
  };

  const result = crc32(bytes, hooks);

  rec
    .begin({ zh: `完成：CRC32 = ${hex32(result)}`, en: `Done: CRC32 = ${hex32(result)}` })
    .setAux([{ label: 'CRC32 结果', value: hex32(result), role: 'final' }])
    .commit();

  return rec.build();
}
