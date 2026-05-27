// Generator functions for Sorting Algorithms
// Yields state objects: { array: [...arr], comparing: [i, j], swapping: [i, j], sorted: [indices...], pivot: idx, isComplete: bool }

export function* bubbleSort(arr) {
    let n = arr.length;
    let sorted = [];
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            yield { array: [...arr], comparing: [j, j + 1], swapping: [], sorted: [...sorted] };
            if (arr[j] > arr[j + 1]) {
                yield { array: [...arr], comparing: [], swapping: [j, j + 1], sorted: [...sorted] };
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                yield { array: [...arr], comparing: [], swapping: [j, j + 1], sorted: [...sorted] };
            }
        }
        sorted.push(n - i - 1);
    }
    sorted.push(0);
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}

export function* selectionSort(arr) {
    let n = arr.length;
    let sorted = [];
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            yield { array: [...arr], comparing: [min_idx, j], swapping: [], sorted: [...sorted] };
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx !== i) {
            yield { array: [...arr], comparing: [], swapping: [min_idx, i], sorted: [...sorted] };
            let temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
            yield { array: [...arr], comparing: [], swapping: [min_idx, i], sorted: [...sorted] };
        }
        sorted.push(i);
    }
    sorted.push(n - 1);
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}

export function* insertionSort(arr) {
    let n = arr.length;
    let sorted = [0];
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0) {
            yield { array: [...arr], comparing: [j, j + 1], swapping: [], sorted: [...sorted] };
            if (arr[j] > key) {
                yield { array: [...arr], comparing: [], swapping: [j, j + 1], sorted: [...sorted] };
                arr[j + 1] = arr[j];
                yield { array: [...arr], comparing: [], swapping: [j, j + 1], sorted: [...sorted] };
                j = j - 1;
            } else {
                break;
            }
        }
        arr[j + 1] = key;
        sorted.push(i);
    }
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}

export function* mergeSortWrapper(arr) {
    let sorted = [];
    let generator = mergeSort(arr, 0, arr.length - 1, sorted);
    yield* generator;
    for(let i=0; i<arr.length; i++) sorted.push(i);
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}

function* mergeSort(arr, l, r, sorted) {
    if (l >= r) return;
    let m = l + Math.floor((r - l) / 2);
    yield* mergeSort(arr, l, m, sorted);
    yield* mergeSort(arr, m + 1, r, sorted);
    yield* merge(arr, l, m, r, sorted);
}

function* merge(arr, l, m, r, sorted) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        yield { array: [...arr], comparing: [l+i, m+1+j], swapping: [], sorted: [...sorted] };
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        yield { array: [...arr], comparing: [], swapping: [k], sorted: [...sorted] };
        k++;
    }
    while (i < n1) {
        arr[k] = L[i];
        yield { array: [...arr], comparing: [], swapping: [k], sorted: [...sorted] };
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        yield { array: [...arr], comparing: [], swapping: [k], sorted: [...sorted] };
        j++;
        k++;
    }
}

export function* quickSortWrapper(arr) {
    let sorted = [];
    yield* quickSort(arr, 0, arr.length - 1, sorted);
    for(let i=0; i<arr.length; i++) {
        if(!sorted.includes(i)) sorted.push(i);
    }
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}

function* quickSort(arr, low, high, sorted) {
    if (low < high) {
        let piGenerator = partition(arr, low, high, sorted);
        let pi;
        for (let state of piGenerator) {
            if (state.pi !== undefined) {
                pi = state.pi;
            } else {
                yield state;
            }
        }
        sorted.push(pi);
        yield* quickSort(arr, low, pi - 1, sorted);
        yield* quickSort(arr, pi + 1, high, sorted);
    } else if (low === high) {
        sorted.push(low);
    }
}

