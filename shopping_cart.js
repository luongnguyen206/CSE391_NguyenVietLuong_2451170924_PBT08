function createCart() {
    // Private data
    let items = [];
    let discountCode = null;
    let discountPercent = 0;
    
    // Discount codes
    const discounts = {
        "SALE10": 10,
        "SALE20": 20,
        "FREESHIP": { type: "fixed", value: 30000 }
    };
    
    return {
        // Thêm sản phẩm (nếu đã có → tăng quantity)
        addItem(product, quantity = 1) {
            const existingItem = items.find(item => item.id === product.id);
            
            if (existingItem) {
                // Sản phẩm đã tồn tại → tăng quantity
                existingItem.quantity += quantity;
            } else {
                // Sản phẩm mới → thêm vào
                items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                });
            }
        },
        
        // Xóa sản phẩm theo id
        removeItem(productId) {
            items = items.filter(item => item.id !== productId);
        },
        
        // Cập nhật số lượng
        updateQuantity(productId, newQuantity) {
            const item = items.find(item => item.id === productId);
            if (item) {
                item.quantity = Math.max(0, newQuantity);
                if (item.quantity === 0) {
                    this.removeItem(productId);
                }
            }
        },
        
        // Tính tổng tiền
        getTotal() {
            const subtotal = items.reduce((total, item) => 
                total + (item.price * item.quantity), 0
            );
            
            // Áp dụng discount
            if (discountCode) {
                const discount = discounts[discountCode];
                if (discount.type === "fixed") {
                    return Math.max(0, subtotal - discount.value);
                } else {
                    return subtotal * (1 - discountPercent / 100);
                }
            }
            
            return subtotal;
        },
        
        // Áp dụng mã giảm giá
        applyDiscount(code) {
            if (discounts[code]) {
                discountCode = code;
                const discount = discounts[code];
                if (discount.type === "fixed") {
                    discountPercent = 0;
                } else {
                    discountPercent = discount;
                }
                console.log(`✓ Áp dụng mã giảm giá: ${code}`);
            } else {
                console.log(`✗ Mã giảm giá không hợp lệ: ${code}`);
            }
        },
        
        // In giỏ hàng dạng bảng
        printCart() {
            if (items.length === 0) {
                console.log("Giỏ hàng trống");
                return;
            }
            
            const subtotal = items.reduce((total, item) => 
                total + (item.price * item.quantity), 0
            );
            
            let discount = 0;
            let total = subtotal;
            
            if (discountCode) {
                const discountData = discounts[discountCode];
                if (discountData.type === "fixed") {
                    discount = discountData.value;
                } else {
                    discount = subtotal * (discountData / 100);
                }
                total = subtotal - discount;
            }
            
            console.log("┌──────────────────────────────────────────────────────────┐");
            console.log("│ # │ Sản phẩm           │ SL │ Đơn giá      │ Tổng         │");
            console.log("├──────────────────────────────────────────────────────────┤");
            
            items.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                const name = item.name.padEnd(18);
                const qty = item.quantity.toString().padStart(2);
                const price = item.price.toLocaleString('vi-VN').padStart(12);
                const lineTotal = itemTotal.toLocaleString('vi-VN').padStart(12);
                console.log(`│ ${index + 1} │ ${name} │ ${qty} │ ${price}  │ ${lineTotal}  │`);
            });
            
            console.log("├──────────────────────────────────────────────────────────┤");
            console.log(`│ Tổng phụ:                                  ${subtotal.toLocaleString('vi-VN').padStart(12)}đ │`);
            
            if (discount > 0) {
                console.log(`│ Giảm giá (${discountCode}):                         -${discount.toLocaleString('vi-VN').padStart(11)}đ │`);
            }
            
            console.log(`│ Tổng cộng:                                  ${total.toLocaleString('vi-VN').padStart(12)}đ │`);
            console.log("└──────────────────────────────────────────────────────────┘");
        },
        
        // Lấy tổng số sản phẩm (tổng quantity)
        getItemCount() {
            return items.reduce((total, item) => total + item.quantity, 0);
        },
        
        // Xóa toàn bộ giỏ
        clearCart() {
            items = [];
            discountCode = null;
            discountPercent = 0;
            console.log("Giỏ hàng đã được xóa");
        },
        
        // Helper: Xem nội dung giỏ (cho debug)
        getItems() {
            return [...items];
        }
    };
}

// ============== TEST ==============
const cart = createCart();

console.log("=== Thêm sản phẩm ===");
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1); // Tăng lên 2

console.log("\n=== Giỏ hàng ban đầu ===");
cart.printCart();

console.log("\n=== Áp dụng mã SALE10 ===");
cart.applyDiscount("SALE10");
cart.printCart();

console.log("\n=== Thông tin giỏ ===");
console.log("Số sản phẩm (tổng quantity):", cart.getItemCount()); // → 4

console.log("\n=== Xóa sản phẩm ID 3 ===");
cart.removeItem(3);
console.log("Số sản phẩm sau xóa:", cart.getItemCount()); // → 2

console.log("\n=== Giỏ hàng sau xóa ===");
cart.printCart();

console.log("\n=== Xóa toàn bộ ===");
cart.clearCart();
console.log("Số sản phẩm:", cart.getItemCount()); // → 0
