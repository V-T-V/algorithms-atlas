// =============================================================================
// 去除重复字母 · 录制帧序列
// 可视化：setArray 渲染栈（字符 ASCII 为值）；setAux 展示处理进度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { removeDuplicateLetters, type RemoveDuplicateLettersHooks } from './impl.ts';

export const DEFAULT_INPUT = 'bcabc';

const toValues = (arr: string[]): number[] => arr.map((c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const stack: string[] = [];

  rec
    .begin({
      zh: `去除重复字母 "${input}"，字典序最小且保序`,
      en: `Remove duplicate letters from "${input}", min lex order`,
    })
    .setArray([0], ['default'], [])
    .setAux([{ label: '原串', value: input, role: 'default' }])
    .commit();

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(
        toValues(stack),
        stack.map(() => 'pivot' as BarRole),
        [],
      )
      .setAux([{ label: '栈内容', value: stack.join('') || '·', role: 'pivot' }])
      .commit();
  };

  const hooks: RemoveDuplicateLettersHooks = {
    onPush: (ch, s) => {
      stack.length = 0;
      stack.push(...s);
      render({ zh: `入栈 '${ch}'`, en: `Push '${ch}'` });
    },
    onPop: (ch, s) => {
      stack.length = 0;
      stack.push(...s);
      render({ zh: `弹出 '${ch}'（之后还会出现）`, en: `Pop '${ch}' (appears later)` });
    },
    onSkip: (ch) => {
      render({ zh: `跳过重复 '${ch}'`, en: `Skip duplicate '${ch}'` });
    },
  };

  const result = removeDuplicateLetters(input, hooks);

  rec
    .begin({ zh: `完成：${result.value}`, en: `Done: ${result.value}` })
    .setArray(
      toValues([...result.value]),
      [...result.value].map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: '原串', value: input, role: 'default' },
      { label: '结果', value: result.value, role: 'final' },
    ])
    .commit();

  return rec.build();
}
