import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

it('should show login page', () => {
  const { getByText } = render(<App />);
  expect(getByText('Welcome'));
  expect(getByText('Login With Microsoft'));
});
