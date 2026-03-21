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

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_FOLLOWLOCATION => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if (!$response || $httpCode !== 200) {
    echo json_encode(["error" => "Geocoding request failed" . ($curlError ? ": $curlError" : "")]);
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
