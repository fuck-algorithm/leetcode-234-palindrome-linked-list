import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { ListNode, AlgorithmStep } from '../types';
import { useAlgorithm } from '../context/AlgorithmContext';

// 定义链表可视化组件属性
interface LinkedListVisualizationProps {
  width?: number;
  height?: number;
}

// 链表可视化组件
const LinkedListVisualization: React.FC<LinkedListVisualizationProps> = ({
  width = 800,
  height = 300
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state } = useAlgorithm();
  const { nodes, animation, pointers, result } = state;
  const { step } = animation;

  // D3力导向图布局
  useEffect(() => {
    if (!nodes.length || !svgRef.current) return;

    // 清除旧内容
    d3.select(svgRef.current).selectAll('*').remove();

    // 设置SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // 创建力导向布局
    const simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('x', d3.forceX(width / 2).strength(0.1));

    // 准备节点和连接线数据
    const links = nodes.slice(0, -1).map((node, i) => ({
      source: node.id,
      target: nodes[i + 1].id
    }));

    // 创建连接线
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // 创建箭头标记
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', '#999');

    // 创建节点组
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // 节点背景
    node.append('circle')
      .attr('r', 20)
      .attr('fill', (d, i) => getNodeFill(i))
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5);

    // 节点文本
    node.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.val)
      .style('font-size', '12px')
      .style('fill', '#000');

    // 添加慢指针
    if (step !== AlgorithmStep.INITIALIZE) {
      const slowPointer = svg.append('g')
        .attr('class', 'pointer')
        .attr('transform', `translate(0,0)`);
      
      slowPointer.append('circle')
        .attr('r', 8)
        .attr('fill', 'red');
      
      slowPointer.append('text')
        .attr('dy', '-10')
        .attr('text-anchor', 'middle')
        .text('slow')
        .style('font-size', '10px');
    }

    // 添加快指针
    if (step === AlgorithmStep.FIND_MIDDLE) {
      const fastPointer = svg.append('g')
        .attr('class', 'pointer')
        .attr('transform', `translate(0,0)`);
      
      fastPointer.append('polygon')
        .attr('points', '0,-8 8,0 0,8 -8,0')
        .attr('fill', 'blue');
      
      fastPointer.append('text')
        .attr('dy', '-15')
        .attr('text-anchor', 'middle')
        .text('fast')
        .style('font-size', '10px');
    }

    // 添加比较指针
    if (step === AlgorithmStep.COMPARE) {
      // 左指针
      const leftPointer = svg.append('g')
        .attr('class', 'pointer left')
        .attr('transform', `translate(0,0)`);
      
      leftPointer.append('circle')
        .attr('r', 8)
        .attr('fill', 'green');
      
      leftPointer.append('text')
        .attr('dy', '-10')
        .attr('text-anchor', 'middle')
        .text('left')
        .style('font-size', '10px');
      
      // 右指针
      const rightPointer = svg.append('g')
        .attr('class', 'pointer right')
        .attr('transform', `translate(0,0)`);
      
      rightPointer.append('circle')
        .attr('r', 8)
        .attr('fill', 'orange');
      
      rightPointer.append('text')
        .attr('dy', '-10')
        .attr('text-anchor', 'middle')
        .text('right')
        .style('font-size', '10px');
    }

    // 添加复杂度信息
    svg.append('text')
      .attr('x', width - 150)
      .attr('y', height - 20)
      .text('O(n) Time | O(1) Space')
      .style('font-size', '12px')
      .style('fill', '#666');

    // 模拟力导向布局
    simulation
      .nodes(nodes as any)
      .on('tick', ticked);

    (simulation.force('link') as d3.ForceLink<any, any>).links(links);

    // 布局更新函数
    function ticked() {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);

      // 更新指针位置
      if (step !== AlgorithmStep.INITIALIZE) {
        const slowNode = nodes[pointers.slow] as any;
        if (slowNode) {
          svg.select('.pointer')
            .attr('transform', `translate(${slowNode.x},${slowNode.y - 30})`);
        }
      }

      if (step === AlgorithmStep.FIND_MIDDLE) {
        const fastNode = nodes[pointers.fast] as any;
        if (fastNode) {
          svg.select('.pointer:nth-of-type(2)')
            .attr('transform', `translate(${fastNode.x},${fastNode.y - 30})`);
        }
      }

      if (step === AlgorithmStep.COMPARE) {
        const leftNode = nodes[pointers.left] as any;
        const rightNode = nodes[pointers.right] as any;
        
        if (leftNode) {
          svg.select('.pointer.left')
            .attr('transform', `translate(${leftNode.x},${leftNode.y - 30})`);
        }
        
        if (rightNode) {
          svg.select('.pointer.right')
            .attr('transform', `translate(${rightNode.x},${rightNode.y - 30})`);
        }
      }
    }

    // 拖拽事件处理
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // 根据算法阶段获取节点填充颜色
    function getNodeFill(index: number): string {
      if (step === AlgorithmStep.INITIALIZE) {
        return 'white';
      }
      
      if (step === AlgorithmStep.FIND_MIDDLE) {
        return index <= pointers.slow ? '#FFFACD' : 'white'; // 浅黄色标记已访问
      }
      
      if (step === AlgorithmStep.REVERSE_SECOND_HALF) {
        return index <= pointers.middleNode ? '#FFFACD' : '#E6E6FA'; // 前半部分黄色，后半部分淡紫色
      }
      
      if (step === AlgorithmStep.COMPARE) {
        // 根据比较结果着色
        if (index === pointers.left || index === pointers.right) {
          const comparisonIndex = Math.min(pointers.left, pointers.right);
          return result.comparisons[comparisonIndex] ? '#CCFFCC' : '#FFCCCC'; // 绿色表示匹配，红色表示不匹配
        }
        
        return index <= pointers.middleNode ? '#FFFACD' : '#E6E6FA';
      }
      
      if (step === AlgorithmStep.RESULT) {
        return result.isPalindrome ? '#CCFFCC' : '#FFCCCC'; // 整体结果颜色
      }
      
      return 'white';
    }

    // 清理函数
    return () => {
      simulation.stop();
    };
  }, [nodes, step, pointers, result, width, height]);

  return (
    <div className="linked-list-visualization">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LinkedListVisualization; 