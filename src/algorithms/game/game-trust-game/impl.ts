// 信任博弈 · 实现
export interface TrustHooks {
  onSend?: (s: number) => void;
  onReturn?: (r: number) => void;
  onPayoff?: (sender: number, trustee: number) => void;
}
export function trustGame(
  endowment: number,
  send: number,
  multiplier: number,
  returnAmt: number,
  hooks: TrustHooks = {},
): { sender: number; trustee: number } {
  hooks.onSend?.(send);
  const received = send * multiplier;
  hooks.onReturn?.(returnAmt);
  const sender = endowment - send + returnAmt;
  const trustee = endowment + received - returnAmt;
  hooks.onPayoff?.(sender, trustee);
  return { sender, trustee };
}
