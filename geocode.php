<?php
header('Content-Type: application/json');

$q = $_GET['q'] ?? null;

if (!$q || !trim($q)) {
    echo json_encode(["error" => "Missing query"]);
    exit;
}

$q = trim($q);

$params = [
    "name" => $q,
    "count" => 1,
    "language" => "en",
    "format" => "json"
];

$url = "https://geocoding-api.open-meteo.com/v1/search?" . http_build_query($params);

$opts = [
    "http" => [
        "method" => "GET",
        "timeout" => 10
    ]
];

$context = stream_context_create($opts);
$response = @file_get_contents($url, false, $context);

if (!$response) {
    echo json_encode(["error" => "Geocoding request failed"]);
    exit;
}

$data = json_decode($response, true);

if (!isset($data['results']) || count($data['results']) === 0) {
    echo json_encode(["error" => "No results found"]);
    exit;
}

$result = $data['results'][0];

$nameParts = array_filter([
    $result["name"] ?? null,
    $result["admin1"] ?? null,
    $result["country"] ?? null
]);

echo json_encode([
    "lat" => floatval($result["latitude"]),
    "lon" => floatval($result["longitude"]),
    "display_name" => implode(", ", $nameParts)
]);
