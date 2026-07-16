// 随机锦标赛 · 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface RtRound {
  round: number;
  pairs: Array<{ a: number; b: number; winner: number }>;
  survivors: number[];
}

export interface RtResult {
  champion: number;
  rounds: RtRound[];
}

/** 随机配对锦标赛，返回冠军（最大值）与每轮记录。 */
export function randomTournament(values: number[], rng: Rng): RtResult {
  if (values.length === 0) throw new Error('空');
  let survivors = [...values];
  const rounds: RtRound[] = [];
  let roundNo = 0;
  while (survivors.length > 1) {
    roundNo++;
    // 随机打乱
    survivors = [...survivors].sort(() => rng() - 0.5);
    const pairs: Array<{ a: number; b: number; winner: number }> = [];
    const next: number[] = [];
    for (let i = 0; i < survivors.length; i += 2) {
      if (i + 1 < survivors.length) {
        const a = survivors[i]!;
        const b = survivors[i + 1]!;
        const w = a >= b ? a : b;
        pairs.push({ a, b, winner: w });
        next.push(w);
      } else {
        next.push(survivors[i]!); // 奇数轮空
      }
    }
    rounds.push({ round: roundNo, pairs, survivors: [...next] });
    survivors = next;
  }
  return { champion: survivors[0]!, rounds };
}
