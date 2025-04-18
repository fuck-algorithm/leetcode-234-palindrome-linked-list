import React from 'react';
import LinkedListNode from './LinkedListNode';

interface NodeData<T> {
  value: T;
  position: number;
}

interface ArrowProps {
  width?: number;
  color?: string;
  showPointerLabel?: boolean;
  isNullPointer?: boolean;
}

const Arrow: React.FC<ArrowProps> = ({ 
  width = 40, 
  color = '#2c3e50', 
  showPointerLabel = false,
  isNullPointer = false
}) => {
  if (isNullPointer) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          margin: '0 5px',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '2px',
            backgroundColor: '#95a5a6',
            position: 'relative',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '-4px',
              width: 0,
              height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '8px solid #95a5a6',
            }}
          />
        </div>
        <div style={{
          marginLeft: '8px',
          color: '#7f8c8d',
          fontSize: '14px',
          fontFamily: 'monospace',
          padding: '3px 8px',
          backgroundColor: '#ecf0f1',
          borderRadius: '4px',
          fontWeight: 'bold',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          NULL
        </div>
      </div>
    );
  }

  // 使用渐变色彩
  const arrowGradient = color === '#3498db' ? 
    'linear-gradient(90deg, #3498db, #2980b9)' : 
    'linear-gradient(90deg, #16a085, #1abc9c)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 5px',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: '3px',
          background: arrowGradient,
          position: 'relative',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          borderRadius: '1.5px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-1px',
            top: '-5px',
            width: 0,
            height: 0,
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
            borderLeft: `10px solid ${color === '#3498db' ? '#2980b9' : '#1abc9c'}`,
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
          }}
        />
        {showPointerLabel && (
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              width: '100%',
              textAlign: 'center',
              fontSize: '12px',
              color: color,
              fontWeight: 'bold',
              textShadow: '0 1px 1px rgba(255,255,255,0.8)'
            }}
          >
            引用
          </div>
        )}
      </div>
    </div>
  );
};

interface LinkedListVisualizerProps<T> {
  nodes: NodeData<T>[];
  highlightedNodes?: number[];
  comparedNodes?: { left: number; right: number }[];
  nodeSize?: number;
}

const LinkedListVisualizer = <T extends React.ReactNode>({
  nodes,
  highlightedNodes = [],
  comparedNodes = [],
  nodeSize = 50,
}: LinkedListVisualizerProps<T>): React.ReactElement => {
  // Function to check if a node is being compared
  const isCompared = (position: number): boolean => {
    return comparedNodes.some(
      (pair) => pair.left === position || pair.right === position
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowX: 'auto',
        maxWidth: '100%',
      }}
    >
      {nodes.map((node, index) => (
        <React.Fragment key={index}>
          <LinkedListNode
            value={node.value}
            position={node.position}
            highlighted={highlightedNodes.includes(node.position)}
            compared={isCompared(node.position)}
            nodeSize={nodeSize}
          />
          {index < nodes.length - 1 && (
            <Arrow 
              width={40} 
              color={highlightedNodes.includes(node.position) ? '#3498db' : '#2c3e50'} 
              showPointerLabel={false}
            />
          )}
          {index === nodes.length - 1 && (
            <Arrow 
              isNullPointer={true}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default LinkedListVisualizer; 