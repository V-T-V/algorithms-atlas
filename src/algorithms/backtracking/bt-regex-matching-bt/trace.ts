// 正则匹配回溯 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btRegexMatching, type BtRegexHooks } from './impl.ts';

export const DEFAULT_INPUT = { s: 'aa', p: 'a*' };

export function buildTrace(input: { s: string; p: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s, p } = input;

  rec
    .begin({ zh: `s="${s}" p="${p}"`, en: `s="${s}" p="${p}"` })
    .setAux([{ label: '目标', value: '正则匹配 . 与 *', role: 'pivot' }])
    .commit();

  const hooks: BtRegexHooks = {
    onMatch: (i, jj) => {
      rec
        .begin({
          zh: `单字符匹配 s[${i}]="${s[i] ?? ''}" 与 p[${jj}]="${p[jj]}"`,
          en: `match s[${i}]="${s[i] ?? ''}" p[${jj}]="${p[jj]}"`,
        })
        .setAux([
          { label: 'i', value: String(i), role: 'compare' },
          { label: 'j', value: String(jj), role: 'compare' },
        ])
        .commit();
    },
    onStar: (i, jj) => {
      rec
        .begin({ zh: `x* @(${i},${jj}) 分支：丢/留`, en: `x* @(${i},${jj}) branch` })
        .setAux([
          { label: 'i', value: String(i), role: 'warn' },
          { label: 'j', value: String(jj), role: 'warn' },
        ])
        .commit();
    },
  };

  const ok = btRegexMatching(s, p, hooks);
  void ('final' as BarRole);

  rec
    .begin({ zh: `完成：${ok}`, en: `Done: ${ok}` })
    .setAux([{ label: '结果', value: String(ok), role: 'final' }])
    .commit();

  return rec.build();
}
