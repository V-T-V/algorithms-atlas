// 访问者模式 · 实现
export interface VisitorHooks {
  onVisit?: (elementName: string, result: number) => void;
}

export interface ShapeVisitor {
  visitCircle(c: Circle): number;
  visitRectangle(r: Rectangle): number;
}

export interface Shape {
  name: string;
  accept(v: ShapeVisitor): number;
}

export class Circle implements Shape {
  constructor(public readonly radius: number) {}
  get name(): string {
    return `circle(r=${this.radius})`;
  }
  accept(v: ShapeVisitor): number {
    return v.visitCircle(this);
  }
}

export class Rectangle implements Shape {
  constructor(
    public readonly w: number,
    public readonly h: number,
  ) {}
  get name(): string {
    return `rect(${this.w}x${this.h})`;
  }
  accept(v: ShapeVisitor): number {
    return v.visitRectangle(this);
  }
}

export class AreaVisitor implements ShapeVisitor {
  constructor(private readonly hooks: VisitorHooks = {}) {}
  visitCircle(c: Circle): number {
    const a = Math.PI * c.radius * c.radius;
    this.hooks.onVisit?.(c.name, a);
    return a;
  }
  visitRectangle(r: Rectangle): number {
    const a = r.w * r.h;
    this.hooks.onVisit?.(r.name, a);
    return a;
  }
}

export class PerimeterVisitor implements ShapeVisitor {
  constructor(private readonly hooks: VisitorHooks = {}) {}
  visitCircle(c: Circle): number {
    const p = 2 * Math.PI * c.radius;
    this.hooks.onVisit?.(c.name, p);
    return p;
  }
  visitRectangle(r: Rectangle): number {
    const p = 2 * (r.w + r.h);
    this.hooks.onVisit?.(r.name, p);
    return p;
  }
}

export function sumVisit(shapes: readonly Shape[], v: ShapeVisitor): number {
  return shapes.reduce((acc, s) => acc + s.accept(v), 0);
}
