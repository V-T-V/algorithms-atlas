// 流式构建器 · 实现
export interface BuiltQuery {
  table: string;
  columns: string[];
  where?: string;
  limit?: number;
}
export interface FluentHooks {
  onSet?: (field: string, value: unknown) => void;
  onBuild?: (q: BuiltQuery) => void;
}
export class QueryBuilder {
  private table = '';
  private columns: string[] = [];
  private whereClause?: string;
  private limitN?: number;
  constructor(private hooks: FluentHooks = {}) {}
  from(t: string): this {
    this.table = t;
    this.hooks.onSet?.('table', t);
    return this;
  }
  select(...cols: string[]): this {
    this.columns.push(...cols);
    this.hooks.onSet?.('columns', cols);
    return this;
  }
  where(w: string): this {
    this.whereClause = w;
    this.hooks.onSet?.('where', w);
    return this;
  }
  limit(n: number): this {
    this.limitN = n;
    this.hooks.onSet?.('limit', n);
    return this;
  }
  build(): BuiltQuery {
    const q: BuiltQuery = {
      table: this.table,
      columns: this.columns,
      where: this.whereClause,
      limit: this.limitN,
    };
    this.hooks.onBuild?.(q);
    return q;
  }
}
