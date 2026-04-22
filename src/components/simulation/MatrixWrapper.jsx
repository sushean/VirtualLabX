import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MatrixWrapper({ config }) {
  const navigate = useNavigate();

  useEffect(() => {
    // We wrap matrix execution by using the existing robust Matrix multi-tab component.
    // By re-routing to it directly, we guarantee the user gets the identical complex experience.
    navigate('/labs/matrix-multiplication', { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-full items-center justify-center text-gray-400 bg-black">
      Redirecting to high-fidelity matrix engine...
    </div>
  );
}
