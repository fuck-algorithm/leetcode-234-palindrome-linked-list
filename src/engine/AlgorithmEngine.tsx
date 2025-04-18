import React, { useEffect } from 'react';
import { animationSubject, useAlgorithm } from '../context/AlgorithmContext';
import { AlgorithmStep } from '../types';
import { findMiddleNode, reverseLinkedList } from '../utils/linkedListUtils';

// 中间步骤间隔时间（毫秒）
const DEFAULT_STEP_DELAY = 1000;

// 算法引擎组件
const AlgorithmEngine: React.FC = () => {
  const { state, dispatch } = useAlgorithm();
  const { list, animation, pointers } = state;
  const { step, playing, speed, completed } = animation;

  // 根据步骤执行对应的算法动作
  useEffect(() => {
    if (!playing || !list || completed) return;

    // 计算实际延迟（考虑速度因子）
    const actualDelay = DEFAULT_STEP_DELAY / speed;

    // 创建定时器执行当前步骤
    const timer = setTimeout(() => {
      switch (step) {
        case AlgorithmStep.INITIALIZE:
          // 初始化完成后，进入查找中间节点步骤
          dispatch({ type: 'SET_STEP', payload: AlgorithmStep.FIND_MIDDLE });
          break;

        case AlgorithmStep.FIND_MIDDLE:
          findMiddleNodeStep();
          break;

        case AlgorithmStep.REVERSE_SECOND_HALF:
          reverseSecondHalfStep();
          break;

        case AlgorithmStep.COMPARE:
          compareHalvesStep();
          break;

        case AlgorithmStep.RESTORE:
          restoreListStep();
          break;

        case AlgorithmStep.RESULT:
          // 结果显示步骤，标记为已完成
          dispatch({ 
            type: 'SET_PLAYING', 
            payload: false
          });
          break;

        default:
          break;
      }
    }, actualDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [list, step, playing, speed, completed, pointers]);

  // 订阅动画步骤变化
  useEffect(() => {
    const subscription = animationSubject.subscribe(newStep => {
      if (newStep === step && !playing) {
        dispatch({ type: 'SET_PLAYING', payload: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [step, playing, dispatch]);

  // 查找中间节点步骤实现
  const findMiddleNodeStep = () => {
    const { slow, fast } = pointers;
    
    if (!list) return;
    
    let currentSlow = list;
    let currentFast = list;
    let slowIndex = slow;
    let fastIndex = fast;
    
    // 快指针已经到达尾部
    if (fastIndex >= state.nodes.length - 1 || !currentFast.next || !currentFast.next.next) {
      // 慢指针现在指向中间节点，保存中间节点索引
      dispatch({ 
        type: 'UPDATE_POINTERS', 
        payload: { middleNode: slowIndex } 
      });
      // 进入下一步
      dispatch({ type: 'SET_STEP', payload: AlgorithmStep.REVERSE_SECOND_HALF });
      return;
    }
    
    // 更新慢指针和快指针
    dispatch({
      type: 'UPDATE_POINTERS',
      payload: {
        slow: slowIndex + 1,
        fast: fastIndex + 2
      }
    });
  };

  // 反转后半部分链表步骤实现
  const reverseSecondHalfStep = () => {
    const { middleNode } = pointers;
    
    if (!list) return;
    
    // 模拟反转后半段链表（不实际修改原链表结构）
    // 在真实实现中，这里会通过辅助指针实际修改链表
    // 这里只是为了动画效果，设置为下一步
    
    // 计算比较的起始位置
    const leftIndex = 0;
    const rightIndex = state.nodes.length - 1;
    
    // 更新指针位置，为比较做准备
    dispatch({
      type: 'UPDATE_POINTERS',
      payload: {
        left: leftIndex,
        right: rightIndex
      }
    });
    
    // 进入比较步骤
    dispatch({ type: 'SET_STEP', payload: AlgorithmStep.COMPARE });
  };

  // 比较两半链表步骤实现
  const compareHalvesStep = () => {
    const { left, right } = pointers;
    
    if (!list || left >= right) {
      // 比较完成，进入恢复步骤
      dispatch({ type: 'SET_STEP', payload: AlgorithmStep.RESTORE });
      return;
    }
    
    // 获取当前比较的节点值
    const leftValue = state.nodes[left].val;
    const rightValue = state.nodes[right].val;
    
    // 比较节点值
    const match = leftValue === rightValue;
    
    // 更新比较结果
    const updatedComparisons = [...state.result.comparisons];
    updatedComparisons[left] = match;
    
    dispatch({
      type: 'UPDATE_RESULT',
      payload: {
        comparisons: updatedComparisons,
        // 如果有任何不匹配，则不是回文
        isPalindrome: match && state.result.isPalindrome
      }
    });
    
    // 移动指针继续比较
    dispatch({
      type: 'UPDATE_POINTERS',
      payload: {
        left: left + 1,
        right: right - 1
      }
    });
  };

  // 恢复原始链表步骤实现
  const restoreListStep = () => {
    // 在这一步，我们假装恢复了链表（实际上动画中没有修改原链表）
    // 在实际算法中，这一步会将后半部分再次反转，恢复原始链表
    
    // 进入结果展示步骤
    dispatch({ type: 'SET_STEP', payload: AlgorithmStep.RESULT });
  };

  // 这是一个"无界面"组件，只负责执行算法逻辑
  return null;
};

export default AlgorithmEngine; 