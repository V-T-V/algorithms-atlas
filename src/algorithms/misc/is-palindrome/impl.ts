// =============================================================================
// 回文判定（Is Palindrome）· 纯算法实现
// 双指针：一头一尾向中间逼近，逐对比较。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface IsPalindromeHooks {
  /** 比较一对 (left, right) 指针所指字符。 */
  onCompare?: (left: number, right: number) => void;
  /** 一对字符匹配成功。 */
  onMatch?: (left: number, right: number) => void;
  /** 一对字符不匹配。 */
  onMismatch?: (left: number, right: number) => void;
  /** 全部比较通过，确认是回文。 */
  onResult?: (isPalindrome: boolean) => void;
}

export interface IsPalindromeOptions {
  /** 是否规范化：转小写并忽略空白与非字母数字字符（默认 false，精确比较）。 */
  normalize?: boolean;
}

/**
 * 判定字符串是否为回文（双指针）。
 *
 * @param s 待判定字符串
 * @param hooks 可选事件钩子
 * @param options 选项（如规范化）
 * @returns 是否回文
 */
export function isPalindrome(
  s: string,
  hooks: IsPalindromeHooks = {},
  options: IsPalindromeOptions = {},
): boolean {
  const normalize = options.normalize ?? false;
  const str = normalize ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : s;

  let left = 0;
  let right = str.length - 1;
  let result = true;

  while (left < right) {
    hooks.onCompare?.(left, right);
    if (str[left] === str[right]) {
      hooks.onMatch?.(left, right);
    } else {
      hooks.onMismatch?.(left, right);
      result = false;
      break;
    }
    left++;
    right--;
  }

  hooks.onResult?.(result);
  return result;
}
