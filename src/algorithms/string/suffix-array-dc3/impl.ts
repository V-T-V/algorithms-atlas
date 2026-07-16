// =============================================================================
// DC3 后缀数组（Difference Cover modulo 3）· 纯算法实现
// Kärkkäinen-Sanders DC3：线性时间构造后缀数组。把后缀按起点 mod 3 分成两组，
// 递归求 mod!=0 的后缀排序，再用其结果对 mod==0 的后缀排序，最后归并。
// 这里在整数数组（字母表已离散化为 1..|Σ|）上工作，末尾加 0 哨兵。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SuffixArrayDc3Hooks {
  /** 对 B12（mod!=0 的后缀）完成递归排序，得到 rank。 */
  onSortB12?: (rank: number[]) => void;
  /** 对 B0（mod==0 的后缀）完成排序。 */
  onSortB0?: (sa0: number[]) => void;
  /** 归并两组完成，给出后缀数组。 */
  onMerge?: (sa: number[]) => void;
  /** 计算完成。 */
  onDone?: (sa: number[]) => void;
}

/**
 * DC3 算法（Kärkkäinen-Sanders）：在整数数组 s（末尾 0 哨兵）上线性构造后缀数组。
 *
 * 步骤：\n
 * 1. 把后缀起点 i（0-based）按 i mod 3 分组：B12 = {i : i mod 3 != 0}，B0 = {i : i mod 3 == 0}\n
 * 2. 对 B12 用「三元组 (s[i],s[i+1],s[i+2]) 基数排序」+ 递归（若三元组有重复）求序\n
 * 3. 用 B12 的序对 B0 的「(s[i], rank(i+1))」基数排序\n
 * 4. 归并 B0 与 B12（比较时利用 rank 跳跃）\n
 *
 * 时间 O(n)，空间 O(n)。返回的后缀数组已去掉哨兵偏移。
 *
 * @param s 整数数组（每个元素 > 0）；函数内部加 0 哨兵
 * @returns 后缀数组 sa（升序排列的后缀起点下标，对应原 s）
 */
export function suffixArrayDc3(s: number[], hooks: SuffixArrayDc3Hooks = {}): number[] {
  const n0 = s.length;
  if (n0 === 0) {
    hooks.onDone?.([]);
    return [];
  }
  // 加哨兵：s' = s + [0,0,0]
  const arr = [...s, 0, 0, 0];
  const result = dc3(arr, n0);
  hooks.onDone?.(result);
  return result;
}

/** DC3 主体：对长 n 的整数数组（已含足够尾部 0）求后缀数组，不含哨兵位置。 */
function dc3(s: number[], n: number): number[] {
  if (n === 1) return [0];
  if (n === 2) return s[0]! < s[1]! ? [0, 1] : [1, 0];

  // 1) B12：i mod 3 != 0
  const b12Idx: number[] = [];
  for (let i = 0; i < n; i++) if (i % 3 !== 0) b12Idx.push(i);
  // 2) 对 B12 按三元组基数排序（从低位到高位）
  b12Idx.sort((a, b) => {
    for (let k = 0; k < 3; k++) {
      const va = s[a + k]!;
      const vb = s[b + k]!;
      if (va !== vb) return va - vb;
    }
    return 0;
  });
  // 3) 给 B12 编号 rank；若有相同三元组 → 递归
  const rank12 = new Array<number>(s.length).fill(-1);
  let r = 0;
  rank12[b12Idx[0]!] = 0;
  for (let i = 1; i < b12Idx.length; i++) {
    const prev = b12Idx[i - 1]!;
    const cur = b12Idx[i]!;
    let same = true;
    for (let k = 0; k < 3; k++) {
      if (s[prev + k] !== s[cur + k]) {
        same = false;
        break;
      }
    }
    if (!same) r++;
    rank12[cur] = r;
  }
  // 若有重复三元组，递归求精确序
  if (r + 1 < b12Idx.length) {
    // 构造递归串：先 mod 1 的三元组名，再 mod 2 的三元组名
    const s1: number[] = [];
    const s2: number[] = [];
    for (let i = 0; i < n; i++) {
      if (i % 3 === 1) s1.push(rank12[i]! + 1);
      else if (i % 3 === 2) s2.push(rank12[i]! + 1);
    }
    const recInput = [...s1, ...s2, 0, 0, 0];
    const len12 = s1.length + s2.length;
    const recSa = dc3(recInput, len12);
    // 用递归结果回填 b12Idx 与 rank12
    const newB12: number[] = [];
    const mod1Count = Math.floor((n + 2) / 3); // i=1,4,7,... 的个数
    for (const pos of recSa) {
      if (pos < mod1Count) {
        newB12.push(1 + 3 * pos);
      } else {
        newB12.push(2 + 3 * (pos - mod1Count));
      }
    }
    b12Idx.length = 0;
    b12Idx.push(...newB12);
    for (let i = 0; i < b12Idx.length; i++) rank12[b12Idx[i]!] = i;
  }

  // 4) B0：按 (s[i], rank[i+1]) 排序
  const b0Idx: number[] = [];
  for (let i = 0; i < n; i += 3) b0Idx.push(i);
  b0Idx.sort((a, b) => {
    const va = s[a]!;
    const vb = s[b]!;
    if (va !== vb) return va - vb;
    return rank12[a + 1]! - rank12[b + 1]!;
  });

  // 5) 归并 B0 与 B12
  const sa: number[] = [];
  let i0 = 0;
  let i12 = 0;
  const less = (i: number, j: number): boolean => {
    // 比较 B12 后缀 i 与 B0 后缀 j（i%3!=0, j%3==0），用 rank12 加速
    const mi = i % 3;
    const va = s[i]!;
    const vb = s[j]!;
    if (va !== vb) return va < vb;
    if (mi === 1) {
      // i≡1：比较 i+1（≡2,B12）与 j+1（≡1,B12）
      return rank12[i + 1]! < rank12[j + 1]!;
    } else {
      // i≡2：先比第二字符 i+1（≡0,B0）与 j+1（≡1,B12）
      const va2 = s[i + 1]!;
      const vb2 = s[j + 1]!;
      if (va2 !== vb2) return va2 < vb2;
      // 再比 i+2（≡1,B12）与 j+2（≡2,B12）
      return rank12[i + 2]! < rank12[j + 2]!;
    }
  };
  while (i0 < b0Idx.length && i12 < b12Idx.length) {
    if (less(b12Idx[i12]!, b0Idx[i0]!)) {
      sa.push(b12Idx[i12]!);
      i12++;
    } else {
      sa.push(b0Idx[i0]!);
      i0++;
    }
  }
  while (i0 < b0Idx.length) {
    sa.push(b0Idx[i0]!);
    i0++;
  }
  while (i12 < b12Idx.length) {
    sa.push(b12Idx[i12]!);
    i12++;
  }
  return sa;
}

/**
 * 字符串便捷封装：把字符串离散化为字符码 +1（避开哨兵 0），返回 { sa, rank }。
 * @param s 输入字符串
 * @returns { sa: 后缀起点升序数组, rank: sa 的逆 }
 */
export function suffixArrayDc3String(s: string): { sa: number[]; rank: number[] } {
  if (s.length === 0) return { sa: [], rank: [] };
  const arr = Array.from(s, (c) => c.charCodeAt(0));
  const sa = suffixArrayDc3(arr);
  const rank = new Array<number>(sa.length).fill(0);
  for (let i = 0; i < sa.length; i++) rank[sa[i]!] = i;
  return { sa, rank };
}
