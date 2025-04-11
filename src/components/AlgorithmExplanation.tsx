import React from 'react';
import { StepType } from '../utils/palindromeChecker';

interface AlgorithmExplanationProps {
  currentStep: string;
  algorithm?: 'array' | 'pointer';
}

const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({ 
  currentStep, 
  algorithm = 'pointer'
}) => {
  const getExplanation = (step: string): { title: string; text: string } => {
    if (algorithm === 'array') {
      switch (step) {
        case StepType.INITIAL:
          return {
            title: '问题：检查链表是否为回文',
            text: `
              回文是指从前往后读和从后往前读是一样的序列。
              对于链表，我们需要检查其中的值是否构成回文序列。
              这里我们将使用数组复制法来解决这个问题。
            `,
          };
        case StepType.ARRAY_COPY_START:
          return {
            title: '步骤1：复制链表值到数组',
            text: `
              为了判断链表是否为回文，我们首先将链表的所有值复制到一个数组中：
              - 从链表头开始遍历每个节点
              - 将每个节点的值添加到数组末尾
              - 这样我们得到一个与链表值顺序相同的数组
              
              复制到数组的好处是可以通过索引随机访问元素，而链表只能按顺序访问。
            `,
          };
        case StepType.ARRAY_COPY_COMPLETE:
          return {
            title: '步骤1：链表值复制到数组（完成）',
            text: `
              现在我们已经将链表的所有值都复制到了数组中：
              - 数组中的元素顺序与链表中的节点值顺序相同
              - 数组的长度等于链表的节点数量
              - 我们可以通过索引直接访问数组中的任何元素
            `,
          };
        case StepType.ARRAY_COMPARE_START:
          return {
            title: '步骤2：开始使用双指针比较数组元素',
            text: `
              使用双指针法判断数组是否为回文：
              - 一个指针从数组开始（左指针）
              - 一个指针从数组末尾（右指针）
              - 两个指针向中间移动并比较对应元素是否相等
              
              这种方法非常直观：如果是回文，则对称位置的元素应该相等。
            `,
          };
        case StepType.ARRAY_COMPARE_STEP:
          return {
            title: '步骤2：双指针比较数组元素（进行中）',
            text: `
              比较的过程：
              - 比较arr[left]和arr[right]的值是否相等
              - 如果不相等，数组不是回文，也就意味着链表不是回文
              - 如果相等，将左指针右移（left++），右指针左移（right--）
              - 继续比较，直到两个指针相遇或交叉
            `,
          };
        case StepType.ARRAY_COMPARE_COMPLETE:
          return {
            title: '步骤2：双指针比较数组元素（完成）',
            text: `
              比较已经完成：
              - 如果所有对称位置的元素都相等，数组是回文，链表也是回文
              - 如果发现任何一对不相等的元素，数组不是回文，链表也不是回文
              
              这种方法的优点是简单直观，缺点是需要O(n)的额外空间来存储数组。
            `,
          };
        default:
          return {
            title: '回文链表检查 - 数组方法',
            text: '请选择一个步骤来查看详细解释。',
          };
      }
    }
    
    switch (step) {
      case StepType.INITIAL:
        return {
          title: '问题：检查链表是否为回文',
          text: `
            回文是指从前往后读和从后往前读是一样的序列。
            对于链表，我们需要检查其中的值是否构成回文序列。
            让我们探索如何高效地解决这个问题。
          `,
        };
      case StepType.FIND_MIDDLE_START:
        return {
          title: '步骤1：开始查找链表的中间节点',
          text: `
            我们使用"快慢指针"技术找到链表的中间位置：
            - 慢指针(slow)和快指针(fast)都从链表的头节点开始
            - 在循环中，慢指针每次移动一步，快指针每次移动两步
            - 当快指针到达链表末尾时，慢指针将指向中间位置
          `,
        };
      case StepType.FIND_MIDDLE_STEP:
        return {
          title: '步骤1：查找链表的中间节点（进行中）',
          text: `
            查找中间节点的循环过程：
            - 慢指针(slow)每次向前移动一个节点：slow = slow.next
            - 快指针(fast)每次向前移动两个节点：fast = fast.next.next
            - 当fast.next为空或fast.next.next为空时，循环结束
            - 对于偶数长度的链表，需要额外将slow再向前移动一步
          `,
        };
      case StepType.FIND_MIDDLE_COMPLETE:
        return {
          title: '步骤1：找到链表的中间节点（完成）',
          text: `
            现在慢指针(slow)已经指向了链表的中间位置：
            - 对于奇数长度的链表，slow指向正中间的节点
            - 对于偶数长度的链表，slow指向中间偏右的节点
            - 从这个位置开始，我们将反转后半部分链表
          `,
        };
      case StepType.REVERSE_START:
        return {
          title: '步骤2：开始反转链表的后半部分',
          text: `
            我们需要反转从中间节点开始的后半部分链表：
            - 初始化三个指针：prev = null, current = slow, next = null
            - prev将记录当前节点的前一个节点
            - current是当前正在处理的节点
            - next用于临时保存current的下一个节点
          `,
        };
      case StepType.REVERSE_STEP:
        return {
          title: '步骤2：反转链表的后半部分（进行中）',
          text: `
            反转链表的每一步包括：
            1. 保存current的下一个节点：next = current.next
            2. 改变current的next指针，指向prev：current.next = prev
            3. 移动prev指针到current：prev = current
            4. 移动current指针到next：current = next
            
            这个过程会逐步反转链表中的指针方向。
          `,
        };
      case StepType.REVERSE_COMPLETE:
        return {
          title: '步骤2：反转链表的后半部分（完成）',
          text: `
            链表后半部分已经成功反转：
            - 当current变为null时，反转完成
            - prev现在指向反转后的链表头部（原来的链表尾部）
            - 原来的链表结构已经改变，后半部分的所有next指针都被反转
          `,
        };
      case StepType.COMPARE_START:
        return {
          title: '步骤3：开始比较前半部分和反转后的后半部分',
          text: `
            现在我们准备开始比较：
            - 从原始链表的头节点(firstHalf)开始遍历前半部分
            - 从反转后的链表头节点(prev)开始遍历后半部分
            - 同步比较这两个部分的对应节点值
          `,
        };
      case StepType.COMPARE_STEP:
        return {
          title: '步骤3：比较前半部分和反转后的后半部分（进行中）',
          text: `
            比较的过程：
            - 判断firstHalf.val是否等于secondHalf.val
            - 如果两个值不相等，说明链表不是回文
            - 如果相等，继续移动两个指针到下一个节点
            - 继续比较直到secondHalf变为null
          `,
        };
      case StepType.COMPARE_COMPLETE:
        return {
          title: '步骤3：比较前半部分和反转后的后半部分（完成）',
          text: `
            比较已经完成：
            - 如果所有节点值比较都相等，链表是回文
            - 如果发现任何一对不相等的节点值，链表不是回文
            - 在实际实现中，我们通常应该将链表还原回原始状态（通过再次反转后半部分）
          `,
        };
      default:
        return {
          title: '回文链表检查 - 快慢指针方法',
          text: '请选择一个步骤来查看详细解释。',
        };
    }
  };

  const explanation = getExplanation(currentStep);

  const getComplexityAnalysis = () => {
    if (algorithm === 'array') {
      return (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: '#2c3e50' }}>时间和空间复杂度：</h4>
          <ul style={{ color: '#34495e', lineHeight: '1.5' }}>
            <li><strong>时间复杂度：</strong> O(n) - 我们需要遍历链表一次将值复制到数组，然后遍历数组的一半来比较</li>
            <li><strong>空间复杂度：</strong> O(n) - 我们需要额外的空间来存储链表中的所有值</li>
            <li><strong>优点：</strong> 实现简单，易于理解</li>
            <li><strong>缺点：</strong> 需要额外的O(n)空间</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: '#2c3e50' }}>时间和空间复杂度：</h4>
          <ul style={{ color: '#34495e', lineHeight: '1.5' }}>
            <li><strong>时间复杂度：</strong> O(n) - 我们只需遍历链表固定的次数</li>
            <li><strong>空间复杂度：</strong> O(1) - 我们只使用固定数量的额外空间，与输入大小无关</li>
            <li><strong>优点：</strong> 空间复杂度低，只需O(1)的额外空间</li>
            <li><strong>缺点：</strong> 实现较复杂，且修改了输入链表的结构（虽然在最后可以恢复）</li>
          </ul>
        </div>
      );
    }
  };

  return (
    <div
      className="algorithm-explanation"
      style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ marginTop: 0, color: '#2c3e50' }}>{explanation.title}</h3>
      <p style={{ lineHeight: '1.6', color: '#34495e', whiteSpace: 'pre-line' }}>
        {explanation.text}
      </p>
      
      {getComplexityAnalysis()}
    </div>
  );
};

export default AlgorithmExplanation; 