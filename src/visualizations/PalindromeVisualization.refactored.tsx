import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { NodeData, NodeStatus, StepType } from '../utils/palindromeChecker';
import PointerAnimation from './components/PointerAnimation';
import PointerMovementPath from './components/PointerMovementPath';
import IndicatorComponent from './components/IndicatorComponent';
import ComparisonLine from './components/ComparisonLine';
import StepIndicator from './components/StepIndicator';

// 导入拆分出的常量和组件
import { 
  NODE_RADIUS, 
  NODE_SPACING, 
  ROW_SPACING,
  NODES_PER_ROW,
  START_X,
  START_Y,
  STATUS_COLORS,
  STATUS_BACKGROUNDS,
  STATUS_LABELS,
  POINTER_WIDTH,
  POINTER_HEIGHT
} from './constants/VisualizationConstants';

import NodeComponent from './components/nodes/NodeComponent';
import LinkComponent from './components/nodes/LinkComponent';
// 其他拆分组件的导入...

interface PalindromeVisualizationProps<T> {
  steps: {
    type: StepType;
    nodes: NodeData<T>[];
    description: string;
    comparedNodes?: { left: number; right: number }[];
    isEvenLength?: boolean;
    positions?: {
      [key: string]: number;
    };
  }[];
  currentStep: number;
  width: number;
  height: number;
}

// 定义连接线的类型
interface Connection {
  source: number;
  target: number;
  isReverse: boolean;
  isNull: boolean;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

// 定义节点位置的类型
interface NodePosition {
  x: number;
  y: number;
}

/**
 * 回文链表可视化组件 - 重构后的主组件
 * 负责协调和管理各个子组件，但不直接实现渲染逻辑
 */
const PalindromeVisualization = <T extends unknown>({
  steps,
  currentStep,
  width = 800,
  height = 400,
}: PalindromeVisualizationProps<T>): React.ReactElement => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // 在组件挂载后，确保数据完全初始化
  useEffect(() => {
    // 初始化逻辑...
    if (!isInitialized) {
      setIsInitialized(true);
      setIsVisible(true);
    }
  }, [isInitialized]);
  
  // 获取当前步骤数据
  const currentStepData = useMemo(() => steps[currentStep], [steps, currentStep]);
  
  // 计算节点位置
  const nodePositions = useMemo<Record<number, NodePosition>>(() => {
    if (!currentStepData) return {};
    
    const positions: Record<number, NodePosition> = {};
    
    currentStepData.nodes.forEach((_, index) => {
      const row = Math.floor(index / NODES_PER_ROW);
      const col = index % NODES_PER_ROW;
      
      positions[index] = {
        x: START_X + col * NODE_SPACING + POINTER_WIDTH/2,
        y: START_Y + row * ROW_SPACING
      };
    });
    
    return positions;
  }, [currentStepData]);
  
  // 计算连接线
  const connections = useMemo<Connection[]>(() => {
    if (!currentStepData) return [];
    
    const connections: Connection[] = [];
    
    currentStepData.nodes.forEach((node, i) => {
      const sourcePos = nodePositions[i];
      if (!sourcePos) return;
      
      const sourceX = sourcePos.x + NODE_RADIUS + POINTER_WIDTH;
      
      if (node.next === null) {
        // 空指针
        connections.push({
          source: i,
          target: -1,
          isReverse: false,
          isNull: true,
          sourceX: sourceX,
          sourceY: sourcePos.y,
          targetX: sourceX + 30,
          targetY: sourcePos.y
        });
      } else {
        // 获取目标节点索引
        const targetIndex = typeof node.next === 'number' ? node.next : -1;
        
        if (targetIndex >= 0 && nodePositions[targetIndex]) {
          const targetPos = nodePositions[targetIndex];
          
          const targetX = targetPos.x - NODE_RADIUS;
          
          connections.push({
            source: i,
            target: targetIndex,
            isReverse: targetIndex < i,
            isNull: false,
            sourceX: sourceX,
            sourceY: sourcePos.y,
            targetX: targetX,
            targetY: targetPos.y
          });
        }
      }
    });
    
    return connections;
  }, [currentStepData, nodePositions]);
  
  // 计算焦点和指针位置
  const focusData = useMemo(() => {
    if (!currentStepData) return { 
      focusIndex: -1, 
      focusType: "",
      slowIndex: undefined,
      fastIndex: undefined,
      leftIndex: undefined,
      rightIndex: undefined,
      prevIndex: undefined,
      currentIndex: undefined,
      nextIndex: undefined
    };
    
    // 从当前步骤获取所有可能的指针位置
    const positions = currentStepData.positions || {};
    const type = currentStepData.type;
    
    // 根据步骤类型确定焦点和焦点类型
    let focusIndex = -1;
    let focusType = "";
    
    if (type.includes('MIDDLE')) {
      focusType = "MIDDLE";
      // 处理查找中间节点的焦点
      if (positions.slow !== undefined) {
        focusIndex = positions.slow;
      }
    } else if (type.includes('REVERSE')) {
      focusType = "REVERSE";
      // 处理反转链表的焦点
      if (positions.current !== undefined) {
        focusIndex = positions.current;
      }
    } else if (type.includes('COMPARE')) {
      focusType = "COMPARE";
      // 处理比较节点的焦点
      if (positions.left !== undefined && positions.right !== undefined) {
        // 选择左指针作为主焦点
        focusIndex = positions.left;
      }
    }
    
    return { 
      focusIndex,
      focusType,
      slowIndex: positions.slow,
      fastIndex: positions.fast,
      leftIndex: positions.left,
      rightIndex: positions.right,
      prevIndex: positions.prev,
      currentIndex: positions.current,
      nextIndex: positions.next
    };
  }, [currentStepData]);
  
