import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import InputNode from './nodes/InputNode';
import ProcessNode from './nodes/ProcessNode';
import OutputNode from './nodes/OutputNode';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import dagre from 'dagre';

const nodeTypes = {
  input: InputNode,
  default: ProcessNode,
  output: OutputNode,
  custom: ProcessNode // Fallback custom to process natively
};

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // LR = Left to Right diagram flow, exactly what you want for DAGs
  dagreGraph.setGraph({ rankdir: 'LR', align: 'UL', nodesep: 100, ranksep: 200 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 220, height: 120 }); // Avg bounds of Custom Nodes
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 220 / 2,
        y: nodeWithPosition.y - 120 / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

export default function FlowRenderer({ config }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (config?.nodes && config?.edges) {
      // Intelligently auto-layout the user's messy CMS mappings using dagre
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        config.nodes,
        config.edges
      );
      
      setNodes(layoutedNodes.map(n => ({
        ...n,
        data: {
          ...n.data,
          status: 'idle',
          result: undefined,
          value: n.data.value || 0,
          onChangeLocal: (id, val) => {
            setNodes((nds) => nds.map(node => node.id === id ? { ...node, data: { ...node.data, value: val } } : node));
          }
        }
      })));

      setEdges(layoutedEdges.map(e => ({
        ...e,
        animated: false
      })));
    }
  }, [config, setNodes, setEdges]);

  const runSimulation = async () => {
    if (isExecuting) return;
    setIsExecuting(true);

    // Reset visually
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: 'idle', result: undefined } })));
    setEdges(eds => eds.map(e => ({ ...e, animated: true, style: { stroke: '#00e5ff', strokeWidth: 2 } })));
    await new Promise(r => setTimeout(r, 600));

    const inDegree = {};
    const adjList = {};
    
    nodes.forEach(n => {
      inDegree[n.id] = 0;
      adjList[n.id] = [];
    });

    edges.forEach(e => {
      if (adjList[e.source]) adjList[e.source].push(e.target);
      if (inDegree[e.target] !== undefined) inDegree[e.target]++;
    });

    const queue = nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
    const resolvedValues = {};

    while (queue.length > 0) {
      const currentId = queue.shift();

      // Trigger visual "Running Mode"
      setNodes(nds => nds.map(n => n.id === currentId ? { ...n, data: { ...n.data, status: 'running' } } : n));
      await new Promise(r => setTimeout(r, 800)); // Execution step delay mapping

      let finalResult;
      // Fetch latest node state to cleanly read inputs avoiding stale closures
      let latestNode;
      setNodes(nds => {
        latestNode = nds.find(n => n.id === currentId);
        return nds;
      });

      if (latestNode.type === 'input') {
        finalResult = Number(latestNode.data.value) || 0;
      } else if (latestNode.type === 'default' || latestNode.type === 'custom') {
        const inboundEdges = edges.filter(e => e.target === currentId);
        const inboundValues = inboundEdges.map(e => resolvedValues[e.source] || 0);

        const op = latestNode.data.config?.operation || 'add';
        if (inboundValues.length === 0) {
            finalResult = 0;
        } else if (op === 'add') {
            finalResult = inboundValues.reduce((a, b) => a + b, 0);
        } else if (op === 'subtract') {
            finalResult = inboundValues.reduce((a, b) => a - b);
        } else if (op === 'multiply') {
            finalResult = inboundValues.reduce((a, b) => a * b, 1);
        } else if (op === 'divide') {
            finalResult = inboundValues.reduce((a, b) => a / b);
        } else {
            finalResult = inboundValues[0];
        }
      } else if (latestNode.type === 'output') {
        const inboundEdges = edges.filter(e => e.target === currentId);
        if (inboundEdges.length > 0) finalResult = resolvedValues[inboundEdges[0].source] || 0;
        else finalResult = 0;
      }

      resolvedValues[currentId] = finalResult;

      // Finish execution for node
      setNodes(nds => nds.map(n => n.id === currentId ? { ...n, data: { ...n.data, status: 'success', result: finalResult } } : n));
      await new Promise(r => setTimeout(r, 600));

      if (adjList[currentId]) {
        adjList[currentId].forEach(targetId => {
          inDegree[targetId]--;
          if (inDegree[targetId] === 0) queue.push(targetId);
        });
      }
    }

    // Freeze edge animations
    setEdges(eds => eds.map(e => ({ ...e, animated: false, style: { stroke: '#a855f7', strokeWidth: 1 } })));
    setIsExecuting(false);
  };

  return (
    <div className="w-full h-full bg-[#120a1f]/30 relative rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(108,43,217,0.1)]">
      
      {/* Floating Control Dashboard */}
      <div className="absolute top-6 right-6 z-10 flex gap-4 bg-[#0a0510]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
         <div className="flex flex-col justify-center px-2 border-r border-white/10 mr-2">
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff] uppercase tracking-wider mb-1 flex items-center gap-2">
               <AutoFixHighIcon fontSize="small"/> Flow Engine
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase">{isExecuting ? 'Engine Running...' : 'Idle System State'}</p>
         </div>
         <button 
           onClick={runSimulation}
           disabled={isExecuting || nodes.length === 0}
           className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${isExecuting ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-none' : 'bg-gradient-to-r from-purple-600 to-[#00e5ff] text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]'}`}
         >
            <PlayArrowIcon /> {isExecuting ? 'Processing...' : 'Run Simulation'}
         </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={!isExecuting} // Locking panning natively mapped down!
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={!isExecuting} // Strictly enforcing freeze rules requested
        zoomOnScroll={!isExecuting}
      >
        <Controls className="bg-[#110b27] border border-white/20 fill-white custom-react-flow-controls shadow-xl" showInteractive={false} />
        <MiniMap nodeStrokeColor="#6865A5" nodeColor="#A855F7" maskColor="rgba(0,0,0,0.5)" style={{ backgroundColor: '#0a0510' }} />
        <Background variant="dots" gap={12} size={1} color="#374151" />
      </ReactFlow>
    </div>
  );
}
