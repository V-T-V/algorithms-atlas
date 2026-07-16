// 命令模式 · 实现
export interface CommandHooks {
  onExecute?: (cmdName: string, result: string) => void;
  onUndo?: (cmdName: string, result: string) => void;
}

export interface Command {
  name: string;
  execute(): string;
  undo(): string;
}

export class Light {
  constructor(public on = false) {}
  switchOn(): string {
    this.on = true;
    return 'on';
  }
  switchOff(): string {
    this.on = false;
    return 'off';
  }
}

export class LightOnCommand implements Command {
  constructor(
    public readonly name: string,
    private readonly light: Light,
  ) {}
  execute(): string {
    return this.light.switchOn();
  }
  undo(): string {
    return this.light.switchOff();
  }
}

export class LightOffCommand implements Command {
  constructor(
    public readonly name: string,
    private readonly light: Light,
  ) {}
  execute(): string {
    return this.light.switchOff();
  }
  undo(): string {
    return this.light.switchOn();
  }
}

export class MacroCommand implements Command {
  constructor(
    public readonly name: string,
    private readonly cmds: Command[],
  ) {}
  execute(): string {
    return this.cmds.map((c) => c.execute()).join(',');
  }
  undo(): string {
    return [...this.cmds]
      .reverse()
      .map((c) => c.undo())
      .join(',');
  }
}

export class RemoteControl {
  private history: Command[] = [];
  private readonly hooks: CommandHooks;
  constructor(hooks: CommandHooks = {}) {
    this.hooks = hooks;
  }

  execute(cmd: Command): string {
    const r = cmd.execute();
    this.history.push(cmd);
    this.hooks.onExecute?.(cmd.name, r);
    return r;
  }

  undo(): string | null {
    const cmd = this.history.pop();
    if (!cmd) return null;
    const r = cmd.undo();
    this.hooks.onUndo?.(cmd.name, r);
    return r;
  }

  getHistoryDepth(): number {
    return this.history.length;
  }
}
