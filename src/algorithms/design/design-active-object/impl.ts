type Method = () => void;
export class ActiveObject {
  private q: Method[] = [];
  private log: string[] = [];
  schedule(m: Method): void {
    this.q.push(m);
  }
  runSync(hooks: { onExec?: (i: number) => void } = {}): string[] {
    let i = 0;
    while (this.q.length) {
      const m = this.q.shift()!;
      m();
      hooks.onExec?.(i++);
    }
    return this.log;
  }
  pushLog(s: string): void {
    this.log.push(s);
  }
}
