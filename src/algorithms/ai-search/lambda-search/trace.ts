// =============================================================================
// Lambda 搜索 · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lambdaSearch, DEFAULT_LAMBDA_CONFIG, type LambdaHooks, type LambdaNode } from './impl.ts';

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(
  node: LambdaNode,
  highlight: Set<string>,
  threats: Set<string>,
  proven: Set<string>,
): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (proven.has(node.id)) role = 'final';
  else if (threats.has(node.id)) role = 'warn';
  const isLeaf = node.children === undefined || node.children.length === 0;
  const tl = node.threatLevel !== undefined ? ` λ=${node.threatLevel}` : '';
  const value = isLeaf ? `u=${node.utility}${tl}` : `${node.id}${tl}`;
  return {
    id: vizId(),
    value,
    role,
    children: node.children?.map((c) => toViz(c, highlight, threats, proven)),
  };
}

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  // 构造一棵演示树：root -> [c0(u=10), c1(u=200 直接威胁), c2(对手无反击且 c2.utility=150)]
  const root: LambdaNode = {
    id: 'r',
    children: [
      { id: 'c0', utility: 10 },
      { id: 'c1', utility: 200 }, // 直接威胁（λ=1）
      {
        id: 'c2',
        utility: 50,
        children: [
          { id: 'c2a', utility: 150 },
          { id: 'c2b', utility: 30 },
        ],
      },
    ],
  };

  const highlight = new Set<string>();
  const threats = new Set<string>();
  const proven = new Set<string>();
  let probeCount = 0;
  let threatFound = 0;
  let step = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    vizCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, threats, proven))
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' },
        { label: '探测次数', value: String(probeCount), role: 'frontier' },
        { label: '找到威胁', value: String(threatFound), role: 'warn' },
        {
          label: 'winThreshold',
          value: String(DEFAULT_LAMBDA_CONFIG.winThreshold),
          role: 'default',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `构造威胁博弈树（root 有 3 子），winThreshold=${DEFAULT_LAMBDA_CONFIG.winThreshold}，开始逐层 λ 搜索`,
    en: `Build threat tree (3 root children); winThreshold=${DEFAULT_LAMBDA_CONFIG.winThreshold}; start lambda search`,
  });

  const hooks: LambdaHooks = {
    onProbe: (nodeId, lambda) => {
      step += 1;
      probeCount += 1;
      highlight.add(nodeId);
      snapshot({
        zh: `λ=${lambda}：检验节点 ${nodeId} 是否能在此层获胜`,
        en: `λ=${lambda}: probe ${nodeId} for a win at this level`,
      });
    },
    onThreatFound: (nodeId, lambda, childId) => {
      step += 1;
      threatFound += 1;
      threats.add(`${nodeId}.${childId}`);
      highlight.add(childId);
      snapshot({
        zh: `${nodeId} 找到 λ=${lambda} 威胁走法 → ${childId}`,
        en: `${nodeId} found λ=${lambda} threat move → ${childId}`,
      });
    },
    onProven: (nodeId, lambda) => {
      step += 1;
      proven.add(nodeId);
      highlight.add(nodeId);
      snapshot({
        zh: `证明：${nodeId} 在 λ=${lambda} 内获胜`,
        en: `Proven: ${nodeId} wins within λ=${lambda}`,
      });
    },
  };

  const result = lambdaSearch(root, DEFAULT_LAMBDA_CONFIG, hooks);

  vizCounter = 0;
  rec
    .begin({
      zh: `完成：最小威胁数 λ = ${result === Infinity ? '∞（无法获胜）' : result}`,
      en: `Done: smallest lambda = ${result === Infinity ? 'infinity' : result}`,
    })
    .setTree(toViz(root, new Set(), threats, proven))
    .setAux([
      { label: '最小 λ', value: result === Infinity ? '∞' : String(result), role: 'final' },
      { label: '探测次数', value: String(probeCount), role: 'final' },
      { label: '找到威胁', value: String(threatFound), role: 'final' },
    ])
    .commit();

  return rec.build();
}
