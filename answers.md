# PHẦN A — KIỂM TRA ĐỌC HIỂU

## Câu A1: Function Declaration vs Expression vs Arrow

### Cách 1: Function Declaration
```javascript
function tinhThueBaoHiem(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return {
        thue: thue,
        thuc_nhan: luong - thue
    };
}
```

### Cách 2: Function Expression
```javascript
const tinhThueBaoHiem = function(luong) {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return {
        thue: thue,
        thuc_nhan: luong - thue
    };
};
```

### Cách 3: Arrow Function
```javascript
const tinhThueBaoHiem = (luong) => {
    const thue = luong > 11000000 ? luong * 0.1 : 0;
    return {
        thue: thue,
        thuc_nhan: luong - thue
    };
};
```

### Khác nhau về Hoisting:
- **Function Declaration**: Được hoisting HOÀN TOÀN. Có thể gọi trước khi khai báo.
- **Function Expression & Arrow Function**: KHÔNG hoisting. Chỉ hoisting biến, không hoisting giá trị function.

**Ví dụ cụ thể:**
```javascript
// Function Declaration — Chạy bình thường (hoisting)
console.log(tinhThueBaoHiem(15000000));  // Chạy OK, trước khi hàm được viết
function tinhThueBaoHiem(luong) {
    // ...
}

// Function Expression — LỖI!
console.log(tinhThueBaoHiem(15000000));  // TypeError: not a function
const tinhThueBaoHiem = function(luong) {
    // ...
};
// Lý do: Hoisting chỉ hoisting biến, không hoisting hàm
```

## Câu A2: Scope & Closure

### Đoạn 1: Output dự đoán
```javascript
function counter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}
const c = counter();
console.log(c.increment());  // 1
console.log(c.increment());  // 2
console.log(c.increment());  // 3
console.log(c.decrement());  // 2
console.log(c.getCount());   // 2
```

**Giải thích:** Closure — hàm con nhớ biến `count` của hàm cha. Mỗi lần gọi, `count` thay đổi trong scope của `counter`.

### Đoạn 2: Output dự đoán
```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log("var:", i), 100);
}
for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log("let:", j), 200);
}
// Output sau 200ms:
// var: 3
// var: 3
// var: 3
// let: 0
// let: 1
// let: 2
```

### Giải thích chi tiết: Tại sao var và let khác nhau?

| Khía cạnh | `var` | `let` |
|---|---|---|
| **Scope** | Function scope | Block scope |
| **Hoisting** | Hoisting + gán `undefined` | Hoisting nhưng vùng "Temporal Dead Zone" |
| **Closure** | Tất cả vòng lặp dùng CÙNG 1 biến `i` | Mỗi vòng lặp có RIÊNG biến `j` |

**Chi tiết:**

**var case:**
- Vòng lặp chạy: `i = 0, 1, 2, 3`
- Loop kết thúc: `i = 3` (sau điều kiện cuối cùng)
- `setTimeout` được bảo lưu với closure tham chiếu tới `i` CHUNG
- Khi callback chạy (100ms sau), `i` đã là `3` rồi
- Tất cả 3 callback chạy → "var: 3" (3 lần)

**let case:**
- Mỗi lần loop, `let j` tạo scope MỚI riêng biệt
- `j = 0` trong scope lần 1 → closure lưu `j = 0`
- `j = 1` trong scope lần 2 → closure lưu `j = 1`
- `j = 2` trong scope lần 3 → closure lưu `j = 2`
- Khi callback chạy, mỗi closure nhớ `j` tương ứng
- Output: "let: 0", "let: 1", "let: 2"

## Câu A3: Array Methods

```javascript
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 1. Lấy các số chẵn
nums.filter(n => n % 2 === 0);
// → [2, 4, 6, 8, 10]

// 2. Nhân mỗi số với 3
nums.map(n => n * 3);
// → [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]

// 3. Tính tổng tất cả
nums.reduce((sum, n) => sum + n, 0);
// → 55

// 4. Tìm số đầu tiên > 7
nums.find(n => n > 7);
// → 8

// 5. Kiểm tra CÓ số > 10 không
nums.some(n => n > 10);
// → false

// 6. Kiểm tra TẤT CẢ đều > 0
nums.every(n => n > 0);
// → true

// 7. Tạo mảng "Số X là [chẵn/lẻ]"
nums.map(n => `Số ${n} là ${n % 2 === 0 ? "chẵn" : "lẻ"}`);
// → ["Số 1 là lẻ", "Số 2 là chẵn", ..., "Số 10 là chẵn"]

// 8. Đảo ngược mảng (không mutate gốc)
[...nums].reverse();
// → [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

## Câu A4: Object Destructuring & Spread

### Destructuring:
```javascript
const product = {
    name: "iPhone 16",
    price: 25990000,
    specs: { ram: 8, storage: 256, color: "Titan" }
};

