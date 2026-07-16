// 抽象工厂模式 · 实现
export interface AbstractFactoryHooks {
  onCreate?: (factory: string, product: string, output: string) => void;
  onResult?: (family: string, products: string) => void;
}

export interface Button {
  render(): string;
}
export interface Input {
  render(): string;
}

export interface UIFactory {
  readonly family: string;
  createButton(): Button;
  createInput(): Input;
}

export class DarkButton implements Button {
  render(): string {
    return '[Dark Button]';
  }
}
export class DarkInput implements Input {
  render(): string {
    return '<Dark Input />';
  }
}
export class DarkFactory implements UIFactory {
  readonly family = 'dark';
  constructor(private readonly hooks: AbstractFactoryHooks = {}) {}
  createButton(): Button {
    const b = new DarkButton();
    this.hooks.onCreate?.(this.family, 'button', b.render());
    return b;
  }
  createInput(): Input {
    const i = new DarkInput();
    this.hooks.onCreate?.(this.family, 'input', i.render());
    return i;
  }
}

export class LightButton implements Button {
  render(): string {
    return '[Light Button]';
  }
}
export class LightInput implements Input {
  render(): string {
    return '<Light Input />';
  }
}
export class LightFactory implements UIFactory {
  readonly family = 'light';
  constructor(private readonly hooks: AbstractFactoryHooks = {}) {}
  createButton(): Button {
    const b = new LightButton();
    this.hooks.onCreate?.(this.family, 'button', b.render());
    return b;
  }
  createInput(): Input {
    const i = new LightInput();
    this.hooks.onCreate?.(this.family, 'input', i.render());
    return i;
  }
}

export function renderUI(factory: UIFactory, hooks: AbstractFactoryHooks = {}): string {
  const b = factory.createButton();
  const i = factory.createInput();
  const out = `${b.render()} ${i.render()}`;
  hooks.onResult?.(factory.family, out);
  return out;
}
