// =============================================================================
// 2-SAT · 录制帧序列
// 可视化：setGraph（蕴含图，节点 = 文字 x / ¬x），role: 已赋真='final'，已赋假='warn'，SCC 中='frontier'；
// setAux 展示各变量最终赋值。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoSat, type TwoSatHooks, type TwoSatInput } from './impl.ts';

/** 演示：4 个变量、可满足。
 *  子句（用 1-based 直观描述，代码用 0-based）：
 *   (x0 ∨ x1) ∧ (¬x0 ∨ x2) ∧ (¬x1 ∨ ¬x2) ∧ (x3 ∨ ¬x2)
 *  一个可行解：x0=T,x1=F,x2=T,x3=T。 */
export const DEFAULT_INPUT: TwoSatInput = {
  n: 4,
  clauses: [
    [
      { var: 0, neg: false },
      { var: 1, neg: false },
    ],
    [
      { var: 0, neg: true },
      { var: 2, neg: false },
    ],
    [
      { var: 1, neg: true },
      { var: 2, neg: true },
    ],
    [
      { var: 3, neg: false },
      { var: 2, neg: true },
    ],
  ],
};

/** 蕴含图节点布局：左列 x（正），右列 ¬x（负），自上而下按变量序。 */
const POS = (n: number): Record<string, { x: number; y: number }> => {
  const m: Record<string, { x: number; y: number }> = {};
  for (let i = 0; i < n; i++) {
    const y = 0.15 + (i / Math.max(1, n - 1)) * 0.7;
    m[`${i}`] = { x: 0.28, y };
    m[`!${i}`] = { x: 0.72, y };
  }
  return m;
};

/** 录制演示帧序列。 */
export function buildTrace(input: TwoSatInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;
  const pos = POS(n);

  // 收集实际存在的边（动态构建）
  const edges: Array<{ from: string; to: string }> = [];
  const compOf = new Map<string, number>();
  const assignment = new Array<boolean | null>(n).fill(null);
  let curComp: string[] = [];
  let sat = false;
  let highlightEdge: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodeIds = new Set<string>();
    for (let i = 0; i < n; i++) {
      nodeIds.add(`${i}`);
      nodeIds.add(`!${i}`);
    }
    const nodes: GraphNode[] = [...nodeIds].map((id) => {
      const isNeg = id.startsWith('!');
      const v = Number(isNeg ? id.slice(1) : id);
      let role: BarRole = 'default';
      const val = assignment[v];
      if (val !== null) {
        // 该变量已定：正形与赋值一致 → final，否则 → warn
        const isTrueLit = (isNeg && val === false) || (!isNeg && val === true);
        role = isTrueLit ? 'final' : 'warn';
      } else if (curComp.includes(id)) role = 'frontier';
      return {
        id,
        label: isNeg ? `¬x${v}` : `x${v}`,
        x: pos[id]?.x ?? 0.5,
        y: pos[id]?.y ?? 0.5,
        role,
      };
    });
    const gEdges: GraphEdge[] = edges.map((e) => {
      let role: BarRole = 'default';
      if (highlightEdge && highlightEdge.from === e.from && highlightEdge.to === e.to)
        role = 'compare';
      return { from: e.from, to: e.to, directed: true, role };
    });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '子句 / clauses',
        value: input.clauses
          .map((c) => `(${c[0].neg ? '¬' : ''}x${c[0].var} ∨ ${c[1].neg ? '¬' : ''}x${c[1].var})`)
          .join(' ∧ '),
      },
      {
        label: '赋值 / assignment',
        value: assignment
          .map((v, i) => (v === null ? `x${i}=?` : `x${i}=${v ? 'T' : 'F'}`))
          .join(', '),
        role: 'final',
      },
    ];
    rec.begin(note).setGraph(nodes, gEdges).setAux(aux).commit();
  };

  render({
    zh: `建蕴含图：${n} 变量，${input.clauses.length} 子句`,
    en: `Build implication graph: ${n} vars, ${input.clauses.length} clauses`,
  });

  const hooks: TwoSatHooks = {
    onImplication: (from, to) => {
      edges.push({ from, to });
      highlightEdge = { from, to };
      render({
        zh: `加蕴含边 ${from} → ${to}`,
        en: `Add implication ${from} → ${to}`,
      });
      highlightEdge = null;
    },
    onComponent: (comp) => {
      curComp = comp;
      for (const id of comp) compOf.set(id, compOf.size);
      render({
        zh: `发现 SCC：{ ${comp.join(', ')} }`,
        en: `SCC found: { ${comp.join(', ')} }`,
      });
      curComp = [];
    },
    onContradiction: (i) => {
      render({
        zh: `矛盾：x${i} 与 ¬x${i} 同 SCC → 不可满足`,
        en: `Contradiction: x${i} and ¬x${i} in same SCC → UNSAT`,
      });
    },
    onDone: (s, asg) => {
      sat = s;
      if (asg) for (let i = 0; i < n; i++) assignment[i] = asg[i]!;
    },
  };

  twoSat(input, hooks);

  // 终态
  rec
    .begin({
      zh: sat
        ? `可满足，解：${assignment.map((v, i) => `x${i}=${v ? 'T' : 'F'}`).join(', ')}`
        : '不可满足（UNSAT）',
      en: sat
        ? `Satisfiable, solution: ${assignment.map((v, i) => `x${i}=${v ? 'T' : 'F'}`).join(', ')}`
        : 'Unsatisfiable (UNSAT)',
    })
    .setGraph(
      (() => {
        const nodeIds = new Set<string>();
        for (let i = 0; i < n; i++) {
          nodeIds.add(`${i}`);
          nodeIds.add(`!${i}`);
        }
        return [...nodeIds].map((id) => {
          const isNeg = id.startsWith('!');
          const v = Number(isNeg ? id.slice(1) : id);
          const val = assignment[v];
          const isTrueLit = val !== null && ((isNeg && val === false) || (!isNeg && val === true));
          return {
            id,
            label: isNeg ? `¬x${v}` : `x${v}`,
            x: pos[id]?.x ?? 0.5,
            y: pos[id]?.y ?? 0.5,
            role: (sat ? (isTrueLit ? 'final' : 'warn') : 'default') as BarRole,
          };
        });
      })(),
      edges.map((e) => ({ from: e.from, to: e.to, directed: true, role: 'default' as BarRole })),
    )
    .setAux([
      {
        label: '结果 / result',
        value: sat ? 'SAT（可满足）' : 'UNSAT（不可满足）',
        role: sat ? 'final' : 'warn',
      },
    ])
    .commit();

  return rec.build();
}
