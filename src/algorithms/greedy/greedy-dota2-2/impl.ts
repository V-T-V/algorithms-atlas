// Dota2 参议院 · 实现
export interface Dota2Hooks {
  onRound?: (round: number, remaining: string) => void;
  onConclude?: (winner: 'Radiant' | 'Dire') => void;
}
export interface Dota2Result {
  winner: 'Radiant' | 'Dire';
}
export function greedyDota2(senate: string, hooks: Dota2Hooks = {}): Dota2Result {
  const radiant: number[] = [];
  const dire: number[] = [];
  for (let i = 0; i < senate.length; i++) {
    if (senate[i] === 'R') radiant.push(i);
    else dire.push(i);
  }
  let round = 0;
  while (radiant.length > 0 && dire.length > 0) {
    round++;
    const r = radiant.shift()!;
    const d = dire.shift()!;
    if (r < d) radiant.push(r + senate.length);
    else dire.push(d + senate.length);
    hooks.onRound?.(round, '');
  }
  const winner: 'Radiant' | 'Dire' = radiant.length > 0 ? 'Radiant' : 'Dire';
  hooks.onConclude?.(winner);
  return { winner };
}
