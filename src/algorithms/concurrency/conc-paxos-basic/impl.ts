export interface PaxosHooks {
  onPrepare?: (n: number) => void;
  onPromise?: (acc: number) => void;
  onAccept?: (val: number) => void;
  onChosen?: (val: number) => void;
}
export function basicPaxos(
  acceptors: number,
  proposedValue: number,
  hooks: PaxosHooks = {},
): { chosen: number | null; majority: number } {
  const majority = Math.floor(acceptors / 2) + 1;
  const n = 1;
  hooks.onPrepare?.(n);
  let promises = 0;
  for (let a = 0; a < acceptors; a++) {
    promises++;
    hooks.onPromise?.(a);
  }
  let chosen: number | null = null;
  if (promises >= majority) {
    hooks.onAccept?.(proposedValue);
    let accepted = 0;
    for (let a = 0; a < acceptors; a++) {
      accepted++;
    }
    if (accepted >= majority) {
      chosen = proposedValue;
      hooks.onChosen?.(proposedValue);
    }
  }
  return { chosen, majority };
}
