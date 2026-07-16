// Generator for 21 optimization algorithms (GD/optimizer variants).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'optimization';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  const testDir = join(ROOT, 'test', CAT);
  mkdirSync(testDir, { recursive: true });
  writeFileSync(join(testDir, `${id}.test.ts`), test);
}

function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: 'optimization',
  title: { zh: ${JSON.stringify(zh)}, en: ${JSON.stringify(en)} },
  summary: { zh: ${JSON.stringify(sumZh)}, en: ${JSON.stringify(sumEn)} },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// Shared demo problem: minimize f(x,y) = (x-3)^2 + (y+1)^2, optimum (3,-1).
function demoFunc() {
  return `/** 演示目标 f(x,y) = (x-3)^2 + (y+1)^2，最优解 (3,-1)。 */
export function demoFunc(p: number[]): number {
  return (p[0]! - 3) ** 2 + (p[1]! + 1) ** 2;
}
/** 演示梯度 ∇f = [2(x-3), 2(y+1)]。 */
export function demoGrad(p: number[]): number[] {
  return [2 * (p[0]! - 3), 2 * (p[1]! + 1)];
}`;
}

// Standard trace: snapshot params/velocity/value each iteration.
function optTrace(id, fnName, paramNotes) {
  return `// ${id} · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ${fnName}, demoFunc, demoGrad } from './impl.ts';

export const DEFAULT_INPUT = { initParams: [0, 0], lr: 0.1, maxIter: 80, tol: 1e-10 };

export function buildTrace(
  input: { initParams?: number[]; lr?: number; maxIter?: number; tol?: number } = {},
): Frame[] {
  const { initParams = [0, 0], lr = 0.1, maxIter = 80, tol = 1e-10 } = input;
  const rec = new TraceRecorder();

  const snapshot = (
    note: { zh: string; en: string },
    params: number[],
    value: number,
    iter: number,
    extra: Array<{ label: string; value: string; role?: BarRole }> = [],
  ) => {
    rec
      .begin(note)
      .setAux([
        { label: '迭代 / iter', value: String(iter), role: 'pivot' as BarRole },
        { label: 'x', value: params[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'y', value: params[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'f(x,y)', value: value.toFixed(6), role: 'final' as BarRole },
        ...extra,
      ])
      .commit();
  };

  snapshot({ zh: '初始 (0,0)', en: 'Init (0,0)' }, initParams, demoFunc(initParams), 0);

  const result = ${fnName}(demoFunc, demoGrad, initParams, { lr, maxIter, tol });

  rec
    .begin({
      zh: result.converged
        ? \`收敛于 (\${result.params[0]!.toFixed(3)}, \${result.params[1]!.toFixed(3)})，\${result.iterations} 步\`
        : \`未收敛（\${result.iterations} 步）\`,
      en: result.converged
        ? \`Converged at (\${result.params[0]!.toFixed(3)}, \${result.params[1]!.toFixed(3)}) in \${result.iterations} steps\`
        : \`Not converged (\${result.iterations} steps)\`,
    })
    .setAux([
      { label: 'x', value: result.params[0]!.toFixed(4), role: 'final' as BarRole },
      { label: 'y', value: result.params[1]!.toFixed(4), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}`;
}

function optTest(id, fnName) {
  return `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ${fnName}, demoFunc, demoGrad } from '../../src/algorithms/optimization/${id}/impl.ts';

test('${id} 收敛到 (3,-1)', () => {
  const r = ${fnName}(demoFunc, demoGrad, [0, 0], { lr: 0.1, maxIter: 500, tol: 1e-8 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-2, \`x=\${r.params[0]}\`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-2, \`y=\${r.params[1]}\`);
});

test('${id} 目标值趋近 0', () => {
  const r = ${fnName}(demoFunc, demoGrad, [0, 0], { lr: 0.1, maxIter: 500, tol: 1e-10 });
  assert.ok(r.value < 1e-4, \`value=\${r.value}\`);
});
`;
}

