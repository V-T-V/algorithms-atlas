// =============================================================================
// Graph —— 节点+边（图算法）
// 节点坐标：优先用帧给定的归一化 x/y，否则按圆周布局自动排布。
// 用 SVG 绘制以获得清晰的边与箭头。
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../types.ts';
import { roleColor } from './palette.ts';

export function renderGraph(
  host: HTMLElement,
  g: { nodes: GraphNode[]; edges: GraphEdge[] },
): void {
  injectOnce();
  host.classList.add('viz-graph');
  host.replaceChildren();

  const W = 600;
  const H = 360;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'viz-graph__svg' });

  // 计算坐标
  const positioned = layout(g.nodes, W, H);

  // 边
  const byId = new Map(positioned.map((n) => [n.id, n]));
  for (const e of g.edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) continue;
    const color = e.role ? roleColor(e.role) : 'var(--border)';
    const line = svgEl('line', {
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
      stroke: color,
      'stroke-width': e.role ? '3' : '1.5',
    });
    svg.append(line);
    if (e.weight !== undefined) {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const t = svgEl('text', { x: mx, y: my - 4, 'text-anchor': 'middle' });
      t.textContent = String(e.weight);
      svg.append(t);
    }
  }

  // 节点
  for (const n of positioned) {
    const fill = n.role ? roleColor(n.role) : 'var(--bg-elev-2)';
    const circle = svgEl('circle', {
      cx: n.x,
      cy: n.y,
      r: 16,
      fill,
      stroke: 'var(--ink)',
      'stroke-width': '1.5',
    });
    svg.append(circle);
    const t = svgEl('text', { x: n.x, y: n.y + 4, 'text-anchor': 'middle' });
    t.textContent = n.label ?? n.id;
    t.setAttribute('fill', n.role ? '#0b0e12' : 'var(--ink)');
    t.setAttribute('font-size', '11');
    svg.append(t);
  }

  host.append(svg);
}

export function hasGraph(
  f: Frame | undefined,
): f is Frame & { graph: NonNullable<Frame['graph']> } {
  return !!f && !!f.graph && f.graph.nodes.length > 0;
}

function layout(
  nodes: GraphNode[],
  W: number,
  H: number,
): Array<GraphNode & { x: number; y: number }> {
  const n = nodes.length;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - 36;
  return nodes.map((node, i) => {
    if (node.x !== undefined && node.y !== undefined) {
      return { ...node, x: node.x * W, y: node.y * H };
    }
    const ang = (i / Math.max(1, n)) * Math.PI * 2 - Math.PI / 2;
    return { ...node, x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
  });
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
.viz-graph { width:100%; display:flex; align-items:center; justify-content:center; }
.viz-graph__svg { width:100%; max-width:600px; height:auto; }
`;
  document.head.append(s);
}
