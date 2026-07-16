// 通配符匹配回溯 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btWildcardMatching, type BtWildcardHooks } from './impl.ts';

export const DEFAULT_INPUT = { s: 'aa', p: '*' };

export function buildTrace(input: { s: string; p: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s, p } = input;

  rec
    .begin({ zh: `s="${s}" p="${p}"`, en: `s="${s}" p="${p}"` })
    .setAux([{ label: '目标', value: '通配符匹配', role: 'pivot' }])
    .commit();

  const hooks: BtWildcardHooks = {
    onStep: (i, jj) => {
      rec
        .begin({
          zh: `匹配 s[${i}]="${s[i]}" 与 p[${jj}]="${p[jj]}"`,
          en: `match s[${i}]="${s[i]}" p[${jj}]="${p[jj]}"`,
        })
        .setAux([
          { label: 'i', value: String(i), role: 'compare' },
          { label: 'j', value: String(jj), role: 'compare' },
        ])
        .commit();
    },
    onStar: (jj) => {
      rec
        .begin({ zh: `遇到 * @${jj}，先匹配 0`, en: `Star @${jj}, match 0` })
        .setAux([{ label: '星号', value: String(jj), role: 'warn' }])
        .commit();
    },
    onBack: (i, jj) => {
      rec
        .begin({ zh: `回退到 *，多消费一个，i=${i}`, en: `Back to star, i=${i}` })
        .setAux([
          { label: 'i', value: String(i), role: 'warn' },
          { label: 'j', value: String(jj), role: 'compare' },
        ])
        .commit();
    },
  };

  const ok = btWildcardMatching(s, p, hooks);
  void ('final' as BarRole);

  rec
    .begin({ zh: `完成：${ok}`, en: `Done: ${ok}` })
    .setAux([{ label: '结果', value: String(ok), role: 'final' }])
    .commit();

  return rec.build();
}
