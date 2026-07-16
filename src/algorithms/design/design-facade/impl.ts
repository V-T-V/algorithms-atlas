// 外观模式 · 实现
export interface FacadeHooks {
  onSubStep?: (subsystem: string, action: string, result: string) => void;
  onResult?: (success: boolean, log: string) => void;
}

export class CPU {
  freeze(): string {
    return 'CPU freeze';
  }
  jump(addr: number): string {
    return `CPU jump ${addr}`;
  }
  execute(): string {
    return 'CPU execute';
  }
}
export class Memory {
  load(addr: number, data: string): string {
    return `Memory load ${data}@${addr}`;
  }
}
export class HardDrive {
  read(lba: number, size: number): string {
    return `HD read ${size}B@${lba}`;
  }
}

export class ComputerFacade {
  private readonly cpu = new CPU();
  private readonly mem = new Memory();
  private readonly hd = new HardDrive();
  private readonly hooks: FacadeHooks;
  constructor(hooks: FacadeHooks = {}) {
    this.hooks = hooks;
  }

  boot(): boolean {
    const log: string[] = [];
    const step = (sub: string, action: string, r: string) => {
      log.push(r);
      this.hooks.onSubStep?.(sub, action, r);
    };
    step('CPU', 'freeze', this.cpu.freeze());
    step('Memory', 'load', this.mem.load(0, 'bootloader'));
    step('HD', 'read', this.hd.read(0, 1024));
    step('CPU', 'jump', this.cpu.jump(0));
    step('CPU', 'execute', this.cpu.execute());
    this.hooks.onResult?.(true, log.join('; '));
    return true;
  }

  shutdown(): boolean {
    const log: string[] = ['CPU halt', 'Memory flush', 'HD park'];
    this.hooks.onResult?.(true, log.join('; '));
    return true;
  }
}
