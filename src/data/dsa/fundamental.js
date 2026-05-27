export const fundamentalTopics = {
  'arrays': {
    title: 'Arrays',
    slug: 'arrays',
    category: 'Fundamental Data Structures',
    difficulty: 'Beginner',
    introduction: 'An array is a contiguous memory allocation that stores elements of the same data type. It provides O(1) random access but requires linear time O(N) for shifting elements during insertion and deletion.',
    prerequisites: [
      { title: 'Contiguous Memory', body: [{ type: 'paragraph', text: 'Understanding how RAM physical slots are sequentially structured and allocated to variables.' }] },
      { title: 'Data Types', body: [{ type: 'paragraph', text: 'Knowing that elements inside a primitive array must occupy equal byte counts (e.g., 4 bytes for 32-bit integers).' }] }
    ],
    objective: [
      'Learn how arrays are sequentially organized inside RAM.',
      'Understand the difference between indexing access O(1) and linear search scans O(N).',
      'Visualize shift movements that take place when inserting or deleting mid-array elements.',
      'Implement custom search, insert, and delete methods in multiple languages.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'An array is the most basic memory mapping structure in computer systems. When an array is declared, the OS allocates a single, contiguous block of RAM. The index pointer calculation is done instantly using: <br/><b class="font-mono text-[#00e5ff] text-lg bg-black/40 px-2 py-1 rounded">Address = BaseAddress + Index * ElementSize</b>.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Sequential Allocations:</b> Elements are stored index-by-index in direct neighbor memory addresses.</li><li><b>Contiguous Constraint:</b> Growing an array in place is impossible if the adjacent addresses are already owned by other processes, requiring fresh relocation copies.</li><li><b>Zero-based Indexing:</b> Indexes represent offsets from the base address of the array block.</li></ul>' },
      { type: 'alert-red', title: 'Insert/Delete Shifts', text: 'When inserting at index `i`, all elements from index `i` to `n-1` must shift right to make room, creating an O(N) worst-case time complexity overhead.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Access',
        average: 'O(N) Search & Insert',
        worst: 'O(N) Delete at Front'
      },
      space: 'O(N) auxiliary space'
    },
    applications: [
      { name: 'Database Records', description: 'Used to store tabular records with quick index queries.' },
      { name: 'Lookup Tables', description: 'Optimal for constant-time status matching matrices.' }
    ],
    quiz: [
      {
        question: 'What is the time complexity of accessing an array element by its index?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
        answer: 0,
        explanation: 'Array access is O(1) because the exact memory address is computed instantly using base offset arithmetic.'
      },
      {
        question: 'Why does inserting an element at the beginning of an array take linear time O(N)?',
        options: ['Because memory is fragmented', 'All existing elements must be shifted one index to the right', 'We must reallocate base pointers', 'It requires an array sorting pass'],
        answer: 1,
        explanation: 'Inserting at the beginning requires shifting all N existing elements to the right to clear space at index 0.'
      },
      {
        question: 'What is the memory address calculation formula for a 1D array of elements starting at base address B where each element takes S bytes?',
        options: ['B + i * S', 'B + i / S', 'B + (i - 1) * S', 'B * S + i'],
        answer: 0,
        explanation: 'The memory address of index i is calculated as the base address plus the index offset times the element size in bytes.'
      },
      {
        question: 'Which array representation size can be changed dynamically during runtime by reallocation?',
        options: ['Static Array', 'Dynamic Array / Vector', 'Constant Array', 'Read-only Array'],
        answer: 1,
        explanation: 'Dynamic arrays (or vectors) double their capacity when full by reallocating a larger contiguous block in heap memory.'
      },
      {
        question: 'What is the advantage of arrays over linked lists regarding hardware cache locality?',
        options: ['Arrays have scattered nodes', 'Contiguous allocation enables CPU prefetching of adjacent elements', 'Linked lists use less pointers', 'Arrays have dynamic sizes'],
        answer: 1,
        explanation: 'Because array elements are stored contiguously in memory, accessing adjacent elements results in high cache hit rates due to spatial locality.'
      }
    ],
    code: {
      Python: `class ArrayOperations:
    def __init__(self, capacity):
        self.arr = [None] * capacity
        self.size = 0
        
    def insert(self, value, index):
        if index < 0 or index > self.size or self.size >= len(self.arr):
            return False
        # Shift elements right
        for i in range(self.size, index, -1):
            self.arr[i] = self.arr[i-1]
        self.arr[index] = value
        self.size += 1
        return True
        
    def delete(self, index):
        if index < 0 or index >= self.size:
            return None
        val = self.arr[index]
        # Shift elements left
        for i in range(index, self.size - 1):
            self.arr[i] = self.arr[i+1]
        self.arr[self.size - 1] = None
        self.size -= 1
        return val`,
      JavaScript: `class ArrayOperations {
  constructor(capacity) {
    this.arr = new Array(capacity).fill(null);
    this.size = 0;
  }

  insert(value, index) {
    if (index < 0 || index > this.size || this.size >= this.arr.length) {
      return false;
    }
    // Shift elements right
    for (let i = this.size; i > index; i--) {
      this.arr[i] = this.arr[i - 1];
    }
    this.arr[index] = value;
    this.size++;
    return true;
  }

  delete(index) {
    if (index < 0 || index >= this.size) return null;
    let val = this.arr[index];
    // Shift elements left
    for (let i = index; i < this.size - 1; i++) {
      this.arr[i] = this.arr[i + 1];
    }
    this.arr[this.size - 1] = null;
    this.size--;
    return val;
  }
}`,
      Java: `public class ArrayOperations {
    private int[] arr;
    private int size;

    public ArrayOperations(int capacity) {
        arr = new int[capacity];
        size = 0;
    }

    public boolean insert(int value, int index) {
        if (index < 0 || index > size || size >= arr.length) {
            return false;
        }
        for (int i = size; i > index; i--) {
            arr[i] = arr[i - 1];
        }
        arr[index] = value;
        size++;
        return true;
    }

    public int delete(int index) {
        if (index < 0 || index >= size) return -1;
        int val = arr[index];
        for (int i = index; i < size - 1; i++) {
            arr[i] = arr[i + 1];
        }
        size--;
        return val;
    }
}`,
      'C++': `class ArrayOperations {
private:
    int* arr;
    int capacity;
    int size;
public:
    ArrayOperations(int cap) {
        capacity = cap;
        arr = new int[capacity];
        size = 0;
    }
    bool insert(int value, int index) {
        if (index < 0 || index > size || size >= capacity) return false;
        for (int i = size; i > index; i--) {
            arr[i] = arr[i - 1];
        }
        arr[index] = value;
        size++;
        return true;
    }
    int remove(int index) {
        if (index < 0 || index >= size) return -1;
        int val = arr[index];
        for (int i = index; i < size - 1; i++) {
            arr[i] = arr[i + 1];
        }
        size--;
        return val;
    }
};`
    },
    playground: {
      title: 'Find the Duplicate in contiguous arrays',
      description: 'Given an array of integers containing N elements, find if there is a repeating duplicate number. Return the duplicate value if found, or -1 if elements are unique.',
      sampleInput: '[1, 3, 4, 2, 2]',
      sampleOutput: '2',
      startingTemplate: `function findDuplicate(arr) {
  // Write your solution here
  return -1;
}`
    },
    resources: [
      { type: 'Docs', title: 'Contiguous Array Layouts (GeeksforGeeks)', link: 'https://www.geeksforgeeks.org/array-data-structure/' },
      { type: 'Video', title: 'Arrays Basics & Memory - Abdul Bari', link: 'https://www.youtube.com/watch?v=0IAPZzGSbME' }
    ]
  },

  'linked-lists': {
    title: 'Linked Lists',
    slug: 'linked-lists',
    category: 'Fundamental Data Structures',
    difficulty: 'Intermediate',
    introduction: 'A linked list is a linear collection of nodes where each node points to the next node in memory via a pointer or reference address. This allows O(1) insertions/deletions without contiguous memory constraints.',
    prerequisites: [
      { title: 'Pointers & References', body: [{ type: 'paragraph', text: 'Familiarity with pointer variables and RAM reference addressing schemes.' }] },
      { title: 'Dynamic Allocations', body: [{ type: 'paragraph', text: 'Understanding how structures spawn dynamically inside the Heap segment.' }] }
    ],
    objective: [
      'Learn the node blueprint containing data fields and pointer references.',
      'Understand why linked list traversals require sequential linear O(N) sweeps.',
      'Visualize dynamic node pointer updates when performing head or middle insertions.',
      'Implement Singly Linked Lists in four major compilation formats.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Unlike arrays, linked lists do not store elements sequentially in physical memory slots. Each node is dynamically allocated in random Heap spaces. The nodes are connected via a pointer member variable `next` which physically holds the 32/64-bit RAM address of the subsequent element.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Head:</b> Pointer address referencing the starting element of the list chain.</li><li><b>Tail:</b> The final node in the list pointing to `NULL` to signify termination.</li><li><b>No Overflow Risk:</b> Linked lists dynamically grow and shrink node-by-node without size re-allocations.</li></ul>' },
      { type: 'alert-red', title: 'Searching Bottleneck', text: 'Random index access is impossible. To locate node `i`, we must physically travel through nodes `0` to `i-1` in linear time.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Insert/Delete at Head',
        average: 'O(N) Search/Lookup',
        worst: 'O(N) Delete at Tail (singly)'
      },
      space: 'O(N) auxiliary space'
    },
    applications: [
      { name: 'Operating System Stacks', description: 'Used to manage program execution scopes.' },
      { name: 'Browser Back/Forward Buffers', description: 'Doubly linked lists represent history maps.' }
    ],
    quiz: [
      {
        question: 'What is the time complexity to insert a new node at the head of a linked list?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
        answer: 0,
        explanation: 'Inserting at the head is O(1) as it only requires updating the new node pointer to point to the current head, and setting head to the new node.'
      },
      {
        question: 'What happens if a node pointer in a singly linked list is overwritten without saving its target reference?',
        options: ['The list is automatically sorted', 'The remaining list nodes are orphaned in memory (resource leak)', 'Compiler throws an index out of bounds error', 'Garbage collection moves it to stack space'],
        answer: 1,
        explanation: 'If the reference pointer is overwritten, the downstream nodes become unreachable, resulting in memory leak orphans.'
      },
      {
        question: 'In a doubly linked list, each node contains references to which elements?',
        options: ['Only the next node', 'Only the previous node', 'Both the next and previous nodes', 'Its child nodes'],
        answer: 2,
        explanation: 'Each node in a doubly linked list contains two pointers, next and prev, pointing to the following and preceding nodes respectively.'
      },
      {
        question: 'What is the time complexity of deleting the tail node in a singly linked list if you only have a pointer to the head node?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        answer: 2,
        explanation: 'To delete the tail of a singly linked list, we must traverse the list from the head to find the second-to-last node, which takes linear time.'
      },
      {
        question: 'How does a circular linked list differ from a standard singly linked list?',
        options: ['Nodes have multiple data fields', 'The tail node points back to the head node instead of NULL', 'It cannot be traversed', 'It allocates fixed sizes'],
        answer: 1,
        explanation: 'In a circular linked list, the next pointer of the tail node points back to the head node, forming a loop.'
      }
    ],
    code: {
      Python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        
    def insertAtHead(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        
    def deleteHead(self):
        if not self.head:
            return None
        temp = self.head
        self.head = self.head.next
        return temp.data`,
      JavaScript: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
  }

  insertAtHead(data) {
    let newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
  }

  deleteHead() {
    if (!this.head) return null;
    let temp = this.head;
    this.head = this.head.next;
    return temp.data;
  }
}`,
      Java: `class Node {
    int data;
    Node next;
    Node(int d) { data = d; next = null; }
}

public class SinglyLinkedList {
    Node head = null;

    public void insertAtHead(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }

    public int deleteHead() {
        if (head == null) return -1;
        int val = head.data;
        head = head.next;
        return val;
    }
}`,
      'C++': `struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

class SinglyLinkedList {
private:
    Node* head;
public:
    SinglyLinkedList() : head(nullptr) {}
    
    void insertAtHead(int data) {
        Node* newNode = new Node(data);
        newNode->next = head;
        head = newNode;
    }
    
    int deleteHead() {
        if (!head) return -1;
        Node* temp = head;
        int val = temp->data;
        head = head->next;
        delete temp;
        return val;
    }
};`
    },
    playground: {
      title: 'Detect a Cycle in a Linked List',
      description: 'Given the head pointer of a singly linked list, determine if it has a cycle (loop). A cycle exists if some node can be reached again by continuously following the next pointer.',
      sampleInput: 'head -> [3] -> [2] -> [0] -> [-4] -> [2]',
      sampleOutput: 'true',
      startingTemplate: `function hasCycle(head) {
  // Use Floyd's Cycle-Finding Algorithm (slow and fast pointers)
  let slow = head;
  let fast = head;
  
  while(fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if(slow === fast) return true;
  }
  return false;
}`
    },
    resources: [
      { type: 'Docs', title: 'Singly & Doubly Linked List Structures', link: 'https://www.geeksforgeeks.org/linked-list-data-structure/' },
      { type: 'Video', title: 'Linked List Complete Implementation - FreeCodeCamp', link: 'https://www.youtube.com/watch?v=H5l808yT-o0' }
    ]
  },

  'stack': {
    title: 'Stack',
    slug: 'stack',
    category: 'Fundamental Data Structures',
    difficulty: 'Beginner',
    introduction: 'A stack is a Last-In, First-Out (LIFO) linear collection. It restricts access so elements can only be inserted (push) or removed (pop) from a single designated boundary called the TOP.',
    prerequisites: [
      { title: 'Array/List Foundations', body: [{ type: 'paragraph', text: 'An understanding of standard array additions and linked list head modifications.' }] }
    ],
    objective: [
      'Learn LIFO constraints in data processing.',
      'Understand implementation wrappers using both sequential arrays and linked node chains.',
      'Visualize pop, push, and overflow/underflow exception rules.',
      'Build fully functional custom stack containers.'
    ],
    theory: [
      { type: 'header-purple', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'A stack mimics a physical stack of plates. You can only place a new plate at the top, and you can only retrieve the topmost plate. Trying to fetch plates from the middle causes structural collapsing. In code, the `top` integer index represents the active head address boundary.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>LIFO Pattern:</b> The final item pushed is strictly the first item popped.</li><li><b>Push:</b> Places a element at `top` address, moving index pointer.</li><li><b>Pop:</b> Fetches the value at `top` address and shifts the index.</li></ul>' },
      { type: 'alert-red', title: 'Stack Overflow / Underflow', text: 'Pushing on an array stack at max capacity causes a STACK OVERFLOW; popping on an empty stack triggers a STACK UNDERFLOW.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Push',
        average: 'O(1) Pop',
        worst: 'O(1) Peak/Size query'
      },
      space: 'O(N) memory allocation'
    },
    applications: [
      { name: 'System Call Stack', description: 'Maintains function memory frames during program compilation and runtime execution.' },
      { name: 'Undo/Redo Operations', description: 'Word editors use LIFO stacks to save keystroke histories.' }
    ],
    quiz: [
      {
        question: 'Which of the following describes the access policy of a stack?',
        options: ['FIFO (First-In, First-Out)', 'LIFO (Last-In, First-Out)', 'LILO (Last-In, Last-Out)', 'Random Access'],
        answer: 1,
        explanation: 'A stack is LIFO. The element inserted last is the first to be retrieved.'
      },
      {
        question: 'What occurs during a stack underflow exception?',
        options: ['Pushing into a full stack', 'Popping from an empty stack', 'Clearing stack indices', 'Sorting stack elements'],
        answer: 1,
        explanation: 'A stack underflow exception occurs when an application attempts to perform a Pop operation on an empty stack.'
      },
      {
        question: 'Which of the following applications primarily uses a stack data structure?',
        options: ['Printer job scheduling', 'Evaluation of postfix arithmetic expressions', 'BFS graph traversal', 'Database indexing'],
        answer: 1,
        explanation: 'Postfix expression evaluation and bracket matching are classic applications of stacks.'
      },
      {
        question: 'If you push elements A, B, C, D in order onto an empty stack, which element will be at the bottom of the stack?',
        options: ['D', 'C', 'B', 'A'],
        answer: 3,
        explanation: 'Since a stack is LIFO, the first element pushed (A) remains at the bottom of the stack.'
      },
      {
        question: 'What is the time complexity of the Peek operation on a stack?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
        answer: 0,
        explanation: 'Peek retrieves the top element without removing it, which is a constant time operation.'
      }
    ],
    code: {
      Python: `class Stack:
    def __init__(self):
        self.stack = []
        
    def push(self, val):
        self.stack.append(val)
        
    def pop(self):
        if self.isEmpty():
            return None
        return self.stack.pop()
        
    def peek(self):
        if self.isEmpty():
            return None
        return self.stack[-1]
        
    def isEmpty(self):
        return len(self.stack) == 0`,
      JavaScript: `class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`,
      Java: `import java.util.EmptyStackException;

public class Stack {
    private int[] arr;
    private int top;
    private int capacity;

    public Stack(int size) {
        arr = new int[size];
        capacity = size;
        top = -1;
    }

    public void push(int x) {
        if (top == capacity - 1) throw new StackOverflowError();
        arr[++top] = x;
    }

    public int pop() {
        if (top == -1) throw new EmptyStackException();
        return arr[top--];
    }

    public int peek() {
        if (top == -1) throw new EmptyStackException();
        return arr[top];
    }
}`,
      'C++': `#include <iostream>
#define MAX 1000

class Stack {
    int top;
public:
    int a[MAX];
    Stack() { top = -1; }
    
    bool push(int x) {
        if (top >= (MAX - 1)) return false;
        a[++top] = x;
        return true;
    }
    
    int pop() {
        if (top < 0) return -1;
        return a[top--];
    }
    
    int peek() {
        if (top < 0) return -1;
        return a[top];
    }
};`
    },
    playground: {
      title: 'Valid Parentheses String Match',
      description: 'Given a string containing characters parenthetic blocks `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string brackets are valid.',
      sampleInput: '"()[]{}"',
      sampleOutput: 'true',
      startingTemplate: `function isValidParentheses(s) {
  let stack = [];
  let map = { ')': '(', '}': '{', ']': '[' };
  
  for(let char of s) {
    if(char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if(stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`
    },
    resources: [
      { type: 'Docs', title: 'Stack and Call Frames Analysis', link: 'https://www.geeksforgeeks.org/stack-data-structure/' },
      { type: 'Video', title: 'Stacks Data Structure Explanation - CS50', link: 'https://www.youtube.com/watch?v=2y5Mv7tH6a8' }
    ]
  },

  'queue': {
    title: 'Queue',
    slug: 'queue',
    category: 'Fundamental Data Structures',
    difficulty: 'Beginner',
    introduction: 'A queue is a First-In, First-Out (FIFO) linear data structure. Elements enter the container through the REAR pointer, and exit from the FRONT pointer.',
    prerequisites: [
      { title: 'Linear Structures', body: [{ type: 'paragraph', text: 'Knowledge of LIFO stacks and flat index arrays.' }] }
    ],
    objective: [
      'Understand the principles of FIFO processing pipelines.',
      'Explain circular queue optimizations that prevent sequential array leaks.',
      'Visualize front and rear pointer movements during queue transitions.',
      'Build standard and circular queue containers.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'A queue acts like a checkout line in a retail store. The customer who arrives first is served and leaves first. In programming, index additions occur at the `rear` boundaries, while retrievals take place at the `front` boundary. Popping from front leaves unused empty spaces in flat arrays, requiring circular buffer algorithms.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>FIFO Policy:</b> The oldest element in the collection is always processed first.</li><li><b>Enqueue:</b> Inserting a element at the `rear` slot.</li><li><b>Dequeue:</b> Removing the element at the `front` slot.</li></ul>' },
      { type: 'alert-red', title: 'Circular Queue Optimization', text: 'Using modular arithmetic <b class="font-mono">(rear + 1) % size</b> wraps boundaries, allowing popped front space indices to be reused.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Enqueue',
        average: 'O(1) Dequeue',
        worst: 'O(1) Size queries'
      },
      space: 'O(N) total space bounds'
    },
    applications: [
      { name: 'CPU Task Scheduler', description: 'Queues process operational threads in order of arrival.' },
      { name: 'Printers Buffer', description: 'Jobs wait in print queues sequentially.' }
    ],
    quiz: [
      {
        question: 'Which of the following describes the access policy of a queue?',
        options: ['LIFO', 'FIFO', 'Random Access', 'Priority Access'],
        answer: 1,
        explanation: 'A queue operates under FIFO rules, where the element inserted first is the first to be retrieved.'
      },
      {
        question: 'What is the purpose of a Circular Queue structure?',
        options: ['To speed up linear sorting', 'To reuse memory slots at the front after dequeue operations', 'To automatically reverse the list', 'To connect multiple databases'],
        answer: 1,
        explanation: 'Circular queues reuse decommissioned front slots by wrapping indices using modular arithmetic.'
      },
      {
        question: 'In a queue implemented using a circular array, if capacity is 5, front is 2, and size is 3, what is the index of the rear element?',
        options: ['0', '1', '4', '3'],
        answer: 2,
        explanation: 'The rear element is located at (front + size - 1) % capacity = (2 + 3 - 1) % 5 = 4.'
      },
      {
        question: 'Which data structure is typically used to implement Breadth-First Search (BFS) on a graph?',
        options: ['Stack', 'Queue', 'Binary Search Tree', 'Max-Heap'],
        answer: 1,
        explanation: 'BFS uses a Queue to keep track of nodes to visit level-by-level.'
      },
      {
        question: 'What is a Deque (Double-Ended Queue)?',
        options: ['A queue with two priority levels', 'A queue where insertion and deletion can occur at both ends', 'A queue that is sorted', 'A circular linked queue'],
        answer: 1,
        explanation: 'A Deque allows enqueue and dequeue operations at both the front and the rear.'
      }
    ],
    code: {
      Python: `class Queue:
    def __init__(self):
        self.queue = []
        
    def enqueue(self, val):
        self.queue.append(val)
        
    def dequeue(self):
        if self.isEmpty():
            return None
        return self.queue.pop(0)
        
    def isEmpty(self):
        return len(self.queue) == 0`,
      JavaScript: `class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`,
      Java: `public class Queue {
    private int[] arr;
    private int front, rear, size, capacity;

    public Queue(int cap) {
        capacity = cap;
        arr = new int[capacity];
        front = this.size = 0;
        rear = capacity - 1;
    }

    public void enqueue(int item) {
        if (size == capacity) return;
        rear = (rear + 1) % capacity;
        arr[rear] = item;
        size++;
    }

    public int dequeue() {
        if (size == 0) return -1;
        int item = arr[front];
        front = (front + 1) % capacity;
        size--;
        return item;
    }
}`,
      'C++': `#define MAX 1000
class Queue {
    int front, rear, size;
public:
    int a[MAX];
    Queue() { front = size = 0; rear = MAX - 1; }
    
    bool enqueue(int x) {
        if (size >= MAX) return false;
        rear = (rear + 1) % MAX;
        a[rear] = x;
        size++;
        return true;
    }
    
    int dequeue() {
        if (size == 0) return -1;
        int val = a[front];
        front = (front + 1) % MAX;
        size--;
        return val;
    }
};`
    },
    playground: {
      title: 'Implement Queue Using Stacks',
      description: 'Implement a FIFO queue using only two standard LIFO stacks. The queue should support enqueue, dequeue, peek, and empty operations.',
      sampleInput: 'enqueue(1), enqueue(2), dequeue()',
      sampleOutput: '1',
      startingTemplate: `class MyQueue {
  constructor() {
    this.s1 = [];
    this.s2 = [];
  }
  
  enqueue(x) {
    this.s1.push(x);
  }
  
  dequeue() {
    if (this.s2.length === 0) {
      while(this.s1.length > 0) {
        this.s2.push(this.s1.pop());
      }
    }
    return this.s2.pop() || null;
  }
}`
    },
    resources: [
      { type: 'Docs', title: 'Queue Buffer Models (GeeksforGeeks)', link: 'https://www.geeksforgeeks.org/queue-data-structure/' },
      { type: 'Video', title: 'Circular Queues Visualization - Abdul Bari', link: 'https://www.youtube.com/watch?v=okr-XE8yTO8' }
    ]
  },

  'hashing': {
    title: 'Hashing',
    slug: 'hashing',
    category: 'Fundamental Data Structures',
    difficulty: 'Advanced',
    introduction: 'Hashing maps arbitrary sized data keys to fixed indexes inside an array using a Hash Function. It provides O(1) average lookup times, but requires resolution algorithms to resolve collisions.',
    prerequisites: [
      { title: 'Array Indexes', body: [{ type: 'paragraph', text: 'Familiarity with direct array address structures.' }] },
      { title: 'Modulo Mathematics', body: [{ type: 'paragraph', text: 'Understanding modular remainder division operations.' }] }
    ],
    objective: [
      'Learn the principles of hash mappings.',
      'Explain collision resolution strategies: Chaining vs Open Addressing.',
      'Visualize linked collision list traversals.',
      'Build custom Hash Maps with modulo collision chaining.'
    ],
    theory: [
      { type: 'header-cyan', text: 'Theoretical Breakdown' },
      { type: 'paragraph', text: 'Hashing maps a key value to an index in a hash table using a hash function. A simple hash function is <b class="font-mono text-[#00e5ff] text-lg bg-black/40 px-2 py-1 rounded">index = key % table_size</b>. When two different keys generate the same index, a collision occurs. This must be resolved to prevent data from being overwritten.' },
      { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Separate Chaining:</b> Each array slot holds a linked list of collided keys.</li><li><b>Open Addressing:</b> Collided elements search for empty adjacent slots using Linear Probing or Quadratic Probing.</li><li><b>Load Factor:</b> The ratio of stored keys to table capacity. High load factors degrade performance towards O(N) linear time.</li></ul>' },
      { type: 'alert-red', title: 'Worst-case Degradation', text: 'If a hash function maps all keys to the same index, separate chaining degrades the O(1) table search to an O(N) linked list lookup.' }
    ],
    complexity: {
      time: {
        best: 'O(1) Insert & Search',
        average: 'O(1) Average Search',
        worst: 'O(N) Search on high collisions'
      },
      space: 'O(N) storage allocation'
    },
    applications: [
      { name: 'Database Indexing', description: 'Provides fast record lookup in relational databases.' },
      { name: 'Cryptographical Verify', description: 'Uses cryptographic hashing to verify document authenticity.' }
    ],
    quiz: [
      {
        question: 'What is a hash collision in a hash table?',
        options: ['Two identical keys stored in different lists', 'Two distinct keys mapping to the same array index', 'A table running out of memory capacity', 'An array index out of bounds error'],
        answer: 1,
        explanation: 'A collision occurs when the hash function computes the same index for two distinct keys.'
      },
      {
        question: 'What is the average time complexity of searching for a key in a hash table?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
        answer: 0,
        explanation: 'On average, hash tables provide constant time O(1) lookups by using direct index mapping.'
      },
      {
        question: 'What is the purpose of a load factor in a hash table?',
        options: ['To measure table capacity saturation to trigger resizing', 'To speed up the hash calculation', 'To prevent all insertions', 'To sort keys'],
        answer: 0,
        explanation: 'The load factor measures how full the hash table is. Resizing is triggered when it exceeds a threshold (typically 0.7 or 0.75).'
      },
      {
        question: 'In separate chaining collision resolution, what happens to keys that hash to the same slot?',
        options: ['They are placed in consecutive empty slots', 'They are stored in a linked list linked to that slot', 'The newer key overwrites the older key', 'An error is thrown'],
        answer: 1,
        explanation: 'Separate chaining stores collided keys in a linked list or bucket linked to the hashed index.'
      },
      {
        question: 'What hash probing technique searches slots at offsets 1^2, 2^2, 3^2, ... from the original hash index?',
        options: ['Linear Probing', 'Quadratic Probing', 'Double Hashing', 'Separate Chaining'],
        answer: 1,
        explanation: 'Quadratic Probing resolves collisions by checking slots at quadratic intervals from the original hash address.'
      }
    ],
    code: {
      Python: `class HashTable:
    def __init__(self, size=8):
        self.size = size
        self.table = [[] for _ in range(self.size)]
        
    def hashFunction(self, key):
        return key % self.size
        
    def insert(self, key, value):
        idx = self.hashFunction(key)
        for item in self.table[idx]:
            if item[0] == key:
                item[1] = value
                return
        self.table[idx].append([key, value])
        
    def search(self, key):
        idx = self.hashFunction(key)
        for item in self.table[idx]:
            if item[0] == key:
                return item[1]
        return None`,
      JavaScript: `class HashTable {
  constructor(size = 8) {
    this.size = size;
    this.table = Array(size).fill(0).map(() => []);
  }

  hashFunction(key) {
    return key % this.size;
  }

  insert(key, value) {
    const idx = this.hashFunction(key);
    for (let item of this.table[idx]) {
      if (item.key === key) {
        item.value = value;
        return;
      }
    }
    this.table[idx].push({ key, value });
  }

  search(key) {
    const idx = this.hashFunction(key);
    for (let item of this.table[idx]) {
      if (item.key === key) return item.value;
    }
    return null;
  }
}`,
      Java: `import java.util.LinkedList;

public class HashTable {
    private static class HashNode {
        int key; String val;
        HashNode(int k, String v) { key = k; val = v; }
    }
    
    private LinkedList<HashNode>[] table;
    private int size;

    public HashTable(int cap) {
        size = cap;
        table = new LinkedList[size];
        for(int i = 0; i < size; i++) table[i] = new LinkedList<>();
    }

    public void insert(int key, String val) {
        int idx = key % size;
        for(HashNode node : table[idx]) {
            if(node.key == key) { node.val = val; return; }
        }
        table[idx].add(new HashNode(key, val));
    }

    public String search(int key) {
        int idx = key % size;
        for(HashNode node : table[idx]) {
            if(node.key == key) return node.val;
        }
        return null;
    }
}`,
      'C++': `#include <iostream>
#include <list>
#include <vector>

class HashTable {
    int BUCKET;
    std::vector<std::list<std::pair<int, std::string>>> table;
public:
    HashTable(int V) : BUCKET(V), table(V) {}
    
    void insertItem(int key, std::string value) {
        int index = key % BUCKET;
        for (auto& pair : table[index]) {
            if (pair.first == key) {
                pair.second = value;
                return;
            }
        }
        table[index].push_back(std::make_pair(key, value));
    }
    
    std::string searchItem(int key) {
        int index = key % BUCKET;
        for (auto& pair : table[index]) {
            if (pair.first == key) return pair.second;
        }
        return "";
    }
};`
    },
    playground: {
      title: 'Two Sum Map Target Match',
      description: 'Given an array of integers and a target number, return indices of the two numbers such that they add up to the target. Use a hash map to solve this in O(N) time.',
      sampleInput: 'nums = [2, 7, 11, 15], target = 9',
      sampleOutput: '[0, 1]',
      startingTemplate: `function twoSum(nums, target) {
  let map = new Map();
  for(let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if(map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`
    },
    resources: [
      { type: 'Docs', title: 'Hashing Collisions & Tables Complete Guide', link: 'https://www.geeksforgeeks.org/hashing-data-structure/' },
      { type: 'Video', title: 'Hash Table Implementations & Mathematics - MIT', link: 'https://www.youtube.com/watch?v=0M_kIqhLSiY' }
    ]
  }
};
