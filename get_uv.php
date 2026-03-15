<?php
header('Content-Type: application/json');

$lat = $_GET['lat'] ?? null;
$lon = $_GET['lon'] ?? null;

if (!$lat || !$lon) {
    echo json_encode(["error"=>"Missing coordinates"]);
    exit;
}

if (!is_numeric($lat) || !is_numeric($lon)) {
    echo json_encode(["error"=>"Invalid coordinates"]);
    exit;
}

function callAPI($url)
{
    $opts = [
        "http" => [
            "method" => "GET",
            "timeout" => 10
        ]
    ];

    $context = stream_context_create($opts);
    $response = @file_get_contents($url, false, $context);

    if (!$response) return null;

    return json_decode($response, true);
}

$url =
"https://api.open-meteo.com/v1/forecast?" .
"latitude=$lat&longitude=$lon" .
"&hourly=uv_index" .
"&daily=sunset" .
"&current=uv_index" .
"&forecast_days=1" .
"&timezone=auto";
$data = callAPI($url);

if (!$data) {
    echo json_encode(["error"=>"Weather API failure"]);
    exit;
}
/*
Current UV
*/
$uv = $data['current']['uv_index'] ?? null;
error_log(print_r($data, true));

/*
Forecast (6am to 5pm)
*/
$forecastData = [];

if (isset($data['hourly']['time'])) {

    $times = $data['hourly']['time'];
    $uvs   = $data['hourly']['uv_index'];

    for ($i=0; $i<count($times); $i++) {

        $hour = (int) date('H', strtotime($times[$i]));

        if ($hour >= 6 && $hour <= 17) {

            $forecastData[] = [
                "time" => $times[$i],
                "uv" => $uvs[$i]
            ];
        }
    }
}

/*
Sunset
*/
$sunset = $data['daily']['sunset'][0] ?? null;


/*
Safe exposure calculation
*/
function calculateSafeExposure($uv)
{
    if (!$uv || $uv <= 0) return null;

    $MED = [
        "st1" => 200,
        "st2" => 250,
        "st3" => 300,
        "st4" => 450,
        "st5" => 600,
        "st6" => 1000
    ];

    $times = [];

    foreach ($MED as $type => $med) {

        $minutes = $med / (1.5 * $uv);

        $times[$type] = round($minutes);
    }

    return $times;
}

$safeExposure = calculateSafeExposure($uv);

echo json_encode([
    "uv" => $uv,
    "forecast" => $forecastData,
    "sunset" => $sunset,
    "safeExposure" => $safeExposure
]);
