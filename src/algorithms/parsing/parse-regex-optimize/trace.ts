// =============================================================================
// 正则 AST 优化 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parseRegex, serializeRegex } from '../parse-regex-ast/impl.ts';
import { optimizeRegex, countRules, type OptimizeHooks } from './impl.ts';

export const DEFAULT_INPUT = '(a|b)*|ε';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const ast = parseRegex(input);

  rec
    .begin({
      zh: `原正则 "${input}"（AST 节点 ${countRules(ast)} 个）。开始迭代化简。`,
      en: `Original regex "${input}" (${countRules(ast)} AST nodes). Iterating.`,
    })
    .setAux([
      { label: '输入', value: input, role: 'frontier' as BarRole },
      { label: '节点数', value: String(countRules(ast)), role: 'pivot' as BarRole },
      { label: '阶段', value: '化简前', role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: OptimizeHooks = {
    onPass: (pass, ruleCount) => {
      rec
        .begin({
          zh: `第 ${pass} 轮化简完成，当前 ${ruleCount} 个节点。`,
          en: `Pass ${pass} done, ${ruleCount} nodes.`,
        })
        .setAux([
          { label: '轮次', value: String(pass), role: 'pivot' as BarRole },
          { label: '节点数', value: String(ruleCount), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const result = optimizeRegex(ast, serializeRegex, 20, hooks);

  rec
    .begin({
      zh: result.changed
        ? `化简完成：${countRules(result.before)} → ${countRules(result.after)} 节点，规范化为 "${serializeRegex(result.after)}"。`
        : `已是规范形式，无需化简。`,
      en: result.changed
        ? `Simplified: ${countRules(result.before)} → ${countRules(result.after)} nodes, normalized "${serializeRegex(result.after)}".`
        : `Already canonical, no change.`,
    })
    .setAux([
      {
        label: '变化',
        value: result.changed ? '已化简' : '无变化',
        role: (result.changed ? 'final' : 'default') as BarRole,
      },
      {
        label: '原节点',
        value: String(countRules(result.before)),
        role: 'compare' as BarRole,
      },
      {
        label: '现节点',
        value: String(countRules(result.after)),
        role: 'final' as BarRole,
      },
      {
        label: '规范化',
        value: serializeRegex(result.after),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
