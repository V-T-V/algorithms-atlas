// =============================================================================
// 笛卡尔树 · 录制帧序列
// 可视化：setGraph（树），role:已接入='frontier'，当前节点='pivot'，
// 根='final'。setAux 展示最右链栈。节点标签为「值@下标」。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cartesian, type CartesianHooks } from './impl.ts';

/** 演示数组：[3, 1, 4, 1, 5, 9, 2, 6]。
 * 最小值 1（下标 1）为根。 */
export const DEFAULT_INPUT = [3, 1, 4, 1, 5, 9, 2, 6];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  const linked = new Set<number>();
  let curNode: number | null = null;
  const left: number[] = new Array(n).fill(-1);
  const right: number[] = new Array(n).fill(-1);

  // 布局：按中序遍历分配 x；深度按在树中的层级。简化用下标做 x，值做 y 反向。
  const POS: Record<number, { x: number; y: number }> = {};
  // 构造完成后用中序与深度布局；过程中用下标近似。
  for (let i = 0; i < n; i++) {
    POS[i] = { x: (i + 0.5) / n, y: 0.5 };
  }

  const render = (note: { zh: string; en: string }, stack: number[], finalLayout = false): void => {
    let depthMap: Map<number, number> | null = null;
    if (finalLayout) {
      // 用 parent 关系算深度（此处重新跑一遍简单 BFS 不现实；用 left/right 已记录）
      depthMap = new Map<number, number>();
      const parentOf = new Array<number>(n).fill(-1);
      for (let i = 0; i < n; i++) {
        if (left[i] !== -1) parentOf[left[i]!] = i;
        if (right[i] !== -1) parentOf[right[i]!] = i;
      }
      // 找根（parent=-1 的最小值下标）
      let root = -1;
      for (let i = 0; i < n; i++) if (parentOf[i] === -1) root = i;
      const bfs = (r: number): void => {
        const q = [r];
        depthMap!.set(r, 0);
        while (q.length) {
          const u = q.shift()!;
          const d = depthMap!.get(u) ?? 0;
          for (let v = 0; v < n; v++) {
            if (parentOf[v] === u && !depthMap!.has(v)) {
              depthMap!.set(v, d + 1);
              q.push(v);
            }
          }
        }
      };
      if (root !== -1) bfs(root);
    }

    const nodes: GraphNode[] = Array.from({ length: n }, (_, i) => {
      let role: BarRole = 'default';
      if (linked.has(i)) role = 'frontier';
      if (i === curNode) role = 'pivot';
      const x = (i + 0.5) / n;
      const d = depthMap?.get(i) ?? 0;
      const y = 0.15 + d * 0.22;
      return {
        id: `n${i}`,
        label: `${input[i]}\n[${i}]`,
        x: finalLayout ? x : (POS[i]?.x ?? 0.5),
        y: finalLayout ? Math.min(y, 0.92) : (POS[i]?.y ?? 0.5),
        role,
      };
    });
    const edges: GraphEdge[] = [];
    for (let i = 0; i < n; i++) {
      if (left[i] !== -1) edges.push({ from: `n${i}`, to: `n${left[i]}`, role: 'default' });
      if (right[i] !== -1) edges.push({ from: `n${i}`, to: `n${right[i]}`, role: 'default' });
    }
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([{ label: '最右链栈', value: stack.length ? stack.join(' → ') : '∅', role: 'pivot' }])
      .commit();
  };

  render({ zh: `初始数组：[${input.join(', ')}]`, en: `Initial array: [${input.join(', ')}]` }, []);

  const hooks: CartesianHooks = {
    onStep: (i, stack) => {
      curNode = i;
      linked.add(i);
      render(
        {
          zh: `处理 A[${i}]=${input[i]}，栈=${stack.join(' → ')}`,
          en: `Process A[${i}]=${input[i]}, stack=${stack.join(' -> ')}`,
        },
        stack,
      );
      curNode = null;
    },
    onPop: (j, i) => {
      render(
        {
          zh: `弹出 ${j}（值 ${input[j]} > ${input[i]}）`,
          en: `Pop ${j} (val ${input[j]} > ${input[i]})`,
        },
        [],
      );
    },
    onLink: (p, c, slot) => {
      if (slot === 'left') left[p] = c;
      else right[p] = c;
      render(
        {
          zh: `${slot === 'left' ? '左' : '右'}子：${p} → ${c}`,
          en: `${slot} child: ${p} -> ${c}`,
        },
        [],
      );
    },
    onRoot: (r) => {
      render(
        { zh: `根 = 下标 ${r}（值 ${input[r]}）`, en: `Root = index ${r} (val ${input[r]})` },
        [],
      );
    },
  };

  const result = cartesian(input, hooks);

  curNode = null;
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setGraph(
      Array.from({ length: n }, (_, i) => {
        const id = `n${i}`;
        return {
          id,
          label: `${input[i]}\n[${i}]`,
          x: POS[i]?.x ?? 0.5,
          y: POS[i]?.y ?? 0.5,
          role: (i === result.root ? 'final' : 'default') as BarRole,
        };
      }),
      [],
    )
    .setAux([{ label: '根下标', value: String(result.root), role: 'final' }])
    .commit();

  return rec.build();
}
