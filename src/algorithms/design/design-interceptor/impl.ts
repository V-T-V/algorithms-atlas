// 拦截器 · 实现
export interface Interceptor<TArgs extends unknown[], TResult> {
  pre?: (...args: TArgs) => void | { skip?: boolean; result?: TResult };
  post?: (result: TResult) => TResult;
}
export interface InterceptorHooks {
  onPre?: (name: string) => void;
  onPost?: (name: string) => void;
  onSkip?: (name: string) => void;
}
export function withInterceptors<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  interceptors: Array<Interceptor<TArgs, TResult>>,
  hooks: InterceptorHooks = {},
): (...args: TArgs) => TResult {
  return (...args: TArgs) => {
    let skipResult: TResult | undefined;
    let skipped = false;
    for (let i = 0; i < interceptors.length; i++) {
      hooks.onPre?.(`i${i}`);
      const r = interceptors[i]!.pre?.(...args);
      if (r?.skip) {
        skipped = true;
        skipResult = r.result;
        hooks.onSkip?.(`i${i}`);
        break;
      }
    }
    let result: TResult;
    if (skipped) result = skipResult as TResult;
    else result = fn(...args);
    for (let i = interceptors.length - 1; i >= 0; i--) {
      hooks.onPost?.(`i${i}`);
      if (interceptors[i]!.post) result = interceptors[i]!.post!(result);
    }
    return result;
  };
}
