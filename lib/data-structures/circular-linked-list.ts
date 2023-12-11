import { LinkedList } from "./linked-list";

import type { Node } from "./linked-list";

export class CircularLinkedList<T> extends LinkedList<T> {
  get tail(): Node<T> | null {
    return this.tailNode;
  }

  // @override
  insert(value: T): this {
    let insertion: Node<T> | null;
    if (!this.headNode) {
      this.insertHead(value);
      insertion = this.head;
    }
    insertion ??= LinkedList.node(value);
    insertion.next = this.head;

    if (this.tailNode) {
      this.tailNode.next = insertion;
    }

    this.tailNode = insertion;

    return this;
  }

  // @override
  insertHead(value: T): this {
    if (this.head) {
      const node = { value, next: this.head };
      this.headNode = node;
      this.tailNode ??= node;
      this.tailNode.next = node;
    } else {
      this.headNode = { value, next: null };
      this.headNode.next = this.head;
      this.tailNode = this.head;
    }

    return this;
  }

  // @override
  removeTail(): this {
    this.traverse((node) => {
      if (node.next === this.tail) {
        this.tailNode = node;
        this.tailNode.next = this.head;
      }
    });

    return this;
  }
}
