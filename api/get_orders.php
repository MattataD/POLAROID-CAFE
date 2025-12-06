<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$conn = new mysqli('localhost', 'root', '', 'polaroid_cafe');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

$status = isset($_GET['status']) ? $_GET['status'] : null;
$orderId = isset($_GET['order_id']) ? $_GET['order_id'] : null;

if ($orderId) {
    $stmt = $conn->prepare("SELECT o.*, GROUP_CONCAT(CONCAT(oi.item_name, '|', oi.item_size, '|', oi.item_price, '|', oi.quantity) SEPARATOR '||') as items_data FROM orders o LEFT JOIN order_items oi ON o.order_id = oi.order_id WHERE o.order_id = ? GROUP BY o.order_id");
    $stmt->bind_param('s', $orderId);
} else if ($status) {
    $stmt = $conn->prepare("SELECT o.*, GROUP_CONCAT(CONCAT(oi.item_name, '|', oi.item_size, '|', oi.item_price, '|', oi.quantity) SEPARATOR '||') as items_data FROM orders o LEFT JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status = ? GROUP BY o.order_id ORDER BY o.created_at DESC");
    $stmt->bind_param('s', $status);
} else {
    $stmt = $conn->prepare("SELECT o.*, GROUP_CONCAT(CONCAT(oi.item_name, '|', oi.item_size, '|', oi.item_price, '|', oi.quantity) SEPARATOR '||') as items_data FROM orders o LEFT JOIN order_items oi ON o.order_id = oi.order_id WHERE o.status NOT IN ('COMPLETED', 'CANCELLED') GROUP BY o.order_id ORDER BY o.created_at DESC");
}

$stmt->execute();
$result = $stmt->get_result();
$orders = [];

while ($row = $result->fetch_assoc()) {
    $items = [];
    if ($row['items_data']) {
        foreach (explode('||', $row['items_data']) as $item) {
            list($name, $size, $price, $qty) = explode('|', $item);
            $items[] = ['name' => $name, 'size' => $size, 'price' => $price, 'quantity' => $qty];
        }
    }
    $row['items'] = $items;
    $row['timestamp'] = strtotime($row['created_at']) * 1000;
    unset($row['items_data']);
    $orders[] = $row;
}

$stmt->close();
$conn->close();
echo json_encode(['success' => true, 'message' => 'Orders retrieved', 'data' => $orders]);