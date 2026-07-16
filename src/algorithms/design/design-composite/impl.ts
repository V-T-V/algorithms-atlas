// 组合模式 · 实现
export interface CompositeHooks {
  onVisit?: (name: string, kind: 'file' | 'dir', size: number) => void;
  onResult?: (totalSize: number, totalNodes: number) => void;
}

export interface FsNode {
  name: string;
  size(): number;
  kind: 'file' | 'dir';
}

export class File implements FsNode {
  constructor(
    public readonly name: string,
    public readonly bytes: number,
    private readonly hooks: CompositeHooks = {},
  ) {}
  get kind(): 'file' {
    return 'file';
  }
  size(): number {
    this.hooks.onVisit?.(this.name, 'file', this.bytes);
    return this.bytes;
  }
}

export class Directory implements FsNode {
  private children: FsNode[] = [];
  constructor(
    public readonly name: string,
    private readonly hooks: CompositeHooks = {},
  ) {}
  get kind(): 'dir' {
    return 'dir';
  }
  add(c: FsNode): this {
    this.children.push(c);
    return this;
  }
  size(): number {
    const total = this.children.reduce((acc, c) => acc + c.size(), 0);
    this.hooks.onVisit?.(this.name, 'dir', total);
    return total;
  }
  count(): number {
    return (
      1 +
      this.children.reduce((acc, c) => acc + (c.kind === 'dir' ? (c as Directory).count() : 1), 0)
    );
  }
}
