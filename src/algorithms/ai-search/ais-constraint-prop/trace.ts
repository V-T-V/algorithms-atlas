import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveCsp, type CspProblem } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 4-皇后
  const N = 4;
  const vars = ['q0', 'q1', 'q2', 'q3'];
  const domains: Record<string, number[]> = {};
  for (const v of vars) domains[v] = [0, 1, 2, 3];
  const p: CspProblem = {
    variables: vars,
    domains,
    neighbors: {
      q0: ['q1', 'q2', 'q3'],
      q1: ['q0', 'q2', 'q3'],
      q2: ['q0', 'q1', 'q3'],
      q3: ['q0', 'q1', 'q2'],
    },
    consistent: (a, va, b, vb) => {
      if (va === vb) return false;
      const ia = Number(a.slice(1));
      const ib = Number(b.slice(1));
      if (Math.abs(va - vb) === Math.abs(ia - ib)) return false;
      return true;
    },
  };
  rec
    .begin({ zh: '4-皇后 CSP', en: '4-queens CSP' })
    .setAux([{ label: '变量', value: 'q0..q3', role: 'compare' as BarRole }])
    .setGrid([
      [
        { v: 'q', role: 'default' },
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
      ],
      [
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
      ],
      [
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
      ],
      [
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
        { v: '.', role: 'default' },
      ],
    ])
    .commit();
  const grid = (a: Record<string, number>) =>
    Array.from({ length: N }, (_, r) =>
      Array.from({ length: N }, (_, c) => {
        const v = 'q' + c;
        if (a[v] !== undefined && a[v] === r) return { v: 'Q', role: 'final' as BarRole };
        return { v: '.', role: 'default' as BarRole };
      }),
    );
  solveCsp(p, {
    onAssign: (v, val) =>
      rec
        .begin({ zh: `赋值 ${v}=${val}`, en: `assign ${v}=${val}` })
        .setAux([{ label: v, value: String(val), role: 'swap' as BarRole }])
        .commit(),
    onBacktrack: (v) =>
      rec
        .begin({ zh: `回溯 ${v}`, en: `backtrack ${v}` })
        .setAux([{ label: '回溯', value: v, role: 'warn' as BarRole }])
        .commit(),
    onSolution: (a) => rec.begin({ zh: '找到解', en: 'solution' }).setGrid(grid(a)).commit(),
  });
  return rec.build();
}
