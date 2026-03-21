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
      <div id="status-message" class="status-message"></div>

      <div id="location-mode" class="location-mode">
        <p class="location-prompt">How should we find your location?</p>
        <div class="mode-buttons">
          <button id="btn-auto" class="mode-btn" type="button">Auto</button>
          <button id="btn-manual" class="mode-btn" type="button">Manual</button>
        </div>
        <div id="manual-input" class="manual-input" style="display:none;">
          <input type="text" id="address-input" placeholder="Enter city name or zip code" autocomplete="off">
          <button id="btn-lookup" class="lookup-btn" type="button">Look Up</button>
          <div id="geocode-error" class="geocode-error"></div>
        </div>
        <div id="favorites" class="favorites"></div>
      </div>

      <div id="location-name" class="location-name">
        <span id="location-name-text"></span>
        <a href="#" id="save-favorite" class="save-favorite" style="display:none;">save</a>
      </div>

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
