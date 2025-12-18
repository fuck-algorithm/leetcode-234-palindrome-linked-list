import React from 'react';
import { StepType } from '../utils/palindromeChecker';
import './AlgorithmInfoPanel.css';

interface AlgorithmInfoPanelProps {
  stepType: StepType;
  currentStep: number;
  totalSteps: number;
  isPalindrome: boolean;
  algorithmType: 'twoPointers' | 'arrayCopy';
  nodeCount: number;
  positions?: {
    slowIndex?: number;
    fastIndex?: number;
    prevIndex?: number;
    currentIndex?: number;
    nextIndex?: number;
    leftIndex?: number;
    rightIndex?: number;
  };
  nodeValues?: number[];
}

// 算法阶段定义
const ALGORITHM_PHASES = {
  twoPointers: [
    { id: 'init', name: '初始化', icon: '🚀', steps: [StepType.INITIAL] },
    { id: 'findMiddle', name: '查找中点', icon: '🔍', steps: [StepType.FIND_MIDDLE_START, StepType.FIND_MIDDLE_STEP, StepType.FIND_MIDDLE_COMPLETE] },
    { id: 'reverse', name: '反转后半', icon: '🔄', steps: [StepType.REVERSE_START, StepType.REVERSE_STEP, StepType.REVERSE_COMPLETE] },
    { id: 'compare', name: '比较验证', icon: '⚖️', steps: [StepType.COMPARE_START, StepType.COMPARE_STEP, StepType.COMPARE_COMPLETE] },
  ],
  arrayCopy: [
    { id: 'init', name: '初始化', icon: '🚀', steps: [StepType.INITIAL] },
    { id: 'copy', name: '复制数组', icon: '📋', steps: [StepType.ARRAY_COPY_START, StepType.ARRAY_COPY_COMPLETE] },
    { id: 'compare', name: '双指针比较', icon: '⚖️', steps: [StepType.ARRAY_COMPARE_START, StepType.ARRAY_COMPARE_STEP, StepType.ARRAY_COMPARE_COMPLETE] },
  ],
};

