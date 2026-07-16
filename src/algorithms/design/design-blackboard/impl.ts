export type KnowledgeSource = {
  canHandle: (b: Map<string, string>) => boolean;
  apply: (b: Map<string, string>) => void;
  name: string;
};
export interface BbHooks {
  onApply?: (ks: string) => void;
  onRound?: (round: number) => void;
}
export function runBlackboard(
  board: Map<string, string>,
  sources: KnowledgeSource[],
  maxRounds: number,
  hooks: BbHooks = {},
): void {
  for (let r = 0; r < maxRounds; r++) {
    hooks.onRound?.(r);
    let progress = false;
    for (const ks of sources) {
      if (ks.canHandle(board)) {
        ks.apply(board);
        hooks.onApply?.(ks.name);
        progress = true;
      }
    }
    if (!progress) break;
  }
}
