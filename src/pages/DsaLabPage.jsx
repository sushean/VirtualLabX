import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WaveFooter from '../components/WaveFooter';
import { dsaTopicsData, dsaCategoryList } from '../data/dsaTopicsData';
import { dsaDeepDiveRegistry } from '../data/dsaDeepDiveRegistry';
import dsaArrayMemory from '../assets/dsa_array_memory.png';
import dsaLinkedList from '../assets/dsa_linked_list.png';
import dsaBstLayout from '../assets/dsa_bst_layout.png';
import dsaGraphNetwork from '../assets/dsa_graph_network.png';

// Icons
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import QuizIcon from '@mui/icons-material/Quiz';
import CodeIcon from '@mui/icons-material/Code';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import FeedbackIcon from '@mui/icons-material/Feedback';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Components
import DsaSimulationEngine from '../components/dsa-lab/DsaSimulationEngine';
import DsaCodePlayground from '../components/dsa-lab/DsaCodePlayground';
import DynamicQuiz from '../components/simulation/DynamicQuiz';

// Local Feedback Form
const DsaFeedbackForm = ({ topicTitle }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (submitted) {
    return (
      <div className="animate-page-enter max-w-2xl mx-auto bg-emerald-500/10 border border-emerald-500/30 p-10 rounded-3xl text-center shadow-2xl">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/40">
           <span className="text-4xl">🎉</span>
        </div>
        <h3 className="text-2xl font-bold text-emerald-400 mb-2">Feedback Received!</h3>
        <p className="text-gray-300 text-sm">Thank you for help scaling our education platforms. Your input has been securely synchronized.</p>
        <button onClick={() => setSubmitted(false)} className="mt-6 text-xs text-emerald-400 hover:underline font-bold uppercase tracking-widest">Submit another rating</button>
      </div>
    );
  }

  return (
    <div className="animate-page-enter max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Experiment Feedback</h2>
      <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">{topicTitle} Review</p>
      
      <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-75 h-75 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none"></div>
         <p className="text-gray-300 text-base mb-6 text-center font-bold">Rate your experience with the {topicTitle} virtual simulation:</p>
         
         <div className="flex gap-2 mb-8 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
               <button 
                 key={star}
                 type="button"
                 onClick={() => setRating(star)}
                 onMouseEnter={() => setHover(star)}
                 onMouseLeave={() => setHover(rating)}
                 className={`text-5xl transition-all ${star <= (hover || rating) ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] scale-110' : 'text-gray-600 hover:text-gray-500'}`}
               >
                 ★
               </button>
            ))}
         </div>

         <div className="flex flex-col gap-3">
            <label className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Additional Comments</label>
            <textarea 
               value={feedbackText}
               onChange={(e) => setFeedbackText(e.target.value)}
               className="w-full bg-black/50 border border-[var(--glass-border)] rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#00e5ff]/50 transition-colors h-28 resize-none"
               placeholder="Write what you liked or what we could refine..."
            />
         </div>

         <button 
            disabled={rating === 0}
            onClick={() => setSubmitted(true)}
            className={`w-full mt-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${rating === 0 ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-[var(--glass-border)]' : 'bg-linear-to-r from-purple-600 to-[#00e5ff] text-white shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] cursor-pointer'}`}
         >
            Submit Feedback
         </button>
      </div>
    </div>
  );
};

