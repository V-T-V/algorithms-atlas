// =============================================================================
// SA-IS 后缀数组（Suffix Array via Induced Sorting）· 纯算法实现
// Nong-Zhang-Chan SA-IS：线性时间构造后缀数组。把后缀分类为 S 型/L 型，
// 用 S* 型后缀的诱导排序递归求序，再用其结果诱导 L 型与 S 型。
// 在整数数组（末尾 0 哨兵）上工作。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SuffixArraySaIsHooks {
  /** 标记完 L/S 型后，给出 t 数组（true=S 型）。 */
  onType?: (t: boolean[]) => void;
  /** 确定 S* 型后缀位置。 */
  onSStar?: (positions: number[]) => void;
  /** 诱导排序一轮（L-type / S-type）完成。 */
  onInduce?: (phase: 'L' | 'S', sa: number[]) => void;
  /** 计算完成。 */
  onDone?: (sa: number[]) => void;
}

const NEG = -1;

/**
 * SA-IS：在整数数组 s（末尾 0 哨兵）上线性构造后缀数组。
 *
 * 高层步骤：\n
 * 1. 标记每个位置为 L 型或 S 型（s[i] < s[i+1] 为 S 型）\n
 * 2. 找 S* 型位置（S 型且前一位置为 L 型）\n
 * 3. 对 S* 子串命名；若命名唯一直接排序，否则递归\n
 * 4. 用 S* 排序结果诱导 L 型、再诱导 S 型后缀排序\n
 *
 * 时间 O(n)，空间 O(n)。返回后缀起点升序数组（不含哨兵位置）。
 *
 * @param s 整数数组（每个元素 >= 0），末尾隐含 0 哨兵（函数内部补）
 * @returns 后缀数组 sa（升序排列的后缀起点下标）
 */
export function suffixArraySaIs(s: number[], hooks: SuffixArraySaIsHooks = {}): number[] {
  if (s.length === 0) {
    hooks.onDone?.([]);
    return [];
  }
  // 加 0 哨兵
  const arr = [...s, 0];
  const sa = sais(arr, hooks);
  // 去掉哨兵位置（sa 中含 n，即哨兵后缀）
  const result = sa.filter((x) => x < s.length);
  hooks.onDone?.(result);
  return result;
}

