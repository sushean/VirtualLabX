export const advancedTopics = {
  'trees': {
    title: 'Trees',
    slug: 'trees',
    category: 'Advanced Data Structures',
    difficulty: 'Intermediate',
    introduction: 'A tree is a non-linear hierarchical data structure consisting of nodes connected by edges. The top node is called the ROOT. Each node contains a value and references to its children nodes.',
    prerequisites: [
      { title: 'Linked Structures', body: [{ type: 'paragraph', text: 'Understanding nodes and memory address references from linked lists.' }] },
      { title: 'Recursion', body: [{ type: 'paragraph', text: 'Familiarity with recursive functional calls since trees are self-referential structures.' }] }
    ],
    objective: [
      'Learn standard tree terminologies (root, child, leaf, height, depth).',
      'Understand Binary Tree traversal strategies: Pre-order, In-order, and Post-order.',
      'Visualize traversal step-by-step sequences on dynamic node trees.',
      'Implement binary tree nodes and recursive traversal methods.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'A tree is a collection of nodes connected by directed edges. Unlike arrays or lists, which are linear, a tree represents hierarchical relationships (like file directories or organizational charts). A binary tree restricts each node to a maximum of two children, called the <b>left child</b> and the <b>right child</b>.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Root:</b> The topmost node with no parent.</li><li><b>Leaf:</b> Nodes located at the bottom bounds of the tree with no child nodes.</li><li><b>Depth:</b> The number of edge steps from the root to the node.</li><li><b>Height:</b> The number of edge steps in the longest path from the node to a leaf.</li></ul>' },
      { type: 'alert-red', title: 'Traversal Sequencing', text: 'To visit all nodes, we use Depth-First Search (DFS) traversals: <br/><b>In-order</b> (Left-Root-Right), <b>Pre-order</b> (Root-Left-Right), or <b>Post-order</b> (Left-Right-Root).' }
    ],
    complexity: {
      time: {
        best: 'O(1) Root Access',
        average: 'O(N) Traversal Scan',
        worst: 'O(N) Search Search'
      },
      space: 'O(H) recursion height stack bounds'
    },
    applications: [
      { name: 'File Directories', description: 'Folders and subfolders inside operating systems.' },
      { name: 'HTML DOM Trees', description: 'Visual nested tag layout models inside browsers.' }
    ],
    quiz: [
      {
        question: 'Which traversal visits nodes in the order: Left, Right, Root?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        answer: 2,
        explanation: 'Post-order traversal recursively visits left subtrees, right subtrees, and finally visits the root node.'
      },
      {
        question: 'In a binary tree of height H, what is the maximum number of leaves it can contain?',
        options: ['H', '2 * H', '2^H', '2^(H+1) - 1'],
        answer: 2,
        explanation: 'At height H, a completely full binary tree contains a maximum of 2^H leaf nodes.'
      },
      {
        question: 'What is a complete binary tree?',
        options: ['Every node has exactly 2 children', 'All levels are completely filled except possibly the last, which is filled from left to right', 'A tree with only left child nodes', 'A tree where left subtree height equals right subtree height'],
        answer: 1,
        explanation: 'A complete binary tree has all levels filled, with the last level filled starting from the left, which makes it perfect for flat array mapping.'
      },
      {
        question: 'Which traversal of a binary tree visits the root node first, before visiting any child subtrees?',
        options: ['In-order', 'Pre-order', 'Post-order', 'Level-order'],
        answer: 1,
        explanation: 'Pre-order traversal visits the active root node first, then recursively traverses the left and right subtrees.'
      },
      {
        question: 'If a binary tree node has its left child at memory address 0x200 and right child at 0x300, how many child pointers are stored in its struct?',
        options: ['One pointer', 'Two pointers', 'Zero pointers', 'A dynamic array of pointers'],
        answer: 1,
        explanation: 'Binary tree nodes contain two explicit child reference pointers: left and right.'
      }
    ],
    code: {
      Python: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def inorderTraversal(root, res=None):
    if res is None: res = []
    if root:
        inorderTraversal(root.left, res)
        res.append(root.val)
        inorderTraversal(root.right, res)
    return res`,
      JavaScript: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function inorderTraversal(root, res = []) {
  if (root) {
    inorderTraversal(root.left, res);
    res.push(root.val);
    inorderTraversal(root.right, res);
  }
  return res;
}`,
      Java: `import java.util.ArrayList;
import java.util.List;

class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int x) { val = x; left = right = null; }
}

public class TreeTraversals {
    public List<Integer> inorder(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        inorderHelper(root, res);
        return res;
    }
    private void inorderHelper(TreeNode root, List<Integer> res) {
        if (root == null) return;
        inorderHelper(root.left, res);
        res.add(root.val);
        inorderHelper(root.right, res);
    }
}`,
      'C++': `#include <vector>

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class TreeTraversal {
public:
    std::vector<int> inorder(TreeNode* root) {
        std::vector<int> res;
        inorderHelper(root, res);
        return res;
    }
private:
    void inorderHelper(TreeNode* root, std::vector<int>& res) {
        if (!root) return;
        inorderHelper(root->left, res);
        res.push_back(root->val);
        inorderHelper(root->right, res);
    }
};`
    },
    playground: {
      title: 'Find Maximum Depth of a Binary Tree',
      description: 'Given the root node of a binary tree, write a function to calculate its maximum height/depth. The max depth is the number of nodes along the longest path from root to leaf.',
      sampleInput: 'root = [3, 9, 20, null, null, 15, 7]',
      sampleOutput: '3',
      startingTemplate: `function maxDepth(root) {
  if (!root) return 0;
  let leftDepth = maxDepth(root.left);
  let rightDepth = maxDepth(root.right);
  return Math.max(leftDepth, rightDepth) + 1;
}`
    },
    resources: [
      { type: 'Docs', title: 'Binary Tree Traversals and Properties', link: 'https://www.geeksforgeeks.org/binary-tree-data-structure/' },
      { type: 'Video', title: 'Trees Traversals Recursion - MyCodeSchool', link: 'https://www.youtube.com/watch?v=gm8DUJJhmY4' }
    ]
  },

  'bst': {
    title: 'Binary Search Trees (BST)',
    slug: 'bst',
    category: 'Advanced Data Structures',
    difficulty: 'Intermediate',
    introduction: 'A Binary Search Tree (BST) is a binary tree with a sorting property: For any node, all left subtree keys are strictly less than its key, and all right subtree keys are strictly greater.',
    prerequisites: [
      { title: 'Trees', body: [{ type: 'paragraph', text: 'Solid understanding of parent-child node layouts.' }] }
    ],
    objective: [
      'Learn the BST sorting constraints.',
      'Understand how search, insert, and delete search operations execute in logarithmic O(log N) average time.',
      'Visualize paths traversed down a tree during insertion scans.',
      'Implement recursive BST search and insert methods.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'A BST relies on organizing elements during insertion to speed up search routines. When searching for key `x`: We compare it to the current node. If `x` matches, search completes. If `x` is smaller, we recursively step down the left branch. If larger, we branch right. This halves search scopes at each step, matching binary search.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Left Subtree:</b> All element keys must be strictly less than parent key.</li><li><b>Right Subtree:</b> All element keys must be strictly greater than parent key.</li><li><b>In-order Sort:</b> An In-order traversal of a BST prints elements in strictly sorted ascending order!</li></ul>' },
      { type: 'alert-red', title: 'Worst-case Degradation', text: 'If elements are inserted in already sorted order (e.g. 1, 2, 3, 4), the BST degrades into a linear skewed line, collapsing O(log N) searches into O(N) linear scans.' }
    ],
    complexity: {
      time: {
        best: 'O(log N) Search & Insert',
        average: 'O(log N) Average Search',
        worst: 'O(N) Skewed Tree Search'
      },
      space: 'O(N) tree storage'
    },
    applications: [
      { name: 'Virtual Databases', description: 'Fast indexing lookup schemas.' },
      { name: 'Symbol Tables', description: 'Used in compilers to maintain token definitions.' }
    ],
    quiz: [
      {
        question: 'Which traversal printed sequence of a BST will result in sorted order?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        answer: 1,
        explanation: 'An in-order traversal (Left, Root, Right) of a valid BST always retrieves keys in sorted ascending order.'
      },
      {
        question: 'What is the worst-case time complexity of searching a skewed BST of N nodes?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        answer: 2,
        explanation: 'In a skewed BST (degenerated into a list), search degrades to O(N) as every node must be checked.'
      },
      {
        question: 'In a binary search tree, what is the predecessor of a node?',
        options: ['Its parent node', 'The node with the maximum value in its left subtree', 'The node with the minimum value in its right subtree', 'Its left child'],
        answer: 1,
        explanation: 'The in-order predecessor is the largest key that is smaller than the current node\'s key, located by going left once and then as far right as possible.'
      },
      {
        question: 'What is the average time complexity of inserting a key into a Binary Search Tree of size N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        answer: 1,
        explanation: 'Assuming a balanced tree, inserting a key requires traversing a path from root to leaf, which takes logarithmic O(log N) comparisons.'
      },
      {
        question: 'How does BST deletion handle a node that has two children?',
        options: ['It cannot be deleted', 'It replaces the node with its in-order successor or predecessor, then deletes that leaf', 'It deletes the entire subtree', 'It shifts all nodes left'],
        answer: 1,
        explanation: 'To delete a node with two children, we swap its value with its in-order successor (the smallest key in the right subtree) or predecessor, and delete the swapped node.'
      }
    ],
    code: {
      Python: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def insert(self, root, val):
        if not root:
            return TreeNode(val)
        if val < root.val:
            root.left = self.insert(root.left, val)
        else:
            root.right = self.insert(root.right, val)
        return root
        
    def search(self, root, val):
        if not root or root.val == val:
            return root
        if val < root.val:
            return self.search(root.left, val)
        return self.search(root.right, val)`,
      JavaScript: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  insert(root, val) {
    if (!root) return new TreeNode(val);
    if (val < root.val) {
      root.left = this.insert(root.left, val);
    } else {
      root.right = this.insert(root.right, val);
    }
    return root;
  }

  search(root, val) {
    if (!root || root.val === val) return root;
    if (val < root.val) return this.search(root.left, val);
    return this.search(root.right, val);
  }
}`,
      Java: `class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int x) { val = x; left = right = null; }
}

public class BST {
    public TreeNode insert(TreeNode root, int val) {
        if (root == null) return new TreeNode(val);
        if (val < root.val) {
            root.left = insert(root.left, val);
        } else {
            root.right = insert(root.right, val);
        }
        return root;
    }

    public TreeNode search(TreeNode root, int val) {
        if (root == null || root.val == val) return root;
        if (val < root.val) return search(root.left, val);
        return search(root.right, val);
    }
}`,
      'C++': `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class BST {
public:
    TreeNode* insert(TreeNode* root, int val) {
        if (!root) return new TreeNode(val);
        if (val < root->val) root->left = insert(root->left, val);
        else root->right = insert(root->right, val);
        return root;
    }
    
    TreeNode* search(TreeNode* root, int val) {
        if (!root || root->val == val) return root;
        if (val < root->val) return search(root->left, val);
        return search(root->right, val);
    }
};`
    },
    playground: {
      title: 'Validate Binary Search Tree',
      description: 'Given the root node of a binary tree, write a function to determine if it is a valid binary search tree (BST).',
      sampleInput: 'root = [2, 1, 3]',
      sampleOutput: 'true',
      startingTemplate: `function isValidBST(root, min = null, max = null) {
  if (!root) return true;
  if (min !== null && root.val <= min) return false;
  if (max !== null && root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`
    },
    resources: [
      { type: 'Docs', title: 'Binary Search Tree Insertion and Searches', link: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/' },
      { type: 'Video', title: 'BST Creation and Operations - Abdul Bari', link: 'https://www.youtube.com/watch?v=hWqy78b1d40' }
    ]
  },

  'avl-trees': {
    title: 'AVL Trees',
    slug: 'avl-trees',
    category: 'Advanced Data Structures',
    difficulty: 'Advanced',
    introduction: 'An AVL tree is a self-balancing binary search tree. For any node, the difference in height between its left and right subtrees (the Balance Factor) must never exceed 1, or else self-balancing rotations are triggered.',
    prerequisites: [
      { title: 'BST Foundations', body: [{ type: 'paragraph', text: 'Complete command over binary search tree node structures and pointer traversals.' }] }
    ],
    objective: [
      'Learn balance factors: BF = Height(Left) - Height(Right).',
      'Explain single and double balance rotations (LL, RR, LR, RL).',
      'Visualize balance rotations restoring strict height levels.',
      'Implement an AVL tree with rotation logic.'
    ],
    theory: [
      { type: 'header-purple', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'AVL trees solve the worst-case O(N) degradation of BSTs. Each node maintains a height variable. Balance factor is computed as `BF = height(left) - height(right)`. If `BF` hits `-2` or `2`, the node is unbalanced. The tree automatically corrects this in O(1) time using pointer swaps called rotations.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Single Rotations:</b> Left-Left (LL) balance corrected by a Single Right Rotation; Right-Right (RR) corrected by Single Left.</li><li><b>Double Rotations:</b> Left-Right (LR) require a Left Rotation then a Right Rotation; Right-Left (RL) require a Right then a Left.</li></ul>' },
      { type: 'alert-red', title: 'Performance Guarantee', text: 'By keeping the height strictly balanced, AVL trees guarantee O(log N) search, insert, and delete operations even in the worst-case scenarios.' }
    ],
    complexity: {
      time: {
        best: 'O(log N) Search',
        average: 'O(log N) Insert',
        worst: 'O(log N) Delete'
      },
      space: 'O(N) memory slots'
    },
    applications: [
      { name: 'Large Scale Databases', description: 'Ideal for frequent search queries on large data sets.' },
      { name: 'Memory Allocators', description: 'Used to manage memory blocks dynamically by size.' }
    ],
    quiz: [
      {
        question: 'What is the valid range of the Balance Factor in an AVL tree node?',
        options: ['-1, 0, 1', '-2, -1, 0, 1, 2', 'Any positive integer', 'Only 0'],
        answer: 0,
        explanation: 'An AVL node is balanced if its Balance Factor remains -1, 0, or 1. Any other value triggers automatic rotations.'
      },
      {
        question: 'Which rotation is performed to correct a Left-Right (LR) imbalance?',
        options: ['Single Right Rotation', 'Single Left Rotation', 'Left-then-Right Double Rotation', 'Right-then-Left Double Rotation'],
        answer: 2,
        explanation: 'An LR imbalance is corrected using a double rotation: first rotating left at the child, then rotating right at the parent.'
      },
      {
        question: 'What is the maximum height of an AVL tree containing N nodes?',
        options: ['O(N)', 'O(N log N)', 'O(log N)', 'O(N²)'],
        answer: 2,
        explanation: 'AVL trees strictly balance heights at every node, guaranteeing that the height remains bounded by 1.44 log2 N.'
      },
      {
        question: 'Which double rotation is performed to fix an imbalance caused by an insertion in the right subtree of a node\'s left child?',
        options: ['LL Rotation', 'RR Rotation', 'LR Rotation', 'RL Rotation'],
        answer: 2,
        explanation: 'An insertion into the right child of a left subtree creates a Left-Right (LR) shape imbalance, which is resolved by rotating the left child left and then the parent right.'
      },
      {
        question: 'What balance factor requires immediate rotation corrections in AVL trees?',
        options: ['0', '1 or -1', '2 or -2', 'Only 2'],
        answer: 2,
        explanation: 'The AVL height invariant dictates that the balance factor must stay within {-1, 0, 1}. A balance factor of 2 or -2 triggers a rebalancing rotation.'
      }
    ],
    code: {
      Python: `class AVLNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

class AVLTree:
    def getHeight(self, node):
        return node.height if node else 0
        
    def getBalance(self, node):
        return self.getHeight(node.left) - self.getHeight(node.right) if node else 0
        
    def rightRotate(self, y):
        x = y.left
        T2 = x.right
        x.right = y
        y.left = T2
        y.height = 1 + max(self.getHeight(y.left), self.getHeight(y.right))
        x.height = 1 + max(self.getHeight(x.left), self.getHeight(x.right))
        return x
        
    def leftRotate(self, x):
        y = x.right
        T2 = y.left
        y.left = x
        x.right = T2
        x.height = 1 + max(self.getHeight(x.left), self.getHeight(x.right))
        y.height = 1 + max(self.getHeight(y.left), self.getHeight(y.right))
        return y`,
      JavaScript: `class AVLNode {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rightRotate(y) {
    let x = y.left;
    let T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  leftRotate(x) {
    let y = x.right;
    let T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }
}`,
      Java: `class AVLNode {
    int key, height;
    AVLNode left, right;
    AVLNode(int d) { key = d; height = 1; }
}

public class AVLTree {
    int height(AVLNode N) { return N == null ? 0 : N.height; }
    
    AVLNode rightRotate(AVLNode y) {
        AVLNode x = y.left;
        AVLNode T2 = x.right;
        x.right = y; y.left = T2;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        return x;
    }

    AVLNode leftRotate(AVLNode x) {
        AVLNode y = x.right;
        AVLNode T2 = y.left;
        y.left = x; x.right = T2;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        return y;
    }
}`,
      'C++': `struct AVLNode {
    int key;
    int height;
    AVLNode* left;
    AVLNode* right;
    AVLNode(int k) : key(k), height(1), left(nullptr), right(nullptr) {}
};

class AVLTree {
    int height(AVLNode* n) { return n ? n->height : 0; }
    
    AVLNode* rightRotate(AVLNode* y) {
        AVLNode* x = y->left;
        AVLNode* T2 = x->right;
        x->right = y;
        y->left = T2;
        y->height = std::max(height(y->left), height(y->right)) + 1;
        x->height = std::max(height(x->left), height(x->right)) + 1;
        return x;
    }
public:
    int getBalance(AVLNode* n) { return n ? height(n->left) - height(n->right) : 0; }
};`
    },
    playground: {
      title: 'Calculate Balanced AVL Heights',
      description: 'Given a standard BST, write a function to calculate the balance factor at each node and check if the tree is currently height-balanced.',
      sampleInput: 'root = [1, null, 2, null, 3]',
      sampleOutput: 'false',
      startingTemplate: `function isBalanced(root) {
  if (!root) return true;
  function getHeight(node) {
    if (!node) return 0;
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  }
  let bf = getHeight(root.left) - getHeight(root.right);
  if (Math.abs(bf) > 1) return false;
  return isBalanced(root.left) && isBalanced(root.right);
}`
    },
    resources: [
      { type: 'Docs', title: 'AVL Balancing and Rotations', link: 'https://www.geeksforgeeks.org/avl-tree-data-structure/' },
      { type: 'Video', title: 'AVL Trees Single/Double Rotations - Abdul Bari', link: 'https://www.youtube.com/watch?v=jDM6_TkxgjQ' }
    ]
  },

  'heap': {
    title: 'Heap',
    slug: 'heap',
    category: 'Advanced Data Structures',
    difficulty: 'Intermediate',
    introduction: 'A Heap is a complete binary tree that satisfies the Heap Property: In a Max Heap, every parent node is greater than or equal to its children. In a Min Heap, every parent is less than or equal.',
    prerequisites: [
      { title: 'Binary Trees', body: [{ type: 'paragraph', text: 'Understanding complete tree hierarchies where levels are fully filled.' }] }
    ],
    objective: [
      'Learn Min and Max Heap structural constraints.',
      'Explain mapping complete binary trees directly into flat arrays.',
      'Visualize heapify up and down bubbling operations.',
      'Implement priority queues using heaps.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'A heap is a complete binary tree represented as an array without explicit node pointers. For any element at index `i`: <br/><b class="font-mono text-[#00e5ff] text-base bg-black/40 px-2 py-1 rounded">Parent = (i-1)/2</b>, <b class="font-mono text-[#00e5ff] text-base bg-black/40 px-2 py-1 rounded">LeftChild = 2*i + 1</b>, and <b class="font-mono text-[#00e5ff] text-base bg-black/40 px-2 py-1 rounded">RightChild = 2*i + 2</b>. This compact layout allows fast, pointerless traversal.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Complete Tree:</b> All levels are filled from left to right, ensuring height balance.</li><li><b>Heapify Up:</b> Used during insertion, bubbling an element up until the heap property is satisfied.</li><li><b>Heapify Down:</b> Used when extracting the root, swapping it with the last element and bubbling it down.</li></ul>' },
      { type: 'alert-red', title: 'Priority Extract', text: 'Heaps extract the minimum/maximum element in O(1) time and restore balance in O(log N) time, making them optimal for priority queues.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Find Min/Max',
        average: 'O(log N) Insert & Extract',
        worst: 'O(N log N) Heap Sort'
      },
      space: 'O(N) contiguous table storage'
    },
    applications: [
      { name: 'Priority Queues', description: 'Manages jobs based on priority levels rather than insertion order.' },
      { name: 'Heap Sort', description: 'An in-place sorting algorithm with a guaranteed O(N log N) time complexity.' }
    ],
    quiz: [
      {
        question: 'Where is the maximum element stored in a valid Max Heap?',
        options: ['At the deepest leaf node', 'At the root node (index 0)', 'In the middle index', 'Heaps are not sorted'],
        answer: 1,
        explanation: 'In a Max Heap, the root node (index 0) always holds the maximum key in the entire tree.'
      },
      {
        question: 'For a node stored at index i in a zero-indexed array heap, what is the index of its left child?',
        options: ['i + 1', '2 * i', '2 * i + 1', '2 * i + 2'],
        answer: 2,
        explanation: 'In an array heap, the left child of a node at index i is located at index 2*i + 1.'
      },
      {
        question: 'What is the time complexity of building a heap from an unsorted array of size N using the bottom-up heapify method?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        answer: 2,
        explanation: 'Constructing a heap bottom-up runs in linear O(N) time because most nodes reside near the bottom leaves where bubble-down distances are minimal.'
      },
      {
        question: 'In a Min-Heap, where is the second smallest element located?',
        options: ['At the root (index 0)', 'At index 1 or index 2 (children of the root)', 'At the absolute final leaf index', 'Anywhere in the array'],
        answer: 1,
        explanation: 'Since every child is larger than or equal to its parent, the second smallest value in a Min-Heap must be one of the immediate children of the root (index 1 or index 2).'
      },
      {
        question: 'Which heap operation requires a Heapify Down (bubble-down) adjustment?',
        options: ['Inserting an element', 'Extracting the root element', 'Peeking the minimum', 'Increasing the capacity'],
        answer: 1,
        explanation: 'Extracting the root involves placing the last element at index 0 and bubbling it down (Heapify Down) to restore the heap property.'
      }
    ],
    code: {
      Python: `class MinHeap:
    def __init__(self):
        self.heap = []
        
    def insert(self, val):
        self.heap.append(val)
        self.heapifyUp(len(self.heap) - 1)
        
    def heapifyUp(self, i):
        parent = (i - 1) // 2
        if i > 0 and self.heap[i] < self.heap[parent]:
            self.heap[i], self.heap[parent] = self.heap[parent], self.heap[i]
            self.heapifyUp(parent)
            
    def extractMin(self):
        if not self.heap: return None
        if len(self.heap) == 1: return self.heap.pop()
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self.heapifyDown(0)
        return root
        
    def heapifyDown(self, i):
        left = 2 * i + 1
        right = 2 * i + 2
        smallest = i
        if left < len(self.heap) and self.heap[left] < self.heap[smallest]:
            smallest = left
        if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
            smallest = right
        if smallest != i:
            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
            self.heapifyDown(smallest)`,
      JavaScript: `class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(val) {
    this.heap.push(val);
    this.heapifyUp(this.heap.length - 1);
  }

  heapifyUp(i) {
    let p = Math.floor((i - 1) / 2);
    if (i > 0 && this.heap[i] < this.heap[p]) {
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      this.heapifyUp(p);
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    let root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return root;
  }

  heapifyDown(i) {
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let smallest = i;
    if (left < this.heap.length && this.heap[left] < this.heap[smallest]) smallest = left;
    if (right < this.heap.length && this.heap[right] < this.heap[smallest]) smallest = right;
    if (smallest !== i) {
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      this.heapifyDown(smallest);
    }
  }
}`,
      Java: `import java.util.ArrayList;

public class MinHeap {
    private ArrayList<Integer> heap = new ArrayList<>();

    public void insert(int val) {
        heap.add(val);
        heapifyUp(heap.size() - 1);
    }

    private void heapifyUp(int i) {
        int p = (i - 1) / 2;
        if (i > 0 && heap.get(i) < heap.get(p)) {
            int temp = heap.get(i);
            heap.set(i, heap.get(p));
            heap.set(p, temp);
            heapifyUp(p);
        }
    }
}`,
      'C++': `#include <vector>
#include <algorithm>

class MinHeap {
    std::vector<int> heap;
    void heapifyUp(int i) {
        int p = (i - 1) / 2;
        if (i > 0 && heap[i] < heap[p]) {
            std::swap(heap[i], heap[p]);
            heapifyUp(p);
        }
    }
public:
    void insert(int val) {
        heap.push_back(val);
        heapifyUp(heap.size() - 1);
    }
};`
    },
    playground: {
      title: 'Kth Largest Element in an Array',
      description: 'Given an unsorted array of integers, find the Kth largest element using a heap in O(N log K) time.',
      sampleInput: '[3, 2, 1, 5, 6, 4], k = 2',
      sampleOutput: '5',
      startingTemplate: `function findKthLargest(nums, k) {
  // Use a min heap of size k
  nums.sort((a,b) => b-a);
  return nums[k-1];
}`
    },
    resources: [
      { type: 'Docs', title: 'Binary Heaps and Complete Trees', link: 'https://www.geeksforgeeks.org/binary-heap/' },
      { type: 'Video', title: 'Heaps and Heapify Mechanics - Abdul Bari', link: 'https://www.youtube.com/watch?v=H5l808yT-o0' }
    ]
  },

  'trie': {
    title: 'Trie',
    slug: 'trie',
    category: 'Advanced Data Structures',
    difficulty: 'Advanced',
    introduction: 'A Trie (Prefix Tree) is an ordered tree structure used to store strings. Each node represents a single character along a word prefix path, allowing optimal auto-completion search times.',
    prerequisites: [
      { title: 'Trees', body: [{ type: 'paragraph', text: 'Knowledge of multi-child tree hierarchies.' }] },
      { title: 'String Manipulation', body: [{ type: 'paragraph', text: 'Understanding word prefix matching patterns.' }] }
    ],
    objective: [
      'Learn the Trie Node model, which maps child characters using dictionaries or arrays.',
      'Explain how string search runs in O(L) time, where L is the string length.',
      'Visualize prefix paths lighting up character-by-character.',
      'Implement a dynamic Trie with insertion and lookup logic.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'A Trie represents text keys as paths in a tree. Each node contains a key-value dictionary (or an array of size 26 for English characters) representing the next letters, and a boolean flag `isEndOfWord`. Inserting "CAT" and "CAR" shares the "C" -> "A" path, branching out only at the final letter.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Shared Prefixes:</b> Overlapping prefixes are stored only once, saving memory.</li><li><b>Word Mark:</b> The `isEndOfWord` flag distinguishes between complete words and prefixes (e.g. distinguishing "CAT" from prefix "CA").</li></ul>' },
      { type: 'alert-red', title: 'Search Efficiency', text: 'Searching a word of length L takes O(L) time, which is completely independent of the total number of words stored in the Trie database!' }
    ],
    complexity: {
      time: {
        best: 'O(L) Insert (length L)',
        average: 'O(L) Search',
        worst: 'O(L) Prefix Lookup'
      },
      space: 'O(ALPHABET_SIZE * N * L) worst-case storage'
    },
    applications: [
      { name: 'Auto-complete Input', description: 'Searches matching prefixes in search engines as you type.' },
      { name: 'IP Routing Lookups', description: 'Matches subnet masks dynamically.' }
    ],
    quiz: [
      {
        question: 'What does the isEndOfWord boolean flag represent in a Trie node?',
        options: ['It means the tree has reached max height', 'It signifies the node marks the completion of a valid word', 'It means the node has no children', 'It triggers automatic balancing'],
        answer: 1,
        explanation: 'The isEndOfWord flag marks nodes where a valid complete word ends, distinguishing it from general shared prefixes.'
      },
      {
        question: 'If a Trie contains 10,000 words, what is the search time complexity to check a word of length L?',
        options: ['O(log 10,000)', 'O(10,000)', 'O(L)', 'O(L * log 10,000)'],
        answer: 2,
        explanation: 'Trie search is O(L), where L is the word length. It is completely independent of the total number of words stored in the tree.'
      },
      {
        question: 'What is the key advantage of a Trie over a Hash Map for storing dictionary words?',
        options: ['Tries use less total memory in all cases', 'Tries support prefix-based matching and auto-complete queries', 'Tries have O(1) space complexity', 'Tries are balanced'],
        answer: 1,
        explanation: 'A Trie structures keys by prefix character paths, making it easy to retrieve all words sharing a common prefix (e.g. search suggestions).'
      },
      {
        question: 'If you insert \'CODE\' and \'CODER\' into a Trie, how many nodes will represent the prefix \'COD\'?',
        options: ['3 nodes', '6 nodes', '1 node', '9 nodes'],
        answer: 0,
        explanation: 'The letters \'C\', \'O\', \'D\' are shared and represented by exactly 3 nodes (\'C\' -> \'O\' -> \'D\') in the common path.'
      },
      {
        question: 'What is the alphabet size factor that determines the number of child pointers in each Trie node for standard English lowercase strings?',
        options: ['10', '26', '256', 'Infinite'],
        answer: 1,
        explanation: 'For lowercase English letters, each node carries up to 26 child references (one for each character \'a\' through \'z\').'
      }
    ],
    code: {
      Python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.isEndOfWord = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
        
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.isEndOfWord = True
        
    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.isEndOfWord`,
      JavaScript: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isEndOfWord;
  }
}`,
      Java: `import java.util.HashMap;
import java.util.Map;

class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEndOfWord = false;
}

public class Trie {
    private TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode node = root;
        for(char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEndOfWord = true;
    }

    public boolean search(String word) {
        TrieNode node = root;
        for(char c : word.toCharArray()) {
            if(!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return node.isEndOfWord;
    }
}`,
      'C++': `#include <unordered_map>
#include <string>

class TrieNode {
public:
    std::unordered_map<char, TrieNode*> children;
    bool isEndOfWord = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    
    void insert(std::string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEndOfWord = true;
    }
};`
    },
    playground: {
      title: 'Trie Prefix Search Auto-Complete',
      description: 'Implement a function to check if there is any word in the Trie that starts with the given prefix string.',
      sampleInput: 'insert("apple"), startsWith("app")',
      sampleOutput: 'true',
      startingTemplate: `function startsWith(trieRoot, prefix) {
  let node = trieRoot;
  for(let char of prefix) {
    if(!node.children[char]) return false;
    node = node.children[char];
  }
  return true;
}`
    },
    resources: [
      { type: 'Docs', title: 'Trie Data Structure Prefix Matching', link: 'https://www.geeksforgeeks.org/trie-data-structure-dictionary-implementation/' },
      { type: 'Video', title: 'Trie Insertion and Retrieval Analysis', link: 'https://www.youtube.com/watch?v=zIjfhFhAFTc' }
    ]
  },

  'graphs': {
    title: 'Graphs',
    slug: 'graphs',
    category: 'Advanced Data Structures',
    difficulty: 'Advanced',
    introduction: 'A Graph is a non-linear network consisting of a set of vertices (nodes) connected by edges. Graphs represent network relations like social networks, maps, or data dependencies.',
    prerequisites: [
      { title: 'Queue & Stack', body: [{ type: 'paragraph', text: 'Understanding linear lists to manage active BFS/DFS search frontiers.' }] }
    ],
    objective: [
      'Learn graph terminologies (vertices, edges, directed/undirected, weighted).',
      'Explain representation strategies: Adjacency Matrix vs Adjacency List.',
      'Visualize Breadth-First Search (BFS) and Depth-First Search (DFS) traversals.',
      'Implement traversal and shortest path routing algorithms.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Graphs are mathematical structures representing network relationships. They are modeled as <b class="font-mono text-[#00e5ff] text-base bg-black/40 px-2 py-1 rounded">G = (V, E)</b>, where `V` is the set of vertices and `E` is the set of connecting edges. Weight factors can be assigned to edges to represent distance, cost, or bandwidth.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Adjacency Matrix:</b> A 2D array of size V x V where matrix[i][j] = 1 represents an edge between node i and j. Best for dense graphs.</li><li><b>Adjacency List:</b> An array of linked lists where list[i] stores the neighbors of node i. Highly space-efficient for sparse graphs.</li><li><b>BFS:</b> Uses a Queue to traverse level-by-level, finding the shortest path in unweighted graphs.</li><li><b>DFS:</b> Uses recursion or a Stack to explore as deep as possible down a path before backtracking.</li></ul>' },
      { type: 'alert-red', title: 'Infinite Loop Risk', text: 'If a graph contains cycles, traversal algorithms can fall into infinite loops unless they maintain a `visited` set to track visited nodes.' }
    ],
    complexity: {
      time: {
        best: 'O(V + E) BFS Traversal',
        average: 'O(V + E) DFS Traversal',
        worst: 'O(V²) Dijkstra Shortest Path'
      },
      space: 'O(V + E) adjacency storage bounds'
    },
    applications: [
      { name: 'Social Network Connections', description: 'Mapping friendships and connection paths between users.' },
      { name: 'GPS Navigation Routes', description: 'Finding the shortest path between locations using Dijkstra\'s or A* algorithms.' }
    ],
    quiz: [
      {
        question: 'Which linear data structure is used to implement Breadth-First Search (BFS)?',
        options: ['Stack', 'Queue', 'Array', 'Hash Map'],
        answer: 1,
        explanation: 'BFS uses a Queue to explore neighbors in FIFO order, ensuring nodes are visited level-by-level.'
      },
      {
        question: 'In a graph with cyclic paths, how do we prevent traversals from falling into infinite loops?',
        options: ['By sorting node labels', 'By tracking visited nodes in a boolean array or set', 'By using balanced AVL trees', 'By limiting recursion to 10 steps'],
        answer: 1,
        explanation: 'Maintaining a visited set allows the algorithm to check if a node has already been processed, preventing infinite loops in cyclic graphs.'
      },
      {
        question: 'Which shortest path algorithm handles graphs with non-negative edge weights using a priority queue?',
        options: ['Kruskal\'s Algorithm', 'Dijkstra\'s Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm'],
        answer: 1,
        explanation: 'Dijkstra\'s algorithm determines shortest paths from a single source node in weighted graphs using greedy priority node relaxation.'
      },
      {
        question: 'What is the maximum number of edges in a simple undirected graph with V vertices?',
        options: ['V', 'V * (V - 1)', 'V * (V - 1) / 2', '2^V'],
        answer: 2,
        explanation: 'A complete undirected graph of V vertices contains exactly V(V-1)/2 edges, representing all possible vertex pairs.'
      },
      {
        question: 'Which graph traversal uses a Stack (or recursion) to explore as deep as possible along each branch before backtracking?',
        options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Dijkstra\'s algorithm', 'Binary search'],
        answer: 1,
        explanation: 'DFS uses a LIFO Stack or recursive call stack to traverse down a single branch until a dead end is met.'
      }
    ],
    code: {
      Python: `class Graph:
    def __init__(self):
        self.adj = {}
        
    def addEdge(self, u, v):
        if u not in self.adj: self.adj[u] = []
        if v not in self.adj: self.adj[v] = []
        self.adj[u].append(v)
        self.adj[v].append(u) # Undirected
        
    def bfs(self, start):
        visited = set([start])
        queue = [start]
        res = []
        while queue:
            node = queue.pop(0)
            res.append(node)
            for neighbor in self.adj.get(node, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        return res`,
      JavaScript: `class Graph {
  constructor() {
    this.adj = new Map();
  }

  addEdge(u, v) {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);
    this.adj.get(u).push(v);
    this.adj.get(v).push(u); // Undirected
  }

  bfs(start) {
    let visited = new Set([start]);
    let queue = [start];
    let res = [];
    while (queue.length > 0) {
      let node = queue.shift();
      res.push(node);
      for (let neighbor of this.adj.get(node) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return res;
  }
}`,
      Java: `import java.util.*;

public class Graph {
    private Map<Integer, List<Integer>> adj = new HashMap<>();

    public void addEdge(int u, int v) {
        adj.putIfAbsent(u, new ArrayList<>());
        adj.putIfAbsent(v, new ArrayList<>());
        adj.get(u).add(v);
        adj.get(v).add(u);
    }

    public List<Integer> bfs(int start) {
        List<Integer> res = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();

        visited.add(start);
        queue.add(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            res.add(node);
            for (int neighbor : adj.getOrDefault(node, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return res;
    }
}`,
      'C++': `#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>

class Graph {
    std::unordered_map<int, std::vector<int>> adj;
public:
    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    
    std::vector<int> bfs(int start) {
        std::vector<int> res;
        std::unordered_set<int> visited;
        std::queue<int> q;
        
        visited.insert(start);
        q.push(start);
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            res.push_back(node);
            for (int neighbor : adj[node]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    q.push(neighbor);
                }
            }
        }
        return res;
    }
};`
    },
    playground: {
      title: 'Breadth-First Path Route Verification',
      description: 'Given an undirected graph, determine if a valid route/path exists between a source vertex and a destination vertex using BFS.',
      sampleInput: 'edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2',
      sampleOutput: 'true',
      startingTemplate: `function validPath(n, edges, source, destination) {
  let adj = new Map();
  for(let [u, v] of edges) {
    if(!adj.has(u)) adj.set(u, []);
    if(!adj.has(v)) adj.set(v, []);
    adj.get(u).push(v);
    adj.get(v).push(u);
  }
  let visited = new Set([source]);
  let queue = [source];
  while(queue.length > 0) {
    let node = queue.shift();
    if(node === destination) return true;
    for(let nb of adj.get(node) || []) {
      if(!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
    }
  }
  return false;
}`
    },
    resources: [
      { type: 'Docs', title: 'Graph Networks and Algorithms Map', link: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/' },
      { type: 'Video', title: 'Graph Traversals (BFS & DFS) - Abdul Bari', link: 'https://www.youtube.com/watch?v=pcKY4hjDrxk' }
    ]
  }
};
