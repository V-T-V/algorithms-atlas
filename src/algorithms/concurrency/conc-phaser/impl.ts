export interface PhaserHooks {
  onArrive?: (tid: number, phase: number) => void;
  onAdvance?: (phase: number, parties: number) => void;
}
export function phaserSync(parties: number, phases: number, hooks: PhaserHooks = {}): number {
  let cur = 0;
  for (let ph = 0; ph < phases; ph++) {
    for (let p = 0; p < parties; p++) hooks.onArrive?.(p, ph);
    cur++;
    hooks.onAdvance?.(ph, parties);
  }
  return cur;
}
