// 桥梁通行 · 实现

export type Direction = 'N' | 'S';

export interface BridgeEvent {
  car: number;
  dir: Direction;
  action: 'arrive' | 'exit';
}

export interface BridgeStep {
  car: number;
  action: string;
  currentDir: Direction | null;
  onBridge: number;
  passedThisDir: number;
  waitingN: number;
  waitingS: number;
}

export function simulateBridge(events: BridgeEvent[], maxPerDir = 3): BridgeStep[] {
  let currentDir: Direction | null = null;
  let onBridge = 0;
  let passedThisDir = 0;
  let waitingN = 0;
  let waitingS = 0;
  const steps: BridgeStep[] = [];

  for (const ev of events) {
    if (ev.action === 'arrive') {
      if (currentDir === null) {
        currentDir = ev.dir;
        onBridge = 1;
        passedThisDir = 1;
      } else if (
        ev.dir === currentDir &&
        passedThisDir < maxPerDir &&
        waitingN === 0 &&
        waitingS === 0
      ) {
        onBridge++;
        passedThisDir++;
      } else if (ev.dir === currentDir && waitingN === 0 && waitingS === 0) {
        // 达到上限，需排队
        if (ev.dir === 'N') waitingN++;
        else waitingS++;
      } else {
        if (ev.dir === 'N') waitingN++;
        else waitingS++;
      }
    } else {
      // exit
      onBridge = Math.max(0, onBridge - 1);
      if (onBridge === 0) {
        // 方向切换：优先让对向等者
        if (currentDir === 'N' && waitingS > 0) {
          currentDir = 'S';
          onBridge = Math.min(waitingS, maxPerDir);
          waitingS -= onBridge;
          passedThisDir = onBridge;
        } else if (currentDir === 'S' && waitingN > 0) {
          currentDir = 'N';
          onBridge = Math.min(waitingN, maxPerDir);
          waitingN -= onBridge;
          passedThisDir = onBridge;
        } else if (waitingN > 0 || waitingS > 0) {
          // 同向还有等待
          const w = currentDir === 'N' ? 'waitingN' : 'waitingS';
          if (w === 'waitingN' && waitingN > 0) {
            onBridge = Math.min(waitingN, maxPerDir);
            waitingN -= onBridge;
            passedThisDir = onBridge;
          } else if (w === 'waitingS' && waitingS > 0) {
            onBridge = Math.min(waitingS, maxPerDir);
            waitingS -= onBridge;
            passedThisDir = onBridge;
          }
        } else {
          passedThisDir = 0;
        }
      }
    }
    steps.push({
      car: ev.car,
      action: ev.action,
      currentDir,
      onBridge,
      passedThisDir,
      waitingN,
      waitingS,
    });
  }
  return steps;
}
