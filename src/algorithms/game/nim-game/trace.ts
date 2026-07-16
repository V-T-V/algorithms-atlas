// =============================================================================
// Nim 博弈 · 录制帧序列
// 可视化：setArray 渲染各堆石子数（带指针），setAux 展示 nim-sum 与必胜/必败判断。
// roles: 必胜取法的目标堆='swap'，其它='default'；展示 nim-sum 计算过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nimGame, type NimGameHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 4, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  let nimSum = 0;
  let firstPlayerWins = false;
  let winningPile = -1;

  // 初始
  nimSum = input.reduce((acc, p) => acc ^ p, 0);
  rec
    .begin({
      zh: `${input.length} 堆石子：[${input.join(', ')}]，计算异或和 nim-sum = ${nimSum}`,
      en: `${input.length} piles: [${input.join(', ')}], compute nim-sum (xor) = ${nimSum}`,
    })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .setAux([
      { label: 'nim-sum', value: binLine(nimSum), role: 'pivot' as BarRole },
      {
        label: '判定',
        value: nimSum !== 0 ? '先手必胜' : '先手必败',
        role: (nimSum !== 0 ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  // 逐步展示每堆的二进制贡献
  let runningXor = 0;
  for (let i = 0; i < input.length; i++) {
    const prev = runningXor;
    runningXor ^= input[i]!;
    const pointers = [{ index: i, label: `第 ${i} 堆` }];
    rec
      .begin({
        zh: `第 ${i} 堆 = ${input[i]}（${bin8(input[i]!)}）：${bin8(prev)} ⊕ ${bin8(input[i]!)} = ${bin8(runningXor)}`,
        en: `Pile ${i} = ${input[i]} (${bin8(input[i]!)}): ${bin8(prev)} ⊕ ${bin8(input[i]!)} = ${bin8(runningXor)}`,
      })
      .setArray(
        [...input],
        input.map((_, k) => (k === i ? ('compare' as BarRole) : ('default' as BarRole))),
        pointers,
      )
      .setAux([
        { label: '累计 ⊕', value: binLine(runningXor), role: 'pivot' as BarRole },
        { label: '当前堆', value: `${input[i]} = ${bin8(input[i]!)}`, role: 'compare' as BarRole },
      ])
      .commit();
  }

  const hooks: NimGameHooks = {
    onNimSum: (_piles, ns) => {
      nimSum = ns;
    },
    onConclude: (wins, ns) => {
      firstPlayerWins = wins;
      rec
        .begin({
          zh:
            ns === 0
              ? `nim-sum = 0 → 先手必败（N 态：无论怎么取都把必胜态让给对手）`
              : `nim-sum = ${ns} ≠ 0 → 先手必胜（P 态：存在取法使 nim-sum 归零）`,
          en:
            ns === 0
              ? `nim-sum = 0 → first player LOSES (any move leaves a non-zero sum)`
              : `nim-sum = ${ns} ≠ 0 → first player WINS (can force the sum to zero)`,
        })
        .setArray(
          [...input],
          input.map(() => (ns === 0 ? ('warn' as BarRole) : ('final' as BarRole))),
          [],
        )
        .setAux([
          { label: 'nim-sum', value: binLine(ns), role: 'pivot' as BarRole },
          {
            label: '结论',
            value: wins ? '先手必胜 / first wins' : '先手必败 / first loses',
            role: (wins ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
    onWinningMove: (pileIndex, take, after) => {
      winningPile = pileIndex;
      const pointers = [{ index: pileIndex, label: `必胜取法` }];
      rec
        .begin({
          zh: `必胜取法：从第 ${pileIndex} 堆（${input[pileIndex]}）取走 ${take} 颗 → 剩余 ${after[pileIndex]}，使 nim-sum 归零`,
          en: `Winning move: take ${take} from pile ${pileIndex} (${input[pileIndex]}) → leaves ${after[pileIndex]}, forcing nim-sum = 0`,
        })
        .setArray(
          [...input],
          input.map((_, k) => (k === pileIndex ? ('swap' as BarRole) : ('default' as BarRole))),
          pointers,
        )
        .setAux([
          { label: '取法', value: `第 ${pileIndex} 堆取 ${take}`, role: 'swap' as BarRole },
          { label: '取后各堆', value: after.join(', '), role: 'final' as BarRole },
          { label: '取后 nim-sum', value: '0', role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = nimGame(input, hooks);

  // 终态
  rec
    .begin({
      zh: firstPlayerWins
        ? `先手必胜：nim-sum=${result.nimSum}，必胜取法为第 ${winningPile} 堆取 ${result.winningMove?.[1]}`
        : `先手必败：nim-sum=0，先手无必胜取法`,
      en: firstPlayerWins
        ? `First player wins: nim-sum=${result.nimSum}, winning move = pile ${winningPile} take ${result.winningMove?.[1]}`
        : `First player loses: nim-sum=0, no winning move`,
    })
    .setArray(
      [...input],
      input.map((_, k) =>
        firstPlayerWins && k === winningPile ? ('final' as BarRole) : ('default' as BarRole),
      ),
      [],
    )
    .setAux([
      { label: 'nim-sum', value: binLine(result.nimSum), role: 'final' as BarRole },
      {
        label: '结论',
        value: firstPlayerWins ? '先手必胜' : '先手必败',
        role: (firstPlayerWins ? 'final' : 'warn') as BarRole,
      },
      ...(result.winningMove
        ? [
            {
              label: '必胜取法',
              value: `第 ${result.winningMove[0]} 堆取 ${result.winningMove[1]}`,
              role: 'final' as BarRole,
            },
          ]
        : []),
    ])
    .commit();

  return rec.build();
}

/** 把整数格式化成 8 位二进制（高位补 0），便于直观展示异或。 */
function bin8(v: number): string {
  return v.toString(2).padStart(8, '0');
}

/** 把 nim-sum 同时给出十进制和二进制。 */
function binLine(v: number): string {
  return `${v} (${bin8(v)})`;
}
