// 流式 CSV 解析 · 纯算法实现
export interface CsvHooks {
  onRow?: (fields: string[]) => void;
}

export class StreamingCsv {
  private field = '';
  private row: string[] = [];
  private inQuotes = false;
  constructor(
    private sep = ',',
    private hooks: CsvHooks = {},
  ) {}
  feed(chunk: string): void {
    for (let i = 0; i < chunk.length; i++) {
      const c = chunk[i]!;
      if (this.inQuotes) {
        if (c === '"') {
          if (chunk[i + 1] === '"') {
            this.field += '"';
            i++;
          } else this.inQuotes = false;
        } else this.field += c;
      } else if (c === '"') this.inQuotes = true;
      else if (c === this.sep) {
        this.row.push(this.field);
        this.field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && chunk[i + 1] === '\n') i++;
        this.row.push(this.field);
        this.field = '';
        this.hooks.onRow?.(this.row);
        this.row = [];
      } else this.field += c;
    }
  }
  end(): void {
    if (this.field.length > 0 || this.row.length > 0) {
      this.row.push(this.field);
      this.field = '';
      this.hooks.onRow?.(this.row);
      this.row = [];
    }
  }
}
