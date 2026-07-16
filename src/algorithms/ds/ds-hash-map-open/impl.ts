// =============================================================================
// 开放寻址哈希表（线性探测）· 纯算法实现
// =============================================================================

export interface OpenHashMapHooks {
  onProbe?: (idx: number, key: string) => void;
  onInsert?: (idx: number, key: string) => void;
  onResize?: (oldCap: number, newCap: number) => void;
  onDelete?: (idx: number) => void;
}

interface Slot {
  key: string;
  value: number;
  used: boolean; // 是否有活条目
  deleted: boolean; // 是否墓碑
}

export class OpenHashMap {
  private slots: Slot[];
  private cap: number;
  private size = 0; // 活条目数
  private used = 0; // 占用（含墓碑）数
  private hooks: OpenHashMapHooks;
  private static readonly LOAD = 0.7;

  constructor(initialCapacity = 8, hooks: OpenHashMapHooks = {}) {
    this.cap = OpenHashMap.nextPow2(initialCapacity);
    this.slots = OpenHashMap.emptyTable(this.cap);
    this.hooks = hooks;
  }

  private static emptyTable(cap: number): Slot[] {
    return Array.from({ length: cap }, () => ({ key: '', value: 0, used: false, deleted: false }));
  }

  private static nextPow2(x: number): number {
    let c = 4;
    while (c < x) c <<= 1;
    return c;
  }

  private hash(key: string): number {
    // FNV-1a
    let h = 2166136261 >>> 0;
    for (let i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  private findSlot(key: string): number {
    const mask = this.cap - 1;
    let i = this.hash(key) & mask;
    let firstTomb = -1;
    for (let step = 0; step < this.cap; step++) {
      const slot = this.slots[i]!;
      this.hooks.onProbe?.(i, key);
      if (!slot.used) {
        // 空槽：key 不存在
        return firstTomb >= 0 ? firstTomb : i;
      }
      if (slot.deleted) {
        if (firstTomb < 0) firstTomb = i;
      } else if (slot.key === key) {
        return i; // 已存在的活条目
      }
      i = (i + 1) & mask;
    }
    return firstTomb >= 0 ? firstTomb : -1;
  }

  private maybeResize(): void {
    if (this.used / this.cap < OpenHashMap.LOAD) return;
    const oldSlots = this.slots;
    this.cap <<= 1;
    this.slots = OpenHashMap.emptyTable(this.cap);
    this.size = 0;
    this.used = 0;
    this.hooks.onResize?.(this.cap >> 1, this.cap);
    for (const s of oldSlots) {
      if (s.used && !s.deleted) this.rawSet(s.key, s.value);
    }
  }

  private rawSet(key: string, value: number): void {
    const i = this.findSlot(key);
    const slot = this.slots[i]!;
    if (!slot.used || slot.deleted) {
      slot.used = true;
      slot.deleted = false;
      slot.key = key;
      this.used++;
      this.size++;
      this.hooks.onInsert?.(i, key);
    }
    slot.value = value;
  }

  put(key: string, value: number): void {
    this.maybeResize();
    // 先查是否已存在（不增加 used）
    const i = this.findSlot(key);
    const slot = this.slots[i]!;
    if (slot.used && !slot.deleted && slot.key === key) {
      slot.value = value;
      return;
    }
    this.rawSet(key, value);
  }

  get(key: string): number | undefined {
    const mask = this.cap - 1;
    let i = this.hash(key) & mask;
    for (let step = 0; step < this.cap; step++) {
      const slot = this.slots[i]!;
      this.hooks.onProbe?.(i, key);
      if (!slot.used) return undefined;
      if (!slot.deleted && slot.key === key) return slot.value;
      i = (i + 1) & mask;
    }
    return undefined;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    const mask = this.cap - 1;
    let i = this.hash(key) & mask;
    for (let step = 0; step < this.cap; step++) {
      const slot = this.slots[i]!;
      if (!slot.used) return false;
      if (!slot.deleted && slot.key === key) {
        slot.deleted = true;
        slot.used = true;
        this.size--;
        this.hooks.onDelete?.(i);
        return true;
      }
      i = (i + 1) & mask;
    }
    return false;
  }

  get length(): number {
    return this.size;
  }
}
