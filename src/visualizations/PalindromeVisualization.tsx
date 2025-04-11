import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
// d3 实际上没有使用，可以移除导入
// import * as d3 from 'd3';
import { NodeData, NodeStatus, StepType } from '../utils/palindromeChecker';
import PointerAnimation from './components/PointerAnimation';
import PointerMovementPath from './components/PointerMovementPath';

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

// 定义指针和节点状态的颜色
const STATUS_COLORS = {
  [NodeStatus.NORMAL]: '#2c3e50',
  [NodeStatus.SLOW_POINTER]: '#3498db',
  [NodeStatus.FAST_POINTER]: '#9b59b6',
  [NodeStatus.PREV_POINTER]: '#e67e22',
  [NodeStatus.CURRENT_POINTER]: '#f1c40f',
  [NodeStatus.NEXT_POINTER]: '#1abc9c',
  [NodeStatus.FIRST_HALF]: '#27ae60',
  [NodeStatus.SECOND_HALF]: '#e74c3c',
  [NodeStatus.COMPARED]: '#2ecc71',
  [NodeStatus.MISMATCH]: '#c0392b'
};

// 定义数据部分的背景渐变色
const STATUS_BACKGROUNDS = {
  [NodeStatus.NORMAL]: '#e8f8f5',
  [NodeStatus.SLOW_POINTER]: '#d6eaf8',
  [NodeStatus.FAST_POINTER]: '#ebdef0',
  [NodeStatus.PREV_POINTER]: '#fdebd0',
  [NodeStatus.CURRENT_POINTER]: '#fef9e7',
  [NodeStatus.NEXT_POINTER]: '#e8f8f5',
  [NodeStatus.FIRST_HALF]: '#eafaf1',
  [NodeStatus.SECOND_HALF]: '#fadbd8',
  [NodeStatus.COMPARED]: '#eafaf1',
  [NodeStatus.MISMATCH]: '#f9ebea'
};

// 状态标签
const STATUS_LABELS = {
  [NodeStatus.NORMAL]: '',
  [NodeStatus.SLOW_POINTER]: 'slow',
  [NodeStatus.FAST_POINTER]: 'fast',
  [NodeStatus.PREV_POINTER]: 'prev',
  [NodeStatus.CURRENT_POINTER]: 'curr',
  [NodeStatus.NEXT_POINTER]: 'next',
  [NodeStatus.FIRST_HALF]: 'first',
  [NodeStatus.SECOND_HALF]: 'second',
  [NodeStatus.COMPARED]: 'compare',
  [NodeStatus.MISMATCH]: 'mismatch'
};

// 定义节点布局参数 - 使用更灵活的相对尺寸计算
const calculateLayoutParams = (width: number, height: number) => {
  // 更加紧凑的布局
  const containerWidth = width * 0.95; // 使用95%的可用宽度
  const containerHeight = height * 0.90; // 使用90%的可用高度
  
  // 动态计算每行最多显示的节点数 - 根据屏幕宽度自适应
  const nodePerRow = Math.max(4, Math.min(8, Math.floor(containerWidth / 120)));
  
  // 动态计算节点大小 - 增大节点半径
  const nodeRadius = Math.max(15, Math.min(22, Math.floor(containerWidth / (nodePerRow * 8))));
  
  // 动态计算节点间距 - 增加间距
  const nodeSpacing = Math.max(80, Math.min(120, containerWidth / (nodePerRow + 1)));
  
  // 动态计算行间距 - 增加行间距
  const rowSpacing = Math.max(60, Math.min(80, containerHeight / 6));
  
  return {
    NODE_RADIUS: nodeRadius,
    NODE_SPACING: nodeSpacing,
    ROW_SPACING: rowSpacing,
    NODES_PER_ROW: nodePerRow,
    START_X: Math.max(20, containerWidth * 0.05), // 增加起始X位置
    START_Y: Math.max(containerHeight * 0.25, 80), // 将起始Y位置设为容器高度的25%，确保不会太靠上
    POINTER_WIDTH: nodeRadius * 1.8, // 加宽指针宽度
    POINTER_HEIGHT: nodeRadius * 1.3 // 加高指针高度
  };
};

// 一个纯函数组件，通过坐标计算渲染节点
const NodeComponent = ({ 
  x, 
  y, 
  value, 
  index, 
  status, 
  isFocus, 
  nodeRadius, 
  pointerWidth, 
  pointerHeight 
}: { 
  x: number;
  y: number;
  value: any;
  index: number;
  status: NodeStatus[];
  isFocus: boolean;
  nodeRadius: number;
  pointerWidth: number;
  pointerHeight: number;
}) => {
  // 确定节点值部分的颜色
  const valueFill = (() => {
    if (isFocus) {
      return '#f39c12';
    }
    
    if (status.includes(NodeStatus.COMPARED)) return '#9b59b6';
    if (status.includes(NodeStatus.CURRENT_POINTER)) return '#3498db';
    if (status.includes(NodeStatus.SLOW_POINTER)) return '#16a085';
    if (status.includes(NodeStatus.FAST_POINTER)) return '#e74c3c';
    return '#bdc3c7';
  })();
  
  // 确定指针部分的颜色
  const pointerFill = '#f8f9fa';
  
  // 值部分的中心位置在传入的x坐标
  const valueX = x;
  
  // 指针部分的左上角位置
  const pointerX = x + nodeRadius;
  const pointerY = y - pointerHeight/2;
  
  return (
    <g className="node">
      {/* 值部分 - 圆形 */}
      <circle
        cx={valueX}
        cy={y}
        r={nodeRadius}
        fill={valueFill}
        stroke="#34495e"
        strokeWidth={2}
      />
      
      {/* 值部分文本 */}
      <text
        x={valueX}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={Math.max(14, nodeRadius * 0.8) + "px"}
        fill="#ffffff"
        fontWeight="bold"
      >
        {String(value)}
      </text>
      
      {/* 连接值部分和指针部分的线 */}
      <line
        x1={valueX + nodeRadius}
        y1={y}
        x2={pointerX}
        y2={y}
        stroke="#34495e"
        strokeWidth={2}
      />
      
      {/* 指针部分 - 矩形 */}
      <rect
        x={pointerX}
        y={pointerY}
        width={pointerWidth}
        height={pointerHeight}
        fill={pointerFill}
        stroke="#34495e"
        strokeWidth={2}
        rx={3}
        ry={3}
      />
      
      {/* 指针部分文本 */}
      <text
        x={pointerX + pointerWidth/2}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={Math.max(12, nodeRadius * 0.6) + "px"}
        fill="#34495e"
      >
        next
      </text>
      
      {/* 节点索引 */}
      <text
        x={valueX}
        y={y + nodeRadius + 12}
        textAnchor="middle"
        fontSize={Math.max(12, nodeRadius * 0.6) + "px"}
        fill="#777"
      >
        #{index + 1}
      </text>
    </g>
  );
};

