// 适配器模式 · 实现
export interface AdapterHooks {
  onAdapt?: (input: string, level: string, output: string) => void;
}

// Target：新版接口
export interface NewLogger {
  log(level: 'info' | 'warn' | 'error', message: string): string;
}

// Adaptee：旧版类，只接收单条字符串，自带级别前缀
export class LegacyLogger {
  writeMsg(severity: number, msg: string): string {
    const tag = severity === 0 ? 'INFO' : severity === 1 ? 'WARN' : 'ERROR';
    return `[${tag}] ${msg}`;
  }
}

// Adapter
export class LoggerAdapter implements NewLogger {
  constructor(
    private readonly legacy: LegacyLogger,
    private readonly hooks: AdapterHooks = {},
  ) {}
  log(level: 'info' | 'warn' | 'error', message: string): string {
    const severity = level === 'info' ? 0 : level === 'warn' ? 1 : 2;
    const out = this.legacy.writeMsg(severity, message);
    this.hooks.onAdapt?.(`${level}:${message}`, level, out);
    return out;
  }
}

// 也提供一个反向适配器：把 NewLogger 适配回 LegacyLogger
export class NewToLegacyAdapter {
  constructor(private readonly modern: NewLogger) {}
  writeMsg(severity: number, msg: string): string {
    const level: 'info' | 'warn' | 'error' =
      severity === 0 ? 'info' : severity === 1 ? 'warn' : 'error';
    return this.modern.log(level, msg);
  }
}
