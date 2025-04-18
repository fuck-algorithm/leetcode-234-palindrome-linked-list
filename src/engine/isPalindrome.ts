import { ListNode } from '../models/ListNode';

/**
 * 判断链表是否为回文链表
 * 
 * 解题思路：
 * 1. 使用快慢指针找到链表中点
 * 2. 反转后半部分链表
 * 3. 比较前半部分和反转后的后半部分
 * 4. 恢复链表（可选）
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
export function isPalindrome(head: ListNode | null): boolean {
    if (!head || !head.next) return true;

    // 1. 找到中点
    let slow = head;
    let fast = head;
    while (fast.next && fast.next.next) {
        slow = slow.next!;
        fast = fast.next.next;
    }

    // 2. 反转后半部分
    let secondHalf = reverseList(slow.next);
    
    // 3. 比较两半部分
    let firstHalf = head;
    let secondHalfPointer = secondHalf;
    let result = true;
    
    while (result && secondHalfPointer) {
        if (firstHalf.val !== secondHalfPointer.val) {
            result = false;
        }
        firstHalf = firstHalf.next!;
        secondHalfPointer = secondHalfPointer.next;
    }
    
    // 4. 恢复链表（可选）
    slow.next = reverseList(secondHalf);
    
    return result;
}

/**
 * 反转链表
 */
function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let curr = head;
    
    while (curr) {
        const next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
} 