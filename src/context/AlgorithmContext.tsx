import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Subject } from 'rxjs';
import { ListNode, AlgorithmStep, AnimationState, PointerState, AlgorithmResult } from '../types';
import { findMiddleNode, reverseLinkedList, linkedListToNodeArray } from '../utils/linkedListUtils';

// 算法状态接口
interface AlgorithmState {
  list: ListNode | null;
  nodes: ListNode[];
  animation: AnimationState;
  pointers: PointerState;
  result: AlgorithmResult;
}

// 动作类型
type ActionType = 
  | { type: 'SET_LIST', payload: ListNode | null }
  | { type: 'SET_STEP', payload: AlgorithmStep }
  | { type: 'SET_PLAYING', payload: boolean }
  | { type: 'SET_SPEED', payload: number }
  | { type: 'UPDATE_POINTERS', payload: Partial<PointerState> }
  | { type: 'UPDATE_RESULT', payload: Partial<AlgorithmResult> }
  | { type: 'RESET' };

// 初始状态
const initialState: AlgorithmState = {
  list: null,
  nodes: [],
  animation: {
    step: AlgorithmStep.INITIALIZE,
    playing: false,
    speed: 1,
    completed: false
  },
  pointers: {
    slow: 0,
    fast: 0,
    left: 0,
    right: 0,
    middleNode: 0
  },
  result: {
    isPalindrome: false,
    comparisons: []
  }
};

// 创建Subject用于流式控制
export const animationSubject = new Subject<AlgorithmStep>();

// 状态管理reducer
const algorithmReducer = (state: AlgorithmState, action: ActionType): AlgorithmState => {
  switch (action.type) {
    case 'SET_LIST':
      return {
        ...state,
        list: action.payload,
        nodes: linkedListToNodeArray(action.payload)
      };
    case 'SET_STEP':
      return {
        ...state,
        animation: {
          ...state.animation,
          step: action.payload
        }
      };
    case 'SET_PLAYING':
      return {
        ...state,
        animation: {
          ...state.animation,
          playing: action.payload
        }
      };
    case 'SET_SPEED':
      return {
        ...state,
        animation: {
          ...state.animation,
          speed: action.payload
        }
      };
    case 'UPDATE_POINTERS':
      return {
        ...state,
        pointers: {
          ...state.pointers,
          ...action.payload
        }
      };
    case 'UPDATE_RESULT':
      return {
        ...state,
        result: {
          ...state.result,
          ...action.payload
        }
      };
    case 'RESET':
      return {
        ...initialState,
        list: state.list, // 保留当前链表
        nodes: state.nodes // 保留节点数据
      };
    default:
      return state;
  }
};

// 创建上下文
interface AlgorithmContextType {
  state: AlgorithmState;
  dispatch: React.Dispatch<ActionType>;
  startAnimation: () => void;
  pauseAnimation: () => void;
  resetAnimation: () => void;
  setSpeed: (speed: number) => void;
}

const AlgorithmContext = createContext<AlgorithmContextType | undefined>(undefined);

// 上下文提供者组件
export const AlgorithmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(algorithmReducer, initialState);

  // 动画控制函数
  const startAnimation = () => {
    dispatch({ type: 'SET_PLAYING', payload: true });
    animationSubject.next(state.animation.step);
  };

  const pauseAnimation = () => {
    dispatch({ type: 'SET_PLAYING', payload: false });
  };

  const resetAnimation = () => {
    dispatch({ type: 'RESET' });
  };

  const setSpeed = (speed: number) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
  };

  return (
    <AlgorithmContext.Provider
      value={{
        state,
        dispatch,
        startAnimation,
        pauseAnimation,
        resetAnimation,
        setSpeed
      }}
    >
      {children}
    </AlgorithmContext.Provider>
  );
};

// 自定义Hook用于访问上下文
export const useAlgorithm = () => {
  const context = useContext(AlgorithmContext);
  if (context === undefined) {
    throw new Error('useAlgorithm must be used within an AlgorithmProvider');
  }
  return context;
}; 