export const algorithmsTopics = {
  'sorting': {
    title: 'Sorting Algorithms',
    slug: 'sorting',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    introduction: 'Sorting is the process of arranging elements in a systematic order (usually ascending or descending). It serves as the foundation for optimizing search routines and database storage models.',
    prerequisites: [
      { title: 'Array indexing', body: [{ type: 'paragraph', text: 'Solid understanding of array elements, iteration loops, and key comparison bounds.' }] }
    ],
    objective: [
      'Understand the difference between O(N²) comparison sorts and O(N log N) divide-and-conquer strategies.',
      'Visualize bar-swapping processes during Bubble and Selection sort execution steps.',
      'Learn in-place vs auxiliary space sorting requirements.',
      'Implement Bubble, Selection, and Quick Sort in standard languages.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Sorting algorithms arrange elements in a collection into a specific order. Simple comparison sorts like Bubble Sort repeatedly swap adjacent elements in O(N²) time. Advanced algorithms like Quick Sort or Merge Sort use a <b>divide-and-conquer</b> strategy to split problems recursively, achieving O(N log N) average times.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>In-place Sort:</b> Algorithms like Bubble and Quick Sort sort elements directly inside the input array without allocating extra arrays, using O(1) auxiliary space.</li><li><b>Stable Sort:</b> A sort is stable if it preserves the relative order of duplicate elements. Merge Sort is stable, while Quick Sort is unstable.</li></ul>' },
      { type: 'alert-red', title: 'Pivot Bottleneck', text: 'Quick Sort is highly efficient on average, but selecting a bad pivot (e.g. on already sorted arrays) degrades its performance to O(N²) quadratic time.' }
    ],
    complexity: {
      time: {
        best: 'O(N) Bubble Sort (optimized)',
        average: 'O(N log N) Quick Sort',
        worst: 'O(N²) Bubble/Selection Sort'
      },
      space: 'O(1) Auxiliary space'
    },
    applications: [
      { name: 'Database Query Optimization', description: 'Pre-sorting records speeds up range scans.' },
      { name: 'Graphics Render Order', description: 'Depth-sorting polygons prevents rendering overlap.' }
    ],
    quiz: [
      {
        question: 'Which sorting algorithm uses a divide-and-conquer approach and has an average time complexity of O(N log N)?',
        options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'],
        answer: 2,
        explanation: 'Quick Sort uses a partition pivot to divide the array, sorting sub-segments recursively in average O(N log N) time.'
      },
      {
        question: 'What is the space complexity of an in-place sorting algorithm like Bubble Sort?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
        answer: 0,
        explanation: 'In-place algorithms sort elements directly within the input array, requiring only O(1) constant auxiliary space.'
      },
      {
        question: 'Which sorting algorithm performs the absolute minimum number of array writes (swaps), making it optimal for systems where memory writes are expensive?',
        options: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort'],
        answer: 1,
        explanation: 'Selection Sort does at most O(N) swaps, which is the minimum among comparison-based sorts.'
      },
      {
        question: 'What is the worst-case time complexity of Merge Sort?',
        options: ['O(N)', 'O(N log N)', 'O(N²)', 'O(2^N)'],
        answer: 1,
        explanation: 'Merge Sort guarantees O(N log N) time complexity in all cases (best, average, worst) by recursively splitting the array and merging sub-arrays.'
      },
      {
        question: 'Which sorting algorithm is stable and has a space complexity of O(N) to hold auxiliary merged arrays?',
        options: ['Quick Sort', 'Bubble Sort', 'Heap Sort', 'Merge Sort'],
        answer: 3,
        explanation: 'Merge Sort requires an auxiliary array of size N to merge elements during the combine step, resulting in O(N) space complexity.'
      }
    ],
    code: {
      Python: `def bubbleSort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`,
      JavaScript: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
      Java: `public class BubbleSort {
    public void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
}`,
      'C++': `class Sorter {
public:
    void bubbleSort(int arr[], int n) {
        for (int i = 0; i < n - 1; i++) {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    std::swap(arr[j], arr[j + 1]);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
};`
    },
    playground: {
      title: 'Find Kth Smallest Element in Unsorted array',
      description: 'Given an unsorted array, find the Kth smallest element by sorting it first.',
      sampleInput: '[7, 10, 4, 3, 20, 15], k = 3',
      sampleOutput: '7',
      startingTemplate: `function kthSmallest(arr, k) {
  arr.sort((a,b) => a-b);
  return arr[k-1];
}`
    },
    resources: [
      { type: 'Docs', title: 'Comprehensive Guide to Sorting Algorithms', link: 'https://www.geeksforgeeks.org/sorting-algorithms/' },
      { type: 'Video', title: 'Divide and Conquer Sorting - Abdul Bari', link: 'https://www.youtube.com/watch?v=TzeBrDU-JaY' }
    ]
  },

  'searching': {
    title: 'Searching Algorithms',
    slug: 'searching',
    category: 'Algorithms',
    difficulty: 'Beginner',
    introduction: 'Searching is the algorithmic process of locating a target value inside a collection. It compares sequential Linear Search against divided Binary Search.',
    prerequisites: [
      { title: 'Sorted Arrays', body: [{ type: 'paragraph', text: 'Understanding that binary search strictly requires sorted inputs to prune search ranges.' }] }
    ],
    objective: [
      'Learn key differences between Linear and Binary Search.',
      'Explain binary range pruning: mid = low + (high-low)/2.',
      'Visualize low, mid, and high pointers converging during binary search.',
      'Implement recursive and iterative searching.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Searching matches a query against database values. Linear Search scans every element from index `0` to `n-1` in O(N) time. Binary Search works on sorted arrays by checking the midpoint. If target matches mid, search completes. If target is smaller, high updates to `mid-1`. If larger, low updates to `mid+1`. This cuts search ranges in half at each step, yielding logarithmic O(log N) speeds.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Pruning:</b> Pointers low and high converge to isolate the target search window.</li><li><b>Overflow Avoidance:</b> Midpoint calculation `low + (high - low)/2` prevents integer summation overflow.</li></ul>' },
      { type: 'alert-red', title: 'Unsorted Constraint', text: 'Using Binary Search on an unsorted array produces incorrect results. If elements are unsorted, you must either sort them first in O(N log N) time or fall back to Linear Search.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Target at Midpoint',
        average: 'O(log N) Binary Search',
        worst: 'O(N) Linear Search'
      },
      space: 'O(1) Iterative storage'
    },
    applications: [
      { name: 'Database Query Indexing', description: 'B-Trees use binary routing searches to load records.' },
      { name: 'Library Catalogs', description: 'Quickly locates books in sorted alphabet sections.' }
    ],
    quiz: [
      {
        question: 'What is the mandatory prerequisite for executing Binary Search on a dataset?',
        options: ['Elements must be uniquely hashed', 'Array elements must be sorted', 'The array size must be even', 'It must be stored in a binary tree'],
        answer: 1,
        explanation: 'Binary Search strictly requires a sorted dataset to prune half of the remaining elements at each step.'
      },
      {
        question: 'What is the maximum number of comparisons needed to search a sorted array of 1024 elements using Binary Search?',
        options: ['10', '32', '512', '1024'],
        answer: 0,
        explanation: 'Because log2(1024) = 10, a binary search will complete in at most 10 comparison cycles.'
      },
      {
        question: 'In Binary Search, why is the midpoint often calculated as low + (high - low) / 2 instead of (low + high) / 2?',
        options: ['To speed up the division operation', 'To prevent integer summation overflow when low and high are very large', 'To ensure the result is rounded down', 'To handle floating-point values'],
        answer: 1,
        explanation: 'If low and high are close to the maximum integer value, low + high can overflow, yielding a negative value. Subtracting first prevents this.'
      },
      {
        question: 'What is the time complexity of searching a sorted array using Linear Search?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
        answer: 2,
        explanation: 'Linear Search checks every index sequentially, which takes linear O(N) time even if the array is sorted.'
      },
      {
        question: 'If a search space is sorted and unbounded (infinite size), which variation of binary search can locate the upper boundary in O(log N) time?',
        options: ['Ternary Search', 'Exponential / Infinite Search', 'Interpolation Search', 'Linear Scan'],
        answer: 1,
        explanation: 'Exponential search doubles the search index pointer (1, 2, 4, 8, ...) until it bounds the target, then performs binary search.'
      }
    ],
    code: {
      Python: `def binarySearch(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      JavaScript: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      Java: `public class BinarySearch {
    public int search(int[] arr, int target) {
        int low = 0, high = arr.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
      'C++': `class Searcher {
public:
    int binarySearch(int arr[], int n, int target) {
        int low = 0, high = n - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
};`
    },
    playground: {
      title: 'Find Insertion Position Index',
      description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.',
      sampleInput: '[1, 3, 5, 6], target = 5',
      sampleOutput: '2',
      startingTemplate: `function searchInsert(nums, target) {
  let low = 0, high = nums.length - 1;
  while(low <= high) {
    let mid = low + Math.floor((high-low)/2);
    if(nums[mid] === target) return mid;
    else if(nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return low;
}`
    },
    resources: [
      { type: 'Docs', title: 'Binary Search Algorithm Guide', link: 'https://www.geeksforgeeks.org/binary-search/' },
      { type: 'Video', title: 'Binary Search Detailed Proofs - Abdul Bari', link: 'https://www.youtube.com/watch?v=V_T5imypwEE' }
    ]
  },

  'recursion': {
    title: 'Recursion',
    slug: 'recursion',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    introduction: 'Recursion is a programming technique where a function calls itself directly or indirectly to solve a problem by breaking it down into smaller, self-similar sub-problems.',
    prerequisites: [
      { title: 'Call Stack', body: [{ type: 'paragraph', text: 'Understanding how parameters, local variables, and return addresses are tracked in the execution stack.' }] }
    ],
    objective: [
      'Learn the structure of recursive functions (base case and recursive step).',
      'Explain recursion call stack loading and unloading processes.',
      'Visualize active recursion depths and return value bubbling.',
      'Implement factorial and fibonacci algorithms recursively.'
    ],
    theory: [
      { type: 'header-purple', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Recursion solves problems by calling the same function with smaller inputs. To prevent infinite execution loops, a recursive function requires two core components: <br/>1. **Base Case**: The termination condition where the function returns a value directly without self-calling.<br/>2. **Recursive Step**: Where the function calls itself with modified parameters, moving closer to the base case.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Active Frames:</b> Each self-call pauses the current execution block and pushes a new memory frame onto the system call stack.</li><li><b>Bubbling:</b> Once the base case is reached, active frames return their results, unloading from the stack in reverse order.</li></ul>' },
      { type: 'alert-red', title: 'Infinite Recursion Risk', text: 'Omitting or failing to reach the base case triggers infinite self-calls, filling the call stack and causing a STACK OVERFLOW crash.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Base Case hit',
        average: 'O(N) Linear recursion (e.g. Factorial)',
        worst: 'O(2^N) Branching recursion (e.g. Fibonacci)'
      },
      space: 'O(N) recursion stack memory space'
    },
    applications: [
      { name: 'Tree/Graph Traversals', description: 'DFS relies heavily on recursive node explorations.' },
      { name: 'JSON/XML Parsing', description: 'Parses nested tag and dictionary structures recursively.' }
    ],
    quiz: [
      {
        question: 'What is the mandatory condition that prevents recursive functions from calling themselves infinitely?',
        options: ['Infinite loop checkers', 'The Base Case', 'Modulo arithmetic checks', 'Global class locks'],
        answer: 1,
        explanation: 'The base case provides a direct return path without further self-calls, terminating the recursion.'
      },
      {
        question: 'What occurs when a recursive function spawns too many active frames, exceeding call stack limits?',
        options: ['Division by zero error', 'Stack Overflow crash', 'Segment allocation exception', 'Memory leak warning'],
        answer: 1,
        explanation: 'Exceeding the call stack limit triggers a Stack Overflow crash.'
      },
      {
        question: 'What is Tail Recursion?',
        options: ['Recursion that occurs inside a loop', 'A recursive call that is the absolute last statement executed in a function', 'Recursion that uses double parameters', 'Recursion that halts immediately'],
        answer: 1,
        explanation: 'Tail recursion allows compilers to optimize execution by reusing the current stack frame instead of pushing new ones (Tail Call Optimization).'
      },
      {
        question: 'How does indirect recursion differ from direct recursion?',
        options: ['Indirect recursion uses more CPU cycles', 'Indirect recursion involves a function calling a different function, which then calls the original function', 'Indirect recursion does not need a base case', 'Indirect recursion is done without using the stack'],
        answer: 1,
        explanation: 'Direct recursion occurs when function A calls function A. Indirect recursion occurs when function A calls function B, and function B calls function A.'
      },
      {
        question: 'What is the recursive relation formula representing the classic Towers of Hanoi puzzle movement count for N disks?',
        options: ['T(N) = T(N-1) + 1', 'T(N) = 2 * T(N-1) + 1', 'T(N) = T(N/2) + 1', 'T(N) = T(N-1) + N'],
        answer: 1,
        explanation: 'To solve N disks, we move N-1 disks to a temporary rod, move the largest disk, then move the N-1 disks to the target rod, yielding 2^N - 1 steps.'
      }
    ],
    code: {
      Python: `def factorial(n):
    # Base Case
    if n <= 1:
        return 1
    # Recursive Step
    return n * factorial(n - 1)`,
      JavaScript: `function factorial(n) {
  // Base Case
  if (n <= 1) return 1;
  // Recursive Step
  return n * factorial(n - 1);
}`,
      Java: `public class RecursionExample {
    public static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
}`,
      'C++': `class Mathematics {
public:
    int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }
};`
    },
    playground: {
      title: 'Recursive Fibonacci Sequence Calculator',
      description: 'Write a recursive function to compute the Nth number in the Fibonacci sequence. F(0) = 0, F(1) = 1, F(N) = F(N-1) + F(N-2).',
      sampleInput: 'n = 6',
      sampleOutput: '8',
      startingTemplate: `function fibonacci(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`
    },
    resources: [
      { type: 'Docs', title: 'Recursion and Call Stack Allocation', link: 'https://www.geeksforgeeks.org/recursion/' },
      { type: 'Video', title: 'Recursion Masterclass with Visual Traces', link: 'https://www.youtube.com/watch?v=k7-N8R0-KY4' }
    ]
  },

  'backtracking': {
    title: 'Backtracking',
    slug: 'backtracking',
    category: 'Algorithms',
    difficulty: 'Advanced',
    introduction: 'Backtracking is an algorithmic paradigm that searches incrementally for a solution in a state space. It abandons candidate paths ("backtracks") as soon as it determines they cannot lead to a valid solution.',
    prerequisites: [
      { title: 'Recursion', body: [{ type: 'paragraph', text: 'Proficiency in writing recursive algorithms to explore decision trees.' }] }
    ],
    objective: [
      'Understand state space search trees.',
      'Explain pruning: abandoning invalid search branches early.',
      'Visualize placing candidates and backtracking on failure.',
      'Implement N-Queens and Maze routing algorithms.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Backtracking is a systematic search of the state space. The algorithm incrementally builds candidate solutions. If it hits a dead-end (where constraints are violated), it discards the step, returns to the previous state, and tries the next branch. This prunes invalid search branches early, avoiding exhaustive searches.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Pruning:</b> Evaluates constraints early to abandon invalid search branches before exploring them fully.</li><li><b>State Reversion:</b> Crucial step where the algorithm resets state parameters (e.g. clearing grid markers) during backtracking steps.</li></ul>' },
      { type: 'alert-red', title: 'Exponential Complexity', text: 'In the worst case (without effective pruning), backtracking explores the entire state tree, resulting in an O(2^N) or O(N!) exponential time complexity.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Quick early match',
        average: 'O(2^N) Exponential branches',
        worst: 'O(N!) Factorial search (e.g. N-Queens)'
      },
      space: 'O(N) stack depth memory size'
    },
    applications: [
      { name: 'Sudoku Solvers', description: 'Fills cells incrementally, backtracking on digit conflicts.' },
      { name: 'Pathfinding Mazes', description: 'Explores routes, backtracking when hitting dead-ends.' }
    ],
    quiz: [
      {
        question: 'What is the primary action in backtracking when a candidate path violates problem constraints?',
        options: ['Infinite loop recursion', 'Reverting the last step and returning to the previous decision point', 'Sorting remaining elements', 'Allocating extra array blocks'],
        answer: 1,
        explanation: 'When a candidate path fails, backtracking reverts the last step, returning to the previous state to try other branches.'
      },
      {
        question: 'Which of the following problems is solved efficiently using backtracking?',
        options: ['Binary Search', 'Bubble Sort', 'N-Queens Chessboard Placement', 'Linear Array access'],
        answer: 2,
        explanation: 'The N-Queens problem is solved using backtracking to place queens row-by-row, backtracking on conflicts.'
      },
      {
        question: 'Which tree structure represents all possible decision paths during a backtracking search?',
        options: ['Binary Search Tree', 'AVL Tree', 'State Space Tree', 'Segment Tree'],
        answer: 2,
        explanation: 'A State Space Tree represents all configurations and decision branches explored by backtracking search.'
      },
      {
        question: 'What is the significance of the \'State Reversion\' step in backtracking algorithms?',
        options: ['To allocate memory blocks', 'To reset variables and choices so other paths can be explored cleanly', 'To terminate the program', 'To trigger garbage collection'],
        answer: 1,
        explanation: 'State reversion undoes the current candidate placement step, returning parameters to their original state before attempting alternative branch options.'
      },
      {
        question: 'What constraint does the N-Queens problem enforce?',
        options: ['No two queens can occupy adjacent squares', 'No two queens can share the same row, column, or diagonal', 'All queens must be placed in a circle', 'Queens can only move diagonally'],
        answer: 1,
        explanation: 'The N-Queens puzzle requires placing N non-attacking chess queens on an N x N grid.'
      }
    ],
    code: {
      Python: `def solveNQueens(n):
    col = set()
    posDiag = set() # (r + c)
    negDiag = set() # (r - c)
    res = []
    board = [["."] * n for _ in range(n)]
    
    def backtrack(r):
        if r == n:
            res.append(["".join(row) for row in board])
            return
        for c in range(n):
            if c in col or (r + c) in posDiag or (r - c) in negDiag:
                continue
            col.add(c)
            posDiag.add(r + c)
            negDiag.add(r - c)
            board[r][c] = "Q"
            
            backtrack(r + 1)
            
            # Backtrack state reversion
            col.remove(c)
            posDiag.remove(r + c)
            negDiag.remove(r - c)
            board[r][c] = "."
            
    backtrack(0)
    return res`,
      JavaScript: `function solveNQueens(n) {
  let col = new Set();
  let posDiag = new Set(); // r + c
  let negDiag = new Set(); // r - c
  let res = [];
  let board = Array(n).fill(0).map(() => Array(n).fill('.'));

  function backtrack(r) {
    if (r === n) {
      res.push(board.map(row => row.join('')));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (col.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue;
      
      col.add(c);
      posDiag.add(r + c);
      negDiag.add(r - c);
      board[r][c] = 'Q';

      backtrack(r + 1);

      // State Reversion
      col.delete(c);
      posDiag.delete(r + c);
      negDiag.delete(r - c);
      board[r][c] = '.';
    }
  }
  backtrack(0);
  return res;
}`,
      Java: `import java.util.*;

public class NQueens {
    private List<List<String>> res = new ArrayList<>();
    private Set<Integer> col = new HashSet<>();
    private Set<Integer> diag1 = new HashSet<>();
    private Set<Integer> diag2 = new HashSet<>();

    public List<List<String>> solve(int n) {
        char[][] board = new char[n][n];
        for(char[] r : board) Arrays.fill(r, '.');
        backtrack(0, n, board);
        return res;
    }

    private void backtrack(int r, int n, char[][] board) {
        if (r == n) {
            List<String> temp = new ArrayList<>();
            for(char[] row : board) temp.add(new String(row));
            res.add(temp); return;
        }
        for (int c = 0; c < n; c++) {
            if (col.contains(c) || diag1.contains(r + c) || diag2.contains(r - c)) continue;
            col.add(c); diag1.add(r + c); diag2.add(r - c);
            board[r][c] = 'Q';
            backtrack(r + 1, n, board);
            col.remove(c); diag1.remove(r + c); diag2.remove(r - c);
            board[r][c] = '.';
        }
    }
}`,
      'C++': `#include <vector>
#include <string>
#include <unordered_set>

class NQueens {
    std::vector<std::vector<std::string>> res;
    std::unordered_set<int> cols;
    std::unordered_set<int> diag1;
    std::unordered_set<int> diag2;
public:
    void backtrack(int r, int n, std::vector<std::string>& board) {
        if (r == n) { res.push_back(board); return; }
        for (int c = 0; c < n; ++c) {
            if (cols.count(c) || diag1.count(r+c) || diag2.count(r-c)) continue;
            cols.insert(c); diag1.insert(r+c); diag2.insert(r-c);
            board[r][c] = 'Q';
            backtrack(r+1, n, board);
            cols.erase(c); diag1.erase(r+c); diag2.erase(r-c);
            board[r][c] = '.';
        }
    }
};`
    },
    playground: {
      title: 'Rat in a Maze Route Search',
      description: 'Write a backtracking function to find if there is a path from top-left (0,0) to bottom-right (N-1, N-1) in a binary grid where 1 represents open path and 0 is blocked.',
      sampleInput: '[[1, 0, 0], [1, 1, 0], [0, 1, 1]]',
      sampleOutput: 'true',
      startingTemplate: `function solveMaze(maze) {
  let n = maze.length;
  let visited = Array(n).fill(0).map(() => Array(n).fill(false));
  
  function dfs(r, c) {
    if(r < 0 || c < 0 || r >= n || c >= n || maze[r][c] === 0 || visited[r][c]) {
      return false;
    }
    if(r === n-1 && c === n-1) return true;
    visited[r][c] = true;
    
    // Move Down, Right, Up, Left
    if(dfs(r+1, c) || dfs(r, c+1) || dfs(r-1, c) || dfs(r, c-1)) {
      return true;
    }
    
    // Revert state (backtrack)
    visited[r][c] = false;
    return false;
  }
  return dfs(0, 0);
}`
    },
    resources: [
      { type: 'Docs', title: 'Backtracking Paradigm Analysis', link: 'https://www.geeksforgeeks.org/backtracking-algorithms/' },
      { type: 'Video', title: 'N-Queens State Space Backtracking - Abdul Bari', link: 'https://www.youtube.com/watch?v=x0E_ANDcKyw' }
    ]
  },

  'dynamic-programming': {
    title: 'Dynamic Programming',
    slug: 'dynamic-programming',
    category: 'Algorithms',
    difficulty: 'Advanced',
    introduction: 'Dynamic Programming (DP) optimizes recursive problems by storing the results of overlapping sub-problems in a lookup table (memoization or tabulation), avoiding redundant computations.',
    prerequisites: [
      { title: 'Recursion', body: [{ type: 'paragraph', text: 'Proficiency in recursive tree structures and overlapping computations.' }] }
    ],
    objective: [
      'Learn the principles of Overlapping Sub-problems and Optimal Substructure.',
      'Compare Top-Down Memoization against Bottom-Up Tabulation.',
      'Visualize lookup tables populating step-by-step.',
      'Implement DP solutions for Knapsack and Fibonacci.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Many recursive algorithms solve the same sub-problems repeatedly (overlapping sub-problems). For example, computing Fibonacci recursively re-calculates `fib(3)` multiple times, yielding O(2^N) exponential times. Dynamic Programming resolves this by storing sub-problem results in a table, reducing the time complexity to linear O(N).' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Optimal Substructure:</b> The global optimal solution can be constructed from optimal solutions of its sub-problems.</li><li><b>Top-Down Memoization:</b> Solves recursively, caching results in a dictionary or array before returning.</li><li><b>Bottom-Up Tabulation:</b> Solves iteratively, building solutions from the base cases up.</li></ul>' },
      { type: 'alert-red', title: 'Memory Overhead', text: 'DP trades memory space for execution speed, using O(N) or O(N²) auxiliary table space to achieve O(N) or O(N²) time complexities.' }
    ],
    complexity: {
      time: {
        best: 'O(N) DP Fibonacci',
        average: 'O(N * W) 0/1 Knapsack',
        worst: 'O(N²) Longest Common Subsequence'
      },
      space: 'O(N) or O(N²) table space'
    },
    applications: [
      { name: 'Word Wrap Alignment', description: 'Calculates optimal line breaks in text editors.' },
      { name: 'Bioinformatics DNA Alignment', description: 'Compares genetic sequences using the Needleman-Wunsch algorithm.' }
    ],
    quiz: [
      {
        question: 'What are the two core characteristics required to apply Dynamic Programming to a problem?',
        options: ['Sorted arrays and binary trees', 'Overlapping Sub-problems and Optimal Substructure', 'Recursive structures and greedy choices', 'Contiguous memory and hashed keys'],
        answer: 1,
        explanation: 'DP strictly requires overlapping sub-problems (to avoid redundant calculations) and optimal substructure (to build solutions from sub-problems).'
      },
      {
        question: 'What is the key difference between Memoization and Tabulation?',
        options: ['Memoization is O(N²), while Tabulation is O(1)', 'Memoization is Top-Down recursive caching, while Tabulation is Bottom-Up iterative table building', 'Memoization uses heaps, while Tabulation uses lists', 'There is no difference'],
        answer: 1,
        explanation: 'Memoization uses top-down recursion to cache results, while Tabulation uses bottom-up iteration to build a table.'
      },
      {
        question: 'In the 0/1 Knapsack problem, why does the greedy value-to-weight ratio approach fail, requiring a DP solution instead?',
        options: ['Because items cannot be broken into fractions', 'Because weights are floating point numbers', 'Because sorting takes too long', 'Because the capacity is infinite'],
        answer: 0,
        explanation: 'Since you must take the whole item or leave it (0/1), a greedy ratio choice can leave empty space that could be filled with more valuable item combinations.'
      },
      {
        question: 'What is the time complexity of the bottom-up DP formulation for finding the Longest Common Subsequence of two strings of lengths M and N?',
        options: ['O(M + N)', 'O(M * N)', 'O(2^(M+N))', 'O(log(M+N))'],
        answer: 1,
        explanation: 'The DP table size is M x N. Filling each cell takes constant O(1) time, yielding an O(M * N) time complexity.'
      },
      {
        question: 'Which sub-problem relationship is essential for using Memoization?',
        options: ['Independent sub-problems', 'Overlapping sub-problems', 'No sub-problems are allowed', 'Sorted sub-problems'],
        answer: 1,
        explanation: 'Memoization works by caching results of sub-problems that are encountered multiple times during top-down recursion.'
      }
    ],
    code: {
      Python: `def fibDP(n):
    if n <= 1: return n
    # Bottom-Up Tabulation
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`,
      JavaScript: `function fibDP(n) {
  if (n <= 1) return n;
  // Tabulation
  let dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
      Java: `public class FibonacciDP {
    public int getFib(int n) {
        if (n <= 1) return n;
        int[] dp = new int[n + 1];
        dp[0] = 0; dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}`,
      'C++': `#include <vector>

class Fibonacci {
public:
    int getFib(int n) {
        if (n <= 1) return n;
        std::vector<int> dp(n + 1, 0);
        dp[1] = 1;
        for (int i = 2; i <= n; ++i) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
};`
    },
    playground: {
      title: 'Climbing Stairs DP Formulation',
      description: 'You are climbing a staircase that takes N steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
      sampleInput: 'n = 3',
      sampleOutput: '3',
      startingTemplate: `function climbStairs(n) {
  if (n <= 1) return 1;
  let dp = [1, 1];
  for(let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`
    },
    resources: [
      { type: 'Docs', title: 'Dynamic Programming Memoization and Tabulations', link: 'https://www.geeksforgeeks.org/dynamic-programming/' },
      { type: 'Video', title: 'DP Overlapping Problems Knapsack - Abdul Bari', link: 'https://www.youtube.com/watch?v=oBt53YbR9K0' }
    ]
  },

  'greedy': {
    title: 'Greedy Algorithms',
    slug: 'greedy',
    category: 'Algorithms',
    difficulty: 'Beginner',
    introduction: 'A Greedy Algorithm builds a solution step-by-step, making the locally optimal choice at each step with the hope of finding a globally optimal solution.',
    prerequisites: [
      { title: 'Sorting', body: [{ type: 'paragraph', text: 'Command over sorting elements to prioritize greedy choices.' }] }
    ],
    objective: [
      'Learn the principles of the Greedy Choice Property.',
      'Explain when greedy choices yield global optima vs when they fail.',
      'Visualize sorting items to select the locally optimal choice first.',
      'Implement fractional Knapsack and Coin Change algorithms.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Greedy algorithms build solutions by choosing the best immediate option at each step. For example, in the Coin Change problem (using US currency), to make 43 cents change, the greedy choice repeatedly picks the largest possible coin: a Quarter (25c), leaving 18c, then a Dime (10c), leaving 8c, then a Nickel (5c), leaving 3c, and finally three Pennies. This yields the minimum coin count of 6.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Greedy Choice:</b> A locally optimal choice is made at each step without considering future consequences or backtracking.</li><li><b>Sub-optimality Risk:</b> Greedy choices can fail to find the global optimum if currency structures are non-standard (e.g. making 12c change using coins {9c, 5c, 1c} greedily chooses 9c + three 1c coins = 4 coins, whereas 5c + 5c + 1c + 1c is sub-optimal, and the optimal is 5c + 5c + 1c + 1c? No, wait: 9 + 1 + 1 + 1 = 4, but two 5s + two 1s = 4. Wait: for 10c using {6c, 5c, 1c}, greedily picking 6c leaves 4c, requiring four 1c coins = 5 coins total, whereas picking two 5c coins = 2 coins total!).</li></ul>' },
      { type: 'alert-red', title: 'Verification Requirement', text: 'You must mathematically prove a greedy algorithm yields the global optimum (using matroid theory or induction) before deploying it.' }
    ],
    complexity: {
      time: {
        best: 'O(N log N) Sorting bound',
        average: 'O(N log N) Heap priority greedy selection',
        worst: 'O(N log N) sorting step'
      },
      space: 'O(1) Auxiliary space'
    },
    applications: [
      { name: 'Huffman Text Compression', description: 'Merges low-frequency characters greedily to build optimal prefix trees.' },
      { name: 'Minimum Spanning Trees', description: 'Kruskal\'s and Prim\'s algorithms pick the shortest edges greedily to connect nodes.' }
    ],
    quiz: [
      {
        question: 'Which property is required for a greedy choice to yield the globally optimal solution?',
        options: ['Hashed direct mapping', 'Greedy Choice Property and Optimal Substructure', 'Infinite backtracking options', 'Tabulation memory matrices'],
        answer: 1,
        explanation: 'Greedy algorithms yield globally optimal solutions only if the problem satisfies the Greedy Choice Property and has Optimal Substructure.'
      },
      {
        question: 'What is the typical time complexity of greedy algorithms that require sorting items first?',
        options: ['O(1)', 'O(log N)', 'O(N log N)', 'O(N²)'],
        answer: 2,
        explanation: 'Most greedy algorithms sort inputs first, resulting in an O(N log N) time complexity due to the sorting step.'
      },
      {
        question: 'Which of the following problems is solved optimally using a Greedy approach?',
        options: ['0/1 Knapsack', 'Fractional Knapsack', 'Traveling Salesperson Problem', 'Longest Common Subsequence'],
        answer: 1,
        explanation: 'The Fractional Knapsack problem allows taking parts of items. Sorting items by value/weight ratio and greedily picking them yields the optimal value.'
      },
      {
        question: 'What is the greedy step in Kruskal\'s algorithm to find a Minimum Spanning Tree?',
        options: ['Always select the vertex with the highest degree', 'Always select the edge with the minimum weight that does not form a cycle', 'Always select a random path', 'Always select adjacent nodes first'],
        answer: 1,
        explanation: 'Kruskal\'s algorithm sorts edges by weight and greedily adds the cheapest edge that connects two unconnected components.'
      },
      {
        question: 'Why does the Greedy coin change algorithm fail to find the optimal coin count for coin denominations {6, 5, 1} when making 10 cents change?',
        options: ['It works perfectly for all denominations', 'It throws a stack overflow error', 'It runs in exponential time', 'Greedy selects 6 and four 1s (5 coins) while the optimal is two 5s (2 coins)'],
        answer: 3,
        explanation: 'Because greedy does not look ahead, it picks 6 first, leaving 4. Dynamic Programming is required to guarantee optimal change for arbitrary denominations.'
      }
    ],
    code: {
      Python: `def minCoins(coins, amount):
    # Sort coins in descending order
    coins.sort(reverse=True)
    count = 0
    selected = []
    for coin in coins:
        while amount >= coin:
            amount -= coin
            count += 1
            selected.append(coin)
    return count if amount == 0 else -1`,
      JavaScript: `function minCoins(coins, amount) {
  // Sort coins descending
  coins.sort((a, b) => b - a);
  let count = 0;
  let selected = [];
  for (let coin of coins) {
    while (amount >= coin) {
      amount -= coin;
      count++;
      selected.push(coin);
    }
  }
  return amount === 0 ? count : -1;
}`,
      Java: `import java.util.Arrays;

public class GreedyCoins {
    public int getMinCoins(int[] coins, int amount) {
        Arrays.sort(coins); // ascending
        int count = 0;
        for (int i = coins.length - 1; i >= 0; i--) {
            while (amount >= coins[i]) {
                amount -= coins[i];
                count++;
            }
        }
        return amount == 0 ? count : -1;
    }
}`,
      'C++': `#include <vector>
#include <algorithm>

class GreedyCoins {
public:
    int minCoins(std::vector<int>& coins, int amount) {
        std::sort(coins.rbegin(), coins.rend()); // descending
        int count = 0;
        for (int coin : coins) {
            while (amount >= coin) {
                amount -= coin;
                count++;
            }
        }
        return amount == 0 ? count : -1;
    }
};`
    },
    playground: {
      title: 'Fractional Knapsack Value Maximization',
      description: 'Given weights and values of N items, find the maximum total value we can fit into a knapsack of capacity W. You can take fractions of items.',
      sampleInput: 'values = [60, 100, 120], weights = [10, 20, 30], W = 50',
      sampleOutput: '240.0',
      startingTemplate: `function fractionalKnapsack(items, capacity) {
  // items is array of {val, wt}
  // Sort items by value/weight ratio descending
  items.sort((a,b) => (b.val/b.wt) - (a.val/a.wt));
  let totalVal = 0;
  for(let item of items) {
    if(capacity >= item.wt) {
      capacity -= item.wt;
      totalVal += item.val;
    } else {
      totalVal += item.val * (capacity / item.wt);
      break;
    }
  }
  return totalVal;
}`
    },
    resources: [
      { type: 'Docs', title: 'Greedy Choice Algorithms and Matroids', link: 'https://www.geeksforgeeks.org/greedy-algorithms/' },
      { type: 'Video', title: 'Fractional Knapsack Greedy Formulation - Abdul Bari', link: 'https://www.youtube.com/watch?v=oBt53YbR9K0' }
    ]
  }
};
