// =============================================================================
// 鸡蛋掉落·二分优化 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { superEggDrop, type EggDropHooks } from './impl.ts';

export const DEFAULT_INPUT = { K: 3, N: 14 };

export function buildTrace(input: { K: number; N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { K, N } = input;

  let curK = 0;
  let curN = 0;
  let answer = 0;
  // 二维表（行 k=1..K，列 n=0..N），未填为空
  const grid: Cell[][] = Array.from({ length: K }, () =>
    Array.from({ length: N + 1 }, () => ({ v: '·', role: 'default' as BarRole })),
  );

  const render = (note: { zh: string; en: string }): void => {
    const display: Cell[][] = grid.map((row, ri) =>
      row.map((c, ci) => {
        let role = c.role;
        if (ri + 1 === curK && ci === curN) role = 'compare';
        else if (c.v !== '·') role = 'frontier';
        return { v: c.v, role };
      }),
    );
    // 行首加鸡蛋数标签
    rec
      .begin(note)
      .setGrid(display)
      .setAux([
        { label: 'K', value: String(K), role: 'frontier' },
        { label: 'N', value: String(N), role: 'frontier' },
        { label: '当前', value: curK ? `dp[${curK}][${curN}]` : '—', role: 'compare' },
        { label: '答案', value: answer ? String(answer) : '（计算中）', role: 'final' },
      ])
      .commit();
  };

  render({ zh: `K=${K} 个蛋，N=${N} 层楼`, en: `K=${K} eggs, N=${N} floors` });

  const hooks: EggDropHooks = {
    onCell: (k, n, val) => {
      curK = k;
      curN = n;
      grid[k - 1]![n] = { v: val, role: 'default' };
      render({ zh: `dp[${k}][${n}] = ${val}`, en: `dp[${k}][${n}] = ${val}` });
    },
    onResult: (a) => {
      answer = a;
      curK = 0;
      curN = 0;
    },
  };

  superEggDrop(K, N, hooks);

  // 终态：高亮答案格
  curK = K;
  curN = N;
  rec
    .begin({ zh: `最少 ${answer} 次试探`, en: `Minimum ${answer} trials` })
    .setGrid(
      grid.map((row, ri) =>
        row.map((c, ci) => ({
          v: c.v,
          role: (ri + 1 === K && ci === N
            ? 'final'
            : c.v === '·'
              ? 'default'
              : 'frontier') as BarRole,
        })),
      ),
    )
    .setAux([{ label: '答案', value: String(answer), role: 'final' }])
    .commit();

  return rec.build();
}