function* partition(arr, low, high, sorted) {
    let pivot = arr[high];
    let i = (low - 1);
    for (let j = low; j <= high - 1; j++) {
        yield { array: [...arr], comparing: [j, high], swapping: [], pivot: high, sorted: [...sorted] };
        if (arr[j] < pivot) {
            i++;
            if (i !== j) {
               yield { array: [...arr], comparing: [], swapping: [i, j], pivot: high, sorted: [...sorted] };
               let temp = arr[i];
               arr[i] = arr[j];
               arr[j] = temp;
               yield { array: [...arr], comparing: [], swapping: [i, j], pivot: high, sorted: [...sorted] };
            }
        }
    }
    if (i + 1 !== high) {
       yield { array: [...arr], comparing: [], swapping: [i + 1, high], pivot: high, sorted: [...sorted] };
       let temp = arr[i + 1];
       arr[i + 1] = arr[high];
       arr[high] = temp;
       yield { array: [...arr], comparing: [], swapping: [i + 1, high], pivot: high, sorted: [...sorted] };
    }
    yield { pi: i + 1 };
}

export function* heapSort(arr) {
    let n = arr.length;
    let sorted = [];
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(arr, n, i, sorted);
    }
    for (let i = n - 1; i > 0; i--) {
        yield { array: [...arr], comparing: [], swapping: [0, i], sorted: [...sorted] };
        let temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        yield { array: [...arr], comparing: [], swapping: [0, i], sorted: [...sorted] };
        sorted.push(i);
        yield* heapify(arr, i, 0, sorted);
    }
    sorted.push(0);
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}

function* heapify(arr, n, i, sorted) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    if (l < n) {
        yield { array: [...arr], comparing: [l, largest], swapping: [], sorted: [...sorted] };
        if (arr[l] > arr[largest]) largest = l;
    }
    if (r < n) {
        yield { array: [...arr], comparing: [r, largest], swapping: [], sorted: [...sorted] };
        if (arr[r] > arr[largest]) largest = r;
    }
    if (largest !== i) {
        yield { array: [...arr], comparing: [], swapping: [i, largest], sorted: [...sorted] };
        let swap = arr[i];
        arr[i] = arr[largest];
        arr[largest] = swap;
        yield { array: [...arr], comparing: [], swapping: [i, largest], sorted: [...sorted] };
        yield* heapify(arr, n, largest, sorted);
    }
}

export function* countingSort(arr) {
    let max = Math.max(...arr);
    let min = Math.min(...arr);
    let range = max - min + 1;
    let count = new Array(range).fill(0);
    let output = new Array(arr.length).fill(0);
    let sorted = [];
    
    for (let i = 0; i < arr.length; i++) {
        yield { array: [...arr], comparing: [i], swapping: [], sorted: [...sorted] };
        count[arr[i] - min]++;
    }
    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
    }
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        sorted.push(i);
        yield { array: [...arr], comparing: [], swapping: [i], sorted: [...sorted] };
    }
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}

export function* radixSort(arr) {
    let max = Math.max(...arr);
    let sorted = [];
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        yield* countSortForRadix(arr, exp, sorted);
    }
    for(let i=0; i<arr.length; i++) sorted.push(i);
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}

function* countSortForRadix(arr, exp, sorted) {
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);
    for (let i = 0; i < arr.length; i++) {
        yield { array: [...arr], comparing: [i], swapping: [], sorted: [...sorted] };
        count[Math.floor(arr[i] / exp) % 10]++;
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i] / exp) % 10]--;
    }
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        yield { array: [...arr], comparing: [], swapping: [i], sorted: [...sorted] };
    }
}

export function* shellSort(arr) {
    let n = arr.length;
    let sorted = [];
    for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
        for (let i = gap; i < n; i += 1) {
            let temp = arr[i];
            let j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                yield { array: [...arr], comparing: [j-gap, i], swapping: [], sorted: [...sorted] };
                yield { array: [...arr], comparing: [], swapping: [j, j-gap], sorted: [...sorted] };
                arr[j] = arr[j - gap];
                yield { array: [...arr], comparing: [], swapping: [j, j-gap], sorted: [...sorted] };
            }
            arr[j] = temp;
        }
    }
    for(let i=0; i<arr.length; i++) sorted.push(i);
    yield { array: [...arr], comparing: [], swapping: [], sorted: [...sorted], isComplete: true };
}
