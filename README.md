# LeetCode 234: Palindrome Linked List Visualization

An interactive visualization of the algorithm to check if a linked list is a palindrome.

## About the Project

This project uses React, TypeScript, and D3.js to provide an interactive and educational visualization of the algorithm used to solve LeetCode problem #234: Palindrome Linked List.

The problem asks us to determine if a singly linked list is a palindrome (reads the same backward as forward). The efficient solution uses the following steps:

1. Find the middle of the linked list using the slow and fast pointer technique
2. Reverse the second half of the linked list
3. Compare the first half with the reversed second half
4. Determine if the linked list is a palindrome based on the comparison

## Features

- Interactive visualization of each step of the algorithm
- Input custom linked lists to test if they are palindromes
- Step-by-step explanation of how the algorithm works
- Control the animation speed and step through the algorithm manually or automatically
- Visual indications of compared nodes
- Detailed explanation of time and space complexity

## Getting Started

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/leetcode-234-palindrome-linked-list.git

# Navigate to the project directory
cd leetcode-234-palindrome-linked-list

# Install dependencies
npm install

# Start the development server
npm start
```

## Project Structure

The project is organized with a modular architecture:

- `src/models/`: Data models for LinkedList and ListNode
- `src/utils/`: Algorithm implementations
- `src/components/`: React components for UI elements
- `src/visualizations/`: D3.js visualizations

## How to Use

1. Enter a comma-separated list of numbers in the input field
2. Click "Create List" to generate the linked list
3. View the result showing whether the list is a palindrome
4. Use the Previous/Next buttons to navigate through the algorithm steps
5. Click "Auto Play" to watch the algorithm execute automatically
6. Adjust the speed slider to control the animation speed
7. Read the explanations to understand each step of the algorithm

## Algorithm Details

The solution has:

- **Time Complexity**: O(n) - where n is the length of the linked list
- **Space Complexity**: O(1) - the algorithm uses constant extra space

## License

This project is licensed under the MIT License - see the LICENSE file for details.
## 开发规范

本项目采用严格的编码规范，确保代码的可维护性和可读性：

1. **语言规范**：
   - 所有代码注释、文档和交流必须使用中文

2. **模块化要求**：
   - 单个文件不超过200行代码
   - 超过限制的文件必须重构为更小的模块

3. **详细规范**：
   - 完整的开发规范请参考[CURSOR_RULE.md](./CURSOR_RULE.md)文件
   - 所有贡献者必须遵循该规范
