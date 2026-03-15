function riskLevel(uv) {

    if (uv < 3) return ["Low","low"]
    if (uv < 6) return ["Moderate","moderate"]
    if (uv < 8) return ["High","high"]
    if (uv < 11) return ["Very High","veryhigh"]
    return ["Extreme","extreme"]

}

function showLoading(show=true) {

    document.getElementById('spinner').style.display = show ? 'block' : 'none'

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

    showLoading(true)

    fetch(`get_uv.php?lat=${lat}&lon=${lon}`)
    .then(r => r.json())
    .then(data => {
        showLoading(false)

        if (data.error) {
            alert(data.error)
            return
        }

        let uv = data.uv

        let r = riskLevel(uv)

        let uvEl = document.getElementById("uvvalue")
        uvEl.innerText = uv.toFixed(1)
        uvEl.className = r[1]

        document.getElementById("risk").innerText = r[0] + " risk"

        let now = new Date()

        document.getElementById("currentTime").innerText =
            now.toLocaleString([], {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })

        let forecastEl = document.getElementById("forecast")
        forecastEl.innerHTML = ""

        ;(data.forecast || []).forEach(f => {
            let container = document.createElement("div")
            container.className = "bar-container"

            let uvVal = document.createElement("div")
            uvVal.className = "bar-value"
            uvVal.innerText = f.uv.toFixed(1)

            let bar = document.createElement("div")
            let rf = riskLevel(f.uv)

            bar.className = "bar " + rf[1]
            bar.style.height = Math.min(f.uv * 10, 100) + "px"

            let time = document.createElement("div")
            time.className = "bar-time"

            let t = new Date(f.time)
            time.innerText = t.getHours()

            container.appendChild(uvVal)
            container.appendChild(bar)
            container.appendChild(time)

            forecastEl.appendChild(container)
        })

        if (data.sunset) {
            let sunsetEl = document.getElementById("sunset");
            let s = new Date(data.sunset);
            sunsetEl.innerText =
                "Sunset: " +
                s.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        }

        if (data.safeExposure) {
            populateExposureTimes(data.safeExposure);
        }
    })
    .catch(err => {
        showLoading(false)
        alert("Failed to fetch UV index")
    })
}

function fetchLocationUV() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported")
        return
    }

    navigator.geolocation.getCurrentPosition(
        pos => {
            fetchUV(pos.coords.latitude, pos.coords.longitude)
        },

        err => {
            switch(err.code) {
                case err.PERMISSION_DENIED:
                    alert("Location permission denied")
                    break
                case err.POSITION_UNAVAILABLE:
                    alert("Location unavailable")
                    break
                case err.TIMEOUT:
                    alert("Location request timed out")
                    break
                default:
                    alert("Location error")
            }
        },
        {
            timeout:15000,
            maximumAge:60000
        }
    )
}

fetchLocationUV()
