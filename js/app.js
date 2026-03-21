var currentLocation = null;

function riskLevel(uv) {
    if (uv < 3) return ["Low", "low"];
    if (uv < 6) return ["Moderate", "moderate"];
    if (uv < 8) return ["High", "high"];
    if (uv < 11) return ["Very High", "veryhigh"];
    return ["Extreme", "extreme"];
}

function showLoading(show = true) {
    document.getElementById('spinner').style.display = show ? 'block' : 'none';
}

function hideResults() {
    ['location-name', 'currentTime', 'uvvalue', 'risk', 'forecast', 'sun-times', 'exposure-times'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
}

function showResults() {
    ['location-name', 'currentTime', 'uvvalue', 'risk', 'forecast', 'sun-times', 'exposure-times'].forEach(id => {
        document.getElementById(id).style.display = '';
    });
}

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('uv-favorites')) || [];
    } catch (e) {
        return [];
    }
}

function saveFavorites(favs) {
    localStorage.setItem('uv-favorites', JSON.stringify(favs));
}

function isFavorite(lat, lon) {
    return getFavorites().some(f => f.lat === lat && f.lon === lon);
}

function addFavorite(name, lat, lon) {
    let favs = getFavorites();
    if (!favs.some(f => f.lat === lat && f.lon === lon)) {
        favs.push({ name: name, lat: lat, lon: lon });
        saveFavorites(favs);
    }
}

function removeFavorite(lat, lon) {
    let favs = getFavorites().filter(f => f.lat !== lat || f.lon !== lon);
    saveFavorites(favs);
}

function renderFavorites() {
    let container = document.getElementById('favorites');
    let favs = getFavorites();

    container.innerHTML = '';

    if (favs.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    let title = document.createElement('div');
    title.className = 'favorites-title';
    title.textContent = 'Favorites:';
    container.appendChild(title);

    let list = document.createElement('div');
    list.className = 'favorites-list';

    favs.forEach(fav => {
        let item = document.createElement('div');
        item.className = 'favorite-item';

        let link = document.createElement('a');
        link.href = '#';
        link.className = 'favorite-link';
        link.textContent = fav.name;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            currentLocation = { name: fav.name, lat: fav.lat, lon: fav.lon };
            document.getElementById('location-name-text').textContent = fav.name;
            updateSaveLink();
            document.getElementById('location-mode').style.display = 'none';
            fetchUV(fav.lat, fav.lon);
        });

        let removeBtn = document.createElement('a');
        removeBtn.href = '#';
        removeBtn.className = 'favorite-remove';
        removeBtn.textContent = '\u00d7';
        removeBtn.title = 'Remove';
        removeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            removeFavorite(fav.lat, fav.lon);
            renderFavorites();
            updateSaveLink();
        });

        item.appendChild(link);
        item.appendChild(removeBtn);
        list.appendChild(item);
    });

    container.appendChild(list);
}

function updateSaveLink() {
    let saveLink = document.getElementById('save-favorite');
    if (!currentLocation || !currentLocation.name) {
        saveLink.style.display = 'none';
        return;
    }
    if (isFavorite(currentLocation.lat, currentLocation.lon)) {
        saveLink.style.display = 'none';
    } else {
        saveLink.style.display = '';
    }
}

function populateExposureTimes(safeExposure) {
    const container = document.querySelector(".exposure-times ul");

    if (!container) return;

    container.innerHTML = "";

    const labels = [
        "Skin Type I",
        "Skin Type II",
        "Skin Type III"
    ];

    for (let i = 1; i <= 3; i++) {
        const li = document.createElement("li");

        const label = document.createElement("span");
        label.textContent = labels[i - 1];

        const value = document.createElement("span");
        value.textContent = safeExposure["st" + i] + " min";

        li.appendChild(label);
        li.appendChild(value);

        container.appendChild(li);
    }
}

