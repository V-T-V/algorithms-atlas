export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {}
  add(other: Money): Money {
    if (other.currency !== this.currency) throw new Error('currency mismatch');
    return new Money(this.amount + other.amount, this.currency);
  }
  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
