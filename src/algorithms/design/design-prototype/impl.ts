// 原型模式 · 实现
export interface PrototypeHooks {
  onClone?: (typeName: string, originalId: number, newId: number) => void;
  onRegister?: (typeName: string, total: number) => void;
}

export interface Monster {
  id: number;
  type: string;
  hp: number;
  pos: { x: number; y: number };
  clone(): Monster;
}

export class Goblin implements Monster {
  private static nextId = 1;
  constructor(
    public id: number,
    public type: string,
    public hp: number,
    public pos: { x: number; y: number },
    private readonly hooks: PrototypeHooks = {},
  ) {}
  clone(): Monster {
    const copy = new Goblin(
      MonsterProtoRegistry.nextId(),
      this.type,
      this.hp,
      { x: this.pos.x, y: this.pos.y },
      this.hooks,
    );
    this.hooks.onClone?.(this.type, this.id, copy.id);
    return copy;
  }
}

export class Dragon implements Monster {
  constructor(
    public id: number,
    public type: string,
    public hp: number,
    public pos: { x: number; y: number },
    public readonly loot: string[],
    private readonly hooks: PrototypeHooks = {},
  ) {}
  clone(): Monster {
    // 深克隆 loot 数组
    const copy = new Dragon(
      MonsterProtoRegistry.nextId(),
      this.type,
      this.hp,
      { x: this.pos.x, y: this.pos.y },
      [...this.loot],
      this.hooks,
    );
    this.hooks.onClone?.(this.type, this.id, copy.id);
    return copy;
  }
}

export class MonsterProtoRegistry {
  private static idCounter = 0;
  private static protos = new Map<string, Monster>();
  private static hooks: PrototypeHooks = {};

  static setHooks(h: PrototypeHooks): void {
    this.hooks = h;
  }
  static nextId(): number {
    return ++this.idCounter;
  }
  static register(key: string, m: Monster): void {
    this.protos.set(key, m);
    this.hooks.onRegister?.(key, this.protos.size);
  }
  static get(key: string): Monster | undefined {
    return this.protos.get(key);
  }
  static create(key: string): Monster | undefined {
    const p = this.protos.get(key);
    return p?.clone();
  }
  static size(): number {
    return this.protos.size;
  }
  static reset(): void {
    this.protos.clear();
    this.idCounter = 0;
  }
}
