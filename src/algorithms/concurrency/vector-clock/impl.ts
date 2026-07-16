// =============================================================================
// 向量时钟（因果排序）· 纯算法实现（事件序列模拟）
// 每个进程维护 n 维向量 V[p]。
//   local   : V[p][p]++
//   send    : V[p][p]++，附向量 V[p]
//   receive : 对每维 i，V[p][i] = max(V[p][i], m[i])；再 V[p][p]++
// =============================================================================

export type VCEventType = 'local' | 'send' | 'receive';

export interface VCEvent {
  proc: number;
  type: VCEventType;
  msgId?: string;
}

export interface VectorClockHooks {
  onEvent?: (proc: number, type: VCEventType, newVector: number[], msgId?: string) => void;
}

export interface VCEventResult {
  event: VCEvent;
  vector: number[];
  sentVector?: number[];
}

export interface VCResult {
  vectors: number[][];
  results: VCEventResult[];
}

/**
 * 运行向量时钟模拟。
 * @param nProc 进程数
 * @param events 事件序列（send 须先于对应 receive）
 */
export function simulateVectorClock(
  nProc: number,
  events: VCEvent[],
  hooks: VectorClockHooks = {},
): VCResult {
  const vectors: number[][] = Array.from({ length: nProc }, () => new Array<number>(nProc).fill(0));
  const sentVectors = new Map<string, number[]>();
  const results: VCEventResult[] = [];

  for (const ev of events) {
    const p = ev.proc;
    if (ev.type === 'local') {
      vectors[p]![p] = vectors[p]![p]! + 1;
      results.push({ event: ev, vector: [...vectors[p]!] });
      hooks.onEvent?.(p, 'local', [...vectors[p]!]);
    } else if (ev.type === 'send') {
      vectors[p]![p] = vectors[p]![p]! + 1;
      const v = [...vectors[p]!];
      sentVectors.set(ev.msgId!, v);
      results.push({ event: ev, vector: v, sentVector: v });
      hooks.onEvent?.(p, 'send', v, ev.msgId);
    } else {
      const m = sentVectors.get(ev.msgId!) ?? new Array<number>(nProc).fill(0);
      for (let i = 0; i < nProc; i++) {
        vectors[p]![i] = Math.max(vectors[p]![i]!, m[i]!);
      }
      vectors[p]![p] = vectors[p]![p]! + 1;
      results.push({ event: ev, vector: [...vectors[p]!] });
      hooks.onEvent?.(p, 'receive', [...vectors[p]!], ev.msgId);
    }
  }

  return { vectors, results };
}

/** 比较：a < b 当且仅当所有维 a[i] <= b[i] 且至少一维严格小。 */
export function vcLess(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  let le = true;
  let strict = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]! > b[i]!) {
      le = false;
      break;
    }
    if (a[i]! < b[i]!) strict = true;
  }
  return le && strict;
}

/** 判定并发：既不 a<=b 也不 b<=a。 */
export function isConcurrent(a: number[], b: number[]): boolean {
  return !vcLess(a, b) && !vcLess(b, a) && !eqVec(a, b);
}

function eqVec(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
