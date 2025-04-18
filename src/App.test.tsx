import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders palindrome linked list title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Palindrome Linked List/i);
  expect(titleElement).toBeInTheDocument();
});
