const headerEl = document.querySelector('.Nav-bar');
headerEl.addEventListener('mouseenter', () => {
    headerEl.classList.add('Nav-bar-hov');
});
headerEl.addEventListener('mouseleave', () => {
    headerEl.classList.remove('Nav-bar-hov');
});

let orders = [];
let selectedOrder = null;
let pendingCancelId = null;

const orderList = document.getElementById("orderList");
const detailsContent = document.getElementById("detailsContent");
const simulateBtn = document.getElementById("simulateBtn");

const modal = document.getElementById("cancelModal");
const confirmCancel = document.getElementById("confirmCancel");
const closeModal = document.getElementById("closeModal");

// API Base URL - adjust this to your server path
const API_BASE = './api';

function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 60000);  // ✅ Correct: 60000 ms = 1 minute
    if (diff === 0) return "Just now";
    if (diff < 60) return diff + " min ago";
    const hours = Math.floor(diff / 60);
    if (hours < 24) return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
    const days = Math.floor(hours / 24);
    return days + " day" + (days > 1 ? "s" : "") + " ago";
}

// Fetch orders from database
async function fetchOrders() {
    try {
        const response = await fetch(`${API_BASE}/get_orders.php`);
        const result = await response.json();
        
        if (result.success) {
            orders = result.data;
            renderOrders();
        } else {
            console.error('Failed to fetch orders:', result.message);
            showError('Failed to load orders');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        showError('Connection error. Please check your server.');
    }
}

// Update order status in database
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_BASE}/update_order.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_id: orderId,
                status: newStatus
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update local orders array
            const order = orders.find(o => o.order_id === orderId);
            if (order) {
                order.status = newStatus;
            }
            return true;
        } else {
            console.error('Failed to update order:', result.message);
            showError('Failed to update order status');
            return false;
        }
    } catch (error) {
        console.error('Error updating order:', error);
        showError('Connection error. Please try again.');
        return false;
    }
}

function renderOrders() {
    orderList.innerHTML = "";

    const activeOrders = orders.filter(o => 
        o.status !== "COMPLETED" && o.status !== "CANCELLED"
    );

    if (activeOrders.length === 0) {
        orderList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <p>No active orders at the moment</p>
            </div>
        `;
        return;
    }

    activeOrders.forEach(order => {
        const card = document.createElement("div");
        card.className = `order-card status-${order.status.toLowerCase().replace(' ', '')}`;

        // Format items for display
        const itemsText = order.items
            .map(item => `${item.quantity}x ${item.name} (${item.size})`)
            .join(', ');
        
        const itemsDisplay = itemsText.length > 50 
            ? itemsText.substring(0, 50) + '...' 
            : itemsText;

        card.innerHTML = `
            <p class="order-id">#${order.order_id}</p>
            <p class="order-meta">${order.customer_name}</p>
            <p class="order-meta">${itemsDisplay}</p>
            <p class="order-meta">₱${parseFloat(order.total_amount).toFixed(2)}</p>
            <p class="order-meta">${timeAgo(order.timestamp)}</p>
        `;

        card.addEventListener("click", () => loadDetails(order.order_id));

        orderList.appendChild(card);
    });
}

function loadDetails(orderId) {
    selectedOrder = orders.find(o => o.order_id === orderId);

    if (!selectedOrder) return;

    detailsContent.classList.remove("hidden");
    
    // Format items list
    const itemsList = selectedOrder.items
        .map(item => `
            <div style="padding: 8px; background: rgba(255,255,255,0.3); border-radius: 8px; margin: 5px 0;">
                <strong>${item.quantity}x ${item.name}</strong><br>
                Size: ${item.size} | Price: ₱${parseFloat(item.price).toFixed(2)}
            </div>
        `)
        .join('');

    detailsContent.innerHTML = `
        <h3 class="order-id">Order #${selectedOrder.order_id}</h3>
        <p><strong>Customer:</strong> ${selectedOrder.customer_name}</p>
        <p><strong>Phone:</strong> ${selectedOrder.customer_phone}</p>
        ${selectedOrder.customer_email ? `<p><strong>Email:</strong> ${selectedOrder.customer_email}</p>` : ''}
        ${selectedOrder.notes ? `<p><strong>Notes:</strong> ${selectedOrder.notes}</p>` : ''}
        
        <div style="margin: 15px 0;">
            <strong>Items:</strong>
            ${itemsList}
        </div>
        
        <p style="font-size: 1.2rem; margin: 10px 0;">
            <strong>Total: ₱${parseFloat(selectedOrder.total_amount).toFixed(2)}</strong>
        </p>
        <p><strong>Status:</strong> <span style="color: ${getStatusColor(selectedOrder.status)}">${selectedOrder.status}</span></p>
        <p style="font-size: 0.9rem; color: #666;">Ordered ${timeAgo(selectedOrder.timestamp)}</p>

        ${selectedOrder.status === "NEW" ? `<button class="action-btn" onclick="setProgress('${selectedOrder.order_id}')">Mark In Progress</button>` : ""}
        ${selectedOrder.status === "IN PROGRESS" ? `<button class="action-btn" onclick="setCompleted('${selectedOrder.order_id}')">Mark Completed</button>` : ""}
        ${selectedOrder.status !== "COMPLETED" && selectedOrder.status !== "CANCELLED" ? `<button class="action-btn" onclick="openCancel('${selectedOrder.order_id}')">Cancel Order</button>` : ""}
    `;
}

function getStatusColor(status) {
    switch(status) {
        case 'NEW': return '#e63946';
        case 'IN PROGRESS': return '#ffb703';
        case 'COMPLETED': return '#2a9d8f';
        case 'CANCELLED': return '#6c757d';
        default: return '#333';
    }
}

async function setProgress(orderId) {
    const success = await updateOrderStatus(orderId, 'IN PROGRESS');
    if (success) {
        renderOrders();
        loadDetails(orderId);
    }
}

async function setCompleted(orderId) {
    const success = await updateOrderStatus(orderId, 'COMPLETED');
    if (success) {
        detailsContent.classList.add("hidden");
        renderOrders();
        showSuccess('Order marked as completed!');
    }
}

function openCancel(orderId) {
    pendingCancelId = orderId;
    modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");

confirmCancel.onclick = async () => {
    const success = await updateOrderStatus(pendingCancelId, 'CANCELLED');
    if (success) {
        modal.classList.add("hidden");
        detailsContent.classList.add("hidden");
        renderOrders();
        showSuccess('Order cancelled');
    }
};

// Remove simulate button functionality (using real orders now)
if (simulateBtn) {
    simulateBtn.textContent = 'Refresh Orders';
    simulateBtn.onclick = fetchOrders;
}

// Notification functions
function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'error' ? '#e63946' : '#2a9d8f'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Auto-refresh orders every 30 seconds
setInterval(fetchOrders, 30000);

// Initial load
fetchOrders();