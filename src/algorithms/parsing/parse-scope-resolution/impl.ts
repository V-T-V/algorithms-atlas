// =============================================================================
// 作用域解析 · 纯算法实现
// 嵌套作用域链：子作用域屏蔽父作用域同名声明。
// =============================================================================

export interface SymbolInfo {
  name: string;
  type: string;
  /** 声明所在作用域深度。 */
  depth: number;
}

export class Scope {
  public readonly symbols = new Map<string, SymbolInfo>();
  public readonly children: Scope[] = [];

  public constructor(
    public readonly name: string,
    public readonly depth: number,
    public readonly parent: Scope | null,
  ) {}

  /** 在本作用域登记符号；同名覆盖（屏蔽外层）。 */
  public declare(name: string, type: string): SymbolInfo {
    const info: SymbolInfo = { name, type, depth: this.depth };
    this.symbols.set(name, info);
    return info;
  }

  /** 本作用域是否声明。 */
  public hasLocal(name: string): boolean {
    return this.symbols.has(name);
  }

  /** 沿父链查找；返回找到的符号与所在作用域。 */
  public resolve(name: string): { info: SymbolInfo; scope: Scope } | undefined {
    const local = this.symbols.get(name);
    if (local) return { info: local, scope: this };
    return this.parent?.resolve(name);
  }
}

export class ScopeStack {
  private current: Scope;
  public readonly root: Scope;

  public constructor(rootName = 'global') {
    this.root = new Scope(rootName, 0, null);
    this.current = this.root;
  }

  /** 进入新作用域。 */
  public push(name: string): Scope {
    const s = new Scope(name, this.current.depth + 1, this.current);
    this.current.children.push(s);
    this.current = s;
    return s;
  }

  /** 退出当前作用域。 */
  public pop(): Scope {
    if (this.current.parent === null) return this.current;
    const leaving = this.current;
    this.current = this.current.parent;
    return leaving;
  }

  /** 当前作用域。 */
  public top(): Scope {
    return this.current;
  }

  /** 在当前作用域登记。 */
  public declare(name: string, type: string): SymbolInfo {
    return this.current.declare(name, type);
  }

  /** 从当前作用域开始查找。 */
  public resolve(name: string): { info: SymbolInfo; scope: Scope } | undefined {
    return this.current.resolve(name);
  }
}

export interface ScopeHooks {
  onPush?: (scope: Scope) => void;
  onPop?: (scope: Scope) => void;
  onDeclare?: (info: SymbolInfo, scope: Scope) => void;
  onResolve?: (name: string, found: boolean, resolvedDepth?: number) => void;
}

/** 操作事件。 */
export type ScopeEvent =
  | { kind: 'push'; name: string }
  | { kind: 'pop' }
  | { kind: 'declare'; name: string; type: string }
  | { kind: 'use'; name: string };

/**
 * 按事件序列运行作用域栈，报告未定义引用与屏蔽情况。
 *
 * @param events 事件
 * @param hooks 可选钩子
 */
export function runScopes(
  events: ScopeEvent[],
  hooks: ScopeHooks = {},
): {
  stack: ScopeStack;
  errors: string[];
  shadows: Array<{ name: string; inner: number; outer: number }>;
} {
  const stack = new ScopeStack();
  const errors: string[] = [];
  const shadows: Array<{ name: string; inner: number; outer: number }> = [];

  for (const ev of events) {
    if (ev.kind === 'push') {
      const s = stack.push(ev.name);
      hooks.onPush?.(s);
    } else if (ev.kind === 'pop') {
      if (stack.top().parent === null) {
        errors.push('在根作用域执行 pop');
        continue;
      }
      const s = stack.pop();
      hooks.onPop?.(s);
    } else if (ev.kind === 'declare') {
      // 检查是否屏蔽外层
      const outer = stack.top().parent?.resolve(ev.name);
      if (outer) {
        shadows.push({ name: ev.name, inner: stack.top().depth, outer: outer.scope.depth });
      }
      const info = stack.declare(ev.name, ev.type);
      hooks.onDeclare?.(info, stack.top());
    } else {
      const r = stack.resolve(ev.name);
      if (!r) errors.push(`未定义引用：${ev.name}`);
      hooks.onResolve?.(ev.name, !!r, r?.scope.depth);
    }
  }
  return { stack, errors, shadows };
}