const AlgorithmInfoPanel: React.FC<AlgorithmInfoPanelProps> = ({
  stepType,
  currentStep,
  totalSteps,
  isPalindrome,
  algorithmType,
  nodeCount,
  positions,
  nodeValues = [],
}) => {
  const phases = ALGORITHM_PHASES[algorithmType];
  
  // 获取当前阶段
  const getCurrentPhase = () => {
    for (const phase of phases) {
      if (phase.steps.includes(stepType)) {
        return phase;
      }
    }
    return phases[0];
  };
  
  const currentPhase = getCurrentPhase();
  
  // 计算时间复杂度说明
  const getComplexityInfo = () => {
    if (algorithmType === 'twoPointers') {
      return {
        time: 'O(n)',
        space: 'O(1)',
        description: '快慢指针法只需要常数额外空间',
      };
    }
    return {
      time: 'O(n)',
      space: 'O(n)',
      description: '需要额外数组存储所有节点值',
    };
  };
  
  const complexity = getComplexityInfo();
  
  // 获取当前操作的详细说明
  const getOperationDetail = () => {
    switch (stepType) {
      case StepType.INITIAL:
        return `链表共 ${nodeCount} 个节点`;
      case StepType.FIND_MIDDLE_START:
      case StepType.FIND_MIDDLE_STEP:
        if (positions?.slowIndex !== undefined && positions?.fastIndex !== undefined) {
          return `slow → 节点${positions.slowIndex + 1}, fast → 节点${positions.fastIndex + 1}`;
        }
        return '快指针速度是慢指针的2倍';
      case StepType.FIND_MIDDLE_COMPLETE:
        return `中点位置: 节点${(positions?.slowIndex ?? 0) + 1}`;
      case StepType.REVERSE_START:
      case StepType.REVERSE_STEP:
        if (positions?.prevIndex !== undefined && positions?.currentIndex !== undefined) {
          const prevStr = positions.prevIndex >= 0 ? `节点${positions.prevIndex + 1}` : 'null';
          const currStr = positions.currentIndex >= 0 ? `节点${positions.currentIndex + 1}` : 'null';
          return `prev → ${prevStr}, curr → ${currStr}`;
        }
        return '原地反转，不需要额外空间';
      case StepType.REVERSE_COMPLETE:
        return '后半部分链表已反转';
      case StepType.COMPARE_START:
      case StepType.COMPARE_STEP:
        if (positions?.leftIndex !== undefined && positions?.rightIndex !== undefined) {
          const leftVal = nodeValues[positions.leftIndex];
          const rightVal = nodeValues[positions.rightIndex];
          const match = leftVal === rightVal ? '✓' : '✗';
          return `比较: ${leftVal} vs ${rightVal} ${match}`;
        }
        return '从两端向中间比较';
      case StepType.COMPARE_COMPLETE:
        return isPalindrome ? '所有节点匹配成功' : '发现不匹配的节点';
      case StepType.ARRAY_COPY_START:
        return `正在复制节点值到数组...`;
      case StepType.ARRAY_COPY_COMPLETE:
        return `数组: [${nodeValues.join(', ')}]`;
      case StepType.ARRAY_COMPARE_START:
      case StepType.ARRAY_COMPARE_STEP:
        if (positions?.leftIndex !== undefined && positions?.rightIndex !== undefined) {
          return `front=${positions.leftIndex}, back=${positions.rightIndex}`;
        }
        return '双指针从两端向中间移动';
      case StepType.ARRAY_COMPARE_COMPLETE:
        return isPalindrome ? '是回文链表' : '不是回文链表';
      default:
        return '';
    }
  };
  
  // 计算进度百分比
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);
  
  return (
    <div className="algorithm-info-panel">
      {/* 算法类型和复杂度 */}
      <div className="info-section complexity-section">
        <div className="complexity-badges">
          <span className="badge time-badge" title="时间复杂度">
            ⏱️ {complexity.time}
          </span>
          <span className="badge space-badge" title="空间复杂度">
            💾 {complexity.space}
          </span>
        </div>
        <div className="complexity-note">{complexity.description}</div>
      </div>
      
      {/* 算法阶段进度 */}
      <div className="info-section phase-section">
        <div className="phase-title">算法阶段</div>
        <div className="phase-timeline">
          {phases.map((phase, index) => {
            const isActive = phase.id === currentPhase.id;
            const isPast = phases.indexOf(currentPhase) > index;
            return (
              <div 
                key={phase.id} 
                className={`phase-item ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
              >
                <div className="phase-icon">{phase.icon}</div>
                <div className="phase-name">{phase.name}</div>
                {index < phases.length - 1 && <div className="phase-connector" />}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 当前操作详情 */}
      <div className="info-section operation-section">
        <div className="operation-header">
          <span className="operation-icon">{currentPhase.icon}</span>
          <span className="operation-title">{currentPhase.name}</span>
        </div>
        <div className="operation-detail">{getOperationDetail()}</div>
      </div>
      
      {/* 指针状态 */}
      {algorithmType === 'twoPointers' && (
        <div className="info-section pointers-section">
          <div className="pointers-title">指针状态</div>
          <div className="pointers-grid">
            {(stepType.includes('MIDDLE') || stepType === StepType.INITIAL || stepType === StepType.FIND_MIDDLE_START || stepType === StepType.FIND_MIDDLE_STEP || stepType === StepType.FIND_MIDDLE_COMPLETE) && (
              <>
                <div className="pointer-item slow">
                  <span className="pointer-label">slow</span>
                  <span className="pointer-value">
                    {positions?.slowIndex !== undefined && positions.slowIndex >= 0 
                      ? `#${positions.slowIndex + 1} (${nodeValues[positions.slowIndex]})` 
                      : '-'}
                  </span>
                </div>
                <div className="pointer-item fast">
                  <span className="pointer-label">fast</span>
                  <span className="pointer-value">
                    {positions?.fastIndex !== undefined && positions.fastIndex >= 0 
                      ? `#${positions.fastIndex + 1} (${nodeValues[positions.fastIndex]})` 
                      : '-'}
                  </span>
                </div>
              </>
            )}
            {(stepType.includes('REVERSE') || stepType === StepType.REVERSE_START || stepType === StepType.REVERSE_STEP || stepType === StepType.REVERSE_COMPLETE) && (
              <>
                <div className="pointer-item prev">
                  <span className="pointer-label">prev</span>
                  <span className="pointer-value">
                    {positions?.prevIndex !== undefined && positions.prevIndex >= 0 
                      ? `#${positions.prevIndex + 1} (${nodeValues[positions.prevIndex]})` 
                      : 'null'}
                  </span>
                </div>
                <div className="pointer-item curr">
                  <span className="pointer-label">curr</span>
                  <span className="pointer-value">
                    {positions?.currentIndex !== undefined && positions.currentIndex >= 0 
                      ? `#${positions.currentIndex + 1} (${nodeValues[positions.currentIndex]})` 
                      : 'null'}
                  </span>
                </div>
              </>
            )}
            {(stepType.includes('COMPARE') || stepType === StepType.COMPARE_START || stepType === StepType.COMPARE_STEP || stepType === StepType.COMPARE_COMPLETE) && (
              <>
                <div className="pointer-item left">
                  <span className="pointer-label">p1</span>
                  <span className="pointer-value">
                    {positions?.leftIndex !== undefined && positions.leftIndex >= 0 
                      ? `#${positions.leftIndex + 1} (${nodeValues[positions.leftIndex]})` 
                      : '-'}
                  </span>
                </div>
                <div className="pointer-item right">
                  <span className="pointer-label">p2</span>
                  <span className="pointer-value">
                    {positions?.rightIndex !== undefined && positions.rightIndex >= 0 
                      ? `#${positions.rightIndex + 1} (${nodeValues[positions.rightIndex]})` 
                      : '-'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* 数组方法的指针状态 */}
      {algorithmType === 'arrayCopy' && stepType.includes('COMPARE') && (
        <div className="info-section pointers-section">
          <div className="pointers-title">双指针位置</div>
          <div className="pointers-grid">
            <div className="pointer-item front">
              <span className="pointer-label">front</span>
              <span className="pointer-value">
                {positions?.leftIndex !== undefined ? positions.leftIndex : '-'}
              </span>
            </div>
            <div className="pointer-item back">
              <span className="pointer-label">back</span>
              <span className="pointer-value">
                {positions?.rightIndex !== undefined ? positions.rightIndex : '-'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* 执行进度 */}
      <div className="info-section progress-section">
        <div className="progress-header">
          <span>执行进度</span>
          <span className="progress-text">{currentStep + 1}/{totalSteps}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="progress-percent">{progressPercent}%</div>
      </div>
      
      {/* 结果预览 */}
      <div className={`info-section result-section ${isPalindrome ? 'success' : 'failure'}`}>
        <div className="result-icon">{isPalindrome ? '✓' : '✗'}</div>
        <div className="result-text">
          {isPalindrome ? '是回文链表' : '不是回文链表'}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInfoPanel;
