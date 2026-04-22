import InputNode from '../nodes/InputNode';
import ProcessNode from '../nodes/ProcessNode';
import OutputNode from '../nodes/OutputNode';
import LogicNode from '../nodes/LogicNode';
import ComparisonNode from '../nodes/ComparisonNode';
import MatrixInputNode from '../nodes/MatrixInputNode';
import MatrixOutputNode from '../nodes/MatrixOutputNode';
import MatrixOperationNode from '../nodes/MatrixOperationNode';
import CNNNode from '../nodes/CNNNode';
import ConsoleLogNode from '../nodes/ConsoleLogNode';
import TextInputNode from '../nodes/TextInputNode';
import ArrayInputNode from '../nodes/ArrayInputNode';
import ChartOutputNode from '../nodes/ChartOutputNode';
import TransformNode from '../nodes/TransformNode';

export const NodeRegistry = {
  'input-number': {
    category: 'input',
    label: 'Number Input',
    component: InputNode,
    configSchema: [
       { key: 'value', label: 'Default Starting Value', type: 'number', defaultValue: 0 }
    ],
    execute: async (inputs, config, nodeData) => {
       // Input nodes yield their own local runtime value, ignoring parent inputs
       return Number(nodeData.value) || 0;
    }
  },
  'math-operation': {
    category: 'process',
    label: 'Math Operation',
    component: ProcessNode,
    configSchema: [
       { 
         key: 'operation', 
         label: 'Operation Method',
         type: 'select', 
         options: [
           { value: 'add', label: 'Addition (+)' },
           { value: 'subtract', label: 'Subtraction (-)' },
           { value: 'multiply', label: 'Multiplication (×)' },
           { value: 'divide', label: 'Division (÷)' },
           { value: 'power', label: 'Power (^)' },
           { value: 'mod', label: 'Modulus (%)' }
         ],
         defaultValue: 'add'
       }
    ],
    execute: async (inputs, config) => {
       const vals = Object.values(inputs);
       if (vals.length === 0) return 0;

       const op = config?.operation || 'add';
       if (op === 'add') return vals.reduce((a, b) => a + b, 0);
       if (op === 'subtract') return vals.reduce((a, b) => a - b);
       if (op === 'multiply') return vals.reduce((a, b) => a * b, 1);
       if (op === 'power') return vals.reduce((a, b) => Math.pow(a, b));
       if (op === 'mod') return vals.reduce((a, b) => b === 0 ? a : a % b);
       if (op === 'divide') {
           return vals.reduce((a, b) => b === 0 ? a : a / b); // prevent divide by zero crash
       }
       return vals[0];
    }
  },
  'output-display': {
    category: 'output',
    label: 'Yield Display',
    component: OutputNode,
    configSchema: [], // Output nodes just render results visually natively
    execute: async (inputs) => {
       const vals = Object.values(inputs);
       return vals.length > 0 ? vals[0] : 0;
    }
  },
  'logic-operation': {
    category: 'control',
    label: 'Logic Gate (AND/OR)',
    component: LogicNode,
    configSchema: [
       { 
         key: 'operation', 
         label: 'Logic Gate',
         type: 'select', 
         options: [
           { value: 'AND', label: 'Logical AND' },
           { value: 'OR', label: 'Logical OR' },
           { value: 'NOT', label: 'Logical NOT (Invert)' }
         ],
         defaultValue: 'AND'
       }
    ],
    execute: async (inputs, config) => {
       const vals = Object.values(inputs);
       const op = config?.operation || 'AND';
       
       if (op === 'NOT') {
          return vals.length > 0 ? !Boolean(vals[0]) : true;
       }
       
       if (vals.length === 0) return false;
       if (op === 'AND') return vals.every(v => Boolean(v));
       if (op === 'OR') return vals.some(v => Boolean(v));
       return false;
    }
  },
  'compare-operation': {
    category: 'process',
    label: 'Comparison (>, <, ==)',
    component: ComparisonNode,
    configSchema: [
       { 
         key: 'operation', 
         label: 'Condition Block',
         type: 'select', 
         options: [
           { value: '>', label: 'Greater Than (>)' },
           { value: '<', label: 'Less Than (<)' },
           { value: '>=', label: 'Greater or Equal (>=)' },
           { value: '<=', label: 'Less or Equal (<=)' },
           { value: '==', label: 'Equals (==)' },
           { value: '!=', label: 'Not Equals (!=)' }
         ],
         defaultValue: '>'
       }
    ],
    execute: async (inputs, config) => {
       const vals = Object.values(inputs);
       if (vals.length < 2) return false; // Comparisons require exactly two edges typically
       
       const op = config?.operation || '>';
       const a = vals[0];
       const b = vals[1];

       if (op === '>') return a > b;
       if (op === '<') return a < b;
       if (op === '>=') return a >= b;
       if (op === '<=') return a <= b;
       if (op === '==') return a == b;
       if (op === '!=') return a != b;
       
       return false;
    }
  },
  'matrix-input': {
    category: 'input',
    label: '2D Matrix Generator',
    component: MatrixInputNode,
    configSchema: [
       { key: 'rows', label: 'Rows', type: 'number', defaultValue: 2 },
       { key: 'columns', label: 'Columns', type: 'number', defaultValue: 2 }
    ],
    execute: async (inputs, config, nodeData) => {
       return Array.isArray(nodeData.value) ? nodeData.value : [[0,0],[0,0]];
    }
  },
  'matrix-operation': {
    category: 'process',
    label: 'Tensor Math Core',
    component: MatrixOperationNode,
    configSchema: [
       { 
         key: 'operation', 
         label: 'Tensor Method',
         type: 'select', 
         options: [
           { value: 'multiply', label: 'Dot Product (×)' },
           { value: 'transpose', label: 'Transpose (T)' },
           { value: 'determinant', label: 'Determinant |A|' }
         ],
         defaultValue: 'multiply'
       }
    ],
    execute: async (inputs, config) => {
       const vals = Object.values(inputs);
       if (vals.length === 0 || !Array.isArray(vals[0])) return null; // Abort invalid routes safely
       
       const op = config?.operation || 'multiply';
       const A = vals[0];
       
       if (op === 'transpose') {
          return A[0].map((_, colIndex) => A.map(row => row[colIndex]));
       }
       if (op === 'determinant') {
          if (A.length !== A[0].length) return NaN; // must be square
          // simple 2x2 for demo safely avoiding full alg bounds complexity here perfectly
          if (A.length === 2) return (A[0][0]*A[1][1]) - (A[0][1]*A[1][0]);
          return 0; 
       }
       if (op === 'multiply') {
          if (vals.length < 2 || !Array.isArray(vals[1])) return null;
          const B = vals[1];
          // Dot Product:
          if (A[0].length !== B.length) return null; // Invalid dimensions
          const rowsA = A.length, colsA = A[0].length, colsB = B[0].length;
          let C = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));
          for (let i = 0; i < rowsA; i++) {
             for (let j = 0; j < colsB; j++) {
                for (let k = 0; k < colsA; k++) C[i][j] += (A[i][k] * B[k][j]);
             }
          }
          return C;
       }
       return null;
    }
  },
  'matrix-output': {
    category: 'output',
    label: 'Tensor Visualizer',
    component: MatrixOutputNode,
    configSchema: [],
    execute: async (inputs) => {
       const vals = Object.values(inputs);
       return vals.length > 0 ? vals[0] : null;
    }
  },
  'ai-layer': {
    category: 'machine-learning',
    label: 'Neural Network Layer',
    component: CNNNode,
    configSchema: [
       { 
         key: 'layerType', 
         label: 'Layer Classification',
         type: 'select', 
         options: [
           { value: 'Dense (Linear)', label: 'Fully Connected (Dense)' },
           { value: 'Conv2D', label: 'Convolutional 2D' },
           { value: 'MaxPooling', label: 'Max Pooling Layer' },
           { value: 'Dropout', label: 'Dropout Core' }
         ],
         defaultValue: 'Dense (Linear)'
       },
       { key: 'nodes', label: 'Parameter Count (Neurons)', type: 'number', defaultValue: 32 }
    ],
    execute: async (inputs, config) => {
       // Deep learning passthrough abstraction
       const vals = Object.values(inputs);
       return vals.length > 0 ? vals[0] : 0;
    }
  },
  'console-log': {
    category: 'output',
    label: 'Console Logger',
    component: ConsoleLogNode,
    configSchema: [
       { key: 'prefix', label: 'Log Tag', type: 'string', defaultValue: 'INFO:' }
    ],
    execute: async (inputs) => {
       const vals = Object.values(inputs);
       const val = vals.length > 0 ? vals[0] : null;
       console.log("SIMULATION LOG:", val);
       return val; // pass through cleanly so operations can continue downstream if hooked
    }
  },
  'text-input': {
    category: 'input',
    label: 'String Input',
    component: TextInputNode,
    configSchema: [],
    execute: async (inputs, config, nodeData) => {
       return String(nodeData.value || '');
    }
  },
  'array-input': {
    category: 'input',
    label: 'Array Generator',
    component: ArrayInputNode,
    configSchema: [],
    execute: async (inputs, config, nodeData) => {
       const raw = String(nodeData.value || '');
       if (!raw) return [];
       return raw.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
    }
  },
  'chart-output': {
    category: 'output',
    label: 'Bar Chart Renderer',
    component: ChartOutputNode,
    configSchema: [],
    execute: async (inputs) => {
       const vals = Object.values(inputs);
       return vals.length > 0 ? vals[0] : null;
    }
  },
  'transform-operation': {
    category: 'process',
    label: 'Array Transform Pipeline',
    component: TransformNode,
    configSchema: [
       { 
         key: 'operation', 
         label: 'Method',
         type: 'select', 
         options: [
           { value: 'map_multiply', label: 'Map: Multiply By Param' },
           { value: 'filter_greater', label: 'Filter: Greater Than Param' },
           { value: 'reduce_sum', label: 'Reduce: Sum All (Ignore Param)' }
         ],
         defaultValue: 'map_multiply'
       },
       { key: 'param', label: 'Parameter Threshold', type: 'number', defaultValue: 2 }
    ],
    execute: async (inputs, config) => {
       const vals = Object.values(inputs);
       if (vals.length === 0) return null;
       const arr = Array.isArray(vals[0]) ? vals[0] : [vals[0]];
       
       const op = config?.operation || 'map_multiply';
       const param = Number(config?.param || 2);
       
       if (op === 'map_multiply') return arr.map(x => x * param);
       if (op === 'filter_greater') return arr.filter(x => x > param);
       if (op === 'reduce_sum') return arr.reduce((a, b) => a + b, 0);
       return arr;
    }
  },
  'merge-operation': {
    category: 'control',
    label: 'Merge to Array',
    component: ProcessNode,
    configSchema: [],
    execute: async (inputs) => {
       // Just takes all inputs and wraps them in an array
       return Object.values(inputs);
    }
  }
};

// --- BACKWARD COMPATIBILITY TRANSFORMER ---
// Runs securely on flow JSON data on mount exactly avoiding legacy node type crashes
export const transformLegacyNodes = (nodes) => {
  return nodes.map(node => {
     let newType = node.type;
     if (node.type === 'input') newType = 'input-number';
     if (node.type === 'default' || node.type === 'custom') newType = 'math-operation';
     if (node.type === 'output') newType = 'output-display';
     
     return {
        ...node,
        type: newType,
        data: {
           ...node.data,
           config: node.data.config || {}
        }
     };
  });
};
