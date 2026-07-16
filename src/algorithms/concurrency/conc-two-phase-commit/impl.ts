export interface TpcHooks {
  onPrepare?: (p: number) => void;
  onVote?: (p: number, yes: boolean) => void;
  onCommit?: () => void;
  onAbort?: () => void;
}
export function twoPhaseCommit(
  participants: number,
  votes: boolean[],
  hooks: TpcHooks = {},
): 'commit' | 'abort' {
  let allYes = true;
  for (let p = 0; p < participants; p++) {
    hooks.onPrepare?.(p);
    hooks.onVote?.(p, votes[p] ?? true);
    if (!votes[p]) allYes = false;
  }
  if (allYes) {
    hooks.onCommit?.();
    return 'commit';
  }
  hooks.onAbort?.();
  return 'abort';
}
