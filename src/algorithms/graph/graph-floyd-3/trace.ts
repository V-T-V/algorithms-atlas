// =============================================================================
// Floyd · 录制
import type { Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floyd, type FloydHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  labels: ['A', 'B', 'C', 'D'],
  // 邻接矩阵：INF 用 -1 表示无直接边
  adj: [
    [0, 5, -1, 10],
    [-1, 0, 3, -1],
    [-1, -1, 0, 1],
    [-1, -1, -1, 0],
  ],
};

export function buildTrace(input: { labels: string[]; adj: number[][] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { labels, adj } = input;
  const n = labels.length;
  const INF = Number.POSITIVE_INFINITY;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : adj[i]![j] === -1 ? INF : adj[i]![j]!)),
  );
  let cur = { k: 0, i: 0, j: 0 };

  const fmt = (v: number): string => (Number.isFinite(v) ? String(v) : '∞');

  const snap = (note: { zh: string; en: string }): void => {
    const grid: Cell[][] = dist.map((row, i) =>
      row.map((v, j) => ({
        v: fmt(v),
        role:
          i === cur.i && j === cur.j ? 'swap' : i === cur.k || j === cur.k ? 'pivot' : 'default',
      })),
    );
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([{ label: '中转点', value: labels[cur.k] ?? '-', role: 'frontier' }])
      .commit();
  };

  snap({ zh: `初始距离矩阵 (${labels.join(',')})`, en: `Init matrix (${labels.join(',')})` });

  const hooks: FloydHooks = {
    onInter: (k, i, j, _o, nv) => {
      dist[i]![j] = nv;
      cur = { k, i, j };
      snap({
        zh: `经 ${labels[k]} 中转：${labels[i]}→${labels[j]}=${nv}`,
        en: `via ${labels[k]}: ${labels[i]}->${labels[j]}=${nv}`,
      });
    },
  };

  floyd(n, (i, j) => (adj[i]![j] === -1 ? INF : adj[i]![j]!), hooks);

  rec
    .begin({ zh: 'Floyd 完成', en: 'Floyd done' })
    .setGrid(dist.map((row) => row.map((v) => ({ v: fmt(v), role: 'final' }))))
    .commit();

  return rec.build();
}
