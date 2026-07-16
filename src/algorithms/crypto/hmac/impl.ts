// =============================================================================
// HMAC消息认证（HMAC）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 通用 HMAC：H(K xor opad, H(K xor ipad, message))，内部哈希用演示版 sum-hash。
// =============================================================================

/** 简单演示哈希：对字节流求 8 位滚动和 + 常量混淆。 */
function simpleHash(data: number[], seed = 0): number[] {
  let h = seed >>> 0;
  for (const b of data) h = ((h << 5) - h + (b & 0xff)) >>> 0;
  // 输出 4 字节摘要（大端）
  return [(h >>> 24) & 0xff, (h >>> 16) & 0xff, (h >>> 8) & 0xff, h & 0xff];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HmacHooks {
  onKeyPad?: (key: number[], pad: 'ipad' | 'opad') => void;
  onInner?: (digest: number[]) => void;
  onOuter?: (digest: number[]) => void;
}

export interface HmacResult {
  /** HMAC 摘要（4 字节）。 */
  digest: number[];
}

/** 块大小 B（字节）。 */
const BLOCK = 16;

/**
 * HMAC：基于内部哈希函数构造消息认证码。
 *
 * 步骤：
 * 1. 把密钥规范化为 B 字节（超长则先哈希；不足补零）
 * 2. inner = H((K ⊕ ipad) ∥ message)
 * 3. outer = H((K ⊕ opad) ∥ inner)
 *
 * @param message 消息字节
 * @param key 密钥字节
 * @param hooks 可选的事件钩子
 */
export function hmac(message: number[], key: number[], hooks: HmacHooks = {}): HmacResult {
  // 规范化密钥到 BLOCK 字节
  let k0 = key.slice(0, BLOCK);
  if (key.length > BLOCK) {
    k0 = simpleHash(key);
  }
  while (k0.length < BLOCK) k0.push(0);

  const ipad = k0.map((b) => b ^ 0x36);
  const opad = k0.map((b) => b ^ 0x5c);
  hooks.onKeyPad?.([...ipad], 'ipad');
  hooks.onKeyPad?.([...opad], 'opad');

  const inner = simpleHash([...ipad, ...message], 0x36363636);
  hooks.onInner?.([...inner]);

  const outer = simpleHash([...opad, ...inner], 0x5c5c5c5c);
  hooks.onOuter?.([...outer]);
  return { digest: outer };
}
