export interface Logger {
  log(msg: string): void;
}
export class ConsoleLogger implements Logger {
  log(msg: string): void {
    /* write */
  }
}
export class NullLogger implements Logger {
  log(_msg: string): void {
    /* no-op */
  }
}
export interface NhHooks {
  onLog?: (target: string, msg: string) => void;
}
export function runWithLogger(log: Logger, messages: string[], hooks: NhHooks = {}): number {
  let count = 0;
  for (const m of messages) {
    log.log(m);
    hooks.onLog?.(log instanceof NullLogger ? 'null' : 'console', m);
    count++;
  }
  return count;
}