function fetchUV(lat, lon) {
    showLoading(true);

    fetch(`get_uv.php?lat=${lat}&lon=${lon}`)
    .then(r => r.json())
    .then(data => {
        showLoading(false);
        showResults();

        if (data.error) {
            alert(data.error);
            return;
        }

        let uv = data.uv;

        let rl = riskLevel(uv);

        let uvEl = document.getElementById("uvvalue");
        uvEl.innerText = uv.toFixed(1);
        uvEl.className = rl[1];

        document.getElementById("risk").innerText = rl[0] + " risk";

        let now = new Date();

        document.getElementById("currentTime").innerText =
            now.toLocaleString([], {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

        let forecastEl = document.getElementById("forecast");
        forecastEl.innerHTML = "";

        (data.forecast || []).forEach(f => {
            let container = document.createElement("div");
            container.className = "bar-container";

            let uvVal = document.createElement("div");
            uvVal.className = "bar-value";
            uvVal.innerText = f.uv.toFixed(1);

            let bar = document.createElement("div");
            let rf = riskLevel(f.uv);

            bar.className = "bar " + rf[1];
            bar.style.height = Math.min(f.uv * 10, 100) + "px";

            let time = document.createElement("div");
            time.className = "bar-time";

            let t = new Date(f.time);
            time.innerText = t.getHours();

            container.appendChild(uvVal);
            container.appendChild(bar);
            container.appendChild(time);

            forecastEl.appendChild(container);
        });

        if (data.sunrise && data.sunset) {
            let sunTimesEl = document.getElementById("sun-times");
            let sr = new Date(data.sunrise);
            let ss = new Date(data.sunset);
            sunTimesEl.innerText =
                "Sunrise: " + sr.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) +
                " | Sunset: " + ss.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        }

        if (data.safeExposure) {
            populateExposureTimes(data.safeExposure);
        }

        updateSaveLink();
    })
    .catch(err => {
        showLoading(false);
        alert("Failed to fetch UV index");
    });
}

function fetchLocationUV() {
    if (!navigator.geolocation) {
        document.getElementById('location-mode').style.display = 'block';
        document.getElementById('geocode-error').textContent = 'Geolocation not supported. Try entering an address instead.';
        document.getElementById('manual-input').style.display = 'flex';
        return;
    }

    showLoading(true);

    navigator.geolocation.getCurrentPosition(
        pos => {
            fetchUV(pos.coords.latitude, pos.coords.longitude);
        },

        err => {
            showLoading(false);
            document.getElementById('location-mode').style.display = 'block';
            document.getElementById('manual-input').style.display = 'flex';

            let errorEl = document.getElementById('geocode-error');
            switch (err.code) {
                case err.PERMISSION_DENIED:
                    errorEl.textContent = 'Location permission denied. Try entering an address instead.';
                    break;
                case err.POSITION_UNAVAILABLE:
                    errorEl.textContent = 'Location unavailable. Try entering an address instead.';
                    break;
                case err.TIMEOUT:
                    errorEl.textContent = 'Location request timed out. Try entering an address instead.';
                    break;
                default:
                    errorEl.textContent = 'Location error. Try entering an address instead.';
            }
        },
        {
            timeout: 15000,
            maximumAge: 60000
        }
    );
}

function geocodeAndFetch(query) {
    let errorEl = document.getElementById('geocode-error');
    errorEl.textContent = '';

    if (!query) {
        errorEl.textContent = 'Please enter an address or zip code.';
        return;
    }

    document.getElementById('location-mode').style.display = 'none';
    showLoading(true);

    fetch('geocode.php?q=' + encodeURIComponent(query))
    .then(r => r.json())
    .then(data => {
        if (data.error) {
            showLoading(false);
            document.getElementById('location-mode').style.display = 'block';
            document.getElementById('geocode-error').textContent = data.error + ' Try a different address.';
            return;
        }
        currentLocation = { name: data.display_name, lat: data.lat, lon: data.lon };
        document.getElementById('location-name-text').textContent = data.display_name;
        updateSaveLink();
        fetchUV(data.lat, data.lon);
    })
    .catch(err => {
        showLoading(false);
        document.getElementById('location-mode').style.display = 'block';
        document.getElementById('geocode-error').textContent = 'Geocoding failed. Please try again.';
    });
}

function initApp() {
    let modeEl = document.getElementById('location-mode');
    let btnAuto = document.getElementById('btn-auto');
    let btnManual = document.getElementById('btn-manual');
    let manualInput = document.getElementById('manual-input');
    let btnLookup = document.getElementById('btn-lookup');
    let addressInput = document.getElementById('address-input');

    modeEl.style.display = 'block';
    showLoading(false);
    hideResults();
    renderFavorites();

    btnAuto.addEventListener('click', function () {
        modeEl.style.display = 'none';
        fetchLocationUV();
    });

    btnManual.addEventListener('click', function () {
        manualInput.style.display = 'flex';
        btnAuto.classList.remove('active');
        btnManual.classList.add('active');
        addressInput.focus();
    });

    btnLookup.addEventListener('click', function () {
        geocodeAndFetch(addressInput.value.trim());
    });

    addressInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            geocodeAndFetch(addressInput.value.trim());
        }
    });

    document.getElementById('save-favorite').addEventListener('click', function (e) {
        e.preventDefault();
        if (currentLocation && currentLocation.name) {
            addFavorite(currentLocation.name, currentLocation.lat, currentLocation.lon);
            updateSaveLink();
        }
    });
}

initApp();
