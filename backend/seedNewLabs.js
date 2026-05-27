const mongoose = require('mongoose');
const Lab = require('./models/Lab');

mongoose.connect('mongodb://localhost:27017/vlab').then(async () => {
  const newLabs = [
    {
      title: 'Advanced Quantum Computing',
      slug: 'advanced-quantum-computing',
      category: 'Physics',
      difficulty: 'Advanced',
      simulationType: 'quantum-computing',
      description: 'Explore the bizarre and powerful world of Quantum Mechanics applied to computation. Visualize Qubit superpositions, entanglement, and execute fundamental quantum gates in a simulated environment.',
      status: 'ACTIVE',
      tabs: {
        introduction: [
          { type: 'paragraph', text: 'Welcome to the Advanced Quantum Computing Lab. Traditional computers rely on bits (0 or 1), but quantum computers leverage Qubits, which can exist in a superposition of states. This allows quantum algorithms to solve certain complex problems exponentially faster than classical counterparts.' },
          { type: 'header-purple', text: 'What You Will Do' },
          { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Apply Logic Gates:</b> Use Hadamard (H) gates to create superposition, Pauli-X (NOT) gates to flip states, and CNOT gates to entangle qubits.</li><li><b>Observe State Vectors:</b> Watch the probability distributions shift dynamically as you apply operations.</li><li><b>Collapse the Wavefunction:</b> Trigger a measurement to force the quantum system into a definite classical state.</li></ul>' },
          { type: 'alert-red', title: 'Quantum Uncertainty', text: 'Remember that once a superposition state is measured, the system collapses. You will need to reset the system to experiment again!' }
        ],
        prerequisites: [
          { title: 'Linear Algebra', body: [{ type: 'paragraph', text: 'A firm grasp of vectors and matrices is essential. Quantum states are represented as column vectors, and quantum gates are unitary matrices.' }] },
          { title: 'Complex Numbers', body: [{ type: 'paragraph', text: 'Quantum amplitudes are complex numbers. You should understand magnitude and phase.' }] }
        ],
        objective: [
          'Understand the difference between classical bits and Qubits.',
          'Visualize how a Hadamard gate creates an equal superposition of |0⟩ and |1⟩.',
          'Demonstrate the concept of Quantum Entanglement using CNOT gates.',
          'Analyze the probabilistic nature of quantum measurement.'
        ],
        targetAudience: [
          { title: 'Physics Students', desc: 'Ideal for those bridging the gap between theoretical physics and computational models.' },
          { title: 'Advanced CS Students', desc: 'Essential for understanding next-generation cryptographic threats and quantum algorithms (like Shor’s).' }
        ],
        courseAlignment: {
          alignment: ['Quantum Mechanics', 'Cryptography', 'Advanced Computing Architectures'],
          typicalPart: ['Graduate level Physics/CS courses', 'Specialized Tech Electives']
        },
        quiz: [
          { question: 'What does a Hadamard (H) gate do to a qubit in state |0⟩?', options: ['Flips it to |1⟩', 'Puts it into an equal superposition of |0⟩ and |1⟩', 'Measures the qubit', 'Destroys the qubit'], answer: 1, explanation: 'The Hadamard gate creates a superposition, giving a 50% probability of measuring either |0⟩ or |1⟩.' },
          { question: 'Which gate is used to create entanglement between two qubits?', options: ['Pauli-X', 'Pauli-Z', 'CNOT', 'Toffoli'], answer: 2, explanation: 'The Controlled-NOT (CNOT) gate flips the target qubit if the control qubit is |1⟩, forming the basis for entanglement.' },
          { question: 'What happens when a qubit in superposition is measured?', options: ['It remains in superposition', 'It collapses to a definite state (0 or 1)', 'It clones itself', 'The simulation crashes'], answer: 1, explanation: 'Measurement causes wave function collapse, forcing the qubit into a classical binary state based on its probability amplitudes.' }
        ],
        quizSettings: { passingScore: 66, allowRetake: true }
      }
    },
    {
      title: 'Blockchain Ledger',
      slug: 'blockchain-ledger',
      category: 'Computer Science',
      difficulty: 'Intermediate',
      simulationType: 'blockchain',
      description: 'Simulate distributed ledger technology. Understand cryptographic hashing, block chaining, and consensus mechanisms in a decentralized network.',
      status: 'ACTIVE',
      tabs: {
        introduction: [
          { type: 'paragraph', text: 'Welcome to the Blockchain Ledger Lab! Blockchain is the foundational technology behind cryptocurrencies and decentralized applications (dApps). It is an immutable, distributed ledger that relies on cryptography to secure transactions.' },
          { type: 'header-cyan', text: 'Core Concepts' },
          { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Cryptographic Hashing:</b> See how SHA-256 transforms transaction data into a fixed-length signature.</li><li><b>Block Mining:</b> Understand the Proof of Work concept by calculating Nonces to meet network difficulty.</li><li><b>Immutability:</b> Observe what happens to subsequent blocks if a malicious actor attempts to alter historical data.</li></ul>' }
        ],
        prerequisites: [
          { title: 'Basic Cryptography', body: [{ type: 'paragraph', text: 'An understanding of one-way hash functions and public key infrastructure (PKI).' }] },
          { title: 'Data Structures', body: [{ type: 'paragraph', text: 'Familiarity with Linked Lists, as a blockchain is essentially a cryptographically linked list.' }] }
        ],
        objective: [
          'Visualize the generation of a block hash based on its payload, timestamp, and previous hash.',
          'Understand the purpose of the Nonce in Proof of Work.',
          'Demonstrate the cascading invalidation effect when modifying a previous block.'
        ],
        targetAudience: [
          { title: 'Web3 Developers', desc: 'Crucial starting point for anyone looking to build Smart Contracts.' },
          { title: 'Security Enthusiasts', desc: 'Learn why blockchain is resistant to tampering.' }
        ],
        courseAlignment: {
          alignment: ['Cryptography', 'Distributed Systems', 'FinTech'],
          typicalPart: ['Senior CS Electives', 'Blockchain Certifications']
        },
        quiz: [
          { question: 'What is the primary function of a cryptographic hash function in a blockchain?', options: ['To encrypt data so it can be decrypted later', 'To provide a unique, fixed-size digital fingerprint of data', 'To compress the block size', 'To route transactions over the network'], answer: 1, explanation: 'Hash functions like SHA-256 create a unique, one-way fingerprint. They are not used for encryption (which implies decryption).' },
          { question: 'What links one block to the previous block?', options: ['The Nonce', 'The IP address', 'The hash of the previous block', 'The miner’s signature'], answer: 2, explanation: 'Each block contains the hash of the preceding block, creating an unbreakable chain.' },
          { question: 'If data in Block #2 is altered, what happens to Block #3?', options: ['Nothing', 'Block #3 is automatically deleted', 'Block #3’s hash becomes invalid because its "previous hash" reference breaks', 'Block #3 updates itself'], answer: 2, explanation: 'Altering Block #2 changes its hash. Since Block #3 relies on Block #2\'s hash, Block #3 becomes invalid.' }
        ],
        quizSettings: { passingScore: 66, allowRetake: true }
      }
    },
    {
      title: 'Deep Learning Basics',
      slug: 'deep-learning-basics',
      category: 'Machine Learning',
      difficulty: 'Advanced',
      simulationType: 'cnn',
      description: 'Understand deep learning neural networks effectively. Visualize forward propagation, backpropagation, and weight adjustments in a multi-layer perceptron.',
      status: 'ACTIVE',
      tabs: {
        introduction: [
          { type: 'paragraph', text: 'Welcome to Deep Learning Basics! Neural networks are the powerhouse behind modern AI, driving everything from image recognition to large language models. This lab breaks down the "black box" of a neural net.' },
          { type: 'header-purple', text: 'Network Architecture' },
          { type: 'glass-box', text: '<ul class="space-y-2"><li><b>Input Layer:</b> Receives raw data features.</li><li><b>Hidden Layers:</b> Applies weights, biases, and activation functions (like ReLU or Sigmoid) to extract complex patterns.</li><li><b>Output Layer:</b> Produces the final prediction or classification probability.</li></ul>' },
          { type: 'alert-red', title: 'Gradient Descent', text: 'Pay close attention to how the Loss is calculated and how Gradients flow backward to adjust weights during training epochs.' }
        ],
        prerequisites: [
          { title: 'Calculus & Derivatives', body: [{ type: 'paragraph', text: 'Understanding the Chain Rule is essential for comprehending backpropagation.' }] },
          { title: 'Linear Algebra', body: [{ type: 'paragraph', text: 'Familiarity with matrix multiplication for weight transformations.' }] }
        ],
        objective: [
          'Visualize the flow of data through neurons via weighted connections.',
          'Understand how Activation Functions introduce non-linearity.',
          'Observe the minimization of Loss over multiple training epochs.'
        ],
        targetAudience: [
          { title: 'AI/ML Enthusiasts', desc: 'The fundamental building block for anyone pursuing a career in Artificial Intelligence.' },
          { title: 'Data Scientists', desc: 'Transitioning from traditional statistical models to deep learning.' }
        ],
        courseAlignment: {
          alignment: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
          typicalPart: ['Core AI Curriculum', 'Specialized ML Tracks']
        },
        quiz: [
          { question: 'What is the purpose of an Activation Function?', options: ['To speed up computation', 'To introduce non-linearity into the network', 'To decrease the number of weights', 'To initialize the network'], answer: 1, explanation: 'Without non-linear activation functions (like ReLU), a deep neural network would mathematically collapse into a simple linear regression model.' },
          { question: 'Which process updates the weights in a neural network?', options: ['Forward Propagation', 'Softmax', 'Backpropagation and Gradient Descent', 'Batch Normalization'], answer: 2, explanation: 'Backpropagation computes the error gradient, and Gradient Descent uses it to update weights.' },
          { question: 'What happens if the learning rate is too high?', options: ['The model learns perfectly', 'The loss function may diverge and never reach the minimum', 'Training takes forever', 'The network adds more layers'], answer: 1, explanation: 'A high learning rate can cause the updates to overshoot the optimal minimum, leading to divergence.' }
        ],
        quizSettings: { passingScore: 66, allowRetake: true }
      }
    }
  ];

  for (const labData of newLabs) {
    const existing = await Lab.findOne({ slug: labData.slug });
    if (existing) {
       console.log(`Lab ${labData.slug} already exists, updating...`);
       await Lab.updateOne({ slug: labData.slug }, labData);
    } else {
       console.log(`Creating new dynamic lab: ${labData.slug}...`);
       await Lab.create(labData);
    }
  }

  console.log('Seeding of new labs complete.');
  process.exit(0);
});
