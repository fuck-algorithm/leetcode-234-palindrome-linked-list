export class ListNode<T> {
  val: T;
  next: ListNode<T> | null;

  constructor(val: T, next: ListNode<T> | null = null) {
    this.val = val;
    this.next = next;
  }

  // 返回与C++中ListNode结构相符的字符串表示
  toString(): string {
    return `ListNode { val: ${this.val}, next: ${this.next ? 'ListNode' : 'nullptr'} }`;
  }
}

export class LinkedList<T> {
  head: ListNode<T> | null;
  
  constructor(elements: T[] = []) {
    this.head = null;
    
    if (elements.length > 0) {
      this.fromArray(elements);
    }
  }

  fromArray(elements: T[]): LinkedList<T> {
    if (elements.length === 0) return this;
    
    this.head = new ListNode<T>(elements[0]);
    let current = this.head;
    
    for (let i = 1; i < elements.length; i++) {
      current.next = new ListNode<T>(elements[i]);
      current = current.next;
    }
    
    return this;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    
    while (current) {
      result.push(current.val);
      current = current.next;
    }
    
    return result;
  }

  isEmpty(): boolean {
    return this.head === null;
  }

  length(): number {
    let count = 0;
    let current = this.head;
    
    while (current) {
      count++;
      current = current.next;
    }
    
    return count;
  }
  
  append(val: T): void {
    const newNode = new ListNode<T>(val);
    
    if (!this.head) {
      this.head = newNode;
      return;
    }
    
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    
    current.next = newNode;
  }

  getNodeAt(index: number): ListNode<T> | null {
    if (index < 0 || !this.head) return null;
    
    let current: ListNode<T> | null = this.head;
    let currentIndex = 0;
    
    while (current && currentIndex < index) {
      current = current.next;
      currentIndex++;
    }
    
    return current;
  }

  // 返回与C++中链表结构相符的字符串表示
  toString(): string {
    if (!this.head) return "空链表";
    
    let result = "";
    let current: ListNode<T> | null = this.head;
    
    while (current) {
      result += `ListNode(${current.val})`;
      if (current.next) {
        result += " -> ";
      } else {
        result += " -> nullptr";
      }
      current = current.next;
    }
    
    return result;
  }
} 