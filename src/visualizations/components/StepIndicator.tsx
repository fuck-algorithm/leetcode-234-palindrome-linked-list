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
  // 算法阶段分组
  const phases = [
    { 
      name: '初始化', 
      types: [StepType.INITIAL],
      color: '#3498db' 
    },
    { 
      name: '复制到数组', 
      types: [StepType.ARRAY_COPY_START, StepType.ARRAY_COPY_COMPLETE],
      color: '#2ecc71' 
    },
    { 
      name: '比较过程', 
      types: [StepType.ARRAY_COMPARE_START, StepType.ARRAY_COMPARE_STEP, StepType.ARRAY_COMPARE_COMPLETE],
      color: '#e74c3c' 
    },
    { 
      name: '查找中间节点', 
      types: [StepType.FIND_MIDDLE_START, StepType.FIND_MIDDLE_STEP, StepType.FIND_MIDDLE_COMPLETE],
      color: '#9b59b6' 
    },
    { 
      name: '反转链表', 
      types: [StepType.REVERSE_START, StepType.REVERSE_STEP, StepType.REVERSE_COMPLETE],
      color: '#f39c12' 
    },
    { 
      name: '比较两部分', 
      types: [StepType.COMPARE_START, StepType.COMPARE_STEP, StepType.COMPARE_COMPLETE],
      color: '#16a085' 
    }
  ];
  
  // 计算当前阶段
  const currentPhase = phases.findIndex(phase => 
    phase.types.includes(currentStepType)
  );
  
  // 计算进度条宽度
  const progressPercent = (currentStep / (totalSteps - 1)) * 100;
  const progressWidth = (width - 40) * (progressPercent / 100);
  
  // 计算各阶段的分界点位置
  const stepSegments = phases.map((phase, index) => {
    // 为简化计算，我们假设每个阶段占总步骤的相等部分
    const position = (index / phases.length) * (width - 40);
    return {
      ...phase,
      position
    };
  });
  
  return (
    <g className="step-indicator" transform={`translate(20, 0)`}>
      {/* 标题 */}
      <text
        x={width / 2 - 20}
        y={15}
        textAnchor="middle"
        fontSize="14px"
        fontWeight="bold"
        fill="#333"
      >
        算法执行阶段
      </text>
      
      {/* 主进度条背景 */}
      <rect
        x={0}
        y={30}
        width={width - 40}
        height={10}
        rx={5}
        ry={5}
        fill="#ecf0f1"
        stroke="#bdc3c7"
        strokeWidth={1}
      />
      
      {/* 已完成进度 */}
      <rect
        x={0}
        y={30}
        width={progressWidth}
        height={10}
        rx={5}
        ry={5}
        fill={phases[currentPhase]?.color || '#3498db'}
      />
      
      {/* 阶段分隔点 */}
      {stepSegments.map((segment, index) => (
        index > 0 && (
          <circle
            key={`segment-${index}`}
            cx={segment.position}
            cy={35}
            r={3}
            fill="#fff"
            stroke="#7f8c8d"
            strokeWidth={1}
          />
        )
      ))}
      
      {/* 阶段标签 */}
      {stepSegments.map((segment, index) => (
        <g key={`label-${index}`}>
          <line
            x1={segment.position}
            y1={40}
            x2={segment.position}
            y2={50}
            stroke="#7f8c8d"
            strokeWidth={1}
            strokeDasharray={index > 0 ? "3,2" : "none"}
            display={index === 0 ? "none" : "block"}
          />
          <text
            x={index === 0 ? 0 : segment.position}
            y={65}
            textAnchor={index === 0 ? "start" : "middle"}
            fontSize="12px"
            fill={currentPhase === index ? segment.color : "#7f8c8d"}
            fontWeight={currentPhase === index ? "bold" : "normal"}
          >
            {segment.name}
          </text>
        </g>
      ))}
      
      {/* 当前步骤数 */}
      <text
        x={width - 40}
        y={35}
        textAnchor="end"
        fontSize="12px"
        fill="#34495e"
      >
        步骤: {currentStep + 1}/{totalSteps}
      </text>
    </g>
  );
};

export default StepIndicator; 