// =============================================================================
// 分发饼干（Assign Cookies）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AssignCookiesHooks {
  onSort?: (children: number[], cookies: number[]) => void;
  onMatch?: (childIdx: number, cookieIdx: number) => void;
  onSkipCookie?: (cookieIdx: number) => void;
}

export interface AssignCookiesResult {
  /** 最多能满足的孩子数。 */
  count: number;
}

/**
 * 分发饼干（LeetCode 455）：每个孩子有一个胃口 g[i]，每块饼干有一个尺寸 s[j]。
 * 当 s[j] >= g[i] 时这块饼干能满足该孩子。求最多能满足多少个孩子。
 *
 * 贪心：把两个数组升序排序，用最小的够格饼干去满足胃口最小的孩子。
 * @param g 孩子胃口数组
 * @param s 饼干尺寸数组
 * @param hooks 可选的事件钩子
 */
export function assignCookies(
  g: number[],
  s: number[],
  hooks: AssignCookiesHooks = {},
): AssignCookiesResult {
  const children = [...g].sort((a, b) => a - b);
  const cookies = [...s].sort((a, b) => a - b);
  hooks.onSort?.(children, cookies);

  let count = 0;
  let ci = 0;
  for (let si = 0; si < cookies.length && ci < children.length; si++) {
    if (cookies[si]! >= children[ci]!) {
      hooks.onMatch?.(ci, si);
      count++;
      ci++;
    } else {
      hooks.onSkipCookie?.(si);
    }
  }
  return { count };
}
