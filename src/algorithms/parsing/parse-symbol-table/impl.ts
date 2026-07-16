// =============================================================================
// 符号表管理 · 纯算法实现
// 单层符号表：enter / lookup / 重复定义检测。
// =============================================================================

export type SymbolKind = 'var' | 'func' | 'class' | 'param' | 'const';

export interface SymbolInfo {
  name: string;
  kind: SymbolKind;
  type: string; // 类型字符串，如 'int'、'int->int'
  /** 内存偏移 / 索引（演示用）。 */
  offset?: number;
  /** 声明所在行号。 */
  line?: number;
}

export class SymbolTableError extends Error {
  public constructor(msg: string) {
    super(msg);
    this.name = 'SymbolTableError';
  }
}

export class SymbolTable {
  private readonly table = new Map<string, SymbolInfo>();
  private readonly order: string[] = [];

  public constructor(public readonly scopeName: string = 'global') {}

  /** 插入一个符号；若已存在则抛错。 */
  public enter(info: SymbolInfo): void {
    if (this.table.has(info.name)) {
      throw new SymbolTableError(`重复定义：${info.name}（作用域 ${this.scopeName}）`);
    }
    this.table.set(info.name, info);
    this.order.push(info.name);
  }

  /** 查询；不存在返回 undefined。 */
  public lookup(name: string): SymbolInfo | undefined {
    return this.table.get(name);
  }

  /** 是否已声明。 */
  public has(name: string): boolean {
    return this.table.has(name);
  }

  /** 当前表大小。 */
  public get size(): number {
    return this.table.size;
  }

  /** 按声明顺序获取所有符号。 */
  public entries(): SymbolInfo[] {
    return this.order.map((n) => this.table.get(n)!);
  }
}

export interface BuildHooks {
  onEnter?: (info: SymbolInfo, ok: boolean) => void;
  onLookup?: (name: string, found: boolean) => void;
  onResult?: (table: SymbolTable, errors: string[]) => void;
}

/**
 * 给定一系列声明 + 引用事件，构建符号表，并报告错误（重复定义、未定义引用）。
 *
 * @param events 事件列表
 * @param scopeName 作用域名
 * @param hooks 可选钩子
 */
export function buildSymbolTable(
  events: Array<{ kind: 'declare'; info: SymbolInfo } | { kind: 'use'; name: string }>,
  scopeName = 'global',
  hooks: BuildHooks = {},
): { table: SymbolTable; errors: string[] } {
  const table = new SymbolTable(scopeName);
  const errors: string[] = [];
  for (const ev of events) {
    if (ev.kind === 'declare') {
      try {
        table.enter(ev.info);
        hooks.onEnter?.(ev.info, true);
      } catch (e) {
        const msg = e instanceof SymbolTableError ? e.message : String(e);
        errors.push(msg);
        hooks.onEnter?.(ev.info, false);
      }
    } else {
      const found = table.has(ev.name);
      if (!found) errors.push(`未定义引用：${ev.name}`);
      hooks.onLookup?.(ev.name, found);
    }
  }
  hooks.onResult?.(table, errors);
  return { table, errors };
}
