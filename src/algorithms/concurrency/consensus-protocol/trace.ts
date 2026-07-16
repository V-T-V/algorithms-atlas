// =============================================================================
// 共识协议（Paxos 简化版）· 录制帧序列
// 用 setAux 展示各 Acceptor 状态（promisedN / accepted）、阶段进度、选定值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { runPaxos, type AcceptorState, type PaxosHooks } from './impl.ts';

export const DEFAULT_INPUT = { numAcceptors: 3, proposalValue: 42, proposalNumber: 1 };

interface TraceOptions {
  numAcceptors: number;
  proposalValue: number;
  proposalNumber: number;
}

export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const numAcceptors = opts.numAcceptors ?? DEFAULT_INPUT.numAcceptors;
  const proposalValue = opts.proposalValue ?? DEFAULT_INPUT.proposalValue;
  const proposalNumber = opts.proposalNumber ?? DEFAULT_INPUT.proposalNumber;
  const rec = new TraceRecorder();
  const majority = Math.floor(numAcceptors / 2) + 1;

  const acceptors: AcceptorState[] = Array.from({ length: numAcceptors }, () => ({
    promisedN: 0,
    acceptedN: 0,
    acceptedV: null,
  }));
  let phase = 'init';
  let chosenValue: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        ...acceptors.map((a, i) => ({
          label: `A${i}`,
          value: `prom=${a.promisedN},acc=(${a.acceptedN},${a.acceptedV ?? '-'})`,
          role: (a.acceptedV !== null
            ? 'final'
            : a.promisedN > 0
              ? 'compare'
              : 'default') as BarRole,
        })),
        { label: '阶段', value: phase, role: 'pivot' as BarRole },
        {
          label: '多数派',
          value: `${majority}/${numAcceptors}`,
          role: 'frontier' as BarRole,
        },
        {
          label: '选定值',
          value: chosenValue === null ? '-' : String(chosenValue),
          role: (chosenValue === null ? 'default' : 'final') as BarRole,
        },
      ])
      .commit();
  };

  snapshot({
    zh: `初始化：${numAcceptors} 个 Acceptor，提议值=${proposalValue}，编号=${proposalNumber}`,
    en: `Init: ${numAcceptors} Acceptors, value=${proposalValue}, n=${proposalNumber}`,
  });

  const hooks: PaxosHooks = {
    onPrepare: () => {
      phase = 'Phase1: Prepare';
      snapshot({
        zh: `Phase 1：Proposer 发 Prepare(n=${proposalNumber})`,
        en: `Phase 1: Proposer sends Prepare(n=${proposalNumber})`,
      });
    },
    onPromise: (a, n, acceptedValue) => {
      acceptors[a]!.promisedN = n;
      acceptors[a]!.acceptedV = acceptedValue;
      snapshot({
        zh: `A${a} 回 Promise(n=${n}${acceptedValue !== null ? `, 已接受=${acceptedValue}` : ''})`,
        en: `A${a} replies Promise(n=${n}${acceptedValue !== null ? `, accepted=${acceptedValue}` : ''})`,
      });
    },
    onAccept: (n, value) => {
      phase = 'Phase2: Accept';
      snapshot({
        zh: `Phase 2：Proposer 发 Accept(n=${n}, value=${value})`,
        en: `Phase 2: Proposer sends Accept(n=${n}, value=${value})`,
      });
    },
    onAccepted: (a, n, value) => {
      acceptors[a]!.acceptedN = n;
      acceptors[a]!.acceptedV = value;
      snapshot({
        zh: `A${a} 接受 (n=${n}, value=${value})`,
        en: `A${a} accepts (n=${n}, value=${value})`,
      });
    },
    onChosen: (value) => {
      chosenValue = value;
      phase = 'Chosen';
      snapshot({
        zh: `值 ${value} 被选定，Learner 学习`,
        en: `Value ${value} chosen, Learner learns`,
      });
    },
  };

  runPaxos(numAcceptors, proposalValue, proposalNumber, hooks);

  rec
    .begin({
      zh: chosenValue === null ? '完成：未达成共识（未达多数）' : `完成：共识值 = ${chosenValue}`,
      en:
        chosenValue === null
          ? 'Done: no consensus (no majority)'
          : `Done: consensus value = ${chosenValue}`,
    })
    .setAux([
      {
        label: '结果',
        value: chosenValue === null ? '失败' : `选定 ${chosenValue}`,
        role: (chosenValue === null ? 'warn' : 'final') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
