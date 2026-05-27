import { fundamentalTopics } from './dsa/fundamental';
import { advancedTopics } from './dsa/advanced';
import { algorithmsTopics } from './dsa/algorithms';

export const dsaTopicsData = {
  ...fundamentalTopics,
  ...advancedTopics,
  ...algorithmsTopics
};

export const dsaCategoryList = [
  {
    categoryName: 'Fundamental Data Structures',
    topics: [
      { name: 'Arrays', slug: 'arrays' },
      { name: 'Linked Lists', slug: 'linked-lists' },
      { name: 'Stack', slug: 'stack' },
      { name: 'Queue', slug: 'queue' },
      { name: 'Hashing', slug: 'hashing' }
    ]
  },
  {
    categoryName: 'Advanced Data Structures',
    topics: [
      { name: 'Trees (Binary Tree)', slug: 'trees' },
      { name: 'BST (Binary Search Tree)', slug: 'bst' },
      { name: 'AVL Trees', slug: 'avl-trees' },
      { name: 'Heap', slug: 'heap' },
      { name: 'Trie', slug: 'trie' },
      { name: 'Graphs', slug: 'graphs' }
    ]
  },
  {
    categoryName: 'Algorithms',
    topics: [
      { name: 'Sorting Algorithms', slug: 'sorting' },
      { name: 'Searching Algorithms', slug: 'searching' },
      { name: 'Recursion', slug: 'recursion' },
      { name: 'Backtracking (N-Queens)', slug: 'backtracking' },
      { name: 'Dynamic Programming (DP)', slug: 'dynamic-programming' },
      { name: 'Greedy Algorithms', slug: 'greedy' }
    ]
  }
];
