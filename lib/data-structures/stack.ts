import { LinkedList } from "./linked-list";

export class Stack<T> {
  private data = new LinkedList<T>();

  peek(): T | null {
    const tailValue = this.data.tail?.value;

    return tailValue ?? null;
  }

  pop(): T | null {
    const tailValue = this.data.tail?.value;
    this.data.removeTail();

    return tailValue ?? null;
  }

  push(value: T): this {
    this.data.insert(value);

    return this;
  }

  /**
   * @override
   */
  toString(): string {
    return this.data.toString();
  }
}
