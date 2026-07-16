// =============================================================================
// PPMd（Prediction by Partial Matching，教学版）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 教学版：用「上下文 → 符号频数」的自适应模型预测下一个符号，输出概率分布。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface PpmdHooks {
  onPredict?: (ctx: string, sym: number, prob: number) => void;
  onUpdate?: (ctx: string, sym: number) => void;
}

export interface PpmdResult {
  /** 每个符号的预测概率序列（用于算术编码）。 */
  predictions: Array<{ ctx: string; symbol: number; probability: number }>;
  /** 模型的对数概率（负对数似然，越小越好）。 */
  logLoss: number;
}

/**
 * 教学版 PPM：维护一个「长度 ≤ order 的上下文」到符号频数的映射。
 * 每个符号预测概率 = (count+escape) / (total+escape)，采用「混合阶」回退（简化）。
 * @param symbols 符号序列（0~255）
 * @param order 上下文阶数
 * @param escape 逃逸平滑项
 * @param hooks 可选的事件钩子
 */
export function ppmd(
  symbols: number[],
  order = 2,
  escape = 1,
  alphabetSize = 256,
  hooks: PpmdHooks = {},
): PpmdResult {
  const model = new Map<string, Map<number, number>>(); // ctx -> sym -> count
  const predictions: PpmdResult['predictions'] = [];
  let logLoss = 0;
  let history = '';

  for (const sym of symbols) {
    // 在阶数 order 下取上下文
    const ctx = history.slice(-order);
    let ctxMap = model.get(ctx);
    if (!ctxMap) {
      ctxMap = new Map();
      model.set(ctx, ctxMap);
    }
    // 预测概率：已见频数 + escape 平滑，分母 = 已见总 + escape*alphabet
    let total = 0;
    for (const c of ctxMap.values()) total += c;
    const count = ctxMap.get(sym) ?? 0;
    const prob = (count + escape) / (total + escape * alphabetSize);
    predictions.push({ ctx, symbol: sym, probability: prob });
    logLoss += -Math.log2(prob);
    hooks.onPredict?.(ctx, sym, prob);

    // 更新模型
    ctxMap.set(sym, count + 1);
    history += String.fromCharCode(sym);
    if (history.length > order + 1) history = history.slice(-order - 1);
    hooks.onUpdate?.(ctx, sym);
  }
  return { predictions, logLoss };
}
