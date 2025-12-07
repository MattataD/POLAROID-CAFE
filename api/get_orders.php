<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

date_default_timezone_set('Asia/Manila');

$conn = new mysqli('localhost', 'root', '', 'polaroid_cafe');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

$status = isset($_GET['status']) ? $_GET['status'] : null;
$orderId = isset($_GET['order_id']) ? $_GET['order_id'] : null;

if ($orderId) {
    $stmt = $conn->prepare("SELECT o.*, UNIX_TIMESTAMP(o.created_at) as unix_time FROM orders o WHERE o.order_id = ?");
    $stmt->bind_param('s', $orderId);
} else if ($status) {
    $stmt = $conn->prepare("SELECT o.*, UNIX_TIMESTAMP(o.created_at) as unix_time FROM orders o WHERE o.status = ? ORDER BY o.created_at DESC");
    $stmt->bind_param('s', $status);
} else {
    $stmt = $conn->prepare("SELECT o.*, UNIX_TIMESTAMP(o.created_at) as unix_time FROM orders o WHERE o.status NOT IN ('COMPLETED', 'CANCELLED') ORDER BY o.created_at DESC");
}

$stmt->execute();
$result = $stmt->get_result();
$orders = [];

while ($row = $result->fetch_assoc()) {
    $orderId = $row['order_id'];
    
    $itemStmt = $conn->prepare("SELECT item_name as name, item_size as size, item_price as price, quantity, image_url as imageUrl FROM order_items WHERE order_id = ?");
    $itemStmt->bind_param('s', $orderId);
    $itemStmt->execute();
    $itemResult = $itemStmt->get_result();
    
    $items = [];
    while ($item = $itemResult->fetch_assoc()) {
        $items[] = $item;
    }
    $itemStmt->close();
    
    $row['items'] = $items;
    $row['timestamp'] = intval($row['unix_time']) * 1000;
    unset($row['unix_time']);
    
    $orders[] = $row;
}

$stmt->close();
$conn->close();
echo json_encode(['success' => true, 'message' => 'Orders retrieved', 'data' => $orders]);
?>