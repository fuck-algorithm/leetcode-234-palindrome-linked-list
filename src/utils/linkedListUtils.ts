import { ListNode } from '../types';

// 从数组创建链表
export const createLinkedList = (values: number[]): ListNode | null => {
  if (values.length === 0) return null;
  
  const head: ListNode = {
    val: values[0],
    next: null,
    id: `node-0`
  };
  
  let current = head;
  for (let i = 1; i < values.length; i++) {
    current.next = {
      val: values[i],
      next: null,
      id: `node-${i}`
    };
    current = current.next;
  }
  
  return head;
};

// 计算链表长度
export const getLinkedListLength = (head: ListNode | null): number => {
  let length = 0;
  let current = head;
  
  while (current) {
    length++;
    current = current.next;
  }
  
  return length;
};

// 链表转数组
export const linkedListToArray = (head: ListNode | null): number[] => {
  const result: number[] = [];
  let current = head;
  
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  
  return result;
};

// 链表转节点数组（带id和位置信息）
export const linkedListToNodeArray = (head: ListNode | null): ListNode[] => {
  const result: ListNode[] = [];
  let current = head;
  let index = 0;
  
  while (current) {
    // 复制节点信息，避免修改原链表
    result.push({
      val: current.val,
      next: null, // 这里不复制next引用，避免循环引用
      id: current.id || `node-${index}`,
      x: current.x,
      y: current.y
    });
    current = current.next;
    index++;
  }
  
  return result;
};

// 查找链表中间节点（使用快慢指针）
export const findMiddleNode = (head: ListNode | null): ListNode | null => {
  if (!head || !head.next) return head;
  
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  
  while (fast?.next && fast.next.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  
  return slow;
};

// 反转链表
export const reverseLinkedList = (head: ListNode | null): ListNode | null => {
  let prev: ListNode | null = null;
  let current: ListNode | null = head;
  
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
};

// 检查链表是否为回文
export const isPalindrome = (head: ListNode | null): boolean => {
  if (!head || !head.next) return true;
  
  // 找到中间节点
  const middle = findMiddleNode(head);
  if (!middle) return true;
  
  // 反转后半部分
  let secondHalfHead = reverseLinkedList(middle.next);
  middle.next = null; // 切断前后两部分
  
  // 比较两部分
  let p1: ListNode | null = head;
  let p2: ListNode | null = secondHalfHead;
  let result = true;
  
  while (p1 && p2) {
    if (p1.val !== p2.val) {
      result = false;
      break;
    }
    p1 = p1.next;
    p2 = p2.next;
  }
  
  // 恢复链表结构（实际应用中可选）
  middle.next = reverseLinkedList(secondHalfHead);
  
  return result;
}; 