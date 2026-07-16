// 混合策略纳什均衡 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameNashEquilibrium } from './impl.ts';

const ROW: ReadonlyArray<readonly number[]> = [
  [1, -1],
  [-1, 1],
];
const COL: ReadonlyArray<readonly number[]> = [
  [-1, 1],
  [1, -1],
];

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const grid = ROW.map((r, i) =>
    r.map((v, j) => ({ v: `${v},${COL[i]![j]}`, role: 'default' as BarRole })),
  );
  rec
    .begin({ zh: '猜硬币博弈（零和）', en: 'Matching pennies (zero-sum)' })
    .setGrid(grid)
    .setAux([{ label: '说明', value: '求混合纳什', role: 'pivot' as BarRole }])
    .commit();
  // 通过 onSolve 捕获 p/q，避免在 onConclude 中引用尚未赋值的 r
  let pSolved = 0.5;
  let qSolved = 0.5;
  const r = gameNashEquilibrium(ROW, COL, {
    onSolve: (p, q) => {
      pSolved = p;
      qSolved = q;
      rec
        .begin({
          zh: `求解：p=${r2(p)}（行选行0），q=${r2(q)}（列选列0）`,
          en: `Solved: p=${r2(p)}, q=${r2(q)}`,
        })
        .setAux([
          { label: 'p', value: p.toFixed(4), role: 'final' as BarRole },
          { label: 'q', value: q.toFixed(4), role: 'final' as BarRole },
        ])
        .commit();
    },
    onConclude: (rv, cv) => {
      rec
        .begin({
          zh: `p=${r2(pSolved)}, q=${r2(qSolved)}，行值=${rv.toFixed(3)}，列值=${cv.toFixed(3)}`,
          en: `p=${r2(pSolved)}, q=${r2(qSolved)}, rowV=${rv.toFixed(3)}, colV=${cv.toFixed(3)}`,
        })
        .setAux([
          { label: 'p (行选行0)', value: pSolved.toFixed(4), role: 'final' as BarRole },
          { label: 'q (列选列0)', value: qSolved.toFixed(4), role: 'final' as BarRole },
          { label: '行期望', value: rv.toFixed(4), role: 'compare' as BarRole },
          { label: '列期望', value: cv.toFixed(4), role: 'compare' as BarRole },
        ])
        .commit();
    },
  });
  void r;
  return rec.build();
}

function r2(x: number): string {
  return x.toFixed(3);
}
