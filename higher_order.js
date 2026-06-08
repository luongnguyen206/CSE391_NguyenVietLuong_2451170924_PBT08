// 1. pipe() — Nối chuỗi functions (function composition)
function pipe(...fns) {
    return (arg) => {
        return fns.reduce((result, fn) => fn(result), arg);
    };
}

// 2. memoize() — Cache kết quả (tránh tính lại nếu argument giống)
function memoize(fn) {
    const cache = {};
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (key in cache) {
            return cache[key];
        }
        
        const result = fn.apply(this, args);
        cache[key] = result;
        return result;
    };
}

// 3. debounce() — Chờ user ngừng gõ mới thực hiện
// (Dùng để tối ưu hóa khi user gõ search, resize window, etc.)
function debounce(fn, delay) {
    let timeoutId = null;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 4. retry() — Thử lại nếu lỗi (chuyên dụng cho async)
async function retry(fn, maxAttempts = 3, delayMs = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed. Retrying...`);
            
            if (attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }
    
    throw new Error(`Failed after ${maxAttempts} attempts: ${lastError.message}`);
}

// ============== TEST ==============

console.log("=== TEST 1: pipe() ===");
const process = pipe(
    x => x * 2,        // 5 → 10
    x => x + 10,       // 10 → 20
    x => x.toString(), // 20 → "20"
    x => "Kết quả: " + x
);
console.log(process(5)); // → "Kết quả: 20"

console.log("\n=== TEST 2: memoize() ===");
const expensiveCalc = memoize((n) => {
    console.log("Đang tính...");
    let result = 0;
    for (let i = 0; i < n; i++) result += i;
    return result;
});
console.log("Lần 1 (sẽ tính):");
console.log(expensiveCalc(1000000)); // → "Đang tính..." → 499999500000
console.log("\nLần 2 (lấy từ cache):");
console.log(expensiveCalc(1000000)); // → (không in "Đang tính...")
console.log("\nLần 3 với argument khác (sẽ tính):");
console.log(expensiveCalc(100)); // → "Đang tính..."

console.log("\n=== TEST 3: debounce() ===");
const search = debounce((query) => {
    console.log("Searching:", query);
}, 500);

// Mô phỏng user gõ liên tục
console.log("Mô phỏng gõ từng ký tự...");
search("a");
setTimeout(() => search("ap"), 100);
setTimeout(() => search("app"), 200);
setTimeout(() => search("appl"), 300);
setTimeout(() => search("apple"), 400);
// Chỉ dòng cuối cùng chạy sau 500ms: "Searching: apple"

setTimeout(() => {
    console.log("\n=== TEST 4: retry() ===");
    
    // Mock function lỗi 2 lần, lần 3 thành công
    let attempts = 0;
    const unreliableAPI = async () => {
        attempts++;
        if (attempts < 3) {
            throw new Error(`Connection failed (attempt ${attempts})`);
        }
        return "Success! Data retrieved";
    };
    
    retry(unreliableAPI, 5, 500)
        .then(result => console.log("✓ Kết quả:", result))
        .catch(error => console.log("✗ Lỗi:", error.message));
}, 1500);
