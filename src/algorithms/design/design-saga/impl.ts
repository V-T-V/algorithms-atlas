// Saga · 实现
export interface SagaStep<T> {
  name: string;
  action: (ctx: T) => Promise<void>;
  compensate: (ctx: T) => Promise<void>;
}
export interface SagaHooks {
  onStep?: (name: string) => void;
  onCompensate?: (name: string) => void;
  onDone?: (ok: boolean) => void;
}
export interface SagaResult {
  ok: boolean;
  completed: string[];
  compensated: string[];
  error?: unknown;
}
export async function runSaga<T>(
  steps: SagaStep<T>[],
  ctx: T,
  hooks: SagaHooks = {},
): Promise<SagaResult> {
  const completed: string[] = [];
  const compensated: string[] = [];
  for (const s of steps) {
    hooks.onStep?.(s.name);
    try {
      await s.action(ctx);
      completed.push(s.name);
    } catch (e) {
      // 反向补偿
      for (let i = completed.length - 1; i >= 0; i--) {
        const name = completed[i]!;
        hooks.onCompensate?.(name);
        try {
          await steps.find((x) => x.name === name)!.compensate(ctx);
          compensated.push(name);
        } catch {
          /* 补偿失败忽略 */
        }
      }
      hooks.onDone?.(false);
      return { ok: false, completed, compensated, error: e };
    }
  }
  hooks.onDone?.(true);
  return { ok: true, completed, compensated };
}
