export interface MtHooks {
  onAccess?: (key: string, created: boolean) => void;
}
export class Multiton {
  private instances = new Map<string, { id: number }>();
  private next = 0;
  get(key: string, hooks: MtHooks = {}): { id: number } {
    let it = this.instances.get(key);
    const created = !it;
    if (!it) {
      it = { id: this.next++ };
      this.instances.set(key, it);
    }
    hooks.onAccess?.(key, created);
    return it;
  }
  size(): number {
    return this.instances.size;
  }
}
