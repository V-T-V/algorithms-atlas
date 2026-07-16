// =============================================================================
// Tree —— 二叉/多叉树（BST/堆/线段树/Trie）
// 用「叶子的中序槽位」给 x，深度给 y；SVG 绘制。
// =============================================================================

import type { Frame, TreeNode } from '../types.ts';
import { roleColor } from './palette.ts';

export function renderTree(host: HTMLElement, root: TreeNode): void {
  injectOnce();
  host.classList.add('viz-tree');
  host.replaceChildren();

  const W = 620;
  const H = 360;
  const total = countLeaves(root);

  // 给每个节点分配坐标：叶子按中序占等宽槽，内部节点取子节点 x 中点。
  const coordMap = new Map<string, { x: number; y: number }>();
  let leafIdx = 0;
  const assign = (node: TreeNode, depth: number): { x: number; y: number } => {
    const kids = node.children ?? [];
    let x: number;
    if (kids.length === 0) {
      x = (leafIdx / Math.max(1, total)) * W + W / Math.max(1, total) / 2;
      leafIdx++;
    } else {
      const cs = kids.map((k) => assign(k, depth + 1));
      x = cs.reduce((a, b) => a + b.x, 0) / cs.length;
    }
    const p = { x, y: 36 + depth * 60 };
    coordMap.set(node.id, p);
    return p;
  };
  assign(root, 0);

  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'viz-tree__svg' });

  // 边
  const drawEdges = (node: TreeNode): void => {
    for (const k of node.children ?? []) {
      const a = coordMap.get(node.id);
      const b = coordMap.get(k.id);
      if (a && b) {
        svg.append(
          svgEl('line', {
            x1: a.x,
            y1: a.y,
            x2: b.x,
            y2: b.y,
            stroke: 'var(--border)',
            'stroke-width': '1.5',
          }),
        );
      }
      drawEdges(k);
    }
  };
  drawEdges(root);

  // 节点
  const drawNodes = (node: TreeNode): void => {
    const p = coordMap.get(node.id);
    if (p) {
      const fill = node.role ? roleColor(node.role) : 'var(--bg-elev-2)';
      svg.append(
        svgEl('circle', {
          cx: p.x,
          cy: p.y,
          r: 16,
          fill,
          stroke: 'var(--ink)',
          'stroke-width': '1.5',
        }),
      );
      const t = svgEl('text', { x: p.x, y: p.y + 4, 'text-anchor': 'middle' });
      t.textContent = String(node.value);
      t.setAttribute('fill', node.role ? '#0b0e12' : 'var(--ink)');
      t.setAttribute('font-size', '11');
      svg.append(t);
    }
    for (const k of node.children ?? []) drawNodes(k);
  };
  drawNodes(root);

  host.append(svg);
}

export function hasTree(f: Frame | undefined): f is Frame & { tree: TreeNode } {
  return !!f && !!f.tree;
}

function countLeaves(n: TreeNode): number {
  const kids = n.children ?? [];
  if (kids.length === 0) return 1;
  return kids.reduce((a, k) => a + countLeaves(k), 0);
}

function svgEl(tag: string, attrs: Record<string, string | number>): SVGElement {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}

let injected = false;
function injectOnce(): void {
  if (injected) return;
  injected = true;
  const s = document.createElement('style');
  s.textContent = `
.viz-tree { width:100%; display:flex; align-items:center; justify-content:center; }
.viz-tree__svg { width:100%; max-width:620px; height:auto; }
`;
  document.head.append(s);
}
