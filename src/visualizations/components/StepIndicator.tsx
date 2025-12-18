import React from 'react';
import { StepType } from '../../utils/palindromeChecker';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  currentStepType: StepType;
  width: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  currentStepType,
  width
}) => {
  // 简化的算法阶段 - 只显示当前相关的阶段
  const getPhaseInfo = () => {
    if (currentStepType === StepType.INITIAL) {
      return { name: '初始化', color: '#00d4aa', icon: '🚀' };
    }
    if (currentStepType.includes('ARRAY_COPY')) {
      return { name: '复制数组', color: '#10b981', icon: '📋' };
    }
    if (currentStepType.includes('ARRAY_COMPARE')) {
      return { name: '双指针比较', color: '#ef4444', icon: '⚖️' };
    }
    if (currentStepType.includes('MIDDLE')) {
      return { name: '查找中点', color: '#3b82f6', icon: '🔍' };
    }
    if (currentStepType.includes('REVERSE')) {
      return { name: '反转后半', color: '#f59e0b', icon: '🔄' };
    }
    if (currentStepType.includes('COMPARE')) {
      return { name: '比较验证', color: '#06b6d4', icon: '✓' };
    }
    return { name: '执行中', color: '#00d4aa', icon: '▶' };
  };
  
  const phase = getPhaseInfo();
  const progressPercent = (currentStep / (totalSteps - 1)) * 100;
  const barWidth = Math.min(width - 40, 400);
  
  return (
    <g className="step-indicator" transform={`translate(20, 0)`}>
      {/* 简化的进度条 */}
      <rect
        x={0}
        y={8}
        width={barWidth}
        height={6}
        rx={3}
        fill="#2d3748"
      />
      <rect
        x={0}
        y={8}
        width={barWidth * (progressPercent / 100)}
        height={6}
        rx={3}
        fill={phase.color}
      />
      
      {/* 当前阶段标签 */}
      <text
        x={barWidth + 10}
        y={14}
        fontSize="12px"
        fill={phase.color}
        fontWeight="bold"
      >
        {phase.icon} {phase.name}
      </text>
    </g>
  );
};

export default StepIndicator; 