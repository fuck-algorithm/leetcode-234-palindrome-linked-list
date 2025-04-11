import React from 'react';

interface LinkedListNodeProps<T> {
  value: T;
  position: number;
  highlighted?: boolean;
  compared?: boolean;
  nodeSize?: number;
}

const LinkedListNode = <T extends React.ReactNode>({
  value,
  position,
  highlighted = false,
  compared = false,
  nodeSize = 50
}: LinkedListNodeProps<T>): React.ReactElement => {
  // 计算节点的宽度和高度
  const nodeHeight = nodeSize;
  const nodeWidth = nodeSize * 2;
  const valueCircleSize = nodeSize * 0.8;
  
  // 定义颜色方案
  const colors = {
    value: {
      border: compared ? '#e74c3c' : highlighted ? '#3498db' : '#2980b9',
      background: compared ? 'linear-gradient(135deg, #fadbd8, #f5b7b1)' : 
                  highlighted ? 'linear-gradient(135deg, #d6eaf8, #aed6f1)' : 
                  'linear-gradient(135deg, #e8f8f5, #a3e4d7)',
      text: compared ? '#c0392b' : highlighted ? '#2471a3' : '#1a5276'
    },
    pointer: {
      border: compared ? '#e74c3c' : highlighted ? '#3498db' : '#16a085',
      background: compared ? 'linear-gradient(135deg, #fdedec, #f9ebea)' : 
                  highlighted ? 'linear-gradient(135deg, #ebf5fb, #d6eaf8)' : 
                  'linear-gradient(135deg, #e8f8f5, #d1f2eb)',
      text: compared ? '#c0392b' : highlighted ? '#2471a3' : '#0e6655'
    },
    connector: compared ? '#c0392b' : highlighted ? '#2471a3' : '#16a085'
  };
  
  // 节点容器样式
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    margin: '0 5px',
  };
  
  // 节点样式（包含值和指针）
  const nodeStyle: React.CSSProperties = {
    width: `${nodeWidth}px`,
    height: `${nodeHeight}px`,
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  };
  
  // 值部分样式（圆形）
  const valueStyle: React.CSSProperties = {
    width: `${valueCircleSize}px`,
    height: `${valueCircleSize}px`,
    borderRadius: '50%',
    border: `2px solid ${colors.value.border}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: colors.value.background,
    fontSize: `${valueCircleSize / 2.5}px`,
    fontWeight: 'bold',
    color: colors.value.text,
    marginRight: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  // 指针部分样式（矩形）
  const pointerStyle: React.CSSProperties = {
    width: `${nodeWidth - valueCircleSize - 4}px`,
    height: `${nodeHeight * 0.8}px`,
    border: `2px solid ${colors.pointer.border}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: colors.pointer.background,
    fontSize: `${valueCircleSize / 3}px`,
    fontWeight: 'bold',
    color: colors.pointer.text,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: '4px'
  };
  
  // 连接线样式
  const connectorStyle: React.CSSProperties = {
    width: '6px',
    height: '2px',
    backgroundColor: colors.connector,
  };
  
  // 位置标签样式
  const labelStyle: React.CSSProperties = {
    marginTop: '5px',
    fontSize: `${nodeSize / 3}px`,
    color: '#7f8c8d',
    fontWeight: 'bold'
  };

  return (
    <div style={containerStyle}>
      <div style={nodeStyle}>
        <div style={valueStyle}>{value}</div>
        <div style={connectorStyle} />
        <div style={pointerStyle}>next</div>
      </div>
      <div style={labelStyle}>{position}</div>
    </div>
  );
};

export default LinkedListNode; 