// 连接线组件
const LinkComponent = ({ 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  isReverse,
  isNull
}: { 
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isReverse: boolean;
  isNull: boolean;
}) => {
  if (isNull) {
    return (
      <g className="null-link">
        <path
          d={`M${sourceX},${sourceY} h30`}
          stroke="#95a5a6"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrow-null)"
        />
        <text
          x={sourceX + 35}
          y={sourceY + 4}
          textAnchor="middle"
          fontSize="12px"
          fill="#95a5a6"
        >
          null
        </text>
      </g>
    );
  }
  
  if (isReverse) {
    const controlPointY = Math.min(sourceY, targetY) - 40;
    const path = `M${sourceX},${sourceY} 
                C${sourceX + 30},${controlPointY} 
                ${targetX - 30},${controlPointY} 
                ${targetX},${targetY}`;
    
    const midX = (sourceX + targetX) / 2;
    const midY = controlPointY - 10;
    
    return (
      <g className="reverse-link">
        <path
          d={path}
          stroke="#e67e22"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrow)"
          strokeDasharray="5,2"
        />
        <text
          x={midX}
          y={midY}
          textAnchor="middle"
          fontSize="10px"
          fill="#e67e22"
        >
          反向连接
        </text>
      </g>
    );
  }
  
  // 正向连接
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const midX = (sourceX + targetX) / 2;
  const midY = Math.min(sourceY, targetY);
  
  // 控制点计算
  const cpx1 = sourceX + dx / 3;
  const cpy1 = midY;
  const cpx2 = targetX - dx / 3;
  const cpy2 = midY;
  
  const path = `M${sourceX},${sourceY} C${cpx1},${cpy1} ${cpx2},${cpy2} ${targetX},${targetY}`;
  
  return (
    <g className="forward-link">
      <path
        d={path}
        stroke="#34495e"
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arrow)"
      />
    </g>
  );
};

// 更新指示器中的指针标签位置
const adjustedTextDistance = (layoutParams: any) => {
  // 根据节点半径调整标签距离
  return layoutParams.NODE_RADIUS * 2;
};

