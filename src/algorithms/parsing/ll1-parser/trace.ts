// =============================================================================
// LL(1) 预测分析 · 录制帧序列
// 用 setAux 展示分析表（栈 / 剩余输入 / 动作）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ll1Parse, type LL1Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'aabb';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const log: Array<{ stack: string; input: string; action: string }> = [];

  rec
    .begin({
      zh: `LL(1) 分析输入 "${input}$"。文法：S → aSb | ε`,
      en: `LL(1) parse of "${input}$". Grammar: S → aSb | ε`,
    })
    .setAux([
      { label: '文法', value: 'S → a S b | ε', role: 'compare' as BarRole },
      { label: '起始符', value: 'S', role: 'pivot' as BarRole },
      { label: '输入', value: input + '$', role: 'frontier' as BarRole },
    ])
    .commit();

  const hooks: LL1Hooks = {
    onStep: (stack, inputSyms, action) => {
      const stackTop = stack.length ? stack.join(' ') : '∅';
      log.push({ stack: stackTop, input: inputSyms.join(''), action });
      rec
        .begin({ zh: action, en: action })
        .setAux([
          { label: '栈（左=底 右=顶）', value: stackTop, role: 'pivot' as BarRole },
          { label: '剩余输入', value: inputSyms.join(''), role: 'compare' as BarRole },
          { label: '动作', value: action, role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  const result = ll1Parse(input, hooks);

  // 终态：汇总表
  rec
    .begin({
      zh: result.accepted ? `接受："${input}" ∈ L(S)` : `拒绝："${input}" ∉ L(S)`,
      en: result.accepted ? `Accept: "${input}" ∈ L(S)` : `Reject: "${input}" ∉ L(S)`,
    })
    .setAux([
      {
        label: '结果',
        value: result.accepted ? 'ACCEPT' : 'REJECT',
        role: (result.accepted ? 'final' : 'warn') as BarRole,
      },
      { label: '总步数', value: String(result.steps.length), role: 'default' as BarRole },
      { label: '输入', value: input, role: 'compare' as BarRole },
    ])
    .commit();

  void log;
  return rec.build();
}
