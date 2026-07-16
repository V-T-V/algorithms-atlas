export interface OptHooks {
  onRead?: (ver: number) => void;
  onCommit?: (ok: boolean) => void;
  onRetry?: () => void;
}
export function optimisticLock(
  readVer: number,
  curVer: number,
  write: (v: number) => number,
  hooks: OptHooks = {},
): { ok: boolean; ver: number } {
  hooks.onRead?.(readVer);
  let ver = curVer;
  let attempts = 0;
  while (true) {
    if (readVer === ver) {
      ver = write(ver);
      hooks.onCommit?.(true);
      return { ok: true, ver };
    }
    attempts++;
    if (attempts > 3) {
      hooks.onCommit?.(false);
      return { ok: false, ver };
    }
    hooks.onRetry?.();
    readVer = ver;
  }
}
