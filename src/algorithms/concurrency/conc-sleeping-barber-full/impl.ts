export interface SbHooks {
  onArrive?: (cust: number, waiting: number) => void;
  onSit?: (cust: number) => void;
  onLeave?: (cust: number) => void;
  onCut?: (cust: number) => void;
}
export function sleepingBarberFull(
  chairs: number,
  customers: number,
  hooks: SbHooks = {},
): { served: number; lost: number } {
  let waiting = 0;
  let served = 0;
  let lost = 0;
  for (let c = 0; c < customers; c++) {
    hooks.onArrive?.(c, waiting);
    if (waiting < chairs) {
      waiting++;
      hooks.onSit?.(c);
      waiting--;
      served++;
      hooks.onCut?.(c);
    } else {
      lost++;
      hooks.onLeave?.(c);
    }
  }
  return { served, lost };
}
