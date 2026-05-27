import React, { useState } from 'react';

const algorithmsData = {
    'Bubble Sort': {
        complexity: { time: 'O(N²)', space: 'O(1)' },
        explanation: 'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order.',
        code: {
            Python: `def bubbleSort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]`,
            Java: `void bubbleSort(int arr[]) {\n    int n = arr.length;\n    for (int i = 0; i < n-1; i++)\n        for (int j = 0; j < n-i-1; j++)\n            if (arr[j] > arr[j+1]) {\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n}`,
            'C++': `void bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++)    \n        for (int j = 0; j < n-i-1; j++) \n            if (arr[j] > arr[j+1])\n                swap(&arr[j], &arr[j+1]);\n}`,
            JavaScript: `function bubbleSort(arr) {\n    for(let i = 0; i < arr.length; i++){\n        for(let j = 0; j < arr.length - i - 1; j++){\n            if(arr[j] > arr[j + 1]){\n                let temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n            }\n        }\n    }\n}`
        }
    },
    'Quick Sort': {
        complexity: { time: 'O(N log N)', space: 'O(log N)' },
        explanation: 'QuickSort is a Divide and Conquer algorithm. It picks an element as a pivot and partitions the given array around the picked pivot.',
        code: {
            Python: `def partition(arr, low, high):\n    i = (low-1)\n    pivot = arr[high]\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i = i+1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i+1], arr[high] = arr[high], arr[i+1]\n    return (i+1)\n\ndef quickSort(arr, low, high):\n    if len(arr) == 1:\n        return arr\n    if low < high:\n        pi = partition(arr, low, high)\n        quickSort(arr, low, pi-1)\n        quickSort(arr, pi+1, high)`,
            Java: `int partition(int arr[], int low, int high) {\n    int pivot = arr[high]; \n    int i = (low-1);\n    for (int j=low; j<high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            int temp = arr[i];\n            arr[i] = arr[j];\n            arr[j] = temp;\n        }\n    }\n    int temp = arr[i+1];\n    arr[i+1] = arr[high];\n    arr[high] = temp;\n    return i+1;\n}\nvoid sort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        sort(arr, low, pi-1);\n        sort(arr, pi+1, high);\n    }\n}`,
            'C++': `int partition (int arr[], int low, int high) {\n    int pivot = arr[high];\n    int i = (low - 1);\n    for (int j = low; j <= high - 1; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            swap(&arr[i], &arr[j]);\n        }\n    }\n    swap(&arr[i + 1], &arr[high]);\n    return (i + 1);\n}\nvoid quickSort(int arr[], int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`,
            JavaScript: `function partition(arr, low, high) {\n    let pivot = arr[high];\n    let i = (low - 1);\n    for (let j = low; j <= high - 1; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            [arr[i], arr[j]] = [arr[j], arr[i]];\n        }\n    }\n    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n    return (i + 1);\n}\nfunction quickSort(arr, low, high) {\n    if (low < high) {\n        let pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}`
        }
    },
    'Merge Sort': {
        complexity: { time: 'O(N log N)', space: 'O(N)' },
        explanation: 'Merge Sort is a Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
        code: {
            Python: `def mergeSort(arr):\n    if len(arr) > 1:\n        mid = len(arr)//2\n        L = arr[:mid]\n        R = arr[mid:]\n        mergeSort(L)\n        mergeSort(R)\n        i = j = k = 0\n        while i < len(L) and j < len(R):\n            if L[i] <= R[j]:\n                arr[k] = L[i]\n                i += 1\n            else:\n                arr[k] = R[j]\n                j += 1\n            k += 1\n        while i < len(L):\n            arr[k] = L[i]\n            i += 1\n            k += 1\n        while j < len(R):\n            arr[k] = R[j]\n            j += 1\n            k += 1`,
            Java: `void merge(int arr[], int l, int m, int r) {\n    int n1 = m - l + 1;\n    int n2 = r - m;\n    int L[] = new int[n1];\n    int R[] = new int[n2];\n    for (int i = 0; i < n1; ++i) L[i] = arr[l + i];\n    for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];\n    int i = 0, j = 0;\n    int k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) {\n            arr[k] = L[i];\n            i++;\n        } else {\n            arr[k] = R[j];\n            j++;\n        }\n        k++;\n    }\n    while (i < n1) {\n        arr[k] = L[i];\n        i++;\n        k++;\n    }\n    while (j < n2) {\n        arr[k] = R[j];\n        j++;\n        k++;\n    }\n}\nvoid sort(int arr[], int l, int r) {\n    if (l < r) {\n        int m =l+ (r-l)/2;\n        sort(arr, l, m);\n        sort(arr, m + 1, r);\n        merge(arr, l, m, r);\n    }\n}`,
            'C++': `void merge(int array[], int const left, int const mid, int const right) {\n    auto const subArrayOne = mid - left + 1;\n    auto const subArrayTwo = right - mid;\n    auto *leftArray = new int[subArrayOne], *rightArray = new int[subArrayTwo];\n    for (auto i = 0; i < subArrayOne; i++) leftArray[i] = array[left + i];\n    for (auto j = 0; j < subArrayTwo; j++) rightArray[j] = array[mid + 1 + j];\n    auto indexOfSubArrayOne = 0, indexOfSubArrayTwo = 0;\n    int indexOfMergedArray = left;\n    while (indexOfSubArrayOne < subArrayOne && indexOfSubArrayTwo < subArrayTwo) {\n        if (leftArray[indexOfSubArrayOne] <= rightArray[indexOfSubArrayTwo]) {\n            array[indexOfMergedArray] = leftArray[indexOfSubArrayOne];\n            indexOfSubArrayOne++;\n        } else {\n            array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo];\n            indexOfSubArrayTwo++;\n        }\n        indexOfMergedArray++;\n    }\n    while (indexOfSubArrayOne < subArrayOne) {\n        array[indexOfMergedArray] = leftArray[indexOfSubArrayOne];\n        indexOfSubArrayOne++;\n        indexOfMergedArray++;\n    }\n    while (indexOfSubArrayTwo < subArrayTwo) {\n        array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo];\n        indexOfSubArrayTwo++;\n        indexOfMergedArray++;\n    }\n    delete[] leftArray;\n    delete[] rightArray;\n}\nvoid mergeSort(int array[], int const begin, int const end) {\n    if (begin >= end) return;\n    auto mid = begin + (end - begin) / 2;\n    mergeSort(array, begin, mid);\n    mergeSort(array, mid + 1, end);\n    merge(array, begin, mid, end);\n}`,
            JavaScript: `function merge(arr, l, m, r) {\n    let n1 = m - l + 1;\n    let n2 = r - m;\n    let L = new Array(n1);\n    let R = new Array(n2);\n    for (let i = 0; i < n1; i++) L[i] = arr[l + i];\n    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];\n    let i = 0, j = 0, k = l;\n    while (i < n1 && j < n2) {\n        if (L[i] <= R[j]) {\n            arr[k] = L[i];\n            i++;\n        } else {\n            arr[k] = R[j];\n            j++;\n        }\n        k++;\n    }\n    while (i < n1) {\n        arr[k] = L[i];\n        i++;\n        k++;\n    }\n    while (j < n2) {\n        arr[k] = R[j];\n        j++;\n        k++;\n    }\n}\nfunction mergeSort(arr, l, r) {\n    if (l >= r) return;\n    let m = l + parseInt((r - l) / 2);\n    mergeSort(arr, l, m);\n    mergeSort(arr, m + 1, r);\n    merge(arr, l, m, r);\n}`
        }
    }
};