// 指示器组件
const IndicatorComponent = ({
  targetX,
  targetY,
  focusType,
  slowIndex,
  fastIndex,
  leftIndex,
  rightIndex,
  prevIndex,
  currentIndex,
  nextIndex,
  nodes,
  nodePositions,
  previousSlowIndex,
  previousFastIndex,
  layoutParams,
  currentStepData
}: {
  targetX: number;
  targetY: number;
  focusType: string;
  slowIndex?: number;
  fastIndex?: number;
  leftIndex?: number;
  rightIndex?: number;
  prevIndex?: number;
  currentIndex?: number;
  nextIndex?: number;
  nodes: NodeData<any>[];
  nodePositions: {[key: number]: {x: number; y: number}};
  previousSlowIndex?: number;
  previousFastIndex?: number;
  layoutParams: {
    NODE_RADIUS: number;
    NODE_SPACING: number;
    ROW_SPACING: number;
    NODES_PER_ROW: number;
    START_X: number;
    START_Y: number;
    POINTER_WIDTH: number;
    POINTER_HEIGHT: number;
  };
  currentStepData: {
    type: StepType;
    nodes: NodeData<any>[];
    description: string;
    comparedNodes?: { left: number; right: number }[];
    isEvenLength?: boolean;
    positions?: {
      [key: string]: number;
    };
  };
}) => {
  // 控制快指针两步移动的动画状态，使用简化的步骤
  const [fastPointerStep, setFastPointerStep] = useState<number>(0);
  
  // 在指针位置变化时触发动画效果，但使用更直接的转换
  useEffect(() => {
    if (fastIndex !== undefined && previousFastIndex !== undefined && 
        fastIndex !== previousFastIndex && fastIndex > 0) {
      // 重置任何正在进行的动画并开始新动画
      setFastPointerStep(1);
      
      // 只使用一个计时器，简化步骤转换
      const timer = setTimeout(() => {
        setFastPointerStep(0); // 完全重置，不使用中间步骤2
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [fastIndex, previousFastIndex]);
  
  // 计算调整后的标签距离
  const textDistance = adjustedTextDistance(layoutParams);

  return (
    <g className="indicator">
      {/* 中间节点查找阶段的指针 */}
      {slowIndex !== undefined && fastIndex !== undefined && (
        <>
          {/* 计算快指针的路径（但不使用中间点） */}
          {previousFastIndex !== undefined && fastIndex !== previousFastIndex && (
            <PointerMovementPath
              sourceX={nodePositions[previousFastIndex]?.x || 0}
              sourceY={nodePositions[previousFastIndex]?.y || 0}
              targetX={nodePositions[fastIndex]?.x || 0}
              targetY={nodePositions[fastIndex]?.y || 0}
              color={STATUS_COLORS[NodeStatus.FAST_POINTER]}
              animate={true}
              label="快指针移动"
            />
          )}
          
          {/* 慢指针的移动路径 */}
          {previousSlowIndex !== undefined && slowIndex !== previousSlowIndex && (
            <PointerMovementPath
              sourceX={nodePositions[previousSlowIndex]?.x || 0}
              sourceY={nodePositions[previousSlowIndex]?.y || 0}
              targetX={nodePositions[slowIndex]?.x || 0}
              targetY={nodePositions[slowIndex]?.y || 0}
              color={STATUS_COLORS[NodeStatus.SLOW_POINTER]}
              animate={true}
              label="慢指针移动"
            />
          )}
        
          {/* 使用新的指针动画组件 */}
          {slowIndex < nodes.length && nodePositions[slowIndex] && (
            <PointerAnimation
              pointerType="slow"
              startNodeIndex={previousSlowIndex !== undefined ? previousSlowIndex : slowIndex}
              endNodeIndex={slowIndex}
              currentNodeIndices={[slowIndex]}
              nodePositions={nodePositions}
              nodeRadius={layoutParams.NODE_RADIUS}
            />
          )}
          
          {fastIndex < nodes.length && nodePositions[fastIndex] && (
            <PointerAnimation
              pointerType="fast"
              startNodeIndex={previousFastIndex !== undefined ? previousFastIndex : fastIndex}
              endNodeIndex={fastIndex}
              currentNodeIndices={[fastIndex]} // 只显示最终位置，不显示中间点
              nodePositions={nodePositions}
              nodeRadius={layoutParams.NODE_RADIUS}
              isAnimating={fastPointerStep > 0}
            />
          )}
        </>
      )}
      
      {/* 反转链表阶段的指针 */}
      {(prevIndex !== undefined || currentIndex !== undefined || nextIndex !== undefined) && (
        <g className="reverse-pointers">
          {/* Prev指针 */}
          {prevIndex !== undefined && prevIndex >= 0 && nodePositions[prevIndex] && (
            <g className="prev-pointer-indicator">
              <line
                x1={nodePositions[prevIndex].x}
                y1={nodePositions[prevIndex].y - layoutParams.NODE_RADIUS - textDistance}
                x2={nodePositions[prevIndex].x}
                y2={nodePositions[prevIndex].y - layoutParams.NODE_RADIUS - 5}
                stroke="#e67e22"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
              <path
                d={`M${nodePositions[prevIndex].x - 6},${nodePositions[prevIndex].y - layoutParams.NODE_RADIUS - 15} 
                   L${nodePositions[prevIndex].x},${nodePositions[prevIndex].y - layoutParams.NODE_RADIUS - 5} 
                   L${nodePositions[prevIndex].x + 6},${nodePositions[prevIndex].y - layoutParams.NODE_RADIUS - 15}`}
                fill="#e67e22"
              />
              <rect
                x={nodePositions[prevIndex].x - 30}
                y={nodePositions[prevIndex].y - layoutParams.NODE_RADIUS - textDistance - 20}
                width={60}
                height={22}
                rx={11}
                ry={11}
                fill="#e67e22"
                filter="url(#dropShadow)"
              />
              <text
                x={nodePositions[prevIndex].x}
                y={nodePositions[prevIndex].y - layoutParams.NODE_RADIUS - textDistance - 9}
                textAnchor="middle"
                fontSize="13px"
                fontWeight="bold"
                fill="white"
              >
                prev
              </text>
            </g>
          )}
          
          {/* Current指针 */}
          {currentIndex !== undefined && currentIndex >= 0 && nodePositions[currentIndex] && (
            <g className="current-pointer-indicator">
              <line
                x1={nodePositions[currentIndex].x}
                y1={nodePositions[currentIndex].y - layoutParams.NODE_RADIUS - textDistance}
                x2={nodePositions[currentIndex].x}
                y2={nodePositions[currentIndex].y - layoutParams.NODE_RADIUS - 5}
                stroke="#f1c40f"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
              <path
                d={`M${nodePositions[currentIndex].x - 6},${nodePositions[currentIndex].y - layoutParams.NODE_RADIUS - 15} 
                   L${nodePositions[currentIndex].x},${nodePositions[currentIndex].y - layoutParams.NODE_RADIUS - 5} 
                   L${nodePositions[currentIndex].x + 6},${nodePositions[currentIndex].y - layoutParams.NODE_RADIUS - 15}`}
                fill="#f1c40f"
              />
              <rect
                x={nodePositions[currentIndex].x - 30}
                y={nodePositions[currentIndex].y - layoutParams.NODE_RADIUS - textDistance - 20}
                width={60}
                height={22}
                rx={11}
                ry={11}
                fill="#f1c40f"
                filter="url(#dropShadow)"
              />
              <text
                x={nodePositions[currentIndex].x}
                y={nodePositions[currentIndex].y - layoutParams.NODE_RADIUS - textDistance - 9}
                textAnchor="middle"
                fontSize="13px"
                fontWeight="bold"
                fill="white"
              >
                current
              </text>
            </g>
          )}
          
          {/* Next指针 */}
          {nextIndex !== undefined && nextIndex >= 0 && nodePositions[nextIndex] && (
            <g className="next-pointer-indicator">
              <line
                x1={nodePositions[nextIndex].x}
                y1={nodePositions[nextIndex].y - layoutParams.NODE_RADIUS - textDistance}
                x2={nodePositions[nextIndex].x}
                y2={nodePositions[nextIndex].y - layoutParams.NODE_RADIUS - 5}
                stroke="#1abc9c"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
              <path
                d={`M${nodePositions[nextIndex].x - 6},${nodePositions[nextIndex].y - layoutParams.NODE_RADIUS - 15} 
                   L${nodePositions[nextIndex].x},${nodePositions[nextIndex].y - layoutParams.NODE_RADIUS - 5} 
                   L${nodePositions[nextIndex].x + 6},${nodePositions[nextIndex].y - layoutParams.NODE_RADIUS - 15}`}
                fill="#1abc9c"
              />
              <rect
                x={nodePositions[nextIndex].x - 30}
                y={nodePositions[nextIndex].y - layoutParams.NODE_RADIUS - textDistance - 20}
                width={60}
                height={22}
                rx={11}
                ry={11}
                fill="#1abc9c"
                filter="url(#dropShadow)"
              />
              <text
                x={nodePositions[nextIndex].x}
                y={nodePositions[nextIndex].y - layoutParams.NODE_RADIUS - textDistance - 9}
                textAnchor="middle"
                fontSize="13px"
                fontWeight="bold"
                fill="white"
              >
                next
              </text>
            </g>
          )}
          
          {/* 反转链表的动画效果 - 如果当前和上一个节点都存在 */}
          {currentIndex !== undefined && prevIndex !== undefined && prevIndex >= 0 && currentIndex >= 0 && (
            <g className="reverse-animation">
              <path
                d={`M${nodePositions[currentIndex].x + layoutParams.NODE_RADIUS},${nodePositions[currentIndex].y} 
                   C${nodePositions[currentIndex].x + layoutParams.NODE_RADIUS * 2},${nodePositions[currentIndex].y - 30} 
                   ${nodePositions[prevIndex].x - layoutParams.NODE_RADIUS * 2},${nodePositions[prevIndex].y - 30} 
                   ${nodePositions[prevIndex].x - layoutParams.NODE_RADIUS},${nodePositions[prevIndex].y}`}
                stroke="#e74c3c"
                strokeWidth={1.5}
                strokeDasharray="5,3"
                fill="none"
                markerEnd="url(#arrow)"
                opacity={0.7}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="20"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              <text
                x={(nodePositions[currentIndex].x + nodePositions[prevIndex].x) / 2}
                y={Math.min(nodePositions[currentIndex].y, nodePositions[prevIndex].y) - 40}
                textAnchor="middle"
                fontSize="12px"
                fill="#e74c3c"
                fontWeight="bold"
              >
                反转指向
              </text>
            </g>
          )}
        </g>
      )}
      
      {leftIndex !== undefined && rightIndex !== undefined && 
       leftIndex < nodes.length && rightIndex < nodes.length && (
        <>
          {nodes[leftIndex] && nodes[rightIndex] && (
            <>
              {/* 比较节点的连接线 */}
              <path
                d={`M${nodePositions[leftIndex].x + layoutParams.NODE_RADIUS},${nodePositions[leftIndex].y} 
                   C${nodePositions[leftIndex].x + 50},${(nodePositions[leftIndex].y + nodePositions[rightIndex].y) / 2 - 40} 
                   ${nodePositions[rightIndex].x - 50},${(nodePositions[leftIndex].y + nodePositions[rightIndex].y) / 2 - 40} 
                   ${nodePositions[rightIndex].x - layoutParams.NODE_RADIUS},${nodePositions[rightIndex].y}`}
                stroke={nodes[leftIndex].value === nodes[rightIndex].value ? '#2ecc71' : '#e74c3c'}
                strokeWidth={3}
                strokeDasharray="5,3"
                fill="none"
                opacity={0.8}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="20"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
              
              {/* 比较结果标识 */}
              <text
                x={(nodePositions[leftIndex].x + nodePositions[rightIndex].x) / 2}
                y={Math.min(nodePositions[leftIndex].y, nodePositions[rightIndex].y) - 35}
                textAnchor="middle"
                fontSize="16px"
                fill={nodes[leftIndex].value === nodes[rightIndex].value ? '#2ecc71' : '#e74c3c'}
                fontWeight="bold"
              >
                {nodes[leftIndex].value === nodes[rightIndex].value ? '✓ 值相等' : '✗ 值不相等'}
              </text>
              
              {/* 比较节点的高亮圆环 */}
              <circle
                cx={nodePositions[leftIndex].x}
                cy={nodePositions[leftIndex].y}
                r={layoutParams.NODE_RADIUS + 6}
                fill="none"
                stroke={nodes[leftIndex].value === nodes[rightIndex].value ? '#2ecc71' : '#e74c3c'}
                strokeWidth={3}
                opacity={0.7}
              >
                <animate
                  attributeName="r"
                  values={`${layoutParams.NODE_RADIUS + 5};${layoutParams.NODE_RADIUS + 8};${layoutParams.NODE_RADIUS + 5}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.9;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              
              <circle
                cx={nodePositions[rightIndex].x}
                cy={nodePositions[rightIndex].y}
                r={layoutParams.NODE_RADIUS + 6}
                fill="none"
                stroke={nodes[leftIndex].value === nodes[rightIndex].value ? '#2ecc71' : '#e74c3c'}
                strokeWidth={3}
                opacity={0.7}
              >
                <animate
                  attributeName="r"
                  values={`${layoutParams.NODE_RADIUS + 5};${layoutParams.NODE_RADIUS + 8};${layoutParams.NODE_RADIUS + 5}`}
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0.9;0.6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              
              {/* 比较的数值文本 */}
              <text
                x={(nodePositions[leftIndex].x + nodePositions[rightIndex].x) / 2}
                y={Math.min(nodePositions[leftIndex].y, nodePositions[rightIndex].y) - 10}
                textAnchor="middle"
                fontSize="14px"
                fill="#777"
              >
                比较: {nodes[leftIndex].value} vs {nodes[rightIndex].value}
              </text>
            </>
          )}
        </>
      )}
    </g>
  );
};

// 图例组件
const LegendComponent = ({ 
  x, 
  y, 
  layoutParams 
}: { 
  x: number; 
  y: number; 
  layoutParams: {
    NODE_RADIUS: number;
    NODE_SPACING: number;
    ROW_SPACING: number;
    NODES_PER_ROW: number;
    START_X: number;
    START_Y: number;
    POINTER_WIDTH: number;
    POINTER_HEIGHT: number;
  } 
}) => {
  // 放大图例节点
  const valueX = 35;
  const valueY = 0;
  const pointerX = valueX + layoutParams.NODE_RADIUS * 0.8;
  const pointerY = valueY - layoutParams.POINTER_HEIGHT/2 * 0.8;
  
  return (
    <g className="legend" transform={`translate(${x}, ${y})`}>
      <text
        x={0}
        y={-15}
        fontSize="13px"
        fontWeight="bold"
      >
        节点结构:
      </text>
      
      {/* 示例节点的值部分 */}
      <circle
        cx={valueX}
        cy={valueY}
        r={layoutParams.NODE_RADIUS * 0.7} // 适当大小的图例节点
        fill="#fff"
        stroke="#2c3e50"
        strokeWidth={1.5}
      />
      
      {/* 连接线 */}
      <line
        x1={valueX + layoutParams.NODE_RADIUS * 0.7}
        y1={valueY}
        x2={pointerX}
        y2={valueY}
        stroke="#2c3e50"
        strokeWidth={1.5}
      />
      
      {/* 示例节点的指针部分 */}
      <rect
        x={pointerX}
        y={pointerY}
        width={layoutParams.POINTER_WIDTH * 0.7}
        height={layoutParams.POINTER_HEIGHT * 0.7}
        fill="#f8f9fa"
        stroke="#2c3e50"
        strokeWidth={1.5}
        rx={2}
        ry={2}
      />
      
      <text
        x={valueX}
        y={valueY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11px"
        fontWeight="bold"
      >
        值
      </text>
      
      <text
        x={pointerX + layoutParams.POINTER_WIDTH * 0.35}
        y={valueY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9px"
      >
        指针
      </text>
      
      {/* 更清晰的说明文本 */}
      <g transform={`translate(${pointerX + layoutParams.POINTER_WIDTH * 0.7 + 10}, ${valueY - 10})`}>
        <text
          x={0}
          y={0}
          fontSize="11px"
          dominantBaseline="middle"
          fill="#555"
        >
          <tspan x="0" dy="0">数据:节点值</tspan>
          <tspan x="0" dy="16">指针:下一节点</tspan>
        </text>
      </g>
    </g>
  );
};

// 定义标记
const MarkerDefs = () => (
  <defs>
    {/* Drop shadow filter for pointer labels */}
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000033" />
    </filter>
  
    <marker
      id="arrow"
      viewBox="0 -5 10 10"
      refX={10}
      refY={0}
      markerWidth={6}
      markerHeight={6}
      orient="auto"
    >
      <path d="M0,-5L10,0L0,5" fill="#16a085" />
    </marker>
    
    <marker
      id="arrow-null"
      viewBox="0 -5 10 10"
      refX={8}
      refY={0}
      markerWidth={6}
      markerHeight={6}
      orient="auto"
    >
      <path d="M0,-5L10,0L0,5" fill="#95a5a6" />
    </marker>
    
    <marker
      id="focus-arrow"
      viewBox="0 -5 10 10"
      refX={8}
      refY={0}
      markerWidth={8}
      markerHeight={8}
      orient="auto"
    >
      <path d="M0,-5L10,0L0,5" fill="#e74c3c" />
    </marker>
    
    {/* 慢指针向下箭头标记 */}
    <marker
      id="slow-arrow"
      viewBox="0 -5 12 10"
      refX={10}
      refY={0}
      markerWidth={10}
      markerHeight={10}
      orient="auto"
    >
      <path d="M0,-6L12,0L0,6L4,0Z" fill="#16a085" />
    </marker>
    
    {/* 快指针向下箭头标记 */}
    <marker
      id="fast-arrow"
      viewBox="0 -5 12 10"
      refX={10}
      refY={0}
      markerWidth={10}
      markerHeight={10}
      orient="auto"
    >
      <path d="M0,-6L12,0L0,6L4,0Z" fill="#c0392b" />
    </marker>
    
    {/* 快指针向上箭头标记 */}
    <marker
      id="fast-arrow-up"
      viewBox="0 -5 12 10"
      refX={10}
      refY={0}
      markerWidth={10}
      markerHeight={10}
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
      <path d="M0,6L12,0L0,-6L4,0Z" fill="#c0392b" />
    </marker>
    
    {/* 步骤指示器箭头 - 用于显示移动路径 */}
    <marker
      id="step-arrow"
      viewBox="0 -5 10 10"
      refX={10}
      refY={0}
      markerWidth={8}
      markerHeight={8}
      orient="auto"
    >
      <path d="M0,-4L8,0L0,4" fill="#e67e22" />
    </marker>
    
    {/* 步骤指示器箭头 - 第一步 */}
    <marker
      id="step-one-arrow"
      viewBox="0 -5 10 10"
      refX={10}
      refY={0}
      markerWidth={8}
      markerHeight={8}
      orient="auto"
    >
      <path d="M0,-4L8,0L0,4" fill="#16a085" />
    </marker>
    
    {/* 步骤指示器箭头 - 第二步 */}
    <marker
      id="step-two-arrow"
      viewBox="0 -5 10 10"
      refX={10}
      refY={0}
      markerWidth={8}
      markerHeight={8}
      orient="auto"
    >
      <path d="M0,-4L8,0L0,4" fill="#c0392b" />
    </marker>
  </defs>
);

// 添加一个全局变量来始终显示中间节点标识
const FORCE_SHOW_MIDDLE_NODE = true;

const PalindromeVisualization = <T extends unknown>({
  steps,
  currentStep,
  width = 800,
  height = 400,
}: PalindromeVisualizationProps<T>): React.ReactElement => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width, height });
  
  // 使用的布局参数
  const layoutParams = useMemo(() => 
    calculateLayoutParams(dimensions.width, dimensions.height), 
    [dimensions.width, dimensions.height]
  );

  // 重新计算可见区域大小
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current && svgRef.current.parentElement) {
        const parentWidth = svgRef.current.parentElement.clientWidth;
        const parentHeight = svgRef.current.parentElement.clientHeight;
        
        // 确保尺寸不为0，否则使用默认值
        setDimensions({
          width: parentWidth || width,
          height: parentHeight || height
        });
      }
    };

    // 初始化调用一次
    updateDimensions();
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', updateDimensions);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [width, height]);
  
  // 所有数据计算都移动到useMemo中，确保在渲染前完成
  const currentStepData = useMemo(() => steps[currentStep], [steps, currentStep]);
  
  // 使用useMemo预计算所有位置，避免渲染过程中的计算
  const nodePositions = useMemo(() => {
    if (!currentStepData) return {};
    
    const positions: {[key: number]: {x: number; y: number}} = {};
    
    currentStepData.nodes.forEach((_, index) => {
      const row = Math.floor(index / layoutParams.NODES_PER_ROW);
      const col = index % layoutParams.NODES_PER_ROW;
      
      // 更新节点位置计算，考虑新的节点布局
      positions[index] = {
        x: layoutParams.START_X + col * layoutParams.NODE_SPACING + layoutParams.POINTER_WIDTH/2, // 调整X坐标，使value部分居中
        y: layoutParams.START_Y + row * layoutParams.ROW_SPACING
      };
    });
    
    return positions;
  }, [currentStepData, layoutParams]);
  
  // 使用useMemo预计算所有连接
  const connections = useMemo(() => {
    if (!currentStepData) return [];
    
    const connections: Array<{
      source: number;
      target: number;
      isReverse: boolean;
      isNull: boolean;
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
    }> = [];
    
    currentStepData.nodes.forEach((node, i) => {
      const sourcePos = nodePositions[i];
      if (!sourcePos) return; // 跳过没有位置信息的节点
      
      // 从next指针部分的右侧中心开始
      const sourceX = sourcePos.x + layoutParams.NODE_RADIUS + layoutParams.POINTER_WIDTH;
      
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
          
          // 指向target节点的值部分左侧
          const targetX = targetPos.x - layoutParams.NODE_RADIUS;
          
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
  }, [currentStepData, nodePositions, layoutParams]);
  
  // 使用useMemo预计算关注点数据
  const focusData = useMemo(() => {
    if (!currentStepData) return { focusIndex: -1, focusType: "" };
    
    let focusIndex = -1;
    let focusType = "";
    let slowIndex, fastIndex, leftIndex, rightIndex, prevIndex, currentIndex, nextIndex;
    
    // 首先尝试从positions属性获取指针位置
    if (currentStepData.positions) {
      slowIndex = currentStepData.positions.slowIndex;
      fastIndex = currentStepData.positions.fastIndex;
      leftIndex = currentStepData.positions.leftIndex;
      rightIndex = currentStepData.positions.rightIndex;
      prevIndex = currentStepData.positions.prevIndex;
      currentIndex = currentStepData.positions.currentIndex;
      nextIndex = currentStepData.positions.nextIndex;
    }
    
    // 根据步骤类型识别关注点
    if (currentStepData.type.includes('MIDDLE')) {
      currentStepData.nodes.forEach((node, idx) => {
        if (node.status?.includes(NodeStatus.SLOW_POINTER)) {
          slowIndex = idx;
          focusIndex = idx;
          focusType = "slow";
        }
        if (node.status?.includes(NodeStatus.FAST_POINTER)) {
          fastIndex = idx;
        }
      });
    } else if (currentStepData.type.includes('REVERSE')) {
      currentStepData.nodes.forEach((node, idx) => {
        if (node.status?.includes(NodeStatus.CURRENT_POINTER)) {
          currentIndex = idx;
          focusIndex = idx;
          focusType = "reverse";
        }
        if (node.status?.includes(NodeStatus.PREV_POINTER)) {
          prevIndex = idx;
        }
        if (node.status?.includes(NodeStatus.NEXT_POINTER)) {
          nextIndex = idx;
        }
      });
      
      // 反转链表阶段添加日志跟踪
      console.log('反转链表步骤:', {
        stepType: currentStepData.type,
        prevIndex,
        currentIndex,
        nextIndex,
        positions: currentStepData.positions,
        nodesWithStatus: currentStepData.nodes.map((n, i) => ({ 
          index: i,
          value: n.value,
          status: n.status 
        }))
      });
    } else if (currentStepData.type.includes('COMPARE')) {
      if (currentStepData.comparedNodes) {
        const pair = currentStepData.comparedNodes[0];
        if (pair) {
          focusIndex = pair.left;
          focusType = "compare";
        }
      }
    }
    
    // 如果还是没有找到快慢指针位置，再遍历一次节点
    if (slowIndex === undefined || fastIndex === undefined) {
      currentStepData.nodes.forEach((node, idx) => {
        if (node.status?.includes(NodeStatus.SLOW_POINTER)) {
          slowIndex = idx;
        }
        if (node.status?.includes(NodeStatus.FAST_POINTER)) {
          fastIndex = idx;
        }
      });
    }
    
    // 添加日志，帮助诊断为什么指针可能不显示
    if (currentStepData.type.includes('MIDDLE')) {
      console.log('中间节点查找步骤:', {
        stepType: currentStepData.type,
        slowIndex,
        fastIndex,
        positions: currentStepData.positions,
        nodesWithStatus: currentStepData.nodes.map((n, i) => ({ 
          index: i,
          value: n.value,
          status: n.status 
        }))
      });
    }
    
    return { 
      focusIndex, 
      focusType,
      slowIndex,
      fastIndex,
      leftIndex,
      rightIndex,
      prevIndex,
      currentIndex,
      nextIndex
    };
  }, [currentStepData]);
  
  // 获取步骤标题
  const getStepTitle = useCallback((type: StepType): string => {
    switch (type) {
      case StepType.INITIAL:
        return '初始链表';
      case StepType.FIND_MIDDLE_START:
        return '开始查找中间节点';
      case StepType.FIND_MIDDLE_STEP:
        return '查找中间节点过程';
      case StepType.FIND_MIDDLE_COMPLETE:
        return '中间节点查找完成';
      case StepType.REVERSE_START:
        return '开始反转链表后半部分';
      case StepType.REVERSE_STEP:
        return '反转链表步骤';
      case StepType.REVERSE_COMPLETE:
        return '链表后半部分反转完成';
      case StepType.COMPARE_START:
        return '开始比较前后两部分';
      case StepType.COMPARE_STEP:
        return '比较节点值';
      case StepType.COMPARE_COMPLETE:
        return '比较完成';
      default:
        return '回文检查';
    }
  }, []);
  
  // 添加跟踪前一步骤的指针位置
  const [previousStepData, setPreviousStepData] = useState<{
    slowIndex?: number;
    fastIndex?: number;
  }>({});
  
  // 在步骤变化时更新前一步骤数据
  useEffect(() => {
    if (currentStepData) {
      // 获取当前步骤的指针索引
      const currentSlowIndex = focusData.slowIndex;
      const currentFastIndex = focusData.fastIndex;
      
      // 延迟更新前一步骤的数据，以便动画能够正常工作
      const timer = setTimeout(() => {
        setPreviousStepData({
          slowIndex: currentSlowIndex,
          fastIndex: currentFastIndex
        });
      }, 3000); // 给足够的时间显示动画
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, focusData]);
  
  // 找到中间节点的索引 - 对于偶数长度的链表，取前半部分的最后一个节点
  const findMiddleNodeIndex = useCallback(() => {
    // 添加安全检查，确保currentStepData和nodes存在
    if (!currentStepData || !currentStepData.nodes) return -1;
    
    const nodeCount = currentStepData.nodes.length;
    if (nodeCount === 0) return -1;
    
    // 如果明确知道是偶数长度
    if (currentStepData.isEvenLength) {
      return Math.floor(nodeCount / 2) - 1;
    }
    
    // 否则按照奇数长度计算
    return Math.floor(nodeCount / 2);
  }, [currentStepData]);

  // 获取中间节点索引
  const middleNodeIndex = useMemo(() => findMiddleNodeIndex(), [findMiddleNodeIndex]);
  
  // 未初始化或数据未加载
  if (!currentStepData) {
    return (
      <div className="palindrome-visualization" style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden' 
      }}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block',
            margin: '0 auto',
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
  
  // 预计算边距和尺寸 - 使用最小边距
  const margin = { top: 25, right: 15, bottom: 20, left: 15 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <svg 
        ref={svgRef}
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <MarkerDefs />
        
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* 标题和描述 - 极简样式 */}
          <g className="titles">
            <text
              className="title"
              x={innerWidth / 2}
              y={0}
              textAnchor="middle"
              fontSize="14px"
              fontWeight="bold"
            >
              {getStepTitle(currentStepData.type)}
            </text>
            
            <text
              className="description"
              x={innerWidth / 2}
              y={20}
              textAnchor="middle"
              fontSize="12px"
              fill="#555"
            >
              {currentStepData.description}
            </text>
            
            {/* 步骤指示器位置调整 */}
            {currentStepData.type.includes('MIDDLE') && (
              <g className="middle-finding-indicator">
                <rect
                  x={5}
                  y={-20}
                  width={160}
                  height={20}
                  rx={8}
                  ry={8}
                  fill="#3498db"
                  opacity={0.9}
                  filter="url(#dropShadow)"
                />
                <text
                  x={85}
                  y={-9}
                  textAnchor="middle"
                  fontSize="11px"
                  fontWeight="bold"
                  fill="white"
                >
                  🔍 正在查找中间节点 🔍
                </text>
              </g>
            )}
            
            {currentStepData.type.includes('REVERSE') && (
              <g className="reverse-indicator">
                <rect
                  x={5}
                  y={-20}
                  width={160}
                  height={20}
                  rx={8}
                  ry={8}
                  fill="#e67e22"
                  opacity={0.9}
                  filter="url(#dropShadow)"
                />
                <text
                  x={85}
                  y={-9}
                  textAnchor="middle"
                  fontSize="11px"
                  fontWeight="bold"
                  fill="white"
                >
                  🔄 正在反转链表后半部分 🔄
                </text>
              </g>
            )}
            
            {currentStepData.type.includes('COMPARE') && (
              <g className="compare-indicator">
                <rect
                  x={5}
                  y={-20}
                  width={160}
                  height={20}
                  rx={8}
                  ry={8}
                  fill="#2ecc71"
                  opacity={0.9}
                  filter="url(#dropShadow)"
                />
                <text
                  x={85}
                  y={-9}
                  textAnchor="middle"
                  fontSize="11px"
                  fontWeight="bold"
                  fill="white"
                >
                  🔍 正在比较前后两部分 🔍
                </text>
              </g>
            )}
          </g>
          
          {/* 其他内容保持不变 */}
          <g className="links">
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
          
          <g className="nodes">
            {currentStepData.nodes.map((node, i) => {
              const pos = nodePositions[i];
              return pos ? (
                <NodeComponent
                  key={`node-${i}`}
                  x={pos.x}
                  y={pos.y}
                  value={node.value}
                  index={i}
                  status={node.status || []}
                  isFocus={i === focusData.focusIndex}
                  nodeRadius={layoutParams.NODE_RADIUS}
                  pointerWidth={layoutParams.POINTER_WIDTH}
                  pointerHeight={layoutParams.POINTER_HEIGHT}
                />
              ) : null;
            })}
          </g>
          
          {/* 强制显示中间节点标识 - 显示在第3个节点上(索引2) */}
          {FORCE_SHOW_MIDDLE_NODE && currentStepData && nodePositions && 
            nodePositions[2] && currentStepData.type.includes('REVERSE') && (
            <g className="middle-node-indicator" filter="url(#dropShadow)">
              {/* 大大的箭头标识 */}
              <path 
                d={`M${nodePositions[2].x},${nodePositions[2].y - layoutParams.NODE_RADIUS - 30} 
                   L${nodePositions[2].x - 25},${nodePositions[2].y - layoutParams.NODE_RADIUS - 70}
                   L${nodePositions[2].x + 25},${nodePositions[2].y - layoutParams.NODE_RADIUS - 70}
                   Z`} 
                fill="#ff0000"
                stroke="#aa0000"
                strokeWidth={3}
                opacity={0.9}
              >
                <animate 
                  attributeName="opacity" 
                  values="1;0.6;1" 
                  dur="1s" 
                  repeatCount="indefinite" 
                />
              </path>
              
              {/* 明确的中间节点标签 */}
              <rect
                x={nodePositions[2].x - 60}
                y={nodePositions[2].y - layoutParams.NODE_RADIUS - 100}
                width={120}
                height={25}
                rx={12.5}
                ry={12.5}
                fill="#ff0000"
                opacity={0.9}
              />
              <text
                x={nodePositions[2].x}
                y={nodePositions[2].y - layoutParams.NODE_RADIUS - 85}
                textAnchor="middle"
                fontSize="16px"
                fontWeight="bold"
                fill="white"
              >
                中间节点
              </text>
            </g>
          )}
          
          {/* 保留原来的中间节点标识逻辑 */}
          {currentStepData && nodePositions && 
           (currentStepData.type.includes('REVERSE') || currentStepData.type.includes('COMPARE')) && 
           middleNodeIndex >= 0 && nodePositions[middleNodeIndex] && (
            <g className="middle-node-indicator" filter="url(#dropShadow)">
              {/* 大箭头指向中间节点 */}
              <path 
                d={`M${nodePositions[middleNodeIndex].x},${nodePositions[middleNodeIndex].y - layoutParams.NODE_RADIUS - 30} 
                   L${nodePositions[middleNodeIndex].x - 25},${nodePositions[middleNodeIndex].y - layoutParams.NODE_RADIUS - 70}
                   L${nodePositions[middleNodeIndex].x + 25},${nodePositions[middleNodeIndex].y - layoutParams.NODE_RADIUS - 70}
                   Z`} 
                fill="#e74c3c"
                stroke="#c0392b"
                strokeWidth={2.5}
                opacity={0.9}
              >
                <animate 
                  attributeName="opacity" 
                  values="0.9;0.7;0.9" 
                  dur="1.5s" 
                  repeatCount="indefinite" 
                />
              </path>
              
              {/* 中间节点标签 */}
              <rect
                x={nodePositions[middleNodeIndex].x - 50}
                y={nodePositions[middleNodeIndex].y - layoutParams.NODE_RADIUS - 100}
                width={100}
                height={25}
                rx={12.5}
                ry={12.5}
                fill="#e74c3c"
                opacity={0.9}
              />
              <text
                x={nodePositions[middleNodeIndex].x}
                y={nodePositions[middleNodeIndex].y - layoutParams.NODE_RADIUS - 85}
                textAnchor="middle"
                fontSize="14px"
                fontWeight="bold"
                fill="white"
              >
                中间节点
              </text>
            </g>
          )}
          
          {nodePositions && (
            <IndicatorComponent
              targetX={focusData.focusIndex >= 0 ? nodePositions[focusData.focusIndex]?.x : innerWidth/2}
              targetY={focusData.focusIndex >= 0 ? nodePositions[focusData.focusIndex]?.y : innerHeight/2}
              focusType={focusData.focusType}
              slowIndex={focusData.slowIndex}
              fastIndex={focusData.fastIndex}
              leftIndex={focusData.leftIndex}
              rightIndex={focusData.rightIndex}
              prevIndex={focusData.prevIndex}
              currentIndex={focusData.currentIndex}
              nextIndex={focusData.nextIndex}
              nodes={currentStepData.nodes}
              nodePositions={nodePositions}
              previousSlowIndex={previousStepData.slowIndex}
              previousFastIndex={previousStepData.fastIndex}
              layoutParams={layoutParams}
              currentStepData={currentStepData}
            />
          )}
          
          {/* 图例 - 移至左下角 */}
          <LegendComponent x={10} y={innerHeight - 40} layoutParams={layoutParams} />
          
          {/* 缩小提示信息框 */}
          {currentStepData.type.includes('MIDDLE') && (focusData.slowIndex === undefined || focusData.fastIndex === undefined) && (
            <g className="pointer-message">
              <rect
                x={innerWidth - 180}
                y={innerHeight - 45}
                width={170}
                height={35}
                rx={4}
                ry={4}
                fill="#f39c12"
                opacity={0.9}
              />
              <text
                x={innerWidth - 95}
                y={innerHeight - 30}
                textAnchor="middle"
                fontSize="10px"
                fontWeight="bold"
                fill="white"
              >
                提示：请使用步骤控制按钮
              </text>
              <text
                x={innerWidth - 95}
                y={innerHeight - 15}
                textAnchor="middle"
                fontSize="8px"
                fill="white"
              >
                切换到查找中间节点的步骤
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default PalindromeVisualization; 