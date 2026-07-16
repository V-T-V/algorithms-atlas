// =============================================================================
// Star1 剪枝 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  star1Search,
  expectimaxPlain,
  buildExampleTree,
  DEFAULT_STAR_CONFIG,
  type StarHooks,
  type StarNode,
} from './impl.ts';

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(
  node: StarNode,
  highlight: Set<string>,
  pruned: Set<string>,
  evaluated: Set<string>,
): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (pruned.has(node.id)) role = 'warn';
  else if (evaluated.has(node.id)) role = 'final';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const typeTag = node.type === 'max' ? 'M' : 'C';
  const probs = node.probs ? `\np=[${node.probs.map((p) => p.toFixed(2)).join(',')}]` : '';
  const value = isLeaf
    ? `u=${node.utility}`
    : `${typeTag}\nv=${node.value !== undefined ? node.value.toFixed(1) : '?'}${probs}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, pruned, evaluated)),
  };
}

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  const root = buildExampleTree();
  const refRoot = buildExampleTree();
  const highlight = new Set<string>();
  const pruned = new Set<string>();
  const evaluated = new Set<string>();
  let pruneHigh = 0;
  let pruneLow = 0;
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, pruned, evaluated))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: '上界剪枝', value: String(pruneHigh), role: 'warn' },
        { label: '下界剪枝', value: String(pruneLow), role: 'swap' },
        {
          label: '根值',
          value: root.value !== undefined ? root.value.toFixed(2) : '计算中',
          role: 'frontier',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `构建期望树（MAX-chance-叶子），valueLo=${DEFAULT_STAR_CONFIG.valueLo}, valueHi=${DEFAULT_STAR_CONFIG.valueHi}`,
    en: `Build expectimax tree; valueLo=${DEFAULT_STAR_CONFIG.valueLo}, valueHi=${DEFAULT_STAR_CONFIG.valueHi}`,
  });

  const hooks: StarHooks = {
    onVisit: (node) => {
      if (node.children === undefined) {
        step += 1;
        evaluated.add(node.id);
        highlight.add(node.id);
        snapshot({
          zh: `估值叶子 ${node.id} = ${node.utility}`,
          en: `Evaluate leaf ${node.id} = ${node.utility}`,
        });
      }
    },
    onChanceChild: (node, ci) => {
      step += 1;
      highlight.add(node.id);
      const p = node.probs?.[ci] ?? 0;
      snapshot({
        zh: `chance ${node.id} 处理子#${ci}（权重 ${p}）`,
        en: `chance ${node.id} handle child#${ci} (weight ${p})`,
      });
    },
    onPruneHigh: (node, ci, axU, alpha) => {
      step += 1;
      pruneHigh += 1;
      pruned.add(`${node.id}.${ci}`);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 子#${ci}：上界 ${axU.toFixed(1)} < α(${alpha}) → 剪枝`,
        en: `${node.id} child#${ci}: upper ${axU.toFixed(1)} < alpha(${alpha}) → prune`,
      });
    },
    onPruneLow: (node, ci, axL, beta) => {
      step += 1;
      pruneLow += 1;
      pruned.add(`${node.id}.${ci}`);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 子#${ci}：下界 ${axL.toFixed(1)} > β(${beta}) → 剪枝`,
        en: `${node.id} child#${ci}: lower ${axL.toFixed(1)} > beta(${beta}) → prune`,
      });
    },
  };

  star1Search(
    root,
    DEFAULT_STAR_CONFIG.valueLo,
    DEFAULT_STAR_CONFIG.valueHi,
    DEFAULT_STAR_CONFIG,
    hooks,
  );
  const refValue = expectimaxPlain(refRoot);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${root.value?.toFixed(2)}（精确 expectimax = ${refValue.toFixed(2)}）`,
      en: `Done: root = ${root.value?.toFixed(2)} (exact expectimax = ${refValue.toFixed(2)})`,
    })
    .setTree(toViz(root, new Set(), pruned, evaluated))
    .setAux([
      { label: '根值', value: root.value?.toFixed(2) ?? '?', role: 'final' },
      { label: '上界剪枝', value: String(pruneHigh), role: 'final' },
      { label: '下界剪枝', value: String(pruneLow), role: 'final' },
    ])
    .commit();

  return rec.build();
}
