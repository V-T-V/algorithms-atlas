// =============================================================================
// 主变搜索 PVS · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, pvs, type PvsHooks, type PvsNode } from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [3, 5, 2, 9, 1, 7, 4, 6, 8];
export const DEFAULT_BRANCHING: number = 3;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(
  node: PvsNode,
  highlight: Set<string>,
  evaluated: Set<string>,
  scouted: Set<string>,
  researched: Set<string>,
): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (evaluated.has(node.id)) role = 'final';
  else if (researched.has(node.id)) role = 'warn';
  else if (scouted.has(node.id)) role = 'frontier';
  else if (node.value !== undefined) role = 'frontier';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const value = isLeaf ? `u=${node.utility ?? '?'}\nv=${val}` : `v=${val}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, evaluated, scouted, researched)),
  };
}

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  const root = buildTree(utilities, branching);
  const highlight = new Set<string>();
  const evaluated = new Set<string>();
  const scouted = new Set<string>();
  const researched = new Set<string>();
  let scoutCount = 0;
  let researchCount = 0;
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, evaluated, scouted, researched))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: '零窗探测', value: String(scoutCount), role: 'frontier' },
        { label: '重搜次数', value: String(researchCount), role: 'warn' },
        {
          label: '根值',
          value: root.value !== undefined ? String(root.value) : '计算中',
          role: 'frontier',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `构建博弈树（${utilities.length} 叶，分支 ${branching}），开始 PVS`,
    en: `Build tree (${utilities.length} leaves, branching ${branching}), start PVS`,
  });

  const hooks: PvsHooks = {
    onEvaluate: (node, score) => {
      step += 1;
      evaluated.add(node.id);
      highlight.add(node.id);
      snapshot({
        zh: `估值叶子 ${node.id} = ${score}`,
        en: `Evaluate leaf ${node.id} = ${score}`,
      });
    },
    onScout: (node, ci) => {
      step += 1;
      scoutCount += 1;
      scouted.add(`${node.id}.${ci}`);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 子#${ci}：零窗口探测`,
        en: `${node.id} child#${ci}: null-window scout`,
      });
    },
    onResearch: (node, ci) => {
      step += 1;
      researchCount += 1;
      researched.add(`${node.id}.${ci}`);
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 子#${ci}：探测失败 → 完整重搜`,
        en: `${node.id} child#${ci}: scout failed → full re-search`,
      });
    },
    onReturn: (node, value) => {
      step += 1;
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 返回 v=${value}`,
        en: `${node.id} returns v=${value}`,
      });
    },
  };

  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));
  pvs(root, depth, -Infinity, Infinity, hooks);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：根值 = ${root.value}`,
      en: `Done: root value = ${root.value}`,
    })
    .setTree(toViz(root, new Set(), evaluated, scouted, researched))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: '零窗探测', value: String(scoutCount), role: 'final' },
      { label: '重搜次数', value: String(researchCount), role: 'warn' },
    ])
    .commit();

  return rec.build();
}
