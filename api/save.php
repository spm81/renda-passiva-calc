<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!isset($data['username']) || !isset($data['data'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username e data são obrigatórios']);
    exit;
}

$username = preg_replace('/[^a-zA-Z0-9_-]/', '', $data['username']);
$saveDir = __DIR__ . '/../save';

if (!file_exists($saveDir)) {
    mkdir($saveDir, 0755, true);
}

$filePath = $saveDir . '/' . $username . '.json';
$result = file_put_contents($filePath, json_encode($data['data'], JSON_PRETTY_PRINT));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao guardar dados']);
    exit;
}

echo json_encode(['message' => 'Dados guardados com sucesso!']);
