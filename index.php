<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>UV Info</title>

<link rel="stylesheet" href="css/styles.css?v=<?php echo filemtime('css/styles.css'); ?>">

<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">

</head>

<body>

<header>UV Info</header>

<div class="container">
    <div id="uvbox">
        <div id="spinner" class="spinner"></div>

        <div id="currentTime" class="current-time"></div>

        <div id="uvvalue">--</div>

        <div id="risk"></div>

        <div id="forecast" class="forecast"></div>

        <div id="sun-times" class="sun-times"></div>

        <div id="exposure-times" class="exposure-times">
            <div id="exposure-times-title" class="exposure-times-title">
                Safe exposure times:
            </div>

            <ul></ul>
        </div>
    </div>
</div>

<script src="js/app.js?v=<?php echo filemtime('js/app.js'); ?>"></script>

</body>
</html>