function sais(s: number[], hooks: SuffixArraySaIsHooks): number[] {
  const n = s.length;
  if (n === 1) return [0];
  if (n === 2) return [1, 0]; // [x, 0]：0 哨兵最小

  // 1) L/S 型：t[i]=true 表示 S 型
  const t = new Array<boolean>(n).fill(false);
  t[n - 1] = true; // 哨兵是 S 型
  for (let i = n - 2; i >= 0; i--) {
    if (s[i]! < s[i + 1]!) t[i] = true;
    else if (s[i]! === s[i + 1]!) t[i] = t[i + 1]!;
    else t[i] = false;
  }
  hooks.onType?.(t);

  // 2) S* 型：S 型且 (i==0 或 i-1 是 L 型)
  const isSStar = new Array<boolean>(n).fill(false);
  const sStarPos: number[] = [];
  for (let i = 0; i < n; i++) {
    if (t[i]! && (i === 0 || !t[i - 1]!)) {
      isSStar[i] = true;
      sStarPos.push(i);
    }
  }
  hooks.onSStar?.(sStarPos);

  // 字母表大小
  const sigma = Math.max(...s) + 1;

  // 桶边界
  const bucketEnd = ((): number[] => {
    const cnt = new Array<number>(sigma).fill(0);
    for (const v of s) cnt[v]!++;
    const end = new Array<number>(sigma).fill(0);
    let sum = 0;
    for (let c = 0; c < sigma; c++) {
      sum += cnt[c]!;
      end[c] = sum - 1;
    }
    return end;
  })();
  const bucketStart = ((): number[] => {
    const cnt = new Array<number>(sigma).fill(0);
    for (const v of s) cnt[v]!++;
    const start = new Array<number>(sigma).fill(0);
    let sum = 0;
    for (let c = 0; c < sigma; c++) {
      start[c] = sum;
      sum += cnt[c]!;
    }
    return start;
  })();

  const sa = new Array<number>(n).fill(NEG);

  // 3) 把 S* 型后缀按首字符放入各桶末尾（诱导排序 step 1）
  const inducedSort = (sStarSa: number[] | null): void => {
    sa.fill(NEG);
    // step 1：S* 放桶末尾
    const end = [...bucketEnd];
    if (sStarSa === null) {
      // 首次：按 S* 位置逆序放入
      for (let k = sStarPos.length - 1; k >= 0; k--) {
        const p = sStarPos[k]!;
        const c = s[p]!;
        sa[end[c]!] = p;
        end[c] = end[c]! - 1;
      }
    } else {
      for (let k = sStarSa.length - 1; k >= 0; k--) {
        const p = sStarSa[k]!;
        const c = s[p]!;
        sa[end[c]!] = p;
        end[c] = end[c]! - 1;
      }
    }
    hooks.onInduce?.('L', [...sa]);
    // step 2：诱导 L 型（从左到右）
    const start = [...bucketStart];
    // 跳过桶首（已是 L 型起点的扫描）
    for (let i = 0; i < n; i++) {
      const j = sa[i]!;
      if (j === NEG || j === 0) continue;
      const prev = j - 1;
      if (!t[prev]!) {
        // prev 是 L 型
        const c = s[prev]!;
        sa[start[c]!] = prev;
        start[c] = start[c]! + 1;
      }
    }
    hooks.onInduce?.('L', [...sa]);
    // step 3：诱导 S 型（从右到左）
    const end2 = [...bucketEnd];
    for (let i = n - 1; i >= 0; i--) {
      const j = sa[i]!;
      if (j === NEG || j === 0) continue;
      const prev = j - 1;
      if (t[prev]!) {
        // prev 是 S 型
        const c = s[prev]!;
        sa[end2[c]!] = prev;
        end2[c] = end2[c]! - 1;
      }
    }
    hooks.onInduce?.('S', [...sa]);
  };

  // 首次诱导排序（S* 未排序，仅按桶放）
  inducedSort(null);

  // 4) 给 S* 子串命名
  // 收集 sa 中按序出现的 S* 位置
  const sStarInSa: number[] = [];
  for (let i = 0; i < n; i++) {
    if (sa[i] !== NEG && isSStar[sa[i]!]) sStarInSa.push(sa[i]!);
  }
  // 命名：相同子串同名
  const name = new Array<number>(n).fill(NEG);
  let lastSStar = NEG;
  let curName = 0;
  for (let i = 0; i < sStarInSa.length; i++) {
    const p = sStarInSa[i]!;
    if (lastSStar === NEG) {
      name[p] = 0;
    } else {
      // 比较 S* 子串 p 与 lastSStar
      let same = true;
      let a = p;
      let b = lastSStar;
      do {
        if (s[a]! !== s[b]! || t[a]! !== t[b]!) {
          same = false;
          break;
        }
        a++;
        b++;
      } while (!(isSStar[a]! && isSStar[b]!));
      // 还要检查边界处
      if (same && (s[a]! !== s[b]! || isSStar[a]! !== isSStar[b]!)) same = false;
      if (!same) curName++;
      name[p] = curName;
    }
    lastSStar = p;
  }

  // 构造递归串（按 S* 在原串中的出现顺序）
  const recS: number[] = [];
  for (let i = 0; i < n; i++) {
    if (isSStar[i]) recS.push(name[i]! + 1); // +1 避开 0
  }
  const recSigma = curName + 2;

  let sStarSa: number[];
  if (curName + 1 === sStarPos.length) {
    // 命名唯一：直接按 name 排序
    sStarSa = new Array(sStarPos.length).fill(0);
    for (let i = 0; i < sStarPos.length; i++) {
      sStarSa[name[sStarPos[i]!]!] = sStarPos[i]!;
    }
  } else {
    // 递归
    const recResult = saisCore(recS, recSigma, hooks);
    sStarSa = recResult.map((idx) => sStarPos[idx]!);
  }

  // 5) 用排序好的 S* 再做一次诱导排序
  inducedSort(sStarSa);

  return sa;
}

/** SA-IS 递归核心：在已离散化（1..sigma-1，末尾 0）的整数数组上。 */
function saisCore(s: number[], sigma: number, hooks: SuffixArraySaIsHooks): number[] {
  // 复用 sais，但字母表已知为 sigma（避免 Math.max 扫描）
  // 为简洁，这里直接调用 sais（内部会重算 sigma，结果一致）
  void sigma;
  return sais(s, hooks);
}

/**
 * 字符串便捷封装：返回 { sa, rank }。
 */
export function suffixArraySaIsString(s: string): { sa: number[]; rank: number[] } {
  if (s.length === 0) return { sa: [], rank: [] };
  const arr = Array.from(s, (c) => c.charCodeAt(0) + 1); // +1 避开 0 哨兵
  const sa = suffixArraySaIs(arr);
  const rank = new Array<number>(sa.length).fill(0);
  for (let i = 0; i < sa.length; i++) rank[sa[i]!] = i;
  return { sa, rank };
}
