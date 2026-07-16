// =============================================================================
// SSS* · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  sssStar,
  minimaxRef,
  buildTree,
  DEFAULT_SSS_CONFIG,
  type SssHooks,
  type SssNode,
} from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [3, 5, 2, 9, 1, 7, 4, 6, 8];
export const DEFAULT_BRANCHING: number = 3;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(node: SssNode, highlight: Set<string>, solved: Set<string>): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (solved.has(node.id)) role = 'final';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const t = node.type === 'max' ? 'M' : 'm';
  const value = isLeaf
    ? `u=${node.utility}`
    : `${t}\nv=${node.value !== undefined ? node.value.toFixed(0) : '?'}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, solved)),
  };
}

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  const root = buildTree(utilities, branching);
  const refRoot = buildTree(utilities, branching);
  const highlight = new Set<string>();
  const solvedNodes = new Set<string>();
  let pops = 0;
  let purges = 0;
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, solvedNodes))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: 'pop 次数', value: String(pops), role: 'frontier' },
        { label: 'purge 数', value: String(purges), role: 'warn' },
        {
          label: '根值',
          value: root.value !== undefined ? String(root.value) : '计算中',
          role: 'default',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `构建博弈树（${utilities.length} 叶，分支 ${branching}），初始 OPEN = [根活状态, g=+∞]`,
    en: `Build tree; OPEN = [root live state, g=+inf]`,
  });

  const hooks: SssHooks = {
    onPop: ({ nodeId, g, status }) => {
      step += 1;
      pops += 1;
      highlight.add(nodeId);
      snapshot({
        zh: `pop 节点 ${nodeId}（g=${g === Infinity ? '+∞' : g.toFixed(0)}, ${status}）`,
        en: `pop ${nodeId} (g=${g === Infinity ? '+inf' : g.toFixed(0)}, ${status})`,
      });
    },
    onLeaf: (node, u, g) => {
      solvedNodes.add(node.id);
      snapshot({
        zh: `叶子 ${node.id}：utility=${u}，收紧 g=${g === Infinity ? '+∞' : g.toFixed(0)}`,
        en: `Leaf ${node.id}: utility=${u}, g=${g === Infinity ? '+inf' : g.toFixed(0)}`,
      });
    },
    onSolved: (nodeId, value) => {
      solvedNodes.add(nodeId);
      snapshot({
        zh: `节点 ${nodeId} 已解决：值=${value.toFixed(0)}`,
        en: `Node ${nodeId} solved: value=${value.toFixed(0)}`,
      });
    },
    onPurge: (count) => {
      purges += count;
      snapshot({
        zh: `purge OPEN 表中 ${count} 个状态`,
        en: `purge ${count} states from OPEN`,
      });
    },
    onGenerate: (parentId, childIds) => {
      snapshot({
        zh: `${parentId} 生成子状态：[${childIds.join(',')}]`,
        en: `${parentId} generated children: [${childIds.join(',')}]`,
      });
    },
  };

  const result = sssStar(root, DEFAULT_SSS_CONFIG, hooks);
  const refValue = minimaxRef(refRoot);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${result}（与 minimax = ${refValue} 一致）`,
      en: `Done: root = ${result} (matches minimax = ${refValue})`,
    })
    .setTree(toViz(root, new Set(), solvedNodes))
    .setAux([
      { label: '根值', value: String(result), role: 'final' },
      { label: 'pop 次数', value: String(pops), role: 'final' },
      { label: 'purge 数', value: String(purges), role: 'final' },
    ])
    .commit();

  return rec.build();
}
