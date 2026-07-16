// CQRS · 实现
export interface CqrsHooks {
  onCommand?: (type: string) => void;
  onQuery?: (type: string) => void;
}
export class CqrsStore<T extends { id: string }> {
  private writeModel = new Map<string, T>();
  private readModel = new Map<string, T>();
  constructor(private hooks: CqrsHooks = {}) {}
  // Command：写
  executeCreate(item: T): void {
    this.hooks.onCommand?.('create');
    this.writeModel.set(item.id, item);
    this.readModel.set(item.id, { ...item });
  }
  executeUpdate(id: string, patch: Partial<T>): void {
    this.hooks.onCommand?.('update');
    const cur = this.writeModel.get(id);
    if (cur) {
      const u = { ...cur, ...patch };
      this.writeModel.set(id, u);
      this.readModel.set(id, { ...u });
    }
  }
  executeDelete(id: string): void {
    this.hooks.onCommand?.('delete');
    this.writeModel.delete(id);
    this.readModel.delete(id);
  }
  // Query：读（从读模型）
  queryById(id: string): T | undefined {
    this.hooks.onQuery?.('byId');
    return this.readModel.get(id);
  }
  queryAll(): T[] {
    this.hooks.onQuery?.('all');
    return [...this.readModel.values()];
  }
}