export default function SortingLearnCodeComponent() {
    const [algo, setAlgo] = useState('Quick Sort');
    const [language, setLanguage] = useState('Python');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(algorithmsData[algo].code[language]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="animate-page-enter">
            <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-[#00e5ff]">Learn with Code</h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-1/3">
                    <div className="bg-[var(--panel-bg-strong)] border border-[var(--glass-border)] rounded-xl p-4 shadow-lg sticky top-32">
                        <h3 className="text-white font-bold mb-4 border-b border-[var(--glass-border)] pb-2">Select Algorithm</h3>
                        <div className="space-y-2">
                            {Object.keys(algorithmsData).map(a => (
                                <button 
                                    key={a} 
                                    onClick={() => setAlgo(a)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition-all ${algo === a ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/30' : 'text-gray-400 hover:bg-[var(--glass-bg)] border border-transparent'}`}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                    <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl p-6">
                        <div className="flex gap-4 mb-4">
                            <span className="text-[#00e5ff] font-mono bg-[#00e5ff]/10 px-3 py-1 rounded text-sm border border-[#00e5ff]/20">Time: {algorithmsData[algo].complexity.time}</span>
                            <span className="text-purple-400 font-mono bg-purple-500/10 px-3 py-1 rounded text-sm border border-purple-500/20">Space: {algorithmsData[algo].complexity.space}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg">{algorithmsData[algo].explanation}</p>
                    </div>

                    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center bg-[#161b22] px-4 py-2 border-b border-[#30363d]">
                            <div className="flex gap-2">
                                {Object.keys(algorithmsData[algo].code).map(lang => (
                                    <button 
                                        key={lang}
                                        onClick={() => setLanguage(lang)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${language === lang ? 'bg-[#21262d] text-white border border-[#30363d]' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={handleCopy}
                                className="text-xs bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-3 py-1.5 rounded-md border border-[#30363d] transition-colors"
                            >
                                {copied ? 'Copied!' : 'Copy Code'}
                            </button>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <pre className="text-sm font-mono leading-relaxed text-[#c9d1d9]"><code className={`language-${language.toLowerCase()}`}>{algorithmsData[algo].code[language]}</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
