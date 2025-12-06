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

function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 60000);
    return diff === 0 ? "Just now" : diff + " min ago";
}

function renderOrders() {
    orderList.innerHTML = "";

    orders
        .filter(o => o.status !== "COMPLETED" && o.status !== "CANCELLED")
        .forEach(order => {
            const card = document.createElement("div");
            card.className = `order-card status-${order.status.toLowerCase()}`;

            card.innerHTML = `
                <p class="order-id">#${order.id} • ${order.table}</p>
                <p class="order-meta">${order.items}</p>
                <p class="order-meta">${timeAgo(order.timestamp)}</p>
            `;

            card.addEventListener("click", () => loadDetails(order.id));

            orderList.appendChild(card);
        });
}

function loadDetails(id) {
    selectedOrder = orders.find(o => o.id === id);

    detailsContent.classList.remove("hidden");
    detailsContent.innerHTML = `
        <h3 class="order-id">Order #${selectedOrder.id}</h3>
        <p>${selectedOrder.table}</p>
        <p>${selectedOrder.items}</p>
        <p>Status: <strong>${selectedOrder.status}</strong></p>

        ${selectedOrder.status === "NEW" ? `<button class="action-btn" onclick="setProgress(${id})">Mark In Progress</button>` : ""}
        ${selectedOrder.status === "IN PROGRESS" ? `<button class="action-btn" onclick="setCompleted(${id})">Mark Completed</button>` : ""}
        ${selectedOrder.status !== "COMPLETED" && selectedOrder.status !== "CANCELLED" ? `<button class="action-btn" onclick="openCancel(${id})">Cancel Order</button>` : ""}
    `;
}

function setProgress(id) {
    const order = orders.find(o => o.id === id);
    order.status = "IN PROGRESS";
    renderOrders();
    loadDetails(id);
}

function setCompleted(id) {
    const order = orders.find(o => o.id === id);
    order.status = "COMPLETED";
    detailsContent.classList.add("hidden");
    renderOrders();
}

function openCancel(id) {
    pendingCancelId = id;
    modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");

confirmCancel.onclick = () => {
    const order = orders.find(o => o.id === pendingCancelId);
    order.status = "CANCELLED";
    modal.classList.add("hidden");
    detailsContent.classList.add("hidden");
    renderOrders();
};

simulateBtn.onclick = () => {
    const mock = {
        id: Math.floor(Math.random() * 9000 + 1000),
        table: "Table " + Math.floor(Math.random() * 10 + 1),
        items: "2x Latte, 1x Sandwich",
        status: "NEW",
        timestamp: Date.now()
    };

    orders.unshift(mock);
    renderOrders();
};
