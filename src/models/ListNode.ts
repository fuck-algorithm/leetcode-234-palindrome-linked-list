export class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

/**
 * 从数组创建链表
 */
export function createLinkedList(arr: number[]): ListNode | null {
    if (!arr.length) return null;
    const dummy = new ListNode(0);
    let current = dummy;
    for (const val of arr) {
        current.next = new ListNode(val);
        current = current.next;
    }
    return dummy.next;
}

/**
 * 将链表转换为数组
 */
export function linkedListToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    let current = head;
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    return result;
} 