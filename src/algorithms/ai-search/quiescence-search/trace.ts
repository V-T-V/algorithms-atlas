// =============================================================================
// 静止搜索 · 录制帧序列
// 用 setTree 展示博弈树（capture 边标注），setAux 显示 standPat 与已走 capture 链。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildCaptureChain, quiescence, type QsHooks, type QsNode } from './impl.ts';

let nodeIdCounter = 0;
function nextId(): string {
  nodeIdCounter += 1;
  return `v${nodeIdCounter}`;
}

function toViz(node: QsNode, highlight: Set<string>, evaluated: Set<string>): TreeNode {
  let role: BarRole = 'default';
  if (highlight.has(node.id)) role = 'compare';
  else if (evaluated.has(node.id)) role = 'final';
  else if (node.value !== undefined) role = 'frontier';
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  return {
    id: nextId(),
    value: `se=${node.staticEval ?? '?'}\nv=${val}`,
    role,
    children: node.children?.map((c) => ({
      id: nextId(),
      value: '',
      edgeLabel: c.isCapture ? 'x' : '',
      role: c.isCapture ? ('warn' as BarRole) : ('default' as BarRole),
      children: [toViz(c.node, highlight, evaluated)],
    })),
  };
}

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  nodeIdCounter = 0;

  const root = buildCaptureChain();
  const highlight = new Set<string>();
  const evaluated = new Set<string>();
  const captureChain: number[] = [];
  let stepCounter = 0;
  let lastStandPat = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeIdCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, evaluated))
      .setAux([
        { label: '步数', value: String(stepCounter), role: 'pivot' },
        { label: 'StandPat', value: String(lastStandPat), role: 'frontier' },
        {
          label: 'capture 链',
          value: captureChain.length > 0 ? `[${captureChain.join(',')}]` : '—',
          role: 'warn',
        },
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
    zh: `局面：静态估值 -3，但有一条 capture 链 → 开始静止搜索`,
    en: `Position: static eval -3, but a capture chain exists → start quiescence`,
  });

  const hooks: QsHooks = {
    onStandPat: (node, evalScore) => {
      stepCounter += 1;
      lastStandPat = evalScore;
      highlight.add(node.id);
      snapshot({
        zh: `${node.id} 静态估值（stand-pat）= ${evalScore}`,
        en: `${node.id} stand-pat eval = ${evalScore}`,
      });
    },
    onCapture: (_parent, moveId) => {
      stepCounter += 1;
      captureChain.push(moveId);
    },
    onReturn: (node, value) => {
      stepCounter += 1;
      highlight.add(node.id);
      evaluated.add(node.id);
      snapshot({
        zh: `${node.id} 返回 v=${value}`,
        en: `${node.id} returns v=${value}`,
      });
    },
  };

  quiescence(root, -Infinity, Infinity, hooks);

  nodeIdCounter = 0;
  rec
    .begin({
      zh: `完成：静止值 = ${root.value}（高于静态 -3，因发现 capture 链）`,
      en: `Done: quiescence value = ${root.value} (above static -3 due to capture chain)`,
    })
    .setTree(toViz(root, new Set(), evaluated))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: 'capture 链', value: `[${captureChain.join(',')}]`, role: 'final' },
    ])
    .commit();

  return rec.build();
}
