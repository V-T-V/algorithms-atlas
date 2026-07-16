// 模板方法模式 · 实现
export interface PipelineHooks {
  onStep?: (stepName: string, input: string, output: string) => void;
  onResult?: (finalOutput: string) => void;
}

export abstract class DataPipeline {
  protected readonly hooks: PipelineHooks;
  constructor(hooks: PipelineHooks = {}) {
    this.hooks = hooks;
  }

  // 模板方法：固定骨架
  public run(raw: string): string {
    const data = this.read(raw);
    const parsed = this.parse(data);
    const out = this.output(parsed);
    this.hooks.onResult?.(out);
    return out;
  }

  // 抽象步骤
  protected abstract read(raw: string): string;
  protected abstract parse(data: string): unknown[];
  // 公共步骤
  protected output(parsed: unknown[]): string {
    const s = JSON.stringify(parsed);
    this.hooks.onStep?.('output', JSON.stringify(parsed), s);
    return s;
  }
}

export class CsvPipeline extends DataPipeline {
  protected read(raw: string): string {
    this.hooks.onStep?.('read', raw, raw);
    return raw;
  }
  protected parse(data: string): unknown[] {
    const lines = data.split('\n').filter((l) => l.length > 0);
    const rows = lines.map((l) => l.split(','));
    this.hooks.onStep?.('parse', data, JSON.stringify(rows));
    return rows;
  }
}

export class JsonPipeline extends DataPipeline {
  protected read(raw: string): string {
    this.hooks.onStep?.('read', raw, raw);
    return raw;
  }
  protected parse(data: string): unknown[] {
    const arr = JSON.parse(data) as unknown[];
    this.hooks.onStep?.('parse', data, JSON.stringify(arr));
    return arr;
  }
}
