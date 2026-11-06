import styled from 'styled-components';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

const Button = ({ children = 'Sign in', type = 'button', ...props }: ButtonProps) => {
  return (
    <StyledButton type={type} {...props}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  font-size: 1rem;
  color: #fafafa;
  text-transform: uppercase;
  padding: 10px 20px;
  border-radius: 10px;
  border: 2px solid #fafafa;
  background: #11d490;
  box-shadow: 3px 3px #fafafa;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }

  &:active {
    box-shadow: none;
    transform: translate(3px, 3px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export default Button;