const { name, price, specs: { ram, color } } = product;

console.log(name, price, ram, color);  
// → "iPhone 16" 25990000 8 "Titan"

console.log(specs);                     
// → ReferenceError: specs is not defined
// Lý do: `specs` không được extract vào biến. Chỉ extract `ram` và `color` từ trong `specs`
```

### Spread:
```javascript
const updated = { ...product, price: 23990000, sale: true };

console.log(updated.price);            
// → 23990000 (ghi đè giá mới)

console.log(updated.sale);             
// → true (thêm property mới)

console.log(product.price);            
// → 25990000 (gốc KHÔNG thay đổi)
// Lý do: Spread tạo object mới, không mutate object gốc
```

### Spread Gotcha (Shallow Copy):
```javascript
const copy = { ...product };           // Shallow copy
copy.specs.ram = 16;

console.log(product.specs.ram);        
// → 16 (thay đổi!)
// Tại sao? Spread chỉ copy MỖI level 1. `specs` là object, nên 2 object dùng CHUNG reference
// copy.specs và product.specs trỏ tới CÙNG object trong memory
```

**Kết luận:** Spread operator là **shallow copy**, không phải deep copy.

# PHẦN C — SUY LUẬN

## Câu C1: Refactor Code

### Trước (Ugly Code):
```javascript
function processOrders(orders) {
    var result = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === "completed") {
            if (orders[i].total > 100000) {
                var item = {};
                item.id = orders[i].id;
                item.customer = orders[i].customer;
                item.total = orders[i].total;
                item.discount = orders[i].total * 0.1;
                item.finalTotal = orders[i].total - item.discount;
                result.push(item);
            }
        }
    }
    // Sort by finalTotal descending
    for (var j = 0; j < result.length; j++) {
        for (var k = j + 1; k < result.length; k++) {
            if (result[j].finalTotal < result[k].finalTotal) {
                var temp = result[j];
                result[j] = result[k];
                result[k] = temp;
            }
        }
    }
    return result;
}
```

### Sau (Refactored):
```javascript
function processOrders(orders) {
    return orders
        .filter(o => o.status === "completed" && o.total > 100000)
        .map(o => ({
            id: o.id,
            customer: o.customer,
            total: o.total,
            discount: o.total * 0.1,
            finalTotal: o.total * 0.9
        }))
        .sort((a, b) => b.finalTotal - a.finalTotal);
}
```

**Cải tiến:**
-  Dùng `filter` thay vì nested if
-  Dùng `map` để transform object (destructuring trong map)
-  Dùng `sort` thay vì bubble sort (ngắn hơn 10x)
-  Dùng `const` thay vì `var`
-  Arrow function giúp code gọn gàng hơn
-  Chaining array methods → dễ đọc hơn


## Câu C2: Thiết kế API miniArray

```javascript
const miniArray = {
    // map: Biến đổi từng phần tử
    map(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(fn(arr[i], i, arr));
        }
        return result;
    },
    
    // filter: Lọc phần tử theo điều kiện
    filter(arr, fn) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i], i, arr)) {
                result.push(arr[i]);
            }
        }
        return result;
    },
    
    // reduce: Tổng hợp mảng thành 1 giá trị
    reduce(arr, fn, initialValue) {
        let accumulator = initialValue;
        for (let i = 0; i < arr.length; i++) {
            accumulator = fn(accumulator, arr[i], i, arr);
        }
        return accumulator;
    }
};

// Test:
console.log(miniArray.map([1,2,3], x => x * 2));        
// → [2, 4, 6]

console.log(miniArray.filter([1,2,3,4], x => x > 2));   
// → [3, 4]

console.log(miniArray.reduce([1,2,3,4], (a,b) => a+b, 0)); 
// → 10
```

**Giải thích từng hàm:**

| Hàm | Input | Output | Logic |
|---|---|---|---|
| `map` | array, callback | array mới | Lặp, gọi callback, push kết quả |
| `filter` | array, predicate | array mới | Lặp, nếu predicate true thì push |
| `reduce` | array, callback, init | giá trị duy nhất | Lặp, accumulator = callback(acc, curr) |
