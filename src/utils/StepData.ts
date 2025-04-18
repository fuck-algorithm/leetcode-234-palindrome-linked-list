import { NodeData, NodeStatus, StepType } from './palindromeChecker';

export interface PointerPositions {
  slowIndex?: number;
  fastIndex?: number;
  prevIndex?: number;
  currentIndex?: number;
  nextIndex?: number;
  leftIndex?: number;
  rightIndex?: number;
}

export interface StepData<T> {
  type: StepType;
  nodes: NodeData<T>[];
  description: string;
  comparedNodes?: { left: number; right: number }[];
  isEvenLength?: boolean;
  positions?: PointerPositions;
} 