const DsaDetailedPrerequisites = ({ activeTopic, defaultPrereqs }) => {
  const isLinear = ['arrays', 'linked-lists', 'stack', 'queue', 'hashing'].includes(activeTopic);
  const isTree = ['trees', 'bst', 'avl-trees', 'heap', 'trie'].includes(activeTopic);
  const isGraph = activeTopic === 'graphs';
  const isAlgo = ['sorting', 'searching', 'recursion', 'backtracking', 'dynamic-programming', 'greedy'].includes(activeTopic);

  return (
    <div className="space-y-8 animate-page-enter">
      {/* 1. Category Overview Explainer */}
      <div className="bg-[var(--glass-bg)] border border-purple-500/20 p-6 rounded-2xl">
        <h4 className="text-[#00e5ff] font-bold text-base mb-2 uppercase tracking-wide">
          Foundational Blueprint: {activeTopic.replace('-', ' ').toUpperCase()}
        </h4>
        <p className="text-gray-300 text-xs leading-relaxed">
          Succeeding in advanced educational virtual labs requires an architectural grasp of computer engineering basics. Below is a deep-dive syllabus explanation of the core technical pre-requisites required to model and analyze this algorithm namespace.
        </p>
      </div>

      {/* 2. Custom Detailed prerequisite maps based on category */}
      {isLinear && (
        <div className="space-y-6">
          <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg">
            <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#00e5ff] rounded-full inline-block"></span>
              Prerequisite 1: Contiguous Physical Memory Layout
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              A computer's physical random access memory (RAM) is essentially a massive one-dimensional array of 8-bit bytes, each carrying a unique hexadecimal memory address. In contiguous allocation models:
            </p>
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-purple-300 mb-4">
              <strong>Contiguous Memory Addressing Rule:</strong><br/>
              ElementAddress = BaseAddress + (Index * ElementSizeInBytes)<br/><br/>
              Example (Integer Array, 4 Bytes each, Base = 0x1000):<br/>
              - index 0: 0x1000 + (0 * 4) = 0x1000<br/>
              - index 1: 0x1000 + (1 * 4) = 0x1004<br/>
              - index 2: 0x1000 + (2 * 4) = 0x1008
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              This contiguity allows CPU caches to prefetch neighboring elements with extremely high efficiency. If the memory cells are non-contiguous, cache hits drop, and CPU execution is delayed by retrieving data from main RAM.
            </p>
          </div>

          <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg">
            <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
              Prerequisite 2: Heap vs Stack Allocation Models
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Succeeding in linked lists and sequential pointer queues requires knowing exactly where compiler elements are hosted in computing memory:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono mb-4">
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                <span className="text-[#00e5ff] font-bold block mb-1">Stack (Automatic Memory)</span>
                <ul className="space-y-1 text-[10px] text-gray-400">
                  <li>• High speed O(1) pointer allocations</li>
                  <li>• LIFO hardware boundary management</li>
                  <li>• Fixed-size, thread local variables</li>
                  <li>• Scopes automatically cleaned at returns</li>
                </ul>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                <span className="text-purple-400 font-bold block mb-1">Heap (Dynamic Memory)</span>
                <ul className="space-y-1 text-[10px] text-gray-400">
                  <li>• Dynamic sizing configured at runtime</li>
                  <li>• Allocations via `new` / `malloc`</li>
                  <li>• Slower, fragmented random addresses</li>
                  <li>• Managed manually or via Garbage Collection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTree && (
        <div className="space-y-6">
          <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg">
            <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#00e5ff] rounded-full inline-block"></span>
              Prerequisite 1: Hierarchical Data Trees
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Unlike arrays or linked lists, hierarchical trees are non-linear models that group node items using parent-child directories:
            </p>
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-purple-300 mb-4">
              <strong>Mathematical Boundaries for Binary Trees of height H:</strong><br/>
              - Minimum Nodes: H + 1 (Degenerate skewed linear list)<br/>
              - Maximum Nodes: 2^(H+1) - 1 (Perfect fully loaded tree)<br/>
              - Height of Node: Count of longest downward edge path to a leaf node.<br/>
              - Depth of Node: Count of upward edge path leading to the absolute root node.
            </div>
          </div>

          <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg">
            <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
              Prerequisite 2: Recursion & Function Stack Frames
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Almost all tree algorithms (BST traversals, AVL heights, heap bubblings) are implemented recursively. Understanding the Call Stack is essential:
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              When a recursive call is made, the operating system pushes a new <strong>Activation Record (Stack Frame)</strong> onto the program Stack. This frame isolates execution scopes, parameters, local variables, and returns. If a base case is omitted or broken, infinite calls consume the Stack memory, triggering a immediate <strong>Stack Overflow Crash</strong>.
            </p>
          </div>
        </div>
      )}

      {isGraph && (
        <div className="space-y-6">
          <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg">
            <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#00e5ff] rounded-full inline-block"></span>
              Prerequisite 1: Adjacency Matrix vs Adjacency List Mapping
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Graph representations utilize spatial matrix dimensions or adjacent chains. Let's compare their O-notation metrics:
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left font-mono text-[10px] text-gray-400 border border-white/5">
                <thead>
                  <tr className="bg-black/60 text-white font-bold">
                    <th className="p-2.5 border-b border-white/5">Representation</th>
                    <th className="p-2.5 border-b border-white/5">Space Cost</th>
                    <th className="p-2.5 border-b border-white/5">Edge Lookup Cost</th>
                    <th className="p-2.5 border-b border-white/5">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="p-2.5 font-bold text-purple-300">Adjacency Matrix (2D Grid)</td>
                    <td className="p-2.5">O(V²)</td>
                    <td className="p-2.5 text-emerald-400">O(1) Constant</td>
                    <td className="p-2.5 text-gray-300">Dense graphs with high edges</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-[#00e5ff]">Adjacency List (Chain Array)</td>
                    <td className="p-2.5 text-emerald-400">O(V + E)</td>
                    <td className="p-2.5">O(V) Linear Search</td>
                    <td className="p-2.5 text-gray-300">Sparse graphs with few edges</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isAlgo && (
        <div className="space-y-6">
          <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-lg">
            <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#00e5ff] rounded-full inline-block"></span>
              Prerequisite 1: Big O Time & Space Complexity Frameworks
            </h5>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              To evaluate algorithms, you must have an intuitive understanding of the standard Big O growth rates:
            </p>
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-gray-400 space-y-1">
              <div>- <strong className="text-emerald-400">O(1) Constant:</strong> Direct memory offset indices calculations.</div>
              <div>- <strong className="text-cyan-400 font-bold">O(log N) Logarithmic:</strong> Dividing search bounds in half at every index frame.</div>
              <div>- <strong className="text-yellow-400">O(N) Linear:</strong> Iterating through a sequence of data elements once.</div>
              <div>- <strong className="text-purple-400">O(N log N) Linearithmic:</strong> Efficient divide-and-conquer merges and pivot sorts.</div>
              <div>- <strong className="text-red-400">O(N²) Quadratic:</strong> Nested loops traversing combinations of array inputs.</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Base Content Checklist */}
      <div className="bg-purple-950/10 border border-purple-500/25 rounded-2xl p-6">
        <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-3">
          Topic-Specific Foundation Checklist
        </h5>
        <div className="space-y-2.5">
          {defaultPrereqs.map((prereq, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-black/30 p-3 rounded-lg border border-white/5">
              <span className="text-[#00e5ff] text-xs font-black">✔</span>
              <div>
                <strong className="text-white text-xs block mb-1">{prereq.title}</strong>
                {prereq.body.map((b, bIdx) => (
                  <p key={bIdx} className="text-gray-400 text-[10px] leading-relaxed">{b.text}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function DsaLabPage() {
  const [activeTopic, setActiveTopic] = useState('arrays');
  const [activeTab, setActiveTab] = useState('Introduction');
  const [viewedTabs, setViewedTabs] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeTopicData = dsaTopicsData[activeTopic];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab, activeTopic]);

  // Sync progression percentage to server backend database
  useEffect(() => {
    const trackingKey = `${activeTopic}-${activeTab}`;
    if (!viewedTabs.includes(trackingKey)) {
      const nextViewed = [...viewedTabs, trackingKey];
      setViewedTabs(nextViewed);
      
      const token = localStorage.getItem('token');
      if (token) {
        // Calculate progression ratio of DSA modules (17 topics * 13 tabs = 221 possible states)
        const progressionRatio = Math.min(Math.round((nextViewed.length / 221) * 100), 100);
        axios.post('http://localhost:5000/api/progress/lab', 
          { labSlug: 'dsa', progressPercentage: progressionRatio },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(err => console.debug("Sync Progression Warning", err));
      }
    }
  }, [activeTab, activeTopic, viewedTabs]);

  const tabs = [
    { id: 'Introduction', icon: <PlayArrowIcon fontSize="small"/> },
    { id: 'Pre-Requisites', icon: <AssignmentIcon fontSize="small"/> },
    { id: 'Objective', icon: <HelpOutlineIcon fontSize="small"/> },
    { id: 'Theory', icon: <LibraryBooksIcon fontSize="small"/> },
    { id: 'Simulation', icon: <AutoFixHighIcon fontSize="small"/> },
    { id: 'Step-by-Step Visualization', icon: <VisibilityIcon fontSize="small"/> },
    { id: 'Complexity Analysis', icon: <AccountTreeIcon fontSize="small"/> },
    { id: 'Applications', icon: <GroupsIcon fontSize="small"/> },
    { id: 'Test Your Knowledge', icon: <QuizIcon fontSize="small"/> },
    { id: 'Learn Code', icon: <CodeIcon fontSize="small"/> },
    { id: 'Practice Problems', icon: <ListAltIcon fontSize="small"/> },
    { id: 'Resources', icon: <LibraryBooksIcon fontSize="small"/> },
    { id: 'Feedback', icon: <FeedbackIcon fontSize="small"/> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Introduction':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Introduction
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              Overview & Context
            </p>
            
            <div className="space-y-6 text-gray-300 leading-relaxed text-sm">
              <div className="bg-[var(--glass-bg)] border border-purple-500/20 p-6 rounded-2xl">
                <p className="font-bold text-white text-base mb-2">What is {activeTopicData.title}?</p>
                <p className="leading-relaxed">{activeTopicData.introduction}</p>
                {dsaDeepDiveRegistry[activeTopic]?.detailedIntro && (
                  <p className="mt-4 border-t border-white/5 pt-4 text-gray-300 leading-relaxed text-xs">
                    {dsaDeepDiveRegistry[activeTopic].detailedIntro}
                  </p>
                )}
              </div>

              {/* Dynamic Diagram Embed */}
              {activeTopic === 'arrays' && (
                <div className="my-8 rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black/40 p-3 shadow-2xl animate-page-enter">
                  <img src={dsaArrayMemory} alt="Array Memory contiguous layout" className="w-full h-auto object-cover rounded-xl animate-pulse" />
                  <p className="text-[10px] text-gray-500 font-mono text-center mt-2.5">Figure 1.1: Contiguous memory allocation cells indexing values linearly.</p>
                </div>
              )}
              {activeTopic === 'linked-lists' && (
                <div className="my-8 rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black/40 p-3 shadow-2xl animate-page-enter">
                  <img src={dsaLinkedList} alt="Singly Linked List pointer chain layout" className="w-full h-auto object-cover rounded-xl animate-pulse" />
                  <p className="text-[10px] text-gray-500 font-mono text-center mt-2.5">Figure 1.2: Singly linked nodes containing data properties and links pointing to consecutive slots.</p>
                </div>
              )}
              {['trees', 'bst', 'avl-trees', 'heap'].includes(activeTopic) && (
                <div className="my-8 rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black/40 p-3 shadow-2xl animate-page-enter">
                  <img src={dsaBstLayout} alt="BST hierarchical structure diagram" className="w-full h-auto object-cover rounded-xl animate-pulse" />
                  <p className="text-[10px] text-gray-500 font-mono text-center mt-2.5">Figure 1.3: Binary Search Tree layout dividing sub-nodes based on comparative keys.</p>
                </div>
              )}
              {activeTopic === 'graphs' && (
                <div className="my-8 rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black/40 p-3 shadow-2xl animate-page-enter">
                  <img src={dsaGraphNetwork} alt="Graph network representation" className="w-full h-auto object-cover rounded-xl animate-pulse" />
                  <p className="text-[10px] text-gray-500 font-mono text-center mt-2.5">Figure 1.4: Network nodes (Vertices) joined by relational cost weights (Edges).</p>
                </div>
              )}

              <h3 className="text-xl font-bold text-white mt-8 border-b border-white/5 pb-2">
                Detailed Conceptual Overview
              </h3>
              
              {activeTopic === 'arrays' && (
                <div className="space-y-4">
                  <p>
                    An Array is a contiguous chunk of computing memory allocated to hold elements of a homogenous type. Since elements sit immediately adjacent to each other:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400 font-mono">
                    <li><strong className="text-white">O(1) Address Calculation:</strong> Retrieval address of index `i` is calculated in constant time via: `Address = Base + i * ElementSize`.</li>
                    <li><strong className="text-white">Cache Locality Benefit:</strong> Iterating sequentially triggers CPU prefetching because adjacent items reside within the same hardware cache line.</li>
                    <li><strong className="text-white">Fixed-Size Limitation:</strong> Resizing requires allocating a brand-new contiguous block and copying all elements, scaling linearly as O(N).</li>
                  </ul>
                </div>
              )}

              {activeTopic === 'linked-lists' && (
                <div className="space-y-4">
                  <p>
                    Unlike arrays, Linked Lists utilize non-contiguous dynamic node bubbles allocated inside the system Heap. Each node encapsulates its data along with a pointer containing the raw RAM address of the next item:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400 font-mono">
                    <li><strong className="text-white">O(1) Head Operations:</strong> Inserting or deleting elements at the HEAD requires updating only two pointer assignments, regardless of list length.</li>
                    <li><strong className="text-white">O(N) Sequential Search:</strong> Because cells are scattered across different memory locations, accessing index `i` requires iterating from the root node.</li>
                    <li><strong className="text-white">Zero Memory Waste:</strong> Growth is completely dynamic. The structure only consumes heap space as new nodes are explicitly initialized.</li>
                  </ul>
                </div>
              )}

              {['trees', 'bst', 'avl-trees', 'heap'].includes(activeTopic) && (
                <div className="space-y-4">
                  <p>
                    Trees represent non-linear hierarchical data models containing a collection of nodes joined by directed branch arrows:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400 font-mono">
                    <li><strong className="text-white">O(log N) Average Boundary:</strong> Organizing items hierarchically divides search boundaries in half at every step, similar to binary divisions.</li>
                    <li><strong className="text-white">AVL Auto-Balancing:</strong> Prevents trees from degenerating into O(N) linear lists by measuring balance factors (height of left minus right subtrees) and performing rotations when thresholds exceed |1|.</li>
                  </ul>
                </div>
              )}

              {activeTopic === 'graphs' && (
                <div className="space-y-4">
                  <p>
                    A Graph is a relational data structure mapping complex network elements (vertices) and their direct connections (edges) with path costs:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-gray-400 font-mono">
                    <li><strong className="text-white">Breadth-First Search (BFS):</strong> Explores adjacent neighboring nodes level-by-level using a FIFO queue structure, optimal for finding shortest pathways.</li>
                    <li><strong className="text-white">Dijkstra Cost Optimization:</strong> Employs greedy priority selection queues to determine minimum spanning routes across weighted spatial maps.</li>
                  </ul>
                </div>
              )}

              {!['arrays', 'linked-lists', 'trees', 'bst', 'avl-trees', 'heap', 'graphs'].includes(activeTopic) && (
                <p>
                  Data structures dictate how computing architectures allocate physical RAM slots to host elements securely.
                  By structuring element boundaries cleanly, algorithms can search, query, and perform operations in optimized mathematical boundaries rather than exhaustive linear cycles.
                </p>
              )}
            </div>
          </div>
        );

      case 'Pre-Requisites':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Pre-Requisites
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              Required Foundations
            </p>

            <DsaDetailedPrerequisites 
              activeTopic={activeTopic} 
              defaultPrereqs={activeTopicData.prerequisites} 
            />
          </div>
        );

      case 'Objective':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Objectives
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              Learning Targets
            </p>

            <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-8 shadow-2xl">
              <p className="text-white font-bold text-base mb-6">By the end of this virtual lab topic, you will be able to:</p>
              <ul className="space-y-4">
                {activeTopicData.objective.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] font-bold shrink-0 text-xs shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                      {idx + 1}
                    </span>
                    <span className="text-gray-300 text-sm pt-0.5 leading-snug font-medium">
                      {obj}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'Theory':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Theoretical Framework
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              In-depth Concept Guide
            </p>

            {dsaDeepDiveRegistry[activeTopic]?.detailedTheory && (
              <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-8 shadow-2xl space-y-6 text-gray-300 text-xs leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: dsaDeepDiveRegistry[activeTopic].detailedTheory }} />
            )}

            {activeTopicData.theory.map((block, idx) => {
              if (block.type === 'header-cyan' || block.type === 'header-purple') {
                return (
                  <h3 key={idx} className="text-xl font-bold text-white mt-6 border-b border-white/5 pb-2 flex items-center gap-2">
                    <span className={`w-2.5 h-6 rounded-full inline-block ${block.type.includes('cyan') ? 'bg-[#00e5ff]' : 'bg-purple-500'}`}></span>
                    {block.text}
                  </h3>
                );
              }
              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: block.text }} />
                );
              }
              if (block.type === 'glass-box') {
                return (
                  <div key={idx} className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-6 rounded-2xl text-gray-300 text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: block.text }} />
                );
              }
              if (block.type.includes('alert')) {
                return (
                  <div key={idx} className="bg-red-500/10 border border-red-500/30 p-5 rounded-2xl text-xs leading-relaxed">
                    <span className="font-bold text-red-400 block mb-1">⚠️ {block.title}</span>
                    <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: block.text }} />
                  </div>
                );
              }
              return null;
            })}
          </div>
        );

      case 'Simulation':
        return <DsaSimulationEngine slug={activeTopic} topicTitle={activeTopicData.title} />;

      case 'Step-by-Step Visualization':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Step-by-Step Visualization
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              Guided Operational Traces
            </p>

            <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white font-bold text-base mb-4">How to trace transitions inside this visualization:</h3>
              <div className="space-y-4 font-mono text-xs text-gray-300">
                <div className="flex gap-3 items-start border-b border-white/5 pb-3">
                  <span className="bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 px-2 py-0.5 rounded font-black shrink-0">STEP 1</span>
                  <p className="leading-relaxed">Verify boundaries and insert inputs using the parameter panel fields on the right side.</p>
                </div>
                <div className="flex gap-3 items-start border-b border-white/5 pb-3">
                  <span className="bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 px-2 py-0.5 rounded font-black shrink-0">STEP 2</span>
                  <p className="leading-relaxed">Trigger the action buttons. Elements will shift or render highlighted loops.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30 px-2 py-0.5 rounded font-black shrink-0">STEP 3</span>
                  <p className="leading-relaxed">Observe step counts, comparisons, and structural transformations in the chronological timeline logs at the bottom.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Complexity Analysis':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Complexity Analysis
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              Big O Mathematical Bounds
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Time Complexity Card */}
              <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl">
                <h3 className="text-purple-300 font-bold uppercase tracking-widest text-xs mb-4">Time Complexity</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Best Case Scenario:</span>
                    <span className="text-white font-bold">{activeTopicData.complexity.time.best}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-400">Average Case Scenario:</span>
                    <span className="text-white font-bold">{activeTopicData.complexity.time.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Worst Case Scenario:</span>
                    <span className="text-white font-bold">{activeTopicData.complexity.time.worst}</span>
                  </div>
                </div>
              </div>

              {/* Space Complexity Card */}
              <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[#00e5ff] font-bold uppercase tracking-widest text-xs mb-4">Space Complexity</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">
                    Refers to the total auxiliary workspace memory allocated in Heap/Stack structures during compile diagnostics.
                  </p>
                </div>
                <div className="flex justify-between font-mono text-xs border-t border-white/5 pt-3">
                  <span className="text-gray-400">Auxiliary Allocations:</span>
                  <span className="text-white font-bold">{activeTopicData.complexity.space}</span>
                </div>
              </div>

            </div>
          </div>
        );

      case 'Applications':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Real-World Applications
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              System Mappings
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {activeTopicData.applications.map((app, idx) => (
                <div key={idx} className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] p-6 rounded-2xl hover:border-purple-500/30 transition-all shadow-lg hover:-translate-y-1">
                  <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2">
                    <CheckCircleIcon fontSize="small" className="text-[#00e5ff]"/>
                    {app.name}
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{app.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Test Your Knowledge':
        const formattedQuiz = activeTopicData.quiz.map(q => ({
          question: q.question,
          options: q.options,
          answer: typeof q.answer === 'number' ? q.options[q.answer] : q.answer,
          explanation: q.explanation
        }));
        return (
          <DynamicQuiz 
            questions={formattedQuiz} 
            category="DSA Concepts" 
            settings={{ timeLimit: 10 }} 
            topicSlug={`dsa-${activeTopicData.slug}`} 
          />
        );

      case 'Learn Code':
        return (
          <DsaCodePlayground 
            codeTemplates={activeTopicData.code} 
            complexities={activeTopicData.complexity} 
            playgroundChallenge={activeTopicData.playground} 
            topicTitle={activeTopicData.title} 
          />
        );

      case 'Practice Problems':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Practice Problems
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              Coding Challenges
            </p>

            <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white font-bold text-base mb-2">{activeTopicData.playground.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">{activeTopicData.playground.description}</p>
              
              <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-xs font-mono text-gray-300 mb-6">
                <span className="font-bold text-purple-300 block mb-1">Challenge Instructions:</span>
                Switch to the "Learn Code" tab, click the "Coding Challenge" segment to write, compile, and execute your custom solution algorithms directly inside our virtual sandbox.
              </div>
            </div>
          </div>
        );

      case 'Resources':
        return (
          <div className="animate-page-enter max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">
              Learning Resources
            </h2>
            <p className="text-gray-400 mb-8 text-sm uppercase tracking-widest font-black">
              Curated Documentation
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {activeTopicData.resources.map((res, idx) => (
                <a 
                  key={idx} 
                  href={res.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] p-6 rounded-2xl hover:border-white/20 transition-all hover:-translate-y-1 block group shadow-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl">{res.type === 'Video' ? '🎥' : '📖'}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/5 border border-white/10 rounded text-cyan-400 shrink-0">{res.type}</span>
                  </div>
                  <h4 className="text-white font-bold text-base group-hover:text-[#00e5ff] transition-colors mb-1">{res.title}</h4>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Access resource link</p>
                </a>
              ))}
            </div>
          </div>
        );

      case 'Feedback':
        return <DsaFeedbackForm topicTitle={activeTopicData.title} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white relative font-sans flex flex-col pt-32 animate-page-enter">
      
      {/* Dynamic glow scheme background meshes */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-purple-500/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#00e5ff]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      {/* Main Page Title Header */}
      <div className="px-8 max-w-[1500px] mx-auto mb-12 relative w-full border-b border-[var(--glass-border)] pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg flex items-center">
          DSA Virtual Lab <span className="font-light text-gray-400 opacity-60 ml-3 text-3xl">| Visual Algorithms</span>
        </h1>
      </div>

      {/* Main Workspace split panel layout */}
      <div className="flex flex-col md:flex-row gap-8 px-4 lg:px-8 max-w-[1500px] mx-auto w-full mb-32 flex-1 z-10">
        
        {/* Sticky Left Sidebar Navigation: Houses the 13 Pedagogical Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col">
          <div className="sticky top-32 glass-card p-2 shadow-2xl overflow-hidden bg-[var(--panel-bg-strong)] border-[var(--glass-border)] border rounded-2xl">
            {tabs.map((tab) => {
              const isTabActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 mb-1 rounded-lg transition-all duration-300 flex items-center gap-3 font-semibold text-xs ${
                    isTabActive
                      ? 'bg-linear-to-r from-[#6c2bd9] to-[#00e5ff] text-white shadow-[0_4px_20px_rgba(0,229,255,0.3)]'
                      : 'text-gray-400 hover:text-white hover:bg-[var(--glass-bg)]'
                  }`}
                >
                  <span className={`${isTabActive ? 'text-white' : 'text-gray-500'} transition-colors`}>{tab.icon}</span>
                  {tab.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic content column */}
        <div className="flex-1 flex flex-col">
          
          {/* Categorized Dropdown Selector: Above the intro/content section */}
          <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] p-5 rounded-2xl mb-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-sm">Active Lab Module</h3>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Select a topic from the curriculum tree below</p>
            </div>
            <div className="relative w-full sm:w-72">
              <select
                value={activeTopic}
                onChange={(e) => {
                  setActiveTopic(e.target.value);
                  setActiveTab('Introduction');
                }}
                className="w-full bg-black/60 border border-[var(--glass-border)] text-white text-xs font-bold rounded-xl p-3.5 focus:outline-none focus:border-[#00e5ff]/50 cursor-pointer appearance-none shadow-inner"
              >
                {dsaCategoryList.map((cat, catIdx) => (
                  <optgroup label={cat.categoryName} key={catIdx} className="bg-black text-gray-500 font-bold uppercase tracking-wider text-[9px] p-2">
                    {cat.topics.map((t) => (
                      <option value={t.slug} key={t.slug} className="bg-black text-white text-xs font-semibold">
                        {t.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-purple-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Tab Content Box wrapper */}
          <div className={`glass-card border border-[var(--glass-border)] bg-[var(--panel-bg)] shadow-[0_0_50px_rgba(0,0,0,0.5)] ${activeTab === 'Simulation' ? 'p-0 border-none bg-transparent shadow-none' : 'p-8 md:p-12 min-h-150 rounded-3xl'}`}>
            {renderContent()}
          </div>

        </div>

      </div>

      <WaveFooter />
    </div>
  );
}
