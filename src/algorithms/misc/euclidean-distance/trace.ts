// =============================================================================
// 欧氏距离 · 录制帧序列
// 用 setAux 展示距离公式的逐步展开（每维差值、平方、累加），末帧给出结果。
// 二维情形额外用 setGraph 画出两点连线。
// =============================================================================

import type { BarRole, Frame, GraphNode, GraphEdge } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { euclideanDistance, type EuclideanDistanceHooks } from './impl.ts';

export interface EuclideanInput {
  a: number[];
  b: number[];
}

export const DEFAULT_INPUT: EuclideanInput = {
  a: [1, 2],
  b: [4, 6],
};

/** 录制演示帧序列。 */
export function buildTrace(input: EuclideanInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const dim = a.length;

  // 维度明细：每一维 (aᵢ, bᵢ, diff, diff², running sum)
  const rows: Array<{ k: number; a: number; b: number; diff: number; sq: number; sum: number }> =
    [];
  let activeK = -1;
  let finalSum = 0;
  let result = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [];
    aux.push({
      label: '公式 / formula',
      value: `√(Σ(aᵢ−bᵢ)²)`,
      role: 'pivot',
    });
    aux.push({
      label: 'a',
      value: `(${a.join(', ')})`,
      role: 'compare',
    });
    aux.push({
      label: 'b',
      value: `(${b.join(', ')})`,
      role: 'compare',
    });
    aux.push({ label: '───', value: `维度 = ${dim}`, role: 'default' });
    for (const r of rows) {
      const isActive = r.k === activeK;
      aux.push({
        label: `dim ${r.k}`,
        value: `(${r.a}−${r.b})² = ${r.diff}² = ${r.sq}`,
        role: (isActive ? 'swap' : 'default') as BarRole,
      });
      aux.push({
        label: `  Σ`,
        value: r.sum.toString(),
        role: (isActive ? 'frontier' : 'default') as BarRole,
      });
    }
    if (finalSum > 0 || rows.length === dim) {
      aux.push({
        label: '平方和 / sum sq',
        value: finalSum.toString(),
        role: 'frontier',
      });
    }
    if (result > 0) {
      aux.push({
        label: '距离 / distance',
        value: `√${finalSum} = ${result.toFixed(4)}`,
        role: 'final',
      });
    }

    // 二维情形：画两点连线
    let nodes: GraphNode[] | undefined;
    let edges: GraphEdge[] | undefined;
    if (dim === 2) {
      const norm = normalize2d([...a, ...b]);
      const [ax, ay] = norm(a[0]!, a[1]!);
      const [bx, by] = norm(b[0]!, b[1]!);
      nodes = [
        { id: 'A', label: `A(${a.join(',')})`, x: ax, y: ay, role: 'compare' },
        { id: 'B', label: `B(${b.join(',')})`, x: bx, y: by, role: 'pivot' },
      ];
      edges = [{ from: 'A', to: 'B', role: 'final' as BarRole }];
    }

    rec.begin(note);
    if (nodes && edges) rec.setGraph(nodes, edges);
    rec.setAux(aux).commit();
  };

  snapshot({
    zh: `求 A(${a.join(', ')}) 与 B(${b.join(', ')}) 的欧氏距离`,
    en: `Euclidean distance between A(${a.join(', ')}) and B(${b.join(', ')})`,
  });

  const hooks: EuclideanDistanceHooks = {
    onDimension: (k) => {
      activeK = k;
      const row = { k, a: a[k]!, b: b[k]!, diff: 0, sq: 0, sum: 0 };
      rows.push(row);
      snapshot({
        zh: `第 ${k} 维：a=${a[k]}, b=${b[k]}`,
        en: `Dim ${k}: a=${a[k]}, b=${b[k]}`,
      });
    },
    onDiffSquared: (k, diff, sq, sum) => {
      const row = rows[k]!;
      row.diff = diff;
      row.sq = sq;
      row.sum = sum;
      finalSum = sum;
      snapshot({
        zh: `dim ${k}: (${a[k]}−${b[k]})² = ${diff}² = ${sq}，Σ=${sum}`,
        en: `dim ${k}: (${a[k]}−${b[k]})² = ${diff}² = ${sq}, Σ=${sum}`,
      });
    },
    onSum: (sum) => {
      finalSum = sum;
      activeK = -1;
      snapshot({
        zh: `平方和 = ${sum}，开方 → √${sum}`,
        en: `Sum of squares = ${sum}, take sqrt → √${sum}`,
      });
    },
    onResult: (distance) => {
      result = distance;
      snapshot({
        zh: `距离 = ${distance.toFixed(4)}`,
        en: `Distance = ${distance.toFixed(4)}`,
      });
    },
  };

  euclideanDistance(a, b, hooks);

  // 终态
  const aux: Array<{ label: string; value: string; role?: BarRole }> = [
    { label: '距离 / distance', value: result.toFixed(4), role: 'final' },
    { label: '平方和', value: finalSum.toString(), role: 'frontier' },
    {
      label: '公式 / formula',
      value: `√(${rows.map((r) => `(${r.diff})²`).join(' + ')}) = ${result.toFixed(4)}`,
      role: 'pivot',
    },
  ];
  rec.begin({ zh: '完成', en: 'Done' }).setAux(aux).commit();

  return rec.build();
}

/** 二维归一化到 [0,1]×[0,1]（屏幕坐标 y 翻转）。 */
function normalize2d(all: number[]): (x: number, y: number) => [number, number] {
  const xs = all.filter((_, i) => i % 2 === 0);
  const ys = all.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs),
    maxX = Math.max(...xs),
    minY = Math.min(...ys),
    maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const pad = 0.12;
  return (x, y) => [
    pad + ((x - minX) / spanX) * (1 - 2 * pad),
    1 - (pad + ((y - minY) / spanY) * (1 - 2 * pad)),
  ];
}
