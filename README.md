# UV Info

A web application that provides real-time UV index information, forecasts, and safe sun exposure recommendations based on your location.

## Features

- **Current UV Index**: Displays the current UV index with color-coded risk levels
- **UV Forecast**: Hourly UV index forecast between sunrise and sunset
- **Sun Times**: Sunrise and sunset times for your location
- **Safe Exposure Times**: Calculates recommended sun exposure times for different skin types
- **Automatic Location Detection**: Uses browser geolocation to get your coordinates
- **Responsive Design**: Works on desktop and mobile devices

## Risk Levels

The app categorizes UV index into risk levels:
- **Low** (0-2.9): Minimal risk
- **Moderate** (3-5.9): Moderate risk
- **High** (6-7.9): High risk
- **Very High** (8-10.9): Very high risk
- **Extreme** (11+): Extreme risk

## Skin Types for Safe Exposure

Safe exposure times are calculated for three skin types based on Minimal Erythemal Dose (MED):
- **Skin Type I**: Very fair skin, burns easily
- **Skin Type II**: Fair skin, burns easily
- **Skin Type III**: Fair to medium skin

## Requirements

- Web server with PHP support
- Internet connection for API calls
- Modern web browser with geolocation support

## Installation

1. Clone or download the repository
2. Upload files to your web server
3. Ensure PHP is enabled on your server
4. Access the app through your web browser

## Usage

1. Open the app in your web browser
2. Allow location access when prompted
3. View your current UV index and risk level
4. Check the hourly forecast and sun times
5. Review safe exposure recommendations

## API

The app uses the [Open-Meteo API](https://open-meteo.com/) for weather data, which provides:
- Current UV index
- Hourly UV forecasts
- Daily sunrise/sunset times

## Technical Details

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP for API proxy
- **Styling**: Custom CSS with Roboto font
- **Data Source**: Open-Meteo weather API

## Privacy

This app only uses your location to fetch UV data and does not store or transmit location data elsewhere.

## Disclaimer

Most of the code in this application was generated using AI tools. While efforts have been made to ensure accuracy and functionality, please use the UV information provided as a general guide and not as a substitute for professional advice. Always consult local health authorities for the most current UV safety recommendations.

## License

See LICENSE file for details.