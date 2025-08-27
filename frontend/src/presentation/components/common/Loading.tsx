import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="loading">
      <div className="loading__spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default Loading;