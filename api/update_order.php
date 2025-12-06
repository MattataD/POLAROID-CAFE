<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || empty($data['order_id']) || empty($data['status'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$validStatuses = ['NEW', 'IN PROGRESS', 'COMPLETED', 'CANCELLED'];
if (!in_array($data['status'], $validStatuses)) {
    echo json_encode(['success' => false, 'message' => 'Invalid status']);
    exit;
}

$conn = new mysqli('localhost', 'root', '', 'polaroid_cafe');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

$stmt = $conn->prepare("UPDATE orders SET status = ? WHERE order_id = ?");
$stmt->bind_param('ss', $data['status'], $data['order_id']);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(['success' => true, 'message' => 'Order updated', 'data' => ['order_id' => $data['order_id'], 'status' => $data['status']]]);
} else {
    echo json_encode(['success' => false, 'message' => 'Order not found']);
}

$stmt->close();
$conn->close();