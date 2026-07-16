// 单性别洗手间 · 实现

export type Gender = 'M' | 'F';

export interface UbEvent {
  person: number;
  gender: Gender;
  action: 'enter' | 'leave';
}

export interface UbStep {
  person: number;
  action: string;
  currentGender: Gender | null;
  inside: number[];
  waiting: Array<{ person: number; gender: Gender }>;
}

export function simulateUnisexBathroom(events: UbEvent[], capacity = 3): UbStep[] {
  let currentGender: Gender | null = null;
  const inside: number[] = [];
  const waiting: Array<{ person: number; gender: Gender }> = [];
  const steps: UbStep[] = [];

  const tryAdmit = (): void => {
    if (waiting.length === 0) return;
    // 若室内空，取队首性别
    if (inside.length === 0) {
      currentGender = waiting[0]!.gender;
    }
    while (waiting.length > 0 && inside.length < capacity && waiting[0]!.gender === currentGender) {
      const w = waiting.shift()!;
      inside.push(w.person);
    }
  };

  for (const ev of events) {
    if (ev.action === 'enter') {
      if (currentGender === null) {
        currentGender = ev.gender;
        inside.push(ev.person);
      } else if (ev.gender === currentGender && inside.length < capacity) {
        inside.push(ev.person);
      } else {
        waiting.push({ person: ev.person, gender: ev.gender });
      }
    } else {
      const idx = inside.indexOf(ev.person);
      if (idx >= 0) inside.splice(idx, 1);
      if (inside.length === 0) currentGender = null;
      tryAdmit();
    }
    steps.push({
      person: ev.person,
      action: ev.action,
      currentGender,
      inside: [...inside],
      waiting: [...waiting],
    });
  }
  return steps;
}
