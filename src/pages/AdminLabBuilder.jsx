import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider, useNodesState, useEdgesState } from '@xyflow/react';
import BuilderCanvas from '../components/lab-builder/BuilderCanvas';
import NodePanel from '../components/lab-builder/NodePanel';
import PropertiesPanel from '../components/lab-builder/PropertiesPanel';

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function AdminLabBuilder() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [labId, setLabId] = useState(null);
  
  const [labDetails, setLabDetails] = useState({ 
    title: '', 
    slug: '', 
    description: '', 
    simulationType: 'flow',
    category: 'Custom',
    difficulty: 'Beginner'
  });

  useEffect(() => {
    if (slug) {
      fetch(`http://localhost:5000/api/labs/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data._id) {
            setLabId(data._id);
            setLabDetails({
               title: data.title,
               slug: data.slug,
               description: data.description,
               simulationType: data.simulationType || 'flow',
               category: data.category || 'Custom',
               difficulty: data.difficulty || 'Beginner'
            });
            if (data.simulationConfig) {
               if (data.simulationConfig.nodes) {
                 setNodes(data.simulationConfig.nodes);
                 // ensure getId doesn't overlap existing nodes
                 const maxId = Math.max(...data.simulationConfig.nodes.map(n => parseInt(n.id.replace('dndnode_', '')) || 0));
                 if (maxId && maxId >= id) id = maxId + 1;
               }
               if (data.simulationConfig.edges) setEdges(data.simulationConfig.edges);
            }
          }
        }).catch(err => console.error(err));
    }
  }, [slug, setNodes, setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onSelectionChange = useCallback(({ nodes }) => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, []);

  const saveSimulation = async () => {
    if (!labDetails.title) return alert('Please enter a title for the lab');
    
    try {
      const payload = {
        ...labDetails,
        simulationConfig: { nodes, edges },
      };
      
      const url = labId ? `http://localhost:5000/api/labs/${labId}` : 'http://localhost:5000/api/labs';
      const method = labId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) alert('Saved successfully!');
      else {
        const data = await res.json();
        alert('Failed to save: ' + (data.message || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert('Error saving simulation configuration.');
    }
  };

  return (
    <div className="flex flex-col h-screen pt-20 bg-[#05010a] text-white animate-page-enter">
      {/* Header bar */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-white/10 bg-[#0a0510]/80 z-20">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#00e5ff]">Dynamic Lab Builder</h1>
          <p className="text-xs text-gray-400">Design your simulation visually</p>
        </div>
        <div className="flex gap-4 items-center">
           <input 
             className="bg-black/50 border border-white/20 p-2 rounded text-sm text-white focus:outline-none focus:border-purple-500 w-64" 
             placeholder="Lab Title" 
             value={labDetails.title}
             onChange={e => setLabDetails({...labDetails, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
           />
           <button onClick={saveSimulation} className="btn-primary text-sm px-6 hover:scale-105">Save Lab</button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-grow overflow-hidden relative">
        <NodePanel />
        
        <div className="flex-grow relative h-full bg-[#120a1f]/50" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <div className="h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
              <BuilderCanvas 
                  nodes={nodes} 
                  setNodes={setNodes} 
                  edges={edges} 
                  setEdges={setEdges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  setReactFlowInstance={setReactFlowInstance}
                  onSelectionChange={onSelectionChange}
              />
            </div>
          </ReactFlowProvider>
        </div>

        <PropertiesPanel selectedNode={selectedNode} setNodes={setNodes} setEdges={setEdges} />
      </div>
    </div>
  );
}
