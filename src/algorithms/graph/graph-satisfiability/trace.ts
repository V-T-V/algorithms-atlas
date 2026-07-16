// =============================================================================
// 3-SAT 贪心求解 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solve3SatGreedy, type Clause, type SatHooks } from './impl.ts';

// (x1 ∨ x2 ∨ ¬x3) ∧ (¬x1 ∨ x2 ∨ x3) ∧ (x1 ∨ ¬x2 ∨ x3)
export const DEFAULT_CLAUSES: Clause[] = [
  [1, 2, -3],
  [-1, 2, 3],
  [1, -2, 3],
];
export const DEFAULT_VARS = 3;

export function buildTrace(
  clauses: Clause[] = DEFAULT_CLAUSES,
  numVars: number = DEFAULT_VARS,
): Frame[] {
  const rec = new TraceRecorder();
  const assignment = new Map<number, boolean>();
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = clauses.map((cl) => (isSat(cl, assignment) ? 'final' : 'warn'));
    rec
      .begin(note)
      .setBars(
        clauses.map((cl, i) => ({
          value: cl.length,
          role: roles[i]!,
          label: `(${cl.map((l) => (l > 0 ? `x${l}` : `¬x${-l}`)).join('∨')})`,
        })),
      )
      .setMap(
        Array.from({ length: numVars }, (_, i) => {
          const v = i + 1;
          const a = assignment.get(v);
          return {
            key: `x${v}`,
            value: a === undefined ? '?' : a ? 'T' : 'F',
            role: 'frontier' as BarRole,
          };
        }),
      )
      .commit();
  };

  snap({ zh: `${clauses.length} 条 3-CNF 子句`, en: `${clauses.length} 3-CNF clauses` });

  const hooks: SatHooks = {
    onAssign: (v, value) => {
      assignment.set(v, value);
      snap({ zh: `x${v} = ${value}`, en: `x${v} = ${value}` });
    },
    onResult: (sat) => {
      ans = sat;
      snap({ zh: `满足 ${sat}/${clauses.length}`, en: `Satisfied ${sat}/${clauses.length}` });
    },
  };

  const result = solve3SatGreedy(clauses, numVars, hooks);

  rec
    .begin({
      zh: `完成：${result.satisfied}/${clauses.length}`,
      en: `Done: ${result.satisfied}/${clauses.length}`,
    })
    .setBars(clauses.map((cl) => ({ value: cl.length, role: 'final' as BarRole })))
    .setAux([{ label: '满足子句', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}

function isSat(clause: Clause, assignment: Map<number, boolean>): boolean {
  for (const lit of clause) {
    const v = Math.abs(lit);
    const a = assignment.get(v);
    if (a === undefined) continue;
    if (lit > 0 && a) return true;
    if (lit < 0 && !a) return true;
  }
  return false;
}
