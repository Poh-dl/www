import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
} from "reactflow";
import { useDnD,DnDProvider } from '@/contexts/dnd';
import '@xyflow/react/dist/style.css';
import Customblock from './customblock';


  const initialNodes = [];

  let id = 0;
  const getId = () => `dndnode_${id++}`;  

  const nodeTypes = {
     blockNode: Customblock,
  };
  

export default function FlowBoard() {



    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [type] = useDnD();

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [],
      );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }, []);
    
     const onDrop = useCallback(
        (event) => {
          event.preventDefault();
          console.log(type,"type")
       
          const nodeType = event.dataTransfer.getData('application/reactflow'); // Retrieve the type from dataTransfer
          console.log(nodeType,"type")
          // check if the dropped element is valid
          if (!nodeType) {
            return;
          }
          const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
          const newNode = {
            id: getId(),
            type:'blockNode',
            position,
            data: { label: `${nodeType}` },
          };
          
          setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, type],
      );
  console.log()
  return (
    <div className='w-full h-screen' ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          style={{ backgroundColor: "#F7F9FB" }}
          nodeTypes={nodeTypes}

        >
            <Background />
            <Controls />
       </ReactFlow>
    </div>
  )
}