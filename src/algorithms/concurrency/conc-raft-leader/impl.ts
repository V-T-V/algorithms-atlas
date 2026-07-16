export interface RaftHooks {
  onCandidate?: (node: number, term: number) => void;
  onVote?: (voter: number) => void;
  onLeader?: (node: number) => void;
}
export function raftLeaderElection(
  nodes: number,
  candidate: number,
  votesGranted: number,
  hooks: RaftHooks = {},
): { leader: number | null; term: number } {
  const term = 1;
  hooks.onCandidate?.(candidate, term);
  for (let v = 0; v < votesGranted; v++) hooks.onVote?.(v);
  const majority = Math.floor(nodes / 2) + 1;
  let leader: number | null = null;
  if (votesGranted >= majority) {
    leader = candidate;
    hooks.onLeader?.(candidate);
  }
  return { leader, term };
}
