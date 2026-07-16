// 递归反转字符串 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reverseString, type ReverseStringHooks } from './impl.ts';

export const DEFAULT_INPUT = 'recursion';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const s = input;
  const n = s.length;
  const values = Array.from(s).map((ch) => ch.codePointAt(0)!);
  const labels = Array.from(s);
  const roles: BarRole[] = new Array(n).fill('default');
  let stackDepth = 0;
  let resultStr = s;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray([...values], [...roles], [])
      .setAux([
        { label: '输入', value: `"${labels.join('')}"`, role: 'pivot' as BarRole },
        { label: '当前栈深', value: String(stackDepth), role: 'compare' as BarRole },
        { label: '长度', value: String(n), role: 'frontier' as BarRole },
      ])
      .commit();
  };

  render({ zh: `反转 "${labels.join('')}"`, en: `Reverse "${labels.join('')}"` });

  const hooks: ReverseStringHooks = {
    onRecurse: (sub, depth) => {
      stackDepth = depth + 1;
      roles.forEach((_, i) => {
        roles[i] = i < n - sub.length ? 'sorted' : 'default';
      });
      render({ zh: `reverse("${sub}")`, en: `reverse("${sub}")` });
    },
    onBase: () => {
      render({ zh: `空串基例`, en: `Empty string base case` });
    },
    onCombine: (first, restReversed, result, depth) => {
      stackDepth = depth;
      // 标记已被处理的字符
      render({
        zh: `合并：reverse("${restReversed}") + "${first}" = "${result}"`,
        en: `Combine: reverse("${restReversed}") + "${first}" = "${result}"`,
      });
    },
  };

  resultStr = reverseString(s, hooks);

  // 终态：显示反转后
  const reversedValues = Array.from(resultStr).map((ch) => ch.codePointAt(0)!);
  const reversedLabels = Array.from(resultStr);
  rec
    .begin({
      zh: `"${labels.join('')}" → "${reversedLabels.join('')}"`,
      en: `"${labels.join('')}" → "${reversedLabels.join('')}"`,
    })
    .setArray(
      [...reversedValues],
      reversedValues.map(() => 'final' as BarRole),
      [],
    )
    .setAux([{ label: '结果', value: `"${reversedLabels.join('')}"`, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
