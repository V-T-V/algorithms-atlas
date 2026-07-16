// =============================================================================
// 掷骰子 DP · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { diceRoll, type DiceRollHooks } from './impl.ts';

export const DEFAULT_INPUT = { faces: 6, rolls: 3, target: 8 };

export function buildTrace(
  input: { faces: number; rolls: number; target: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { faces, rolls, target } = input;
  const maxS = Math.min(target, rolls * faces);

  let curI = -1;
  let curS = -1;
  let ways = 0;
  const grid: Cell[][] = Array.from({ length: rolls + 1 }, () =>
    Array.from({ length: maxS + 1 }, () => ({ v: '', role: 'default' as BarRole })),
  );

  const render = (note: { zh: string; en: string }): void => {
    const display: Cell[][] = grid.map((row, ri) =>
      row.map((c, ci) => {
        let role = c.role;
        if (c.v === '') role = 'default';
        else if (ri === curI && ci === curS) role = 'compare';
        else if (ri === rolls && ci === target) role = 'final';
        else role = 'frontier';
        return { v: c.v, role };
      }),
    );
    rec
      .begin(note)
      .setGrid(display)
      .setAux([
        { label: '骰子面', value: String(faces), role: 'frontier' },
        { label: '掷次', value: String(rolls), role: 'frontier' },
        { label: '目标', value: String(target), role: 'final' },
        { label: '当前', value: curI >= 0 ? `dp[${curI}][${curS}]` : '—', role: 'compare' },
      ])
      .commit();
  };

  render({
    zh: `m=${faces} 面骰子掷 ${rolls} 次目标 ${target}`,
    en: `${faces}-faced die, ${rolls} rolls, target ${target}`,
  });

  const hooks: DiceRollHooks = {
    onCell: (i, s, val) => {
      curI = i;
      curS = s;
      grid[i]![s] = { v: val, role: 'default' };
      render({ zh: `dp[${i}][${s}] = ${val}`, en: `dp[${i}][${s}] = ${val}` });
    },
    onResult: (w) => {
      ways = w;
      curI = -1;
      curS = -1;
    },
  };

  diceRoll(input, hooks);

  curI = rolls;
  curS = target;
  rec
    .begin({ zh: `方案数 ${ways}`, en: `${ways} ways` })
    .setGrid(
      grid.map((row, ri) =>
        row.map((c, ci) => ({
          v: c.v,
          role: (ri === rolls && ci === target
            ? 'final'
            : c.v === ''
              ? 'default'
              : 'frontier') as BarRole,
        })),
      ),
    )
    .setAux([{ label: '方案数', value: String(ways), role: 'final' }])
    .commit();

  return rec.build();
}
