const mongoose = require('mongoose');
const Lab = require('./models/Lab');

mongoose.connect('mongodb://localhost:27017/vlab').then(async () => {
  const labData = {
    title: 'Sorting Algorithms',
    slug: 'sorting-algorithms',
    category: 'Data Structures & Algorithms',
    difficulty: 'Beginner to Advanced',
    simulationType: 'sorting-algorithms',
    description: 'Understand how sorting algorithms work internally, visualize comparisons and swaps in real time, compare algorithm performance, and learn time and space complexity in a highly interactive visual environment.',
    status: 'ACTIVE',
    tabs: {
        introduction: [
            { type: 'paragraph', text: 'Welcome to the Sorting Algorithms Lab! This highly interactive environment is designed to help you build an intuitive understanding of how data structures are organized in memory. By manipulating the execution state of various sorting algorithms, you can map theoretical time complexities to real-world execution speeds.' },
            { type: 'header-cyan', text: 'What You Will Do' },
            { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Visualize Comparisons:</b> Watch exactly how elements are compared and swapped in real-time, whether through traditional Bar Charts or our new Node-wise sorting view.</li><li><b>Compare Algorithms:</b> Run two engines side-by-side to visibly witness the staggering speed difference between O(n²) and O(n log n) approaches.</li><li><b>Analyze Code:</b> Learn the exact implementation across 4 major programming languages (Python, Java, C++, JS) with line-by-line tracing capabilities.</li><li><b>Performance Testing:</b> Generate randomized, nearly sorted, or fully reversed arrays to test worst-case and best-case execution bounds.</li></ul>' },
            { type: 'alert-red', title: 'Interactive Capability', text: 'You can pause, step forward, and change the playback speed at any time during the simulation. Use this to study complex pivot logic in Quick Sort or the recursive tree merges in Merge Sort!' }
        ],
        prerequisites: [
            { title: 'Array Data Structures', body: [{ type: 'paragraph', text: 'A strong understanding of how arrays store data sequentially in memory. You should know how indexing works and the memory constraints of contiguous allocation.' }] },
            { title: 'Big-O Notation', body: [{ type: 'paragraph', text: 'Familiarity with evaluating time and space complexity. You should understand the difference between linear time O(n), quadratic time O(n²), and logarithmic time O(log n).' }] },
            { title: 'Recursion (Advanced)', body: [{ type: 'paragraph', text: 'For advanced algorithms like Merge Sort and Quick Sort, you must be comfortable with the concept of recursion and the Call Stack, as these algorithms inherently rely on Divide and Conquer methodologies.' }] }
        ],
        objective: [
            'Understand internal algorithm mechanisms of 9 different sorting techniques.',
            'Visualize the ratio of comparisons vs swaps, which impacts hardware cache performance.',
            'Compare algorithmic performance directly via the side-by-side Dual Engine mode.',
            'Learn optimal implementations in Python, Java, C++, and JS.',
            'Identify which sorting algorithm is best suited for specific data distributions (e.g. nearly sorted vs reversed).'
        ],
        targetAudience: [
            { title: 'Undergraduate CS Students', desc: 'Perfect for understanding core algorithm modules taught in Data Structures courses.' },
            { title: 'Interview Candidates', desc: 'Crucial for passing technical screening rounds, LeetCode challenges, and system design interviews.' },
            { title: 'Senior Engineers', desc: 'A great refresher on algorithm selection when dealing with database indexing and optimization.' }
        ],
        courseAlignment: {
            alignment: ['Data Structures', 'Algorithms Analysis', 'Discrete Mathematics', 'Systems Programming'],
            typicalPart: ['1st/2nd year CS Curriculum', 'Bootcamp Algorithms Track', 'Technical Interview Prep']
        },
        resources: [
            { type: 'Video', title: 'Algorithms by Abdul Bari', link: 'https://www.youtube.com/watch?v=0IAPZzGSbME', author: 'Abdul Bari', icon: '📺', color: 'text-red-400' },
            { type: 'Docs', title: 'Sorting Algorithms (Wikipedia)', link: 'https://en.wikipedia.org/wiki/Sorting_algorithm', icon: '📖', color: 'text-blue-400' },
            { type: 'Course', title: 'MIT 6.006 Introduction to Algorithms', link: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/', icon: '🏛️', color: 'text-yellow-400' },
            { type: 'Book', title: 'Introduction to Algorithms (CLRS)', link: '#', author: 'Thomas H. Cormen', icon: '📘', color: 'text-purple-400' }
        ],
        quiz: [
            { question: 'Which sorting algorithm has the best average-case time complexity?', options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'], answer: 2, explanation: 'Merge Sort guarantees O(N log N) time complexity in all cases because it strictly divides the array into halves.' },
            { question: 'Which algorithm is generally preferred for nearly sorted arrays?', options: ['Quick Sort', 'Insertion Sort', 'Heap Sort', 'Merge Sort'], answer: 1, explanation: 'Insertion Sort is highly efficient for nearly sorted arrays, achieving O(N) time complexity since elements barely need to move.' },
            { question: 'What is the worst-case time complexity of Quick Sort?', options: ['O(N)', 'O(N log N)', 'O(N^2)', 'O(log N)'], answer: 2, explanation: 'If the pivot is repeatedly chosen poorly (e.g. the largest/smallest element in an already sorted array without random pivoting), Quick Sort degrades to O(N^2).' },
            { question: 'Which of these sorting algorithms is NOT an in-place sort?', options: ['Bubble Sort', 'Heap Sort', 'Quick Sort', 'Merge Sort'], answer: 3, explanation: 'Merge Sort requires O(N) auxiliary space to merge the divided sub-arrays.' }
        ],
        quizSettings: { passingScore: 75, allowRetake: true }
    }
  };

  const existing = await Lab.findOne({ slug: labData.slug });
  if (existing) {
     console.log('Lab already exists, updating with dynamic JSON blocks...');
     await Lab.updateOne({ slug: labData.slug }, labData);
  } else {
     console.log('Creating new Sorting Algorithms dynamic lab...');
     await Lab.create(labData);
  }

  console.log('Seeding complete.');
  process.exit(0);
});
