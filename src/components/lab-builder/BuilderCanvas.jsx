import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function BuilderCanvas({ nodes, setNodes, edges, setEdges, onNodesChange, onEdgesChange, setReactFlowInstance, onSelectionChange, nodeTypes }) {
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onSelectionChange={onSelectionChange}
        fitView
      >
        <Controls className="bg-black border border-white/20" />
        <MiniMap nodeStrokeColor="#6865A5" nodeColor="#A855F7" maskColor="rgba(0,0,0,0.5)" style={{ backgroundColor: '#0a0510' }} />
        <Background variant="dots" gap={12} size={1} color="#6b7280"/>
      </ReactFlow>
    </div>
  );
}
