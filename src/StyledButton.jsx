import React from 'react';
import styled from 'styled-components';

export const StyledButton = styled('button')`
  color: white;
  padding: 40px;
  background: black;

  &[data-focus-visible-added]:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: red;
    box-shadow: green;
  }
`;
