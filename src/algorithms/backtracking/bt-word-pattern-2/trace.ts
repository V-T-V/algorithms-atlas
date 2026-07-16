// 单词模式 II · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btWordPattern2, type BtWordPattern2Hooks } from './impl.ts';

export const DEFAULT_INPUT = { pattern: 'abab', str: 'redblueredblue' };

export function buildTrace(input: { pattern: string; str: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { pattern, str } = input;
  const codes = Array.from(str).map((c) => c.charCodeAt(0) % 100);

  rec
    .begin({ zh: `模式「${pattern}」 串「${str}」`, en: `pattern "${pattern}" str "${str}"` })
    .setBars(rec.barsFrom(codes))
    .setAux([{ label: '目标', value: '双射匹配', role: 'pivot' }])
    .commit();

  const hooks: BtWordPattern2Hooks = {
    onMap: (ch, substr) => {
      rec
        .begin({ zh: `${ch} → "${substr}"`, en: `${ch} -> "${substr}"` })
        .setAux([
          { label: '字母', value: ch, role: 'compare' },
          { label: '子串', value: substr, role: 'frontier' },
        ])
        .commit();
    },
    onMatch: () => {
      rec
        .begin({ zh: '匹配成功', en: 'Matched' })
        .setAux([{ label: '结果', value: 'true', role: 'final' }])
        .commit();
    },
  };

  const ok = btWordPattern2(pattern, str, hooks);

  void ok;
  rec
    .begin({ zh: `完成：${ok ? '可匹配' : '不可匹配'}`, en: `Done: ${ok ? 'match' : 'no match'}` })
    .setAux([{ label: '结果', value: String(ok), role: 'final' }])
    .commit();

  return rec.build();
}
