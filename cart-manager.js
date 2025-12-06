// Cart Management System
// This file handles all cart operations across your site

// Cart data structure stored in memory
let cart = [];

// Load cart from storage when page loads
function loadCart() {
    const saved = localStorage.getItem('polaroidCafeCart');
    cart = saved ? JSON.parse(saved) : [];
    return cart;
}

// Save cart to storage
function saveCart() {
    localStorage.setItem('polaroidCafeCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(item) {
    // item should have: name, size, price, quantity, imageUrl
    const existingItem = cart.find(
        cartItem => cartItem.name === item.name && cartItem.size === item.size
    );
    
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push({
            id: Date.now(), // Unique ID
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl
        });
    }
    
    saveCart();
    return cart;
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    return cart;
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            saveCart();
        }
    }
    return cart;
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price);
        return total + (price * item.quantity);
    }, 0);
}

// Get cart item count
function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear entire cart
function clearCart() {
    cart = [];
    saveCart();
    return cart;
}

// Initialize cart on page load
loadCart();