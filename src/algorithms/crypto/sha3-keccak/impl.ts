// =============================================================================
// SHA-3 / Keccak 海绵结构 · 简化教学实现
// 不是密码学安全的 SHA-3，仅演示海绵：absorb（XOR + 置换）+ squeeze。
// =============================================================================

/** 状态用 25 个 64 位字（与真实 Keccak-f[1600] 同构），用 JS number（精确到 2^53）。 */
const STATE_LANES = 25;
/** 容量 c 与速率 r（以 lane 数计，简化：r=16 lanes, c=9 lanes）。 */
const RATE_LANES = 16;
const ROUNDS = 24;

export interface KeccakHooks {
  onAbsorb?: (blockIndex: number, block: number[]) => void;
  onPermute?: (roundIndex: number) => void;
  onSqueeze?: (outIndex: number, word: number) => void;
}

/** 字符串 → 字节。 */
export function toBytes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0) & 0xff);
}

/** 简化的 Keccak-f[?:] 风格置换：θ ρ π χ ι 的线性简化版（可逆性来自 ι 的轮常数）。 */
function keccakFRound(state: number[], round: number): void {
  // θ：每 lane 异或相邻列的差分
  const c = new Array<number>(5).fill(0);
  const d = new Array<number>(5).fill(0);
  for (let x = 0; x < 5; x++) {
    let acc = 0;
    for (let y = 0; y < 5; y++) acc ^= state[x + 5 * y]!;
    c[x] = acc >>> 0;
  }
  for (let x = 0; x < 5; x++) {
    d[x] = (c[(x + 4) % 5]! ^ (((c[(x + 1) % 5]! << 1) | (c[(x + 1) % 5]! >>> 31)) >>> 0)) >>> 0;
  }
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      state[x + 5 * y] = (state[x + 5 * y]! ^ d[x]!) >>> 0;
    }
  }
  // ρ + π 合并：旋转 + 重排（简化为按 round 旋转）
  const tmp = state.slice();
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      const nx = y;
      const ny = (2 * x + 3 * y) % 5;
      const rot = (round + x + y) % 32;
      const v = tmp[x + 5 * y]!;
      state[nx + 5 * ny] = ((v << rot) | (v >>> (32 - rot))) >>> 0;
    }
  }
  // χ：非线性
  const tmp2 = state.slice();
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      const cur = tmp2[x + 5 * y]!;
      const nx1 = tmp2[((x + 1) % 5) + 5 * y]!;
      const nx2 = tmp2[((x + 2) % 5) + 5 * y]!;
      state[x + 5 * y] = (cur ^ ((~nx1 >>> 0) & nx2)) >>> 0;
    }
  }
  // ι：轮常数（简化线性反馈）
  const rc = (0x9e3779b9 ^ (round * 0x85ebca77)) >>> 0;
  state[0] = (state[0]! ^ rc) >>> 0;
}

function keccakF(state: number[], hooks: KeccakHooks): void {
  for (let r = 0; r < ROUNDS; r++) {
    keccakFRound(state, r);
    hooks.onPermute?.(r);
  }
}

/** 把字节块打包进 lanes（rate 个 lane，每 lane 4 字节）。 */
function bytesToLanes(block: number[]): number[] {
  const lanes: number[] = [];
  for (let i = 0; i < RATE_LANES; i++) {
    let v = 0;
    for (let b = 0; b < 4; b++) {
      const idx = i * 4 + b;
      if (idx < block.length) v |= (block[idx]! & 0xff) << (8 * b);
    }
    lanes.push(v >>> 0);
  }
  return lanes;
}

/** 把 lanes（rate 个）拆成字节串。 */
function lanesToBytes(lanes: number[], byteLen: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < RATE_LANES && out.length < byteLen; i++) {
    const v = lanes[i]!;
    for (let b = 0; b < 4 && out.length < byteLen; b++) {
      out.push((v >>> (8 * b)) & 0xff);
    }
  }
  return out;
}

/**
 * SHA-3 风格海绵（简化）：
 *  - padding：SHA-3 的 0x06...0x80 域分离；
 *  - absorb：每个 rate 块 XOR 进 state[0..rate)，再 keccakF；
 *  - squeeze：从 state[0..rate) 取字节，需要更多时再置换。
 *
 * @param input 输入字符串
 * @param digestLen 输出字节数（默认 32 = 256 位）
 */
export function keccakHash(input: string, digestLen = 32, hooks: KeccakHooks = {}): string {
  const data = toBytes(input);
  const rateBytes = RATE_LANES * 4; // 64 字节
  // padding：附 0x06，零填充，末字节 |= 0x80
  const padded = [...data, 0x06];
  while (padded.length % rateBytes !== rateBytes - 1) padded.push(0);
  padded.push(0x80);

  const state: number[] = new Array<number>(STATE_LANES).fill(0);

  // absorb
  for (let blockIdx = 0; blockIdx < padded.length / rateBytes; blockIdx++) {
    const block = padded.slice(blockIdx * rateBytes, (blockIdx + 1) * rateBytes);
    const lanes = bytesToLanes(block);
    hooks.onAbsorb?.(blockIdx, lanes);
    for (let i = 0; i < RATE_LANES; i++) {
      state[i] = (state[i]! ^ lanes[i]!) >>> 0;
    }
    keccakF(state, hooks);
  }

  // squeeze
  const out: number[] = [];
  while (out.length < digestLen) {
    const chunk = lanesToBytes(state, Math.min(rateBytes, digestLen - out.length));
    for (const b of chunk) {
      out.push(b);
      hooks.onSqueeze?.(out.length - 1, b);
    }
    if (out.length < digestLen) keccakF(state, hooks);
  }

  // 转十六进制
  return out.map((b) => b.toString(16).padStart(2, '0')).join('');
}