// ---- 1. opt-sgd-momentum-2 (SGD with momentum, distinct from momentum/) ----
writeAlg('opt-sgd-momentum-2',
  meta('opt-sgd-momentum-2', 'SGD+Momentum', 'SGD with Momentum',
    '随机梯度下降加动量：累积历史梯度方向加速收敛。', 'SGD with momentum: accumulate historical gradient to accelerate convergence.',
    'SGD+Momentum：v ← β·v + g；θ ← θ − lr·v。在狭长山谷比纯 SGD 快数倍。',
    'SGD+Momentum: v ← β·v + g; θ ← θ − lr·v. Several times faster than vanilla SGD in narrow valleys.',
    'O(k·d)', 'O(d)', ['optimization', 'sgd', 'momentum']),
  `// SGD+Momentum · 实现
export interface SgdMomentumHooks {
  onIter?: (iter: number, params: number[], grad: number[], velocity: number[], value: number) => void;
}
export interface SgdMomentumResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optSgdMomentum2(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; beta?: number; maxIter?: number; tol?: number } = {},
  hooks: SgdMomentumHooks = {},
): SgdMomentumResult {
  const { lr = 0.1, beta = 0.9, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++) v[i] = beta * v[i]! + g[i]!;
    hooks.onIter?.(it, [...params], [...g], [...v], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
    for (let i = 0; i < params.length; i++) params[i]! -= lr * v[i]!;
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-sgd-momentum-2', 'optSgdMomentum2'),
  optTest('opt-sgd-momentum-2', 'optSgdMomentum2'),
);

// ---- 2. opt-adam-w (Adam with decoupled weight decay) ----
writeAlg('opt-adam-w',
  meta('opt-adam-w', 'AdamW', 'AdamW',
    'AdamW：解耦权重衰减版的 Adam，正则化更稳。', 'AdamW: decoupled weight decay variant of Adam for more stable regularization.',
    'AdamW（Loshchilov & Hutter）：与 Adam 不同，把权重衰减直接作用在参数上而非梯度，避免自适应学习率与 L2 的耦合失真。',
    'AdamW (Loshchilov & Hutter): unlike Adam, weight decay acts directly on parameters rather than gradients, avoiding the distortion from coupling L2 with adaptive learning rates.',
    'O(k·d)', 'O(d)', ['optimization', 'adam', 'regularization']),
  `// AdamW · 实现
export interface AdamWHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface AdamWResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optAdamW(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; beta1?: number; beta2?: number; eps?: number; wd?: number; maxIter?: number; tol?: number } = {},
  hooks: AdamWHooks = {},
): AdamWResult {
  const { lr = 0.1, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, wd = 0.01, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    const bc1 = 1 - Math.pow(beta1, it);
    const bc2 = 1 - Math.pow(beta2, it);
    for (let i = 0; i < params.length; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      const mHat = m[i]! / bc1;
      const vHat = v[i]! / bc2;
      // 解耦权重衰减：先衰减参数，再用自适应更新
      params[i]! -= lr * (mHat / (Math.sqrt(vHat) + eps) + wd * params[i]!);
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-adam-w', 'optAdamW'),
  optTest('opt-adam-w', 'optAdamW'),
);

// ---- 3. opt-adagrad-2 / 4. opt-rmsprop-2 / 5. opt-adadelta-2 ----
function adaImpl(id, fnName, variant) {
  const update = variant === 'adagrad'
    ? `lrEff[i] = lr / (Math.sqrt(v[i]!) + eps); params[i]! -= lrEff[i]! * g[i]!;`
    : variant === 'rmsprop'
      ? `v[i] = decay * v[i]! + (1 - decay) * g[i]! * g[i]!; params[i]! -= lr * g[i]! / (Math.sqrt(v[i]!) + eps);`
      : `// adadelta: 无需 lr
        v[i] = decay * v[i]! + (1 - decay) * g[i]! * g[i]!;
        const delta = -Math.sqrt(d[i]! + eps) / (Math.sqrt(v[i]!) + eps) * g[i]!;
        params[i]! += delta;
        d[i] = decay * d[i]! + (1 - decay) * delta * delta;`;
  const noLr = variant === 'adadelta';
  return `// ${id} · 实现
export interface ${fnName.replace(/^opt/, '').replace(/2$/, '')}Hooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface ${fnName.replace(/^opt/, '').replace(/2$/, '')}Result { params: number[]; value: number; iterations: number; converged: boolean; }
export function ${fnName}(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; decay?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: ${fnName.replace(/^opt/, '').replace(/2$/, '')}Hooks = {},
): ${fnName.replace(/^opt/, '').replace(/2$/, '')}Result {
  const { ${noLr ? 'lr = 1.0' : 'lr = 0.5'}, decay = 0.9, eps = 1e-8, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const v = new Array(params.length).fill(0);
  ${variant === 'adadelta' ? 'const d = new Array(params.length).fill(0);\n  const lrEff = new Array(params.length).fill(1);' : variant === 'adagrad' ? 'const lrEff = new Array(params.length).fill(0);' : ''}
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++) {
      ${update}
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`;
}

writeAlg('opt-adagrad-2',
  meta('opt-adagrad-2', 'AdaGrad', 'AdaGrad',
    'AdaGrad：每个参数累计历史梯度平方，自适应降低学习率。', 'AdaGrad: per-parameter sum of squared gradients adaptively reduces learning rates.',
    'AdaGrad（Duchi 2011）：累积梯度平方和 v，学习率 = lr/√v。适合稀疏数据，但学习率单调下降可能过早停滞。',
    'AdaGrad (Duchi 2011): accumulates squared gradients v; lr = lr/√v. Good for sparse data, but monotonic decay can stall early.',
    'O(k·d)', 'O(d)', ['optimization', 'adaptive']),
  adaImpl('opt-adagrad-2', 'optAdagrad2', 'adagrad'),
  optTrace('opt-adagrad-2', 'optAdagrad2'),
  optTest('opt-adagrad-2', 'optAdagrad2'),
);

writeAlg('opt-rmsprop-2',
  meta('opt-rmsprop-2', 'RMSProp', 'RMSProp',
    'RMSProp：用指数滑动平均替代 AdaGrad 的全历史，避免学习率过早衰减。', 'RMSProp: exponential moving average of squared gradients replaces AdaGrad full history to avoid premature decay.',
    'RMSProp（Hinton）：v ← ρ·v + (1−ρ)·g²；θ ← θ − lr·g/√(v+ε)。解决 AdaGrad 学习率单调下降的问题。',
    'RMSProp (Hinton): v ← ρ·v + (1−ρ)·g²; θ ← θ − lr·g/√(v+ε). Solves the monotonic-decay problem of AdaGrad.',
    'O(k·d)', 'O(d)', ['optimization', 'adaptive']),
  adaImpl('opt-rmsprop-2', 'optRmsprop2', 'rmsprop'),
  optTrace('opt-rmsprop-2', 'optRmsprop2'),
  optTest('opt-rmsprop-2', 'optRmsprop2'),
);

writeAlg('opt-adadelta-2',
  meta('opt-adadelta-2', 'AdaDelta', 'AdaDelta',
    'AdaDelta：无需手动学习率，用两次滑动平均自适应。', 'AdaDelta: no manual learning rate; uses two moving averages for adaptation.',
    'AdaDelta（Zeiler 2012）：在 RMSProp 基础上引入 Δθ 的滑动平均，自动确定有效步长，无需全局学习率。',
    'AdaDelta (Zeiler 2012): extends RMSProp with a moving average of Δθ to self-determine step size without a global learning rate.',
    'O(k·d)', 'O(d)', ['optimization', 'adaptive']),
  adaImpl('opt-adadelta-2', 'optAdadelta2', 'adadelta'),
  optTrace('opt-adadelta-2', 'optAdadelta2'),
  optTest('opt-adadelta-2', 'optAdadelta2'),
);

// ---- 6. opt-lookahead-2 (Lookahead wrapper) ----
writeAlg('opt-lookahead-2',
  meta('opt-lookahead-2', 'Lookahead', 'Lookahead Optimizer',
    'Lookahead：内层任意优化器先走 k 步「快」权重，再向起点缓慢回退 α。', 'Lookahead: inner optimizer takes k "fast" steps, then slowly falls back α toward the start.',
    'Lookahead（Zhang 2019）：维护「慢权重」θ 与「快权重」φ。每 k 步内层更新 φ 后，θ ← θ + α(φ − θ)，再 φ ← θ。提升泛化、降低调参敏感度。',
    'Lookahead (Zhang 2019): maintains "slow" weights θ and "fast" weights φ. After k inner steps, θ ← θ + α(φ − θ), then φ ← θ. Improves generalization and reduces tuning sensitivity.',
    'O(k·d)', 'O(d)', ['optimization', 'wrapper']),
  `// Lookahead · 实现（内层用 SGD+Momentum）
export interface LookaheadHooks {
  onSync?: (step: number, slow: number[]) => void;
}
export interface LookaheadResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optLookahead2(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; alpha?: number; k?: number; maxIter?: number; tol?: number } = {},
  hooks: LookaheadHooks = {},
): LookaheadResult {
  const { lr = 0.1, alpha = 0.5, k = 5, maxIter = 500, tol = 1e-8 } = opts;
  const slow = [...init];
  const fast = [...init];
  const v = new Array(init.length).fill(0);
  let iterations = 0;
  let converged = false;
  const outerIters = Math.ceil(maxIter / k);
  for (let o = 1; o <= outerIters; o++) {
    for (let s = 0; s < k; s++) {
      const g = grad(fast);
      for (let i = 0; i < fast.length; i++) { v[i] = 0.9 * v[i]! + g[i]!; fast[i]! -= lr * v[i]!; }
      iterations++;
    }
    for (let i = 0; i < slow.length; i++) slow[i] = slow[i]! + alpha * (fast[i]! - slow[i]!);
    for (let i = 0; i < fast.length; i++) fast[i] = slow[i]!;
    hooks.onSync?.(o, [...slow]);
    const gn = Math.sqrt(grad(slow).reduce((s, x) => s + x * x, 0));
    if (gn < tol) { converged = true; break; }
  }
  return { params: slow, value: f(slow), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-lookahead-2', 'optLookahead2'),
  optTest('opt-lookahead-2', 'optLookahead2'),
);

// ---- 7. opt-radam-2 (Rectified Adam) / 8. opt-nadam-2 (Nesterov+Adam) / 9. opt-amsgrad-2 ----
writeAlg('opt-amsgrad-2',
  meta('opt-amsgrad-2', 'AMSGrad', 'AMSGrad',
    'AMSGrad：修正 Adam 在非凸情形下学习率反弹的问题，取 v 的历史最大值。', 'AMSGrad: fixes Adam learning-rate rebound on non-convex problems by taking the max of v over history.',
    'AMSGrad（Reddi 2018）：维护 v̂ = max(v̂, v)，用 v̂ 而非 v 计算步长，确保有效学习率单调下降。',
    'AMSGrad (Reddi 2018): maintain v̂ = max(v̂, v) and use v̂ instead of v for the step, guaranteeing monotonic effective lr.',
    'O(k·d)', 'O(d)', ['optimization', 'adam']),
  `// AMSGrad · 实现
export interface AmsgradHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface AmsgradResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optAmsgrad2(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; beta1?: number; beta2?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: AmsgradHooks = {},
): AmsgradResult {
  const { lr = 0.1, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  const vHat = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      vHat[i] = Math.max(vHat[i]!, v[i]!);
      params[i]! -= lr * m[i]! / (Math.sqrt(vHat[i]!) + eps);
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-amsgrad-2', 'optAmsgrad2'),
  optTest('opt-amsgrad-2', 'optAmsgrad2'),
);

writeAlg('opt-nadam-2',
  meta('opt-nadam-2', 'NAdam', 'NAdam',
    'NAdam：把 Nesterov 动量思想融入 Adam，提前「向前看一步」更新。', 'NAdam: fuses Nesterov momentum into Adam, updating with a look-ahead gradient.',
    'NAdam（Dozat 2016）：Nesterov + Adam。在 Adam 框架下用未来位置的梯度近似，m̂ 中含前瞻项。',
    'NAdam (Dozat 2016): Nesterov + Adam. Approximates the gradient at a future position within the Adam framework; m̂ includes a look-ahead term.',
    'O(k·d)', 'O(d)', ['optimization', 'adam', 'nesterov']),
  `// NAdam · 实现
export interface NadamHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface NadamResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optNadam2(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; beta1?: number; beta2?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: NadamHooks = {},
): NadamResult {
  const { lr = 0.1, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    const bc1 = 1 - Math.pow(beta1, it);
    const bc2 = 1 - Math.pow(beta2, it);
    for (let i = 0; i < params.length; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      const mHat = m[i]! / bc1 + (1 - beta1) * g[i]! / bc1;
      const vHat = v[i]! / bc2;
      params[i]! -= lr * mHat / (Math.sqrt(vHat) + eps);
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-nadam-2', 'optNadam2'),
  optTest('opt-nadam-2', 'optNadam2'),
);

writeAlg('opt-radam-2',
  meta('opt-radam-2', 'RAdam', 'Rectified Adam (RAdam)',
    'RAdam：基于收敛性分析给出预热项 ρt，无需手动 warmup。', 'RAdam: derives a rectification term ρt analytically, removing the need for manual warmup.',
    'RAdam（Liu 2019）：根据二阶动量的方差引入修正因子 ρt，自动调节有效步长，避免训练初期方差爆炸。',
    'RAdam (Liu 2019): introduces a rectification factor ρt from the variance of second moments, automatically tuning effective step size without manual warmup.',
    'O(k·d)', 'O(d)', ['optimization', 'adam', 'warmup']),
  `// RAdam · 实现
export interface RadamHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface RadamResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optRadam2(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; beta1?: number; beta2?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: RadamHooks = {},
): RadamResult {
  const { lr = 0.1, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  const rhoInf = 2 / (1 - beta2) - 1;
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    const bc2 = 1 - Math.pow(beta2, it);
    const bc1 = 1 - Math.pow(beta1, it);
    const rho = rhoInf - 2 * it * bc2 / (1 - Math.pow(beta2, it));
    for (let i = 0; i < params.length; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      if (rho > 4) {
        const r = Math.sqrt(((rho - 4) * (rho - 2) * rhoInf) / ((rhoInf - 4) * (rhoInf - 2) * rho));
        const mHat = m[i]! / bc1;
        const vHat = v[i]! / bc2;
        params[i]! -= lr * r * mHat / (Math.sqrt(vHat) + eps);
      } else {
        params[i]! -= lr * (m[i]! / bc1);
      }
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-radam-2', 'optRadam2'),
  optTest('opt-radam-2', 'optRadam2'),
);

// ---- 10-13: framework aliases (mxnet, paddle, torch, jax, tf) ----
// These share the Adam-style update but reflect framework defaults/conventions.
function fwkImpl(id, fnName, defaults) {
  return `// ${id} · 实现（${defaults.desc}）
export interface ${fnName.replace(/^opt/, '').replace(/Opt$/, '')}Hooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface ${fnName.replace(/^opt/, '').replace(/Opt$/, '')}Result { params: number[]; value: number; iterations: number; converged: boolean; }
export function ${fnName}(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; beta1?: number; beta2?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: ${fnName.replace(/^opt/, '').replace(/Opt$/, '')}Hooks = {},
): ${fnName.replace(/^opt/, '').replace(/Opt$/, '')}Result {
  const { lr = ${defaults.lr}, beta1 = ${defaults.beta1}, beta2 = ${defaults.beta2}, eps = ${defaults.eps}, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    const bc1 = 1 - Math.pow(beta1, it);
    const bc2 = 1 - Math.pow(beta2, it);
    for (let i = 0; i < params.length; i++) {
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
      const mHat = m[i]! / bc1;
      const vHat = v[i]! / bc2;
      params[i]! -= lr * mHat / (Math.sqrt(vHat) + eps);
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`;
}

writeAlg('opt-apache-mxnet',
  meta('opt-apache-mxnet', 'MXNet Adam', 'Apache MXNet Adam',
    'Apache MXNet 框架的 Adam 实现（默认 lr=0.001, eps=1e-8）。', 'Apache MXNet framework Adam implementation (defaults lr=0.001, eps=1e-8).',
    'MXNet 的 Adam：标准 Adam 公式，默认 β1=0.9, β2=0.999, ε=1e-8。本实现用更大 lr 以便演示快速收敛。',
    'MXNet Adam: standard Adam with defaults β1=0.9, β2=0.999, ε=1e-8. A larger lr is used here for fast demo convergence.',
    'O(k·d)', 'O(d)', ['optimization', 'framework', 'adam', 'mxnet']),
  fwkImpl('opt-apache-mxnet', 'optApacheMxnet', { lr: 0.5, beta1: 0.9, beta2: 0.999, eps: 1e-8, desc: 'MXNet Adam 默认参数' }),
  optTrace('opt-apache-mxnet', 'optApacheMxnet'),
  optTest('opt-apache-mxnet', 'optApacheMxnet'),
);

writeAlg('opt-paddle-opt',
  meta('opt-paddle-opt', 'PaddlePaddle Adam', 'PaddlePaddle Adam',
    '百度 PaddlePaddle 的 Adam 实现（默认 lr=0.001）。', 'Baidu PaddlePaddle Adam implementation (default lr=0.001).',
    'PaddlePaddle 的 Adam：与 PyTorch 类似，默认 β1=0.9, β2=0.999, ε=1e-8。',
    'PaddlePaddle Adam: similar to PyTorch with defaults β1=0.9, β2=0.999, ε=1e-8.',
    'O(k·d)', 'O(d)', ['optimization', 'framework', 'adam', 'paddle']),
  fwkImpl('opt-paddle-opt', 'optPaddleOpt', { lr: 0.5, beta1: 0.9, beta2: 0.999, eps: 1e-8, desc: 'PaddlePaddle Adam 默认参数' }),
  optTrace('opt-paddle-opt', 'optPaddleOpt'),
  optTest('opt-paddle-opt', 'optPaddleOpt'),
);

writeAlg('opt-torch-sgd',
  meta('opt-torch-sgd', 'PyTorch SGD', 'PyTorch SGD',
    'PyTorch torch.optim.SGD：支持 momentum、dampening、Nesterov、weight_decay。', 'PyTorch torch.optim.SGD: supports momentum, dampening, Nesterov, weight_decay.',
    'PyTorch SGD：v ← ρ·v + (1−damp)·g；θ ← θ − lr·(v + wd·θ)。可切换 Nesterov。',
    'PyTorch SGD: v ← ρ·v + (1−damp)·g; θ ← θ − lr·(v + wd·θ). Nesterov optional.',
    'O(k·d)', 'O(d)', ['optimization', 'framework', 'sgd', 'pytorch']),
  `// PyTorch SGD · 实现
export interface TorchSgdHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface TorchSgdResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optTorchSgd(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; momentum?: number; dampening?: number; nesterov?: boolean; wd?: number; maxIter?: number; tol?: number } = {},
  hooks: TorchSgdHooks = {},
): TorchSgdResult {
  const { lr = 0.1, momentum = 0.9, dampening = 0, nesterov = false, wd = 0, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    for (let i = 0; i < params.length; i++) {
      const gi = g[i]! + wd * params[i]!;
      v[i] = momentum * v[i]! + (1 - dampening) * gi;
      const upd = nesterov ? gi + momentum * v[i]! : v[i]!;
      params[i]! -= lr * upd;
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-torch-sgd', 'optTorchSgd'),
  optTest('opt-torch-sgd', 'optTorchSgd'),
);

writeAlg('opt-torch-adam',
  meta('opt-torch-adam', 'PyTorch Adam', 'PyTorch Adam',
    'PyTorch torch.optim.Adam（默认 lr=0.001, eps=1e-8）。', 'PyTorch torch.optim.Adam (defaults lr=0.001, eps=1e-8).',
    'PyTorch Adam：标准 AdamW 之前版本，不带解耦权重衰减。',
    'PyTorch Adam: the pre-AdamW version, no decoupled weight decay.',
    'O(k·d)', 'O(d)', ['optimization', 'framework', 'adam', 'pytorch']),
  fwkImpl('opt-torch-adam', 'optTorchAdam', { lr: 0.5, beta1: 0.9, beta2: 0.999, eps: 1e-8, desc: 'PyTorch Adam 默认参数' }),
  optTrace('opt-torch-adam', 'optTorchAdam'),
  optTest('opt-torch-adam', 'optTorchAdam'),
);

writeAlg('opt-jax-adam',
  meta('opt-jax-adam', 'JAX Adam', 'JAX Adam (optax)',
    'JAX/optax 的 Adam 实现（默认 lr=0.001, eps=1e-8）。', 'JAX/optax Adam implementation (defaults lr=0.001, eps=1e-8).',
    'JAX optax.adam：纯函数式 Adam，默认 eps 在根号外（与 PyTorch 同）。',
    'JAX optax.adam: functional Adam with eps outside the sqrt (like PyTorch).',
    'O(k·d)', 'O(d)', ['optimization', 'framework', 'adam', 'jax']),
  fwkImpl('opt-jax-adam', 'optJaxAdam', { lr: 0.5, beta1: 0.9, beta2: 0.999, eps: 1e-8, desc: 'JAX optax Adam 默认参数' }),
  optTrace('opt-jax-adam', 'optJaxAdam'),
  optTest('opt-jax-adam', 'optJaxAdam'),
);

writeAlg('opt-tf-adam',
  meta('opt-tf-adam', 'TensorFlow Adam', 'TensorFlow Adam (Keras)',
    'TensorFlow/Keras 的 Adam 实现（默认 lr=0.001, eps=1e-7）。', 'TensorFlow/Keras Adam implementation (defaults lr=0.001, eps=1e-7).',
    'TensorFlow tf.keras.optimizers.Adam：默认 ε=1e-7（比 PyTorch 小 10×）。',
    'TensorFlow tf.keras.optimizers.Adam: default ε=1e-7 (10× smaller than PyTorch).',
    'O(k·d)', 'O(d)', ['optimization', 'framework', 'adam', 'tensorflow']),
  fwkImpl('opt-tf-adam', 'optTfAdam', { lr: 0.5, beta1: 0.9, beta2: 0.999, eps: 1e-7, desc: 'TensorFlow Adam 默认参数' }),
  optTrace('opt-tf-adam', 'optTfAdam'),
  optTest('opt-tf-adam', 'optTfAdam'),
);

// ---- 14-15: SWATS, YOGI ----
writeAlg('opt-swats',
  meta('opt-swats', 'SWATS', 'SWATS',
    'SWATS：Adam 起步，自适应切换到 SGD 以提升泛化。', 'SWATS: start with Adam, adaptively switch to SGD for better generalization.',
    'SWATS（Keskar & Socher 2017）：Adam 早期快速下降，达到切换条件后转为带动量 SGD，兼顾速度与泛化。',
    'SWATS (Keskar & Socher 2017): Adam for fast early progress, then switch to momentum SGD when a criterion triggers, balancing speed and generalization.',
    'O(k·d)', 'O(d)', ['optimization', 'adam', 'hybrid']),
  `// SWATS · 实现（简化：达到阈值迭代后切换到 SGD+Momentum）
export interface SwatsHooks {
  onSwitch?: (iter: number) => void;
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface SwatsResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optSwats(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; switchAfter?: number; beta1?: number; beta2?: number; eps?: number; momentum?: number; maxIter?: number; tol?: number } = {},
  hooks: SwatsHooks = {},
): SwatsResult {
  const { lr = 0.1, switchAfter = 30, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, momentum = 0.9, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  const sgV = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  let phase: 'adam' | 'sgd' = 'adam';
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    if (phase === 'adam') {
      const bc1 = 1 - Math.pow(beta1, it);
      const bc2 = 1 - Math.pow(beta2, it);
      for (let i = 0; i < params.length; i++) {
        m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
        v[i] = beta2 * v[i]! + (1 - beta2) * g[i]! * g[i]!;
        params[i]! -= lr * (m[i]! / bc1) / (Math.sqrt(v[i]! / bc2) + eps);
      }
      if (it >= switchAfter) { phase = 'sgd'; hooks.onSwitch?.(it); }
    } else {
      for (let i = 0; i < params.length; i++) {
        sgV[i] = momentum * sgV[i]! + g[i]!;
        params[i]! -= lr * sgV[i]!;
      }
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-swats', 'optSwats'),
  optTest('opt-swats', 'optSwats'),
);

writeAlg('opt-yogi',
  meta('opt-yogi', 'YOGI', 'YOGI',
    'YOGI：用 (1 − g²) 替代累加项，抑制学习率过度衰减。', 'YOGI: uses (1 − g²) instead of additive accumulation to curb excessive lr decay.',
    'YOGI（Zaheer 2018）：v ← v + (1 − β2)·sign(g² − v)·g²。当梯度大时不显著增加 v，避免学习率塌缩。',
    'YOGI (Zaheer 2018): v ← v + (1 − β2)·sign(g² − v)·g². When gradients are large, v does not blow up, avoiding lr collapse.',
    'O(k·d)', 'O(d)', ['optimization', 'adam']),
  `// YOGI · 实现
export interface YogiHooks {
  onIter?: (iter: number, params: number[], value: number) => void;
}
export interface YogiResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optYogi(
  f: (p: number[]) => number,
  grad: (p: number[]) => number[],
  init: number[],
  opts: { lr?: number; beta1?: number; beta2?: number; eps?: number; maxIter?: number; tol?: number } = {},
  hooks: YogiHooks = {},
): YogiResult {
  const { lr = 0.1, beta1 = 0.9, beta2 = 0.999, eps = 1e-8, maxIter = 500, tol = 1e-8 } = opts;
  const params = [...init];
  const m = new Array(params.length).fill(0);
  const v = new Array(params.length).fill(0);
  let iterations = 0;
  let converged = false;
  for (let it = 1; it <= maxIter; it++) {
    const g = grad(params);
    const value = f(params);
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    const bc1 = 1 - Math.pow(beta1, it);
    const bc2 = 1 - Math.pow(beta2, it);
    for (let i = 0; i < params.length; i++) {
      const g2 = g[i]! * g[i]!;
      m[i] = beta1 * m[i]! + (1 - beta1) * g[i]!;
      v[i] = v[i]! + (1 - beta2) * Math.sign(g2 - v[i]!) * g2;
      const mHat = m[i]! / bc1;
      const vHat = v[i]! / bc2;
      params[i]! -= lr * mHat / (Math.sqrt(vHat) + eps);
    }
    hooks.onIter?.(it, [...params], value);
    iterations = it;
    if (gn < tol) { converged = true; break; }
  }
  return { params, value: f(params), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-yogi', 'optYogi'),
  optTest('opt-yogi', 'optYogi'),
);

// ---- 16: opt-cma-es-diag-2 (diagonal CMA-ES, simplified) ----
writeAlg('opt-cma-es-diag-2',
  meta('opt-cma-es-diag-2', '对角 CMA-ES', 'Diagonal CMA-ES',
    '对角协方差版本的 CMA-ES：每维独立自适应步长，无需完整协方差矩阵。', 'Diagonal-covariance CMA-ES: per-dimension adaptive step size without a full covariance matrix.',
    '对角 CMA-ES：只维护各维方差 σ²·c（对角），用 μ/λ 父代加权更新均值与方差。比完整 CMA-ES 简单且 O(d)。',
    'Diagonal CMA-ES: maintains only per-dimension variances σ²·c (diagonal); updates mean and variance with μ/λ weighted parents. Simpler than full CMA-ES, O(d).',
    'O(k·λ·d)', 'O(d)', ['optimization', 'evolution-strategy', 'cma-es']),
  `// 对角 CMA-ES · 简化实现
export interface CmaDiagHooks {
  onGen?: (gen: number, mean: number[], sigma: number) => void;
}
export interface CmaDiagResult { params: number[]; value: number; iterations: number; converged: boolean; }
export function optCmaEsDiag2(
  f: (p: number[]) => number,
  _grad: (p: number[]) => number[],
  init: number[],
  opts: { sigma?: number; lambda?: number; mu?: number; maxIter?: number; tol?: number; seed?: number } = {},
  hooks: CmaDiagHooks = {},
): CmaDiagResult {
  const { sigma = 1.0, lambda = 8, mu = 4, maxIter = 200, tol = 1e-8, seed = 42 } = opts;
  const mean = [...init];
  const d = mean.length;
  let C = new Array(d).fill(1);
  let s = sigma;
  let state = seed;
  const randn = () => {
    // 简化 Box-Muller
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const u1 = state / 0x7fffffff || 1e-9;
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    const u2 = state / 0x7fffffff || 1e-9;
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
  let iterations = 0;
  let converged = false;
  const weights = Array.from({ length: mu }, (_, i) => Math.log(mu + 0.5) - Math.log(i + 1));
  const wsum = weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < mu; i++) weights[i]! /= wsum;
  for (let gen = 1; gen <= maxIter; gen++) {
    const samples: Array<{ z: number[]; x: number[]; fit: number }> = [];
    for (let k = 0; k < lambda; k++) {
      const z = Array.from({ length: d }, (_, j) => randn() * Math.sqrt(C[j]!));
      const x = mean.map((m, j) => m + s * z[j]!);
      samples.push({ z, x, fit: f(x) });
    }
    samples.sort((a, b) => a.fit - b.fit);
    const parents = samples.slice(0, mu);
    const newMean = new Array(d).fill(0);
    for (let j = 0; j < d; j++) {
      for (let i = 0; i < mu; i++) newMean[j]! += weights[i]! * parents[i]!.x[j]!;
    }
    const before = f(mean);
    for (let j = 0; j < d; j++) mean[j] = newMean[j]!;
    const after = f(mean);
    // 简化方差更新
    for (let j = 0; j < d; j++) {
      let acc = 0;
      for (let i = 0; i < mu; i++) acc += weights[i]! * parents[i]!.z[j]! * parents[i]!.z[j]!;
      C[j] = 0.9 * C[j]! + 0.1 * acc;
    }
    hooks.onGen?.(gen, [...mean], s);
    iterations = gen;
    if (Math.abs(before - after) < tol) { converged = true; break; }
  }
  return { params: mean, value: f(mean), iterations, converged };
}
${demoFunc()}`,
  optTrace('opt-cma-es-diag-2', 'optCmaEsDiag2'),
  optTest('opt-cma-es-diag-2', 'optCmaEsDiag2'),
);

// ---- 17-19: Bayesian Optimization (UCB / EI / PI) ----
function boMeta(id, zh, en, sumZh, sumEn, acq) {
  return meta(id, zh, en, sumZh, sumEn,
    `贝叶斯优化采集函数 ${acq}：在代理模型（高斯过程简化版）的预测均值 μ 与方差 σ² 上选下一个采样点。`,
    `Bayesian optimization acquisition ${acq}: pick the next sample point from surrogate model (simplified GP) predictions μ and variance σ².`,
    'O(n²)', 'O(n)', ['optimization', 'bayesian', 'black-box']);
}

writeAlg('opt-bayes-ucb-2',
  boMeta('opt-bayes-ucb-2', '贝叶斯优化 UCB', 'Bayesian Optimization UCB',
    'UCB 采集函数：选 μ(x) + κ·σ(x) 最大的点。', 'UCB acquisition: pick the point with max μ(x) + κ·σ(x).',
    'Upper Confidence Bound'),
  `// 贝叶斯优化 UCB · 实现（候选网格 + 简化 GP 预测）
export interface BayesUcbHooks {
  onIter?: (iter: number, sampledX: number, sampledY: number, best: number) => void;
}
export interface BayesUcbResult { samples: Array<{ x: number; y: number }>; bestX: number; bestY: number; iterations: number; }
export function optBayesUcb2(
  objective: (x: number) => number,
  opts: { kappa?: number; maxIter?: number; candidates?: number[]; xMin?: number; xMax?: number } = {},
  hooks: BayesUcbHooks = {},
): BayesUcbResult {
  const { kappa = 2.0, maxIter = 8, candidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], xMin = 0, xMax = 10 } = opts;
  const samples: Array<{ x: number; y: number }> = [];
  // 初始采样：取中点
  samples.push({ x: candidates[Math.floor(candidates.length / 2)]!, y: objective(candidates[Math.floor(candidates.length / 2)]!) });
  let bestX = samples[0]!.x;
  let bestY = samples[0]!.y;
  for (let it = 1; it < maxIter; it++) {
    let bestCand = candidates[0]!;
    let bestAcq = -Infinity;
    for (const x of candidates) {
      // 简化预测：μ = 已采样均值，σ = 到最近已采样点的距离（越远越不确定）
      const mu = samples.reduce((s, p) => s + p.y, 0) / samples.length;
      const minDist = Math.min(...samples.map((p) => Math.abs(p.x - x)));
      const sigma = Math.sqrt(minDist + 0.1);
      const acq = mu + kappa * sigma;
      if (acq > bestAcq) { bestAcq = acq; bestCand = x; }
    }
    const y = objective(bestCand);
    samples.push({ x: bestCand, y });
    if (y > bestY) { bestY = y; bestX = bestCand; }
    hooks.onIter?.(it, bestCand, y, bestY);
  }
  // 归一化结果坐标到 [xMin,xMax] 视图（不影响算法）
  void xMin; void xMax;
  return { samples, bestX, bestY, iterations: maxIter };
}
// 演示：最大化 f(x) = -((x-7)^2) + 10（峰值在 x=7）
export function demoObjective(x: number): number {
  return -((x - 7) ** 2) + 10;
}
export function demoFunc(p: number[]): number { return -demoObjective(p[0]!); }
export function demoGrad(p: number[]): number[] { return [2 * (p[0]! - 7)]; }`,
  `// 贝叶斯优化 UCB · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optBayesUcb2, demoObjective } from './impl.ts';
export const DEFAULT_INPUT = { maxIter: 8 };
export function buildTrace(input: { maxIter?: number } = {}): Frame[] {
  const { maxIter = 8 } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '贝叶斯优化 UCB', en: 'Bayesian Optimization UCB' }).commit();
  const r = optBayesUcb2(demoObjective, { maxIter, candidates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }, {
    onIter: (it, x, y, best) => rec.begin({ zh: \`iter \${it}: 采样 x=\${x}, y=\${y.toFixed(2)}, best=\${best.toFixed(2)}\`, en: \`iter \${it}: x=\${x} y=\${y.toFixed(2)} best=\${best.toFixed(2)}\` })
      .setAux([{ label: 'best', value: best.toFixed(2), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最优 x=\${r.bestX}, y=\${r.bestY.toFixed(2)}\`, en: \`Best x=\${r.bestX} y=\${r.bestY.toFixed(2)}\` })
    .setAux([{ label: 'bestX', value: String(r.bestX), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optBayesUcb2, demoObjective } from '../../src/algorithms/optimization/opt-bayes-ucb-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bayes-ucb-2/trace.ts';

test('bayes-ucb 找到接近峰值 x≈7', () => {
  const r = optBayesUcb2(demoObjective, { maxIter: 10, candidates: [0,1,2,3,4,5,6,7,8,9] });
  assert.ok(Math.abs(r.bestX - 7) <= 1, \`bestX=\${r.bestX}\`);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('opt-bayes-ei',
  boMeta('opt-bayes-ei', '贝叶斯优化 EI', 'Bayesian Optimization EI',
    'EI 采集函数：最大化期望改进 E[max(f−f*, 0)]。', 'EI acquisition: maximize expected improvement E[max(f−f*, 0)].',
    'Expected Improvement'),
  `// 贝叶斯优化 EI · 实现
export interface BayesEiHooks {
  onIter?: (iter: number, sampledX: number, sampledY: number, best: number) => void;
}
export interface BayesEiResult { samples: Array<{ x: number; y: number }>; bestX: number; bestY: number; iterations: number; }
export function optBayesEi(
  objective: (x: number) => number,
  opts: { xi?: number; maxIter?: number; candidates?: number[] } = {},
  hooks: BayesEiHooks = {},
): BayesEiResult {
  const { xi = 0.01, maxIter = 8, candidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] } = opts;
  const samples: Array<{ x: number; y: number }> = [];
  samples.push({ x: candidates[0]!, y: objective(candidates[0]!) });
  let bestY = samples[0]!.y;
  let bestX = samples[0]!.x;
  for (let it = 1; it < maxIter; it++) {
    let bestCand = candidates[1]!;
    let bestAcq = -Infinity;
    for (const x of candidates) {
      // 简化 GP：μ 为已采点 y 均值，σ 为到最近已采点距离
      const mu = samples.reduce((s, p) => s + p.y, 0) / samples.length;
      const sigma = Math.sqrt(Math.min(...samples.map((p) => Math.abs(p.x - x))) + 0.1);
      const improvement = mu - bestY - xi;
      // EI = (μ - f* - ξ) Φ(Z) + σ φ(Z)；这里用简化公式
      const Z = sigma > 0 ? improvement / sigma : 0;
      const cdf = 0.5 * (1 + Math.tanh(Z * 0.7979));
      const pdf = Math.exp(-Z * Z / 2) / Math.sqrt(2 * Math.PI);
      const ei = improvement * cdf + sigma * pdf;
      if (ei > bestAcq) { bestAcq = ei; bestCand = x; }
    }
    const y = objective(bestCand);
    samples.push({ x: bestCand, y });
    if (y > bestY) { bestY = y; bestX = bestCand; }
    hooks.onIter?.(it, bestCand, y, bestY);
  }
  return { samples, bestX, bestY, iterations: maxIter };
}
export function demoObjective(x: number): number { return -((x - 7) ** 2) + 10; }
export function demoFunc(p: number[]): number { return -demoObjective(p[0]!); }
export function demoGrad(p: number[]): number[] { return [2 * (p[0]! - 7)]; }`,
  `// 贝叶斯优化 EI · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optBayesEi, demoObjective } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贝叶斯优化 EI', en: 'Bayesian Optimization EI' }).commit();
  const r = optBayesEi(demoObjective, { maxIter: 8 }, {
    onIter: (it, x, y, best) => rec.begin({ zh: \`iter \${it}: x=\${x} best=\${best.toFixed(2)}\`, en: \`iter \${it}\` })
      .setAux([{ label: 'best', value: best.toFixed(2), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最优 x=\${r.bestX}\`, en: \`Best x=\${r.bestX}\` })
    .setAux([{ label: 'bestX', value: String(r.bestX), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optBayesEi, demoObjective } from '../../src/algorithms/optimization/opt-bayes-ei/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bayes-ei/trace.ts';
test('bayes-ei 找到接近峰值', () => {
  const r = optBayesEi(demoObjective, { maxIter: 10, candidates: [0,1,2,3,4,5,6,7,8,9] });
  assert.ok(Math.abs(r.bestX - 7) <= 2, \`bestX=\${r.bestX}\`);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('opt-bayes-pi',
  boMeta('opt-bayes-pi', '贝叶斯优化 PI', 'Bayesian Optimization PI',
    'PI 采集函数：最大化改进概率 P(f > f* + ξ)。', 'PI acquisition: maximize probability of improvement P(f > f* + ξ).',
    'Probability of Improvement'),
  `// 贝叶斯优化 PI · 实现
export interface BayesPiHooks {
  onIter?: (iter: number, sampledX: number, sampledY: number, best: number) => void;
}
export interface BayesPiResult { samples: Array<{ x: number; y: number }>; bestX: number; bestY: number; iterations: number; }
export function optBayesPi(
  objective: (x: number) => number,
  opts: { xi?: number; maxIter?: number; candidates?: number[] } = {},
  hooks: BayesPiHooks = {},
): BayesPiResult {
  const { xi = 0.01, maxIter = 8, candidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] } = opts;
  const samples: Array<{ x: number; y: number }> = [];
  samples.push({ x: candidates[0]!, y: objective(candidates[0]!) });
  let bestY = samples[0]!.y;
  let bestX = samples[0]!.x;
  for (let it = 1; it < maxIter; it++) {
    let bestCand = candidates[1]!;
    let bestAcq = -Infinity;
    for (const x of candidates) {
      const mu = samples.reduce((s, p) => s + p.y, 0) / samples.length;
      const sigma = Math.sqrt(Math.min(...samples.map((p) => Math.abs(p.x - x))) + 0.1);
      const Z = sigma > 0 ? (mu - bestY - xi) / sigma : 0;
      // PI = Φ(Z)
      const pi = 0.5 * (1 + Math.tanh(Z * 0.7979));
      if (pi > bestAcq) { bestAcq = pi; bestCand = x; }
    }
    const y = objective(bestCand);
    samples.push({ x: bestCand, y });
    if (y > bestY) { bestY = y; bestX = bestCand; }
    hooks.onIter?.(it, bestCand, y, bestY);
  }
  return { samples, bestX, bestY, iterations: maxIter };
}
export function demoObjective(x: number): number { return -((x - 7) ** 2) + 10; }
export function demoFunc(p: number[]): number { return -demoObjective(p[0]!); }
export function demoGrad(p: number[]): number[] { return [2 * (p[0]! - 7)]; }`,
  `// 贝叶斯优化 PI · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optBayesPi, demoObjective } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贝叶斯优化 PI', en: 'Bayesian Optimization PI' }).commit();
  const r = optBayesPi(demoObjective, { maxIter: 8 }, {
    onIter: (it, x, y, best) => rec.begin({ zh: \`iter \${it}: x=\${x} best=\${best.toFixed(2)}\`, en: \`iter \${it}\` })
      .setAux([{ label: 'best', value: best.toFixed(2), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最优 x=\${r.bestX}\`, en: \`Best x=\${r.bestX}\` })
    .setAux([{ label: 'bestX', value: String(r.bestX), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optBayesPi, demoObjective } from '../../src/algorithms/optimization/opt-bayes-pi/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-bayes-pi/trace.ts';
test('bayes-pi 找到接近峰值', () => {
  const r = optBayesPi(demoObjective, { maxIter: 10, candidates: [0,1,2,3,4,5,6,7,8,9] });
  assert.ok(Math.abs(r.bestX - 7) <= 2, \`bestX=\${r.bestX}\`);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

console.log('generated all 21 optimization algorithms');
