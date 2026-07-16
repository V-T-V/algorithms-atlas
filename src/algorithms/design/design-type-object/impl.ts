export interface TypeObj {
  name: string;
  maxHp: number;
  attack: number;
}
export class Instance {
  hp: number;
  constructor(public type: TypeObj) {
    this.hp = type.maxHp;
  }
}
export interface ToHooks {
  onHit?: (target: Instance, dmg: number, hpAfter: number) => void;
}
export function attack(a: Instance, b: Instance, hooks: ToHooks = {}): void {
  b.hp = Math.max(0, b.hp - a.type.attack);
  hooks.onHit?.(b, a.type.attack, b.hp);
}
