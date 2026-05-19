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

      <div class="disclaimer-link-wrap">
        <a href="#" id="disclaimer-link" class="disclaimer-link">Disclaimer</a>
      </div>
    </div>
  </div>

  <div id="disclaimer-modal" class="modal" hidden>
    <div class="modal-backdrop" data-close></div>
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
      <h2 id="disclaimer-title">Disclaimer</h2>
      <p>
        The information provided on this website, including UV index readings,
        forecasts, and safe sun-exposure time estimates, is for general
        informational purposes only. Values are derived from third-party
        weather data and simplified models, and may be inaccurate or out of
        date.
      </p>
      <p>
        Nothing on this site constitutes medical advice. The author is not a
        medical professional and makes no representations or warranties about
        the accuracy, completeness, or suitability of the information for any
        purpose. Individual skin sensitivity, medications, altitude, reflective
        surfaces, and other factors can significantly affect safe exposure.
      </p>
      <p>
        Always consult a qualified healthcare provider for advice regarding
        sun exposure, skin health, or any medical condition. By using this
        site you agree that the author bears no responsibility or liability
        for any harm, loss, or damage resulting from reliance on the
        information presented.
      </p>
      <button type="button" id="disclaimer-close" class="modal-close" data-close>Close</button>
    </div>
  </div>

  <script src="js/app.js?v=<?php echo filemtime('js/app.js'); ?>"></script>
</body>

</html>
