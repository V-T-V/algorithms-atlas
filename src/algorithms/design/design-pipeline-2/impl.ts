// 管道模式 v2 · 实现
export type Stage<T> = (input: T, ctx: PipelineCtx) => T;
export interface PipelineCtx {
  log: string[];
}
export interface PipelineHooks {
  onStage?: (index: number, name: string, input: unknown, output: unknown) => void;
}
export function createPipeline<T>(
  stages: Array<{ name: string; fn: Stage<T> }>,
  hooks: PipelineHooks = {},
): (input: T) => T {
  return (input: T) => {
    const ctx: PipelineCtx = { log: [] };
    let value = input;
    for (let i = 0; i < stages.length; i++) {
      const before = value;
      value = stages[i]!.fn(value, ctx);
      hooks.onStage?.(i, stages[i]!.name, before, value);
    }
    return value;
  };
}
