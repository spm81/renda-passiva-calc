<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$username = isset($_GET['username']) ? $_GET['username'] : '';
$username = preg_replace('/[^a-zA-Z0-9_-]/', '', $username);

if (empty($username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username é obrigatório']);
    exit;
}

$saveDir = __DIR__ . '/../save';
$filePath = $saveDir . '/' . $username . '.json';

if (!file_exists($filePath)) {
    http_response_code(404);
    echo json_encode(['error' => 'Nenhum dado guardado para este utilizador']);
    exit;
}

$data = file_get_contents($filePath);
if ($data === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar dados']);
    exit;
}

echo $data;
