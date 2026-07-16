// =============================================================================
// Miller-Rabin 素性测试（Miller-Rabin Primality）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// 大数运算全程用 BigInt，保证 >2^53 时仍精确。
// =============================================================================

/** 一次「见证基」检测的结论。 */
export interface WitnessOutcome {
  /** 检测用的底数 a。 */
  a: number;
  /** 是否发现 a^(d·2^0) ≡ 1 (mod n)：若如此则本轮通过（无法证伪）。 */
  passedAtFirst: boolean;
  /** 是否在平方链中撞到 n-1（无法证伪）。 */
  passedAtSquare: boolean;
  /** 是否被证伪（连续平方始终不为 n-1）→ 确定合数。 */
  composite: boolean;
  /** 平方链上出现的余数（首项为 a^d mod n）。 */
  chain: number[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MillerRabinHooks {
  /** 把 n-1 写成 d·2^s 形式（d 为奇数）。 */
  onDecompose?: (s: number, d: bigint) => void;
  /** 选定一个见证底数 a，开始一轮检测。 */
  onWitness?: (a: number) => void;
  /** 平方链上的一步：当前指数/余数、是否命中 1 或 n-1。 */
  onSquare?: (value: bigint, hitOne: boolean, hitMinusOne: boolean) => void;
  /** 一个见证基判定完成，给出本轮结论。 */
  onWitnessDone?: (out: WitnessOutcome) => void;
  /** 最终判定：true=合数（含小输入），false=可能素数。 */
  onDone?: (n: number, isComposite: boolean) => void;
}

const SMALL_PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

/** BigInt 模幂：base^exp mod m。 */
function powMod(base: bigint, exp: bigint, m: bigint): bigint {
  if (m === 1n) return 0n;
  let result = 1n;
  let b = ((base % m) + m) % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % m;
    e >>= 1n;
    b = (b * b) % m;
  }
  return result;
}

/**
 * Miller-Rabin 素性测试（概率性，确定性底数下为确定算法）。
 *
 * 原理：若 n 为奇素数，把 n-1 写成 `d·2^s`（d 为奇数）。对任一 `1 < a < n`：
 *   - 要么 `a^d ≡ 1 (mod n)`
 *   - 要么存在某个 `0 ≤ r < s` 使 `a^(d·2^r) ≡ -1 (mod n)`
 * 违反则 n 必为合数（称 a 为「见证」）。
 *
 * 本实现取前若干小素数作底数：对 n < 3.3·10²⁴，前 12 个素数即可给出确定结论；
 * 对普通 64 位整数覆盖绰绰有余。全程 BigInt，避免溢出。
 *
 * @param n 待测整数（n ≥ 0）
 * @param rounds 使用的见证底数个数（默认 12，覆盖到确定性范围）
 * @returns `false` 表示 n 为素数（确定）；`true` 表示 n 为合数（确定）。
 *          小于 2 视为合数。
 */
export function millerRabin(n: number, rounds = 12, hooks: MillerRabinHooks = {}): boolean {
  // isPrime = true 表示素数；对外返回值即「是否素数」，onDone 传「是否合数」。
  const isPrime = millerRabinCheck(n, rounds, hooks);
  hooks.onDone?.(n, !isPrime);
  return isPrime; // true = 素数；false = 合数
}

/** 内部：返回 true 表示 n 为素数。 */
function millerRabinCheck(n: number, rounds: number, hooks: MillerRabinHooks): boolean {
  if (n < 2) return false;
  // 小素数直接命中
  for (const p of SMALL_PRIMES) {
    if (BigInt(n) === p) return true;
    if (BigInt(n) % p === 0n) return false;
  }

  const nb = BigInt(n);
  // 分解 n-1 = d · 2^s，d 为奇数
  let d = nb - 1n;
  let s = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }
  hooks.onDecompose?.(s, d);

  const witnessCount = Math.min(rounds, SMALL_PRIMES.length);
  for (let k = 0; k < witnessCount; k++) {
    const ab = SMALL_PRIMES[k]!;
    const a = Number(ab);
    hooks.onWitness?.(a);

    let x = powMod(ab, d, nb);
    const chain: bigint[] = [x];
    const passedAtFirst = x === 1n;
    let passedAtSquare = false;
    let composite = false;

    if (x !== 1n && x !== nb - 1n) {
      let compositeNow = true;
      for (let r = 1; r < s; r++) {
        x = (x * x) % nb;
        chain.push(x);
        const hitMinusOne = x === nb - 1n;
        const hitOne = x === 1n;
        hooks.onSquare?.(x, hitOne, hitMinusOne);
        if (hitMinusOne) {
          passedAtSquare = true;
          compositeNow = false;
          break;
        }
        if (hitOne) break; // 出现 1 之前未遇 -1，必为合数
      }
      if (compositeNow) composite = true;
    } else {
      // 首项即 1 或 -1：本轮通过
      hooks.onSquare?.(x, x === 1n, x === nb - 1n);
    }

    const out: WitnessOutcome = {
      a,
      passedAtFirst,
      passedAtSquare,
      composite,
      chain: chain.map((v) => Number(v)),
    };
    hooks.onWitnessDone?.(out);

    if (composite) return false; // 找到见证 → 合数
  }
  return true;
}