  // 前一步的指针位置记录
  const [previousStepData, setPreviousStepData] = useState<{
    slowIndex?: number;
    fastIndex?: number;
  }>({});
  
  // 当步骤更新时，更新前一步的指针位置
  useEffect(() => {
    if (currentStepData && currentStepData.positions) {
      setPreviousStepData({
        slowIndex: currentStepData.positions.slow,
        fastIndex: currentStepData.positions.fast
      });
    }
  }, [currentStep, currentStepData]);
  
  // 未初始化或数据未加载
  if (!currentStepData) {
    return (
      <div className="palindrome-visualization" style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width={width}
          height={height + 100}
          style={{ 
            border: '1px solid #ddd', 
            borderRadius: '4px', 
            backgroundColor: '#fff'
          }}
        >
          <text x={width/2} y={height/2} textAnchor="middle">加载中...</text>
        </svg>
      </div>
    );
  }
  
  // 计算边距和尺寸
  const margin = { top: 40, right: 30, bottom: 50, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // 渲染比较线（在数组比较阶段使用）
  const renderComparisonLines = () => {
    if (!currentStepData.comparedNodes || currentStepData.comparedNodes.length === 0) {
      return null;
    }
    
    return currentStepData.comparedNodes.map((pair, index) => {
      const leftPos = nodePositions[pair.left];
      const rightPos = nodePositions[pair.right];
      
      if (!leftPos || !rightPos) return null;
      
      // 检查节点状态判断是否匹配
      const leftNode = currentStepData.nodes[pair.left];
      const rightNode = currentStepData.nodes[pair.right];
      
      const isMatch = !!(leftNode.status?.includes(NodeStatus.COMPARED) && 
                      rightNode.status?.includes(NodeStatus.COMPARED) &&
                      !leftNode.status?.includes(NodeStatus.MISMATCH) &&
                      !rightNode.status?.includes(NodeStatus.MISMATCH));
      
      return (
        <ComparisonLine
          key={`compare-${index}`}
          sourceX={leftPos.x}
          sourceY={leftPos.y}
          targetX={rightPos.x}
          targetY={rightPos.y}
          isMatch={isMatch}
          animate={currentStepData.type.includes('COMPARE')}
        />
      );
    });
  };
  
  // 渲染指针指示器
  const renderPointerIndicators = () => {
    const indicators = [];
    
    // 慢指针指示器
    if (focusData.slowIndex !== undefined && nodePositions[focusData.slowIndex]) {
      const position = nodePositions[focusData.slowIndex];
      indicators.push(
        <IndicatorComponent
          key="slow-pointer"
          x={position.x}
          y={position.y - 40}
          label="慢指针"
          color={STATUS_COLORS[NodeStatus.SLOW_POINTER]}
          isActive={focusData.focusType === "MIDDLE"}
        />
      );
    }
    
    // 快指针指示器
    if (focusData.fastIndex !== undefined && nodePositions[focusData.fastIndex]) {
      const position = nodePositions[focusData.fastIndex];
      indicators.push(
        <IndicatorComponent
          key="fast-pointer"
          x={position.x}
          y={position.y + 40}
          label="快指针"
          color={STATUS_COLORS[NodeStatus.FAST_POINTER]}
          isActive={focusData.focusType === "MIDDLE"}
        />
      );
    }
    
    // 其他指针指示器（前一个、当前和下一个）
    if (focusData.prevIndex !== undefined && nodePositions[focusData.prevIndex]) {
      const position = nodePositions[focusData.prevIndex];
      indicators.push(
        <IndicatorComponent
          key="prev-pointer"
          x={position.x}
          y={position.y - 40}
          label="prev"
          color={STATUS_COLORS[NodeStatus.PREV_POINTER]}
          isActive={focusData.focusType === "REVERSE"}
        />
      );
    }
    
    if (focusData.currentIndex !== undefined && nodePositions[focusData.currentIndex]) {
      const position = nodePositions[focusData.currentIndex];
      indicators.push(
        <IndicatorComponent
          key="current-pointer"
          x={position.x}
          y={position.y - 40}
          label="current"
          color={STATUS_COLORS[NodeStatus.CURRENT_POINTER]}
          isActive={focusData.focusType === "REVERSE"}
          pulse={true}
        />
      );
    }
    
    if (focusData.nextIndex !== undefined && nodePositions[focusData.nextIndex]) {
      const position = nodePositions[focusData.nextIndex];
      indicators.push(
        <IndicatorComponent
          key="next-pointer"
          x={position.x}
          y={position.y - 40}
          label="next"
          color={STATUS_COLORS[NodeStatus.NEXT_POINTER]}
          isActive={focusData.focusType === "REVERSE"}
        />
      );
    }
    
    // 比较阶段的左右指针
    if (focusData.leftIndex !== undefined && nodePositions[focusData.leftIndex]) {
      const position = nodePositions[focusData.leftIndex];
      indicators.push(
        <IndicatorComponent
          key="left-pointer"
          x={position.x}
          y={position.y - 40}
          label="left"
          color={STATUS_COLORS[NodeStatus.FIRST_HALF]}
          isActive={focusData.focusType === "COMPARE"}
        />
      );
    }
    
    if (focusData.rightIndex !== undefined && nodePositions[focusData.rightIndex]) {
      const position = nodePositions[focusData.rightIndex];
      indicators.push(
        <IndicatorComponent
          key="right-pointer"
          x={position.x}
          y={position.y - 40}
          label="right"
          color={STATUS_COLORS[NodeStatus.SECOND_HALF]}
          isActive={focusData.focusType === "COMPARE"}
        />
      );
    }
    
    return indicators;
  };
  
  // 渲染指针移动轨迹
  const renderPointerMovementPaths = () => {
    const paths = [];
    
    // 慢指针移动轨迹
    if (focusData.slowIndex !== undefined && previousStepData.slowIndex !== undefined &&
        focusData.slowIndex !== previousStepData.slowIndex) {
      const prevPos = nodePositions[previousStepData.slowIndex];
      const currentPos = nodePositions[focusData.slowIndex];
      
      if (prevPos && currentPos) {
        paths.push(
          <PointerMovementPath
            key="slow-path"
            sourceX={prevPos.x}
            sourceY={prevPos.y - 40}
            targetX={currentPos.x}
            targetY={currentPos.y - 40}
            color={STATUS_COLORS[NodeStatus.SLOW_POINTER]}
            animate={true}
            label="slow移动"
          />
        );
      }
    }
    
    // 快指针移动轨迹
    if (focusData.fastIndex !== undefined && previousStepData.fastIndex !== undefined &&
        focusData.fastIndex !== previousStepData.fastIndex) {
      const prevPos = nodePositions[previousStepData.fastIndex];
      const currentPos = nodePositions[focusData.fastIndex];
      
      if (prevPos && currentPos) {
        paths.push(
          <PointerMovementPath
            key="fast-path"
            sourceX={prevPos.x}
            sourceY={prevPos.y + 40}
            targetX={currentPos.x}
            targetY={currentPos.y + 40}
            color={STATUS_COLORS[NodeStatus.FAST_POINTER]}
            animate={true}
            label="fast移动"
          />
        );
      }
    }
    
    return paths;
  };
  
  // 渲染步骤指示器
  const renderStepIndicator = () => {
    return (
      <StepIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
        currentStepType={currentStepData.type}
        width={width}
      />
    );
  };
  
  return (
    <div className="palindrome-visualization" style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height + 100}
        style={{ 
          border: '1px solid #ddd', 
          borderRadius: '4px', 
          backgroundColor: '#fff'
        }}
      >
        {/* 步骤指示器 */}
        <g transform={`translate(0, ${height + 10})`}>
          {renderStepIndicator()}
        </g>
        
        {/* 定义箭头标记 */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
          </marker>
          <marker
            id="arrow-null"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#95a5a6" />
          </marker>
        </defs>
        
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* 步骤说明 */}
          <text
            x={innerWidth / 2}
            y={20}
            textAnchor="middle"
            fontSize="16px"
            fontWeight="bold"
            fill="#333"
          >
            {currentStepData.description}
          </text>
          
          {/* 连接线 */}
          <g className="connections">
            {connections.map((conn, i) => (
              <LinkComponent
                key={`link-${i}`}
                sourceX={conn.sourceX}
                sourceY={conn.sourceY}
                targetX={conn.targetX}
                targetY={conn.targetY}
                isReverse={conn.isReverse}
                isNull={conn.isNull}
              />
            ))}
          </g>
          
          {/* 比较连接线 */}
          <g className="comparison-lines">
            {renderComparisonLines()}
          </g>
          
          {/* 指针移动路径 */}
          <g className="pointer-paths">
            {renderPointerMovementPaths()}
          </g>
          
          {/* 节点 */}
          <g className="nodes">
            {currentStepData.nodes.map((node, i) => (
              <NodeComponent
                key={`node-${i}`}
                x={nodePositions[i]?.x || 0}
                y={nodePositions[i]?.y || 0}
                value={node.value}
                index={i}
                status={node.status || [NodeStatus.NORMAL]}
                isFocus={i === focusData.focusIndex}
              />
            ))}
          </g>
          
          {/* 指针指示器 */}
          <g className="pointers">
            {renderPointerIndicators()}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default PalindromeVisualization; 