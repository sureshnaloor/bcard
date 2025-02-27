// app/error-layout.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';

export default function ErrorLayout({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    window.onerror = () => {
      setHasError(true);
    };

    return () => {
      window.onerror = null;
    };
  }, []);

  if (hasError) {
    return (
      <div className="error-container">
        <h1>Something went wrong</h1>
        <p>We apologize for the inconvenience. Please try again later.</p>
        <button onClick={() => window.location.href = '/'}>
          Return to homepage
        </button>
      </div>
    );
  }

  return <>{children}</>;
}