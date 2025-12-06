// Cart Display Script with Checkout
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    
    const headerEl = document.querySelector('.Nav-bar');
    if (headerEl) {
        headerEl.addEventListener('mouseenter', () => {
            headerEl.classList.add('Nav-bar-hov');
        });
        headerEl.addEventListener('mouseleave', () => {
            headerEl.classList.remove('Nav-bar-hov');
        });
    }
});

function renderCart() {
    const cartContainer = document.querySelector('.cart-container');
    if (!cartContainer) return;
    
    loadCart();
    
    const existingItems = cartContainer.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());
    
    const subtotalBox = cartContainer.querySelector('.subtotal-box');
    const checkoutBtn = cartContainer.querySelector('.checkout-btn');
    
    if (cart.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.cssText = `
            text-align: center;
            padding: 40px;
            color: #666;
        `;
        emptyMsg.innerHTML = `
            <h3 style="margin-bottom: 10px;">Your cart is empty</h3>
            <p>Add some delicious items from our menu!</p>
            <a href="../Menu/Coffee Drinks/Menu - Coffee Drinks.html" 
               style="display: inline-block; margin-top: 20px; padding: 12px 24px; 
                      background: #333; color: white; border-radius: 8px; text-decoration: none;">
                Browse Menu
            </a>
        `;
        cartContainer.querySelector('h2').after(emptyMsg);
        
        if (subtotalBox) subtotalBox.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }
    
    if (subtotalBox) subtotalBox.style.display = 'flex';
    if (checkoutBtn) checkoutBtn.style.display = 'block';
    
    const h2 = cartContainer.querySelector('h2');
    cart.forEach(item => {
        const cartItem = createCartItemElement(item);
        h2.after(cartItem);
    });
    
    updateSubtotal();
    
    if (checkoutBtn) {
        checkoutBtn.onclick = showCheckoutForm;
    }
}

function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.itemId = item.id;
    
    const img = document.createElement('img');
    img.className = 'item-img';
    
    if (item.imageUrl) {
        let adjustedUrl = item.imageUrl;
        if (adjustedUrl.includes('../Food Items/')) {
            adjustedUrl = adjustedUrl.replace('../Food Items/', '../Menu/Food Items/');
        }
        if (adjustedUrl.includes('../Coffee Drinks/')) {
            adjustedUrl = adjustedUrl.replace('../Coffee Drinks/', '../Menu/Coffee Drinks/');
        }
        if (adjustedUrl.includes('../Non-Coffee Drinks/')) {
            adjustedUrl = adjustedUrl.replace('../Non-Coffee Drinks/', '../Menu/Non-Coffee Drinks/');
        }
        img.src = adjustedUrl;
    }
    
    img.onerror = () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'item-img';
        placeholder.style.cssText = `
            width: 80px;
            height: 80px;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            padding: 5px;
        `;
        placeholder.textContent = item.name.substring(0, 15);
        img.replaceWith(placeholder);
    };
    
    const details = document.createElement('div');
    details.className = 'item-details';
    
    const name = document.createElement('h3');
    name.className = 'item-name';
    name.textContent = item.name;
    
    const size = document.createElement('p');
    size.className = 'item-size';
    size.textContent = item.size;
    
    const price = document.createElement('p');
    price.className = 'item-price';
    price.textContent = `₱${item.price}`;
    
    details.appendChild(name);
    details.appendChild(size);
    details.appendChild(price);
    
    const qtyDiv = document.createElement('div');
    qtyDiv.className = 'item-qty';
    
    const minusBtn = document.createElement('button');
    minusBtn.className = 'qty-btn';
    minusBtn.textContent = '-';
    minusBtn.onclick = () => {
        updateQuantity(item.id, item.quantity - 1);
        renderCart();
    };
    
    const qtySpan = document.createElement('span');
    qtySpan.className = 'qty-number';
    qtySpan.textContent = item.quantity;
    
    const plusBtn = document.createElement('button');
    plusBtn.className = 'qty-btn';
    plusBtn.textContent = '+';
    plusBtn.onclick = () => {
        updateQuantity(item.id, item.quantity + 1);
        renderCart();
    };
    
    qtyDiv.appendChild(minusBtn);
    qtyDiv.appendChild(qtySpan);
    qtyDiv.appendChild(plusBtn);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.onclick = () => {
        if (confirm(`Remove ${item.name} from cart?`)) {
            removeFromCart(item.id);
            renderCart();
        }
    };
    
    cartItem.appendChild(img);
    cartItem.appendChild(details);
    cartItem.appendChild(qtyDiv);
    cartItem.appendChild(deleteBtn);
    
    return cartItem;
}

function updateSubtotal() {
    const subtotalPrice = document.querySelector('.subtotal-price');
    if (subtotalPrice) {
        const total = getCartTotal();
        subtotalPrice.textContent = `₱${total.toFixed(2)}`;
    }
}

function showCheckoutForm() {
    const overlay = document.createElement('div');
    overlay.className = 'checkout-overlay';
    overlay.innerHTML = `
        <div class="checkout-form-container">
            <h2>Complete Your Order</h2>
            <form id="checkoutForm">
                <div class="form-group">
                    <label for="customerName">Full Name *</label>
                    <input type="text" id="customerName" required placeholder="Juan Dela Cruz">
                </div>
                
                <div class="form-group">
                    <label for="customerPhone">Phone Number *</label>
                    <input type="tel" id="customerPhone" required placeholder="09171234567">
                </div>
                
                <div class="form-group">
                    <label for="customerEmail">Email (Optional)</label>
                    <input type="email" id="customerEmail" placeholder="juan@example.com">
                </div>
                
                <div class="form-group">
                    <label for="orderNotes">Special Instructions (Optional)</label>
                    <textarea id="orderNotes" rows="3" placeholder="Any special requests?"></textarea>
                </div>
                
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <p>Total Items: <strong>${getCartCount()}</strong></p>
                    <p>Total Amount: <strong>₱${getCartTotal().toFixed(2)}</strong></p>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel">Cancel</button>
                    <button type="submit" class="btn-submit">Place Order</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .checkout-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        }
        .checkout-form-container {
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        .checkout-form-container h2 {
            margin-bottom: 20px;
            color: #333;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
        }
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            font-family: inherit;
        }
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #333;
        }
        .order-summary {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .order-summary h3 {
            margin-bottom: 10px;
            color: #333;
        }
        .order-summary p {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
        }
        .form-actions {
            display: flex;
            gap: 10px;
        }
        .btn-cancel,
        .btn-submit {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-cancel {
            background: #f0f0f0;
            color: #333;
        }
        .btn-cancel:hover {
            background: #e0e0e0;
        }
        .btn-submit {
            background: #333;
            color: white;
        }
        .btn-submit:hover {
            background: #000;
        }
        .btn-submit:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    overlay.querySelector('.btn-cancel').onclick = () => overlay.remove();
    overlay.querySelector('#checkoutForm').onsubmit = handleCheckoutSubmit;
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    const formData = {
        customer_name: document.getElementById('customerName').value,
        customer_phone: document.getElementById('customerPhone').value,
        customer_email: document.getElementById('customerEmail').value,
        notes: document.getElementById('orderNotes').value,
        items: cart,
        total: getCartTotal()
    };
    
    try {
        const response = await fetch('../api/place_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Order placed successfully! Order ID: ${result.order_id}\n\nWe'll contact you shortly to confirm your order.`);
            clearCart();
            document.querySelector('.checkout-overlay').remove();
            renderCart();
        } else {
            alert('Error: ' + result.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to place order. Please check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order';
    }
}
