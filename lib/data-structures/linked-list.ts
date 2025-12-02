/* eslint-disable no-param-reassign -- linked list operations can require reassign */

export interface Node<T> {
  next: Node<T> | null;
  value: T;
}

export class LinkedList<T> {
  protected headNode: Node<T> | null = null;

  protected tailNode: Node<T> | null = null;

  get head(): Node<T> | null {
    return this.headNode;
  }

  get tail(): Node<T> | null {
    return this.tailNode;
  }

  static fromArray<T>(nodes: T[]): LinkedList<T> {
    const list = new LinkedList<T>();
    nodes.forEach((value) => {
      list.insert(value);
    });

    return list;
  }

  static node<T>(value: T, next: Node<T> | null = null): Node<T> {
    return { value, next };
  }

  insert(value: T): this {
    let insertion: Node<T> | null;
    if (!this.headNode) {
      this.insertHead(value);
      insertion = this.head;
    }
    insertion ??= LinkedList.node(value);

    if (this.tailNode) {
      this.tailNode.next = insertion;
    }

    this.tailNode = insertion;

    return this;
  }

  insertAfter(afterNode: Node<T>, value: T): this {
    const insertion = LinkedList.node(value, afterNode.next);
    afterNode.next = insertion;

    return this;
  }

  insertHead(value: T): this {
    const insertion = LinkedList.node(value);
    if (this.headNode) {
      insertion.next = this.headNode;
    }

    this.headNode = insertion;

    return this;
  }

  removeTail(): this {
    this.traverse((current) => {
      if (current.next?.next === null) {
        this.tailNode = current;
        this.tailNode.next = null;
      }
    });

    return this;
  }

  /**
   * @override
   */
  toString(): string {
    let string = "";

    this.traverse(({ value }) => {
      string += value;
    });

    return string;
  }

  traverse(callback: (value: Node<T>) => unknown): this {
    let currentNode = this.head;
    while (currentNode !== null) {
      callback(currentNode);
      currentNode = currentNode.next;
    }

    return this;
  }
}

/* eslint-enable no-param-reassign */
