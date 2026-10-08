import React from 'react';
import logo from '../../assets/logo-144.png';

interface EmptyStateProps {
  title: string;
  text?: string;
  action?: React.ReactNode;
  role?: 'status' | 'alert';
}

// Empty and error states of lists (mockups/v2/08-states.html): faded logo, title, hint, optional action.
const EmptyState: React.FC<EmptyStateProps> = ({ title, text, action, role = 'status' }) => (
  <div className="pm-empty" role={role}>
    <img src={logo} alt="" width={88} height={88} />
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {action}
  </div>
);

export default EmptyState;
