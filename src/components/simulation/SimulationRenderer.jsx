import React from 'react';
import FlowRenderer from './FlowRenderer';
import MatrixWrapper from './MatrixWrapper';

export default function SimulationRenderer({ lab }) {
  const type = lab.simulationType || 'flow';
  const config = lab.simulationConfig || {};

  switch (type) {
    case 'flow':
      return <FlowRenderer config={config} />;
    case 'matrix-multiplication':
      return <MatrixWrapper config={config} />;
    case 'cnn':
      return <div className="h-full flex items-center justify-center text-gray-400">CNN Simulation Engine (Coming Soon)</div>;
    case 'blockchain':
      return <div className="h-full flex items-center justify-center text-gray-400">Blockchain Visualization (Coming Soon)</div>;
    case 'linear-regression':
      // The native linear regression route overrides the parameterized slug route in App.jsx.
      // This will only be hit if routed dynamically but we usually catch it above.
      return <div className="h-full flex items-center justify-center text-gray-400">Please launch from native linear regression route.</div>;
    default:
      if (config && config.nodes && config.edges) {
        return <FlowRenderer config={config} />;
      }
      return <div className="h-full flex items-center justify-center text-gray-400">Unknown Simulation Type: {type}</div>;
  }
}
