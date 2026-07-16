// =============================================================================
// Fletcher-32 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fletcher32, type Fletcher32Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'abcdefgh'.split('').map((c) => c.charCodeAt(0));

export function buildTrace(bytes: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const wordCount = Math.ceil(bytes.length / 2);

  rec
    .begin({
      zh: `对 ${bytes.length} 字节（${wordCount} 个 16 位字）计算 Fletcher-32`,
      en: `Compute Fletcher-32 over ${bytes.length} byte(s) (${wordCount} 16-bit words)`,
    })
    .setArray(bytes.slice(), undefined, [])
    .setAux([
      { label: '初值 s1', value: '0xffff', role: 'pivot' },
      { label: '初值 s2', value: '0xffff', role: 'pivot' },
    ])
    .commit();

  let widx = 0;
  const hooks: Fletcher32Hooks = {
    onWord: (word, s1, s2) => {
      const roles: BarRole[] = bytes.map((_, i) => (i <= widx * 2 + 1 ? 'sorted' : 'default'));
      rec
        .begin({
          zh: `字[${widx}] = 0x${word.toString(16).padStart(4, '0')} → s1=${s1} s2=${s2}`,
          en: `word[${widx}] = 0x${word.toString(16).padStart(4, '0')} → s1=${s1} s2=${s2}`,
        })
        .setArray(bytes.slice(), roles, [{ index: widx * 2, label: 'wlo' }])
        .setAux([
          { label: 's1 (mod 65535)', value: String(s1), role: 'compare' },
          { label: 's2 (mod 65535)', value: String(s2), role: 'compare' },
          { label: '已处理字', value: String(widx + 1) + '/' + wordCount, role: 'frontier' },
        ])
        .commit();
      widx++;
    },
  };

  const result = fletcher32(bytes, hooks);

  rec
    .begin({
      zh: `完成：Fletcher-32 = 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
      en: `Done: Fletcher-32 = 0x${(result >>> 0).toString(16).padStart(8, '0')}`,
    })
    .setAux([
      {
        label: 'Fletcher-32 结果',
        value: '0x' + (result >>> 0).toString(16).padStart(8, '0'),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
