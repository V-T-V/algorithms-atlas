// 享元模式 · 实现
export interface FlyweightHooks {
  onCreate?: (key: string, total: number) => void;
  onReuse?: (key: string, total: number) => void;
  onPlant?: (key: string, x: number, y: number, total: number) => void;
}

export interface TreeType {
  name: string;
  color: string;
  texture: string;
}

export class TreeFlyweight implements TreeType {
  constructor(
    public readonly name: string,
    public readonly color: string,
    public readonly texture: string,
  ) {}
  key(): string {
    return `${this.name}|${this.color}|${this.texture}`;
  }
}

export interface PlantedTree {
  typeKey: string;
  x: number;
  y: number;
}

export class TreeFactory {
  private pool = new Map<string, TreeFlyweight>();
  private readonly hooks: FlyweightHooks;
  constructor(hooks: FlyweightHooks = {}) {
    this.hooks = hooks;
  }

  get(name: string, color: string, texture: string): TreeFlyweight {
    const key = `${name}|${color}|${texture}`;
    const existing = this.pool.get(key);
    if (existing) {
      this.hooks.onReuse?.(key, this.pool.size);
      return existing;
    }
    const fw = new TreeFlyweight(name, color, texture);
    this.pool.set(key, fw);
    this.hooks.onCreate?.(key, this.pool.size);
    return fw;
  }

  poolSize(): number {
    return this.pool.size;
  }
}

export class Forest {
  private trees: PlantedTree[] = [];
  private readonly factory: TreeFactory;
  private readonly hooks: FlyweightHooks;
  constructor(factory: TreeFactory, hooks: FlyweightHooks = {}) {
    this.factory = factory;
    this.hooks = hooks;
  }

  plant(name: string, color: string, texture: string, x: number, y: number): void {
    const fw = this.factory.get(name, color, texture);
    this.trees.push({ typeKey: fw.key(), x, y });
    this.hooks.onPlant?.(fw.key(), x, y, this.trees.length);
  }

  treeCount(): number {
    return this.trees.length;
  }
}
