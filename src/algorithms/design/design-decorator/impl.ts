// 装饰器模式 · 实现
export interface DecoratorHooks {
  onCompute?: (layer: string, partialCost: number, partialDesc: string) => void;
  onResult?: (totalCost: number, fullDesc: string) => void;
}

export interface Coffee {
  cost(): number;
  desc(): string;
}

export class SimpleCoffee implements Coffee {
  cost(): number {
    return 10;
  }
  desc(): string {
    return '咖啡';
  }
}

export abstract class CoffeeDecorator implements Coffee {
  constructor(
    protected readonly inner: Coffee,
    protected readonly hooks: DecoratorHooks = {},
  ) {}
  abstract cost(): number;
  abstract desc(): string;
}

export class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    const c = this.inner.cost() + 3;
    this.hooks.onCompute?.('milk', c, this.inner.desc());
    return c;
  }
  desc(): string {
    return this.inner.desc() + ' + 牛奶';
  }
}

export class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    const c = this.inner.cost() + 1;
    this.hooks.onCompute?.('sugar', c, this.inner.desc());
    return c;
  }
  desc(): string {
    return this.inner.desc() + ' + 糖';
  }
}

export class CreamDecorator extends CoffeeDecorator {
  cost(): number {
    const c = this.inner.cost() + 5;
    this.hooks.onCompute?.('cream', c, this.inner.desc());
    return c;
  }
  desc(): string {
    return this.inner.desc() + ' + 奶油';
  }
}
