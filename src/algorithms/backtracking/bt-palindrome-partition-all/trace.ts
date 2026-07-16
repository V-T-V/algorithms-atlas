// 所有回文分割 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btPalindromePartitionAll, type BtPalindromePartitionAllHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aab';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const codes = Array.from(input).map((c) => c.charCodeAt(0));

  rec
    .begin({ zh: `字符串「${input}」`, en: `String "${input}"` })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [],
    )
    .setAux([{ label: '目标', value: '列出所有回文分割方案', role: 'pivot' }])
    .commit();

  const hooks: BtPalindromePartitionAllHooks = {
    onCut: (start, end, pal) => {
      const roles: BarRole[] = codes.map((_, i) =>
        i >= start && i <= end ? (pal ? 'compare' : 'warn') : 'default',
      );
      rec
        .begin({
          zh: `试切 [${start},${end}]="${input.slice(start, end + 1)}" ${pal ? '回文' : '非回文'}`,
          en: `Cut [${start},${end}]="${input.slice(start, end + 1)}" ${pal ? 'pal' : 'no'}`,
        })
        .setArray([...codes], roles, [{ index: start, label: 's' }])
        .commit();
    },
    onEmit: (parts) => {
      rec
        .begin({ zh: `收集方案 ${parts.join('|')}`, en: `Emit ${parts.join('|')}` })
        .setAux([{ label: '方案', value: parts.join(' | '), role: 'final' }])
        .commit();
    },
  };

  const result = btPalindromePartitionAll(input, hooks);

  rec
    .begin({ zh: `完成：共 ${result.length} 个方案`, en: `Done: ${result.length} schemes` })
    .setAux([
      { label: '方案数', value: String(result.length), role: 'final' },
      { label: '方案', value: result.map((p) => p.join('|')).join(' , '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
