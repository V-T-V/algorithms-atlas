// =============================================================================
// 共识协议（Paxos 简化版）· 纯算法实现
// 角色：Proposer（1）、Acceptor（2f+1 个）、Learner（可复用 Acceptor）。
// 流程：
//   1. Proposer 发 Prepare(n) 给所有 Acceptor
//   2. Acceptor 若 n > 已承诺最大编号，则 Promise(n, acceptedValue?)，记录承诺
//   3. Proposer 收到多数 Promise 后，选择值（若有 acceptedValue 取最大编号那个，否则自己的值）
//      发 Accept(n, value)
//   4. Acceptor 若 n >= 已承诺最大编号，则接受，回 Ack(n, value)，记录已接受
//   5. Proposer 收到多数 Ack → 选定，通知 Learner
// =============================================================================

/** Acceptor 状态。 */
export interface AcceptorState {
  /** 已承诺的最大提议编号。 */
  promisedN: number;
  /** 已接受的 (编号, 值)。 */
  acceptedN: number;
  acceptedV: number | null;
}

/** 事件钩子。 */
export interface PaxosHooks {
  onPrepare?: (n: number) => void;
  onPromise?: (acceptor: number, n: number, acceptedValue: number | null) => void;
  onAccept?: (n: number, value: number) => void;
  onAccepted?: (acceptor: number, n: number, value: number) => void;
  onChosen?: (value: number) => void;
}

/** 共识结果。 */
export interface ConsensusResult {
  chosen: boolean;
  value: number | null;
  finalAcceptors: AcceptorState[];
}

/**
 * 运行一轮简化 Paxos（无竞争，保证多数派响应）。
 * @param numAcceptors Acceptor 数量（建议 2f+1）
 * @param proposalValue Proposer 想提议的值
 * @param proposalNumber 提议编号
 * @param hooks 事件钩子
 */
export function runPaxos(
  numAcceptors: number,
  proposalValue: number,
  proposalNumber: number,
  hooks: PaxosHooks = {},
): ConsensusResult {
  const acceptors: AcceptorState[] = Array.from({ length: numAcceptors }, () => ({
    promisedN: 0,
    acceptedN: 0,
    acceptedV: null,
  }));
  const majority = Math.floor(numAcceptors / 2) + 1;

  // —— Phase 1: Prepare / Promise ——
  hooks.onPrepare?.(proposalNumber);
  const promises: Array<{ acceptor: number; acceptedValue: number | null; acceptedN: number }> = [];
  for (let a = 0; a < numAcceptors; a++) {
    const acc = acceptors[a]!;
    if (proposalNumber > acc.promisedN) {
      acc.promisedN = proposalNumber;
      promises.push({ acceptor: a, acceptedValue: acc.acceptedV, acceptedN: acc.acceptedN });
      hooks.onPromise?.(a, proposalNumber, acc.acceptedV);
    }
  }

  if (promises.length < majority) {
    return { chosen: false, value: null, finalAcceptors: acceptors };
  }

  // 选定提议值：若有 acceptedValue，取最大 acceptedN 对应的值
  let chosenValue = proposalValue;
  let maxAcceptedN = -1;
  for (const p of promises) {
    if (p.acceptedValue !== null && p.acceptedN > maxAcceptedN) {
      maxAcceptedN = p.acceptedN;
      chosenValue = p.acceptedValue;
    }
  }

  // —— Phase 2: Accept / Accepted ——
  hooks.onAccept?.(proposalNumber, chosenValue);
  let acceptedCount = 0;
  for (let a = 0; a < numAcceptors; a++) {
    const acc = acceptors[a]!;
    if (proposalNumber >= acc.promisedN) {
      acc.promisedN = proposalNumber;
      acc.acceptedN = proposalNumber;
      acc.acceptedV = chosenValue;
      acceptedCount++;
      hooks.onAccepted?.(a, proposalNumber, chosenValue);
    }
  }

  if (acceptedCount >= majority) {
    hooks.onChosen?.(chosenValue);
    return { chosen: true, value: chosenValue, finalAcceptors: acceptors };
  }

  return { chosen: false, value: null, finalAcceptors: acceptors };
}
