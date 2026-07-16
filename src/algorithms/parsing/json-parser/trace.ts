// =============================================================================
// 手写 JSON 解析器 · 录制帧序列
// 用 setTree 展示解析出的 JSON 值结构，用 setAux 展示解析位置与当前值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  parseJson,
  toJsonTree,
  resetNodeId,
  type JsonParserHooks,
  type JsonValue,
} from './impl.ts';
import type { TreeNode } from '../../../types.ts';

export const DEFAULT_INPUT =
  '{"name":"atlas","tags":["dp","graph"],"nested":{"ok":true,"score":3.14,"none":null}}';

/** 深拷贝树。 */
function cloneTree(n: TreeNode): TreeNode {
  return {
    id: n.id,
    value: n.value,
    role: n.role,
    edgeLabel: n.edgeLabel,
    children: n.children?.map(cloneTree),
  };
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  resetNodeId();

  // 累积已解析的「最近值」用于展示（用浅结构表示）
  const seen: Array<{ type: string; preview: string }> = [];
  let finalTree: TreeNode | null = null;

  const preview = (v: unknown): string => {
    if (v === null) return 'null';
    if (typeof v === 'string') return `"${v}"`;
    if (Array.isArray(v)) return `[${v.length} 项]`;
    if (typeof v === 'object' && v) return `{${Object.keys(v).length} 键}`;
    return String(v);
  };

  rec
    .begin({
      zh: `解析 JSON：${input.length} 字符`,
      en: `Parse JSON: ${input.length} chars`,
    })
    .setAux([
      { label: '输入长度', value: String(input.length), role: 'compare' as BarRole },
      { label: '已解析值', value: '∅', role: 'default' as BarRole },
    ])
    .commit();

  const hooks: JsonParserHooks = {
    onValue: (type, value) => {
      seen.push({ type, preview: preview(value) });
      const aux: Array<{ label: string; value: string; role?: BarRole }> = [
        { label: '类型', value: type, role: 'pivot' as BarRole },
        { label: '预览', value: preview(value), role: 'frontier' as BarRole },
        {
          label: '值计数',
          value: String(seen.length),
          role: 'default' as BarRole,
        },
      ];
      rec
        .begin({
          zh: `解析出 ${type} 值：${preview(value)}`,
          en: `Parsed ${type} value: ${preview(value)}`,
        })
        .setAux(aux)
        .commit();
    },
    onArrayElement: (index, value) => {
      rec
        .begin({
          zh: `数组元素 [${index}] = ${preview(value)}`,
          en: `array[${index}] = ${preview(value)}`,
        })
        .setAux([
          { label: '索引', value: String(index), role: 'pivot' as BarRole },
          { label: '值', value: preview(value), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onObjectMember: (key, value) => {
      rec
        .begin({
          zh: `对象成员 "${key}" = ${preview(value)}`,
          en: `object "${key}" = ${preview(value)}`,
        })
        .setAux([
          { label: '键', value: `"${key}"`, role: 'pivot' as BarRole },
          { label: '值', value: preview(value), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onResult: (value) => {
      finalTree = toJsonTree(value as JsonValue);
      rec
        .begin({ zh: `解析完成`, en: `Parse complete` })
        .setTree(cloneTree(finalTree))
        .setAux([
          { label: '顶层类型', value: preview(value), role: 'final' as BarRole },
          {
            label: '值总数',
            value: String(seen.length),
            role: 'default' as BarRole,
          },
        ])
        .commit();
    },
  };

  parseJson(input, hooks);

  // 终态：标记所有叶子为 final
  if (finalTree) {
    const markFinal = (n: TreeNode): void => {
      if (n.role !== 'pivot') n.role = 'final';
      n.children?.forEach(markFinal);
    };
    markFinal(finalTree);
    rec
      .begin({ zh: '完成', en: 'Done' })
      .setTree(cloneTree(finalTree))
      .setAux([
        {
          label: '输入',
          value: input.slice(0, 40) + (input.length > 40 ? '…' : ''),
          role: 'compare' as BarRole,
        },
        { label: '解析值数', value: String(seen.length), role: 'final' as BarRole },
      ])
      .commit();
  }

  return rec.build();
}
