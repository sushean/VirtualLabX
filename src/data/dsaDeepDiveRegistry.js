// Deep-Dive Dynamic Textbook-Grade content for all 17 DSA Topics
export const dsaDeepDiveRegistry = {
  arrays: {
    detailedIntro: `
      An Array represents the most fundamental linear data structure in computer science. 
      At the hardware architecture level, it consists of a contiguous block of physical memory cells allocated to hold elements of a uniform, homogeneous type.
      Because elements sit immediately adjacent to each other, the processor can calculate the exact memory location of any element in constant O(1) time using simple arithmetic.
      
      This physical contiguity makes arrays exceptionally fast for element retrieval, but introduces strict structural limitations:
      1. Fixed capacity boundaries configured at initial compiler allocation.
      2. High linear O(N) cost for inserting or deleting elements because adjacent items must be physically shifted.
      3. Requirement of contiguous memory chunks, which can cause allocation failures due to RAM fragmentation even if total free space is sufficient.
    `,
    detailedTheory: `
      <h3>1. Mathematical Memory Address Equations</h3>
      When an array is declared, the compiler reserves a contiguous byte space. The physical RAM address of an element at index <em>i</em> is calculated via:
      <pre className="font-mono bg-black/40 p-3 rounded-lg border border-white/5 text-purple-300 text-xs my-3">
        Address(A[i]) = BaseAddress + i * sizeof(DataType)
      </pre>
      Where:
      - <strong>BaseAddress:</strong> The pointer to the absolute start of the array block (index 0).
      - <strong>sizeof(DataType):</strong> The byte size of the allocated type (e.g., 4 bytes for 32-bit Integers, 8 bytes for Doubles).
      
      <h3>2. Spatial and Temporal Cache Locality</h3>
      Modern CPUs utilize hierarchical caches (L1, L2, L3) to bridge the speed gap between high-frequency processor cores and main DRAM.
      When the CPU requests a single byte from RAM, the memory controller fetches a whole <strong>Cache Line</strong> (typically 64 bytes) containing adjacent bytes.
      Since arrays allocate elements contiguously, iterating sequentially guarantees that subsequent items are already loaded in high-speed cache lines. 
      This is called <strong>Spatial Locality</strong>, and it makes array traversals significantly faster than linked lists.
      
      <h3>3. Multidimensional Row-Major vs Column-Major Traversals</h3>
      Two-dimensional arrays (matrices) are abstracted as grids, but physical memory remains one-dimensional. Compilers map grids to linear memory in one of two ways:
      - <strong>Row-Major Order (C, C++, Java, JS):</strong> Maps elements row-by-row: <code className="text-[#00e5ff] font-mono">Index = Row * ColumnsCount + Column</code>.
      - <strong>Column-Major Order (Fortran, MATLAB):</strong> Maps elements column-by-column: <code className="text-[#00e5ff] font-mono">Index = Column * RowsCount + Row</code>.
      Iterating in the wrong order triggers continuous cache misses, degrading memory throughput by orders of magnitude.
    `
  },
  'linked-lists': {
    detailedIntro: `
      A Linked List is a linear data collection composed of independent "Node" objects allocated dynamically on the system Heap.
      Unlike arrays, nodes do not reside in contiguous memory locations. Instead, each node acts as a self-referential structure containing:
      1. A <strong>Data Field</strong> carrying the stored value.
      2. A <strong>Pointer/Reference Field</strong> carrying the raw memory address of the next node.
      
      This structure allows lists to grow and shrink dynamically without expensive reallocation copies. However, searching requires traversing the chain from the root node, resulting in linear O(N) access time.
    `,
    detailedTheory: `
      <h3>1. Node Struct Configuration</h3>
      In lower-level languages like C/C++, a singly linked list node is represented as:
      <pre className="font-mono bg-black/40 p-3 rounded-lg border border-white/5 text-purple-300 text-xs my-3">
struct Node {'{'}
    int data;
    Node* next; // Reference address of next node
{'};'}
      </pre>
      
      <h3>2. Structural Classifications</h3>
      Linked lists can be structured in three main ways depending on traversal needs:
      - <strong>Singly Linked List:</strong> Nodes contain a single forward pointer. Traversal is strictly unidirectional.
      - <strong>Doubly Linked List (DLL):</strong> Nodes contain both forward (<code className="text-[#00e5ff] font-mono">next</code>) and backward (<code className="text-[#00e5ff] font-mono">prev</code>) pointers. This allows bidirectional traversal and constant-time node deletions if the node pointer is known.
      - <strong>Circular Linked List:</strong> The tail node's next pointer references the head node, forming a continuous ring. This is ideal for round-robin scheduler loops.
      
      <h3>3. Pointer Manipulation and Memory Leaks</h3>
      Modifying linked lists requires careful pointer updates. When inserting node B between A and C:
      1. Point B's next pointer to C.
      2. Point A's next pointer to B.
      If step 2 is done first, reference to C is lost. In unmanaged languages like C, this results in an unreachable node in the heap, causing a <strong>Memory Leak</strong>.
    `
  },
  stack: {
    detailedIntro: `
      A Stack is an abstract linear data structure that operates strictly on the <strong>Last-In, First-Out (LIFO)</strong> principle.
      It models real-world physical stacks, where items can only be placed on or removed from the top.
      
      Any operation—whether appending or deleting—is restricted to the absolute <strong>Top of Stack</strong>. This guarantees constant O(1) time complexity for insertions and deletions, making stacks highly efficient for tracking state history.
    `,
    detailedTheory: `
      <h3>1. Core Stack Operations</h3>
      Stacks are defined by three primary operations:
      - <strong>Push:</strong> Places an element onto the top of the stack.
      - <strong>Pop:</strong> Removes and returns the top element.
      - <strong>Peek/Top:</strong> Returns the top element without removing it.
      
      <h3>2. Architectural Implementations</h3>
      - <strong>Array-Based Stack:</strong> Uses a flat array and a pointer tracking the top index. This provides fast access but has a fixed capacity. Exceeding this capacity triggers a <strong>Stack Overflow</strong>.
      - <strong>Linked-List Stack:</strong> Inserts and deletes elements at the head node. This allows the stack to grow dynamically to utilize all available heap space.
      
      <h3>3. Compilers and Context Activation Frames</h3>
      When a program calls a function, the compiler creates a new <strong>Activation Record (Stack Frame)</strong> on the thread's call stack. This frame stores arguments, local variables, and the return address. When the function returns, its stack frame is popped, restoring the previous context.
    `
  },
  queue: {
    detailedIntro: `
      A Queue is a linear data structure that processes elements in a strict <strong>First-In, First-Out (FIFO)</strong> sequence.
      It models real-world lines, where the first item to enter the queue is the first one to be processed and removed.
      
      Operations occur at opposite ends of the structure: insertions are appended at the <strong>Rear</strong>, while deletions occur at the <strong>Front</strong>.
    `,
    detailedTheory: `
      <h3>1. Modulo Circular Indexing Equations</h3>
      Flat array queues suffer from "creeping indices": removing elements from the front shifts the boundary forward, leaving unused space behind. 
      To prevent this, queues utilize circular modulo arithmetic to wrap the rear pointer back to the beginning:
      <pre className="font-mono bg-black/40 p-3 rounded-lg border border-white/5 text-purple-300 text-xs my-3">
        RearIndex = (RearIndex + 1) % QueueCapacity
      </pre>
      
      <h3>2. Specialized Queue Implementations</h3>
      - <strong>Double-Ended Queue (Deque):</strong> Allows insertions and deletions at both the Front and Rear in O(1) time.
      - <strong>Priority Queue:</strong> Elements carry a priority rating. Dequeue operations retrieve the highest-priority element first, regardless of arrival order. This is typically implemented using binary heaps.
    `
  },
  hashing: {
    detailedIntro: `
      Hashing is a key-value mapping technique designed to provide near constant-time O(1) search, insertion, and deletion operations.
      It works by passing a key through a mathematical <strong>Hash Function</strong> to compute a numerical index, which maps directly to a location in a physical storage array (the Hash Table).
      
      The primary challenge in hashing is managing <strong>Collisions</strong>, which occur when two distinct keys generate the exact same array index.
    `,
    detailedTheory: `
      <h3>1. Design of Hash Functions</h3>
      A high-quality hash function must be fast to compute, deterministic, and distribute keys uniformly across the table to minimize collisions. 
      A common approach is the division method: <code className="text-[#00e5ff] font-mono">Hash(Key) = Key % TableSize</code>, where TableSize is a prime number to reduce grouping patterns.
      
      <h3>2. Collision Resolution Frameworks</h3>
      - <strong>Chaining (Open Hashing):</strong> The hash table array contains pointers to linked lists. Elements that hash to the same index are appended to that index's list.
      - <strong>Open Addressing (Closed Hashing):</strong> All elements are stored directly in the table array. If a collision occurs, the algorithm probes alternative indices:
        - <em>Linear Probing:</em> Searches sequentially: <code className="text-[#00e5ff] font-mono">Index = (Hash + i) % Size</code>.
        - <em>Quadratic Probing:</em> Searches with quadratic offsets: <code className="text-[#00e5ff] font-mono">Index = (Hash + i²) % Size</code>.
        - <em>Double Hashing:</em> Uses a second hash function to determine the step size: <code className="text-[#00e5ff] font-mono">Index = (Hash1 + i * Hash2) % Size</code>.
      
      <h3>3. Load Factors and Table Rehashing</h3>
      The <strong>Load Factor (α)</strong> is the ratio of stored elements to table capacity: <code className="text-[#00e5ff] font-mono font-bold">α = N / Capacity</code>. 
      When α exceeds a threshold (typically 0.7 for open addressing), lookup times degrade. The table must then be resized (rehashing), which involves allocating a larger array and recalculating indices for all existing elements.
    `
  },
  trees: {
    detailedIntro: `
      A Tree is a hierarchical, non-linear data structure composed of nodes connected by directed edges.
      It models top-down organization, beginning at a single master node called the <strong>Root</strong>.
      
      Unlike linear structures, trees partition search spaces branch-by-branch, making them highly efficient for representing hierarchical relationships, file systems, and decision boundaries.
    `,
    detailedTheory: `
      <h3>1. Core Hierarchical Terminology</h3>
      - <strong>Root:</strong> The absolute top node of the tree, which has no parent nodes.
      - <strong>Leaf Node:</strong> A node that has no children.
      - <strong>Height:</strong> The length of the longest path from a node to a leaf. The height of a tree is the height of its root.
      - <strong>Depth:</strong> The length of the path from the root to a given node.
      
      <h3>2. Traversal Methodologies</h3>
      Unlike linear structures, trees can be traversed in several ways:
      - <strong>Depth-First Search (DFS):</strong>
        - <em>Pre-Order:</em> Visit Root, then Left Subtree, then Right Subtree.
        - <em>In-Order:</em> Visit Left Subtree, then Root, then Right Subtree. (Yields sorted values in a BST).
        - <em>Post-Order:</em> Visit Left Subtree, then Right Subtree, then Root.
      - <strong>Breadth-First Search (BFS):</strong> Explores nodes level-by-level using a FIFO queue.
    `
  },
  bst: {
    detailedIntro: `
      A Binary Search Tree (BST) is a binary tree structured specifically to optimize search and retrieval operations.
      It enforces a strict ordering rule on all its nodes:
      For any parent node, all keys in its left subtree must be less than the parent's key, and all keys in its right subtree must be greater.
      
      This property enables binary division searches, reducing lookup times to O(log N) on average.
    `,
    detailedTheory: `
      <h3>1. The Ordering Constraint</h3>
      Mathematically, for any node <em>N</em> containing key <em>K</em>:
      <pre className="font-mono bg-black/40 p-3 rounded-lg border border-white/5 text-purple-300 text-xs my-3">
        Key(LeftChild(N)) &lt; Key(N) &lt; Key(RightChild(N))
      </pre>
      
      <h3>2. Average vs Worst Case Performance</h3>
      - <strong>Average Case O(log N):</strong> Balanced trees divide the remaining search space in half at each step.
      - <strong>Worst Case O(N):</strong> If elements are inserted in sorted order, the tree degenerates into a linear linked chain, degrading search times to linear.
    `
  },
  'avl-trees': {
    detailedIntro: `
      An AVL Tree (Adelson-Velsky and Landis) is a self-balancing binary search tree.
      It prevents the worst-case O(N) degeneration of standard BSTs by enforcing a strict balance constraint:
      The heights of the left and right subtrees of any node can differ by at most one.
      
      If an insertion or deletion violates this constraint, the tree performs structural rotations to restore balance, guaranteeing O(log N) time complexity for all operations.
    `,
    detailedTheory: `
      <h3>1. The Balance Factor Equation</h3>
      For every node <em>N</em> in the tree, the Balance Factor (BF) must satisfy:
      <pre className="font-mono bg-black/40 p-3 rounded-lg border border-white/5 text-[#00e5ff] text-xs my-3">
        BalanceFactor(N) = Height(LeftSubtree(N)) - Height(RightSubtree(N))
        Where: BalanceFactor(N) ∈ {'{'} -1, 0, 1 {'}'}
      </pre>
      If |BF| &gt; 1, the node is unbalanced, triggering rotation algorithms.
      
      <h3>2. Self-Balancing Rotations</h3>
      To restore balance, AVL trees perform four types of rotations depending on the shape of the imbalance:
      - <strong>Single Left Rotation (RR Imbalance):</strong> Corrects a right-heavy subtree.
      - <strong>Single Right Rotation (LL Imbalance):</strong> Corrects a left-heavy subtree.
      - <strong>Left-Right Double Rotation (LR Imbalance):</strong> Performs a left rotation on the child, followed by a right rotation on the parent.
      - <strong>Right-Left Double Rotation (RL Imbalance):</strong> Performs a right rotation on the child, followed by a left rotation on the parent.
    `
  },
  heap: {
    detailedIntro: `
      A Heap is a complete binary tree that maintains a specialized order property.
      It is primarily used to implement efficient priority queues:
      - <strong>Max-Heap:</strong> The key of any parent node is greater than or equal to the keys of its children. The absolute maximum key resides at the root.
      - <strong>Min-Heap:</strong> The key of any parent node is less than or equal to the keys of its children. The absolute minimum key resides at the root.
    `,
    detailedTheory: `
      <h3>1. Array Representation of Complete Binary Trees</h3>
      Because heaps are complete binary trees, they can be stored efficiently in flat arrays without pointers. For an element at index <em>i</em>:
      <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-[#00e5ff] space-y-1 my-3">
        <div>- Left Child Index = 2 * i + 1</div>
        <div>- Right Child Index = 2 * i + 2</div>
        <div>- Parent Index = floor((i - 1) / 2)</div>
      </div>
      
      <h3>2. Heapification Operations</h3>
      - <strong>Bubble-Up (Up-Heapify):</strong> Restores the heap property after insertion by swapping the new element upward with its parent until order is restored (O(log N)).
      - <strong>Sift-Down (Down-Heapify):</strong> Restores the heap property after root removal by swapping the root downward with its larger/smaller child (O(log N)).
    `
  },
  trie: {
    detailedIntro: `
      A Trie (Prefix Tree) is an ordered tree-like search structure optimized for key retrieval over strings.
      Instead of storing complete keys in individual nodes, each node represents a single character along a prefix path.
      
      All descendants of a node share the same prefix string, making Tries highly efficient for auto-complete, dictionary lookups, and IP routing algorithms.
    `,
    detailedTheory: `
      <h3>1. Character Edge Traversal</h3>
      Each node in a Trie contains an array of child references (typically size 26 for lowercase English letters) and a boolean flag indicating if the node marks the end of a complete word.
      
      <h3>2. Efficiency Mappings</h3>
      Searching for a word of length <em>L</em> takes <strong>O(L)</strong> time, completely independent of the total number of words stored in the Trie. This is faster than hashing in scenarios with frequent prefix match queries.
    `
  },
  graphs: {
    detailedIntro: `
      A Graph is a versatile data structure composed of a set of vertices (nodes) connected by edges (relationships).
      Graphs can model complex systems, such as network topologies, social networks, and geographical paths.
      
      Edges can carry weights (representing costs, distances, or capacities) and directions (directed vs undirected).
    `,
    detailedTheory: `
      <h3>1. Graph Search Algorithms</h3>
      - <strong>Breadth-First Search (BFS):</strong> Explores neighboring nodes level-by-level using a FIFO queue. It is optimal for finding the shortest path in unweighted graphs (O(V + E)).
      - <strong>Depth-First Search (DFS):</strong> Explores paths as deep as possible before backtracking using recursion or a LIFO stack. It is ideal for cycle detection and topological sorting.
      
      <h3>2. Cost Optimization Protocols</h3>
      - <strong>Dijkstra's Algorithm:</strong> Determines the shortest path from a single source vertex to all other vertices in a weighted graph using a priority queue (O((V + E) log V)).
      - <strong>Minimum Spanning Tree (MST):</strong> Finds a subset of edges that connects all vertices with the minimum total edge weight without cycles (Kruskal's and Prim's algorithms).
    `
  },
  sorting: {
    detailedIntro: `
      Sorting is the process of arranging elements in a specific logical order (ascending or descending).
      It is a fundamental operation in computer science, optimizing subsequent operations like binary searching.
      
      Sorting algorithms are evaluated based on their time complexity, space complexity, and stability.
    `,
    detailedTheory: `
      <h3>1. Algorithmic Classifications</h3>
      - <strong>Stability:</strong> A sorting algorithm is stable if it preserves the relative order of duplicate elements.
      - <strong>In-Place:</strong> Requires a constant amount O(1) of auxiliary memory space.
      
      <h3>2. Time Complexity Classes</h3>
      - <strong>O(N²):</strong> Simple, intuitive algorithms suitable for small datasets (Bubble Sort, Selection Sort, Insertion Sort).
      - <strong>O(N log N):</strong> Efficient divide-and-conquer algorithms (Merge Sort, Quick Sort, Heap Sort). Merge Sort is stable but requires O(N) space. Quick Sort is in-place but has a worst-case complexity of O(N²).
    `
  },
  searching: {
    detailedIntro: `
      Searching algorithms locate target elements within a data collection.
      
      The choice of searching algorithm depends heavily on whether the underlying collection is sorted.
    `,
    detailedTheory: `
      <h3>1. Linear vs Binary Search</h3>
      - <strong>Linear Search:</strong> Iterates through the collection sequentially. It works on unsorted collections but has a time complexity of O(N).
      - <strong>Binary Search:</strong> Operates on sorted collections by repeatedly dividing the search space in half. This achieves logarithmic time complexity of O(log N).
      
      <h3>2. Binary Search Partition Equation</h3>
      At each step, the algorithm calculates the middle index:
      <pre className="font-mono bg-black/40 p-3 rounded-lg border border-white/5 text-purple-300 text-xs my-3">
        MidIndex = LowIndex + floor((HighIndex - LowIndex) / 2)
      </pre>
      Using <code className="text-[#00e5ff] font-mono">LowIndex + floor(...)</code> instead of <code className="text-[#00e5ff] font-mono">(LowIndex + HighIndex) / 2</code> avoids integer overflow bugs in large arrays.
    `
  },
  recursion: {
    detailedIntro: `
      Recursion is a programming technique where a function solves a problem by calling itself.
      It breaks complex problems down into smaller, self-similar subproblems.
      
      Every recursive function must define a base case to terminate execution and prevent infinite call loops.
    `,
    detailedTheory: `
      <h3>1. The Anatomy of Recursion</h3>
      - <strong>Base Case:</strong> The terminating condition that returns a value directly without another recursive call.
      - <strong>Recursive Step:</strong> The logic that processes the problem and calls the function with a reduced input.
      
      <h3>2. The Hardware Call Stack</h3>
      Each recursive call pushes an activation record onto the call stack. 
      If the recursion goes too deep without reaching the base case, it exceeds the stack capacity, causing a <strong>Stack Overflow</strong> error.
    `
  },
  backtracking: {
    detailedIntro: `
      Backtracking is an algorithmic technique for solving problems recursively by attempting to build a solution incrementally, one step at a time.
      If a step violates the problem constraints, the algorithm discards that step (backtracks) and tries an alternative path.
      
      It is effectively a systematic depth-first search of a problem's state space.
    `,
    detailedTheory: `
      <h3>1. State Space Tree Traversals</h3>
      Backtracking treats a problem's configuration options as a tree structure. 
      It traverses the tree using DFS, pruning subtrees as soon as it determines they cannot lead to a valid solution.
      
      <h3>2. Classic Applications</h3>
      Backtracking is ideal for constraint satisfaction problems:
      - The N-Queens puzzle.
      - Sudoku solvers.
      - Graph vertex coloring.
    `
  },
  'dynamic-programming': {
    detailedIntro: `
      Dynamic Programming (DP) is an optimization technique used to solve complex problems by breaking them down into overlapping subproblems.
      It is applicable to problems that exhibit two key properties:
      1. <strong>Overlapping Subproblems:</strong> Subproblems are solved repeatedly.
      2. <strong>Optimal Substructure:</strong> The optimal solution to the problem can be constructed from optimal solutions to its subproblems.
      
      DP optimizes execution by solving each subproblem only once and caching the result.
    `,
    detailedTheory: `
      <h3>1. Optimization Methodologies</h3>
      - <strong>Top-Down (Memoization):</strong> Solves the problem recursively, caching subproblem results in a hash table or array to avoid redundant calculations.
      - <strong>Bottom-Up (Tabulation):</strong> Solves the problem iteratively, building a table of subproblem solutions from the smallest base cases up to the final target.
      
      <h3>2. Tabulation Example: The Fibonacci Sequence</h3>
      Instead of recursive calculations, tabulation builds the sequence in linear time:
      <pre className="font-mono bg-black/40 p-3 rounded-lg border border-white/5 text-purple-300 text-xs my-3">
        F[i] = F[i-1] + F[i-2]
      </pre>
    `
  },
  greedy: {
    detailedIntro: `
      A Greedy Algorithm is an algorithmic paradigm that builds a solution step-by-step, making the locally optimal choice at each stage.
      It operates on the hope that choosing the best local option will lead to a globally optimal solution.
      
      Greedy algorithms are generally simple, fast, and highly efficient, but they do not guarantee a global optimum for all problems.
    `,
    detailedTheory: `
      <h3>1. The Greedy Choice Property</h3>
      A problem can be solved optimally with a greedy approach if it exhibits:
      - <strong>Greedy Choice Property:</strong> A global optimum can be reached by making local greedy choices.
      - <strong>Optimal Substructure:</strong> The optimal solution to the subproblem after making the greedy choice can be combined to find the global optimum.
      
      <h3>2. Classic Applications</h3>
      Greedy algorithms are highly effective for optimization tasks:
      - Fractional Knapsack problem.
      - Huffman Coding for file compression.
      - Minimum Spanning Trees (Kruskal's and Prim's algorithms).
    `
  }
};
