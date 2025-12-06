<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
if (empty($input)) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$data = json_decode($input, true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

if (empty($data['customer_name'])) {
    echo json_encode(['success' => false, 'message' => 'Customer name required']);
    exit;
}
if (empty($data['customer_phone'])) {
    echo json_encode(['success' => false, 'message' => 'Phone number required']);
    exit;
}
if (empty($data['items']) || !is_array($data['items'])) {
    echo json_encode(['success' => false, 'message' => 'Items required']);
    exit;
}
if (empty($data['total'])) {
    echo json_encode(['success' => false, 'message' => 'Total required']);
    exit;
}

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'polaroid_cafe';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$conn->set_charset("utf8mb4");

$orderId = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

$customerName = $conn->real_escape_string($data['customer_name']);
$customerPhone = $conn->real_escape_string($data['customer_phone']);
$customerEmail = !empty($data['customer_email']) ? $conn->real_escape_string($data['customer_email']) : null;
$notes = !empty($data['notes']) ? $conn->real_escape_string($data['notes']) : null;
$total = floatval($data['total']);

$conn->begin_transaction();

try {
    $sql = "INSERT INTO orders (order_id, customer_name, customer_phone, customer_email, notes, total_amount, status) 
            VALUES ('$orderId', '$customerName', '$customerPhone', " . 
            ($customerEmail ? "'$customerEmail'" : "NULL") . ", " .
            ($notes ? "'$notes'" : "NULL") . ", $total, 'NEW')";
    
    if (!$conn->query($sql)) {
        throw new Exception('Failed to create order');
    }
    
    foreach ($data['items'] as $item) {
        $itemName = $conn->real_escape_string($item['name']);
        $itemSize = $conn->real_escape_string($item['size']);
        $itemPrice = floatval($item['price']);
        $quantity = intval($item['quantity']);
        $imageUrl = !empty($item['imageUrl']) ? $conn->real_escape_string($item['imageUrl']) : null;
        
        $sql = "INSERT INTO order_items (order_id, item_name, item_size, item_price, quantity, image_url) 
                VALUES ('$orderId', '$itemName', '$itemSize', $itemPrice, $quantity, " .
                ($imageUrl ? "'$imageUrl'" : "NULL") . ")";
        
        if (!$conn->query($sql)) {
            throw new Exception('Failed to add item');
        }
    }
    
    $conn->commit();
    $conn->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
        'order_id' => $orderId,
        'data' => [
            'order_id' => $orderId,
            'total' => $total,
            'items_count' => count($data['items'])
        ]
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    $conn->close();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>