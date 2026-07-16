// 牛顿分形 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { Cell, BarRole } from '../../../types.ts';
import { newtonFractal } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const degree = 3; // z³ − 1
  const width = 24;
  const height = 16;

  rec
    .begin({ zh: `f(z) = z³ − 1 的牛顿分形`, en: `Newton fractal of f(z) = z³ − 1` })
    .setAux([{ label: `网格`, value: `${width}×${height}` }])
    .commit();

  const grid = newtonFractal(degree, -2, 2, -1.5, 1.5, width, height);

  // 用 setGrid 展示：每格按收敛根编号与迭代次数显示
  const cells: Cell[][] = grid.map((row) =>
    row.map((p) => {
      const role: BarRole = p.converged
        ? p.rootIndex === 0
          ? 'final'
          : p.rootIndex === 1
            ? 'swap'
            : p.rootIndex === 2
              ? 'frontier'
              : 'default'
        : 'warn';
      return {
        v: p.converged ? `${p.rootIndex + 1}` : '?',
        role,
      } as Cell;
    }),
  );

  rec
    .begin({ zh: `按收敛根着色（1=蓝/2=红/3=绿）`, en: `Colored by root (1=blue/2=red/3=green)` })
    .setGrid(cells)
    .setAux([
      { label: `根 1`, value: '1 (蓝)' },
      { label: `根 2`, value: 'e^{2πi/3} (红)' },
      { label: `根 3`, value: 'e^{4πi/3} (绿)' },
    ])
    .commit();

  return rec.build();
}
