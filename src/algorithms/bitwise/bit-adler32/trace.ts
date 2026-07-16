// =============================================================================
// Adler-32 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adler32, type Adler32Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'Wikipedia'.split('').map((c) => c.charCodeAt(0));

export function buildTrace(bytes: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `对 ${bytes.length} 个字节计算 Adler-32（模 65521）`,
      en: `Compute Adler-32 over ${bytes.length} byte(s) (mod 65521)`,
    })
    .setArray(bytes.slice(), undefined, [])
    .setAux([
      { label: '初值 s1', value: '1', role: 'pivot' },
      { label: '初值 s2', value: '0', role: 'pivot' },
    ])
    .commit();

  let idx = 0;
  const hooks: Adler32Hooks = {
    onByte: (bv, s1, s2) => {
      const roles: BarRole[] = bytes.map((_, i) => (i <= idx ? 'sorted' : 'default'));
      rec
        .begin({
          zh: `字节[${idx}] = ${bv} → s1=${s1} s2=${s2}`,
          en: `byte[${idx}] = ${bv} → s1=${s1} s2=${s2}`,
        })
        .setArray(bytes.slice(), roles, [{ index: idx, label: 'cur' }])
        .setAux([
          { label: 's1 (mod 65521)', value: String(s1), role: 'compare' },
          { label: 's2 (mod 65521)', value: String(s2), role: 'compare' },
          { label: '已处理', value: String(idx + 1) + '/' + bytes.length, role: 'frontier' },
        ])
        .commit();
      idx++;
    },
  };

  const result = adler32(bytes, hooks);

  rec
    .begin({
      zh: `完成：Adler-32 = 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
      en: `Done: Adler-32 = 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
    })
    .setAux([
      {
        label: 'Adler-32 结果',
        value: '0x' + (result >>> 0).toString(16).padStart(8, '0'),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
