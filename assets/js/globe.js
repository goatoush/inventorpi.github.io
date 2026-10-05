const pointOfView = { lat: 29.02441, lng: -69.44080, altitude: 2 };

colors = {
    'Base, Active': '#000000',
    Active: BRAND_COLOR,
    Planned: BRAND_COLOR + '44',
    Suggested: '#00f7ff',
    'Base, Active Label': '#000000',
    'Active Label': '#000000',
    'Planned Label': '#888888',
    'Suggested Label': '#00478e',
};

const fetchJson = async (url) => await (await fetch(url)).json();

function getDistance(lat1, lon1, lat2, lon2, unit = 'km') {
    const R = 6371; // Earth's mean radius in kilometers

    // Convert degrees to radians
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const rLat1 = (lat1 * Math.PI) / 180;
    const rLat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceInKm = R * c;

    // Return in requested unit
    if (unit === 'miles') {
        return distanceInKm * 0.621371;
    }
    return distanceInKm;
}

const flightTime = (start, end) => {
    const distance = getDistance(start.lat, start.lng, end.lat, end.lng);
    const speed = 2; // 2 km/ms
    return Math.round(distance / speed);
};

// Converts RGB to HSL, adjusts lightness, and returns RGB
const adjustLightness = (hex, percent) => {
    hex = hex.replace(/^#/, '');

    // If it's a shorthand hex code (e.g. "f3f"), expand it to 6 characters ("ff33ff")
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((char) => char + char)
            .join('');
    }

    // Parse the hex values into base-10 integers
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // 1. Convert RGB to fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic (gray)
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    // 2. Adjust Lightness (percent can be positive or negative, e.g., 0.1 or -0.15)
    l = Math.min(1, Math.max(0, l + percent));

    // 3. Convert HSL back to RGB
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let rOut, gOut, bOut;
    if (s === 0) {
        rOut = gOut = bOut = l; // gray
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        rOut = hue2rgb(p, q, h + 1 / 3);
        gOut = hue2rgb(p, q, h);
        bOut = hue2rgb(p, q, h - 1 / 3);
    }

    return `rgb(${Math.round(rOut * 255)}, ${Math.round(gOut * 255)}, ${Math.round(bOut * 255)})`;
};

const countryName = polygon => [polygon.properties.NAME, polygon.properties.NAME_LONG].sort((a, b) => a.length - b.length)[0];

const countryColor = (polygon) => {
    const countryNameFraction = (countryName(polygon).charCodeAt(0) - 65) / 25;
    const lightnessAdjustment = (1 - countryNameFraction) * 0.2 + 0.2; // Adjust lightness based on country name
    return adjustLightness(BRAND_COLOR, lightnessAdjustment);
};

(async function () {
    const cities = (await fetchJson('/assets/data/cities.json')).filter(city => ['Base', 'Active', 'Planned'].some(type => city.type.includes(type)));
    const base = cities.find((city) => city.type.includes('Base'));
    cities.map((city) => (city.flightTime = flightTime(base, city)));
    const countries = await fetchJson('/assets/datasets/ne_110m_admin_0_countries.geojson');

    const addCountries = () => {
        globe
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.1)
            .hexPolygonColor((polygon) => countryColor(polygon));
    };

    const addLabels = () => {
        globe
            .labelsData(cities)
            .labelText((city) => city.name)
            .labelSize(3)
            .labelDotRadius(1.25)
            .labelColor((city) => colors[city.type + ' Label']);
    };

    const addBars = () => {
        globe
            .pointsData(cities)
            .pointRadius(0.5)
            .pointLabel((city) => city.type !== "Suggested" && `<b>${city.name}</b><br><small>${city.type}</small>` || '')
            .pointColor((city) => colors[city.type])
            .pointAltitude(0.15)
            .pointsTransitionDuration(2000);
    };

    const addRings = () => {
        const ringColorInterpolator = (city) => (t) => {
            const baseColor = colors[city.type + ' Label'];
            const alpha = Math.round(Math.sqrt(1 - t) * 255)
                .toString(16)
                .padStart(2, '0');
            return `${baseColor}${alpha}`.toLowerCase();
        };
        globe
            .ringsData(cities)
            .ringColor(ringColorInterpolator)
            .ringMaxRadius(10)
            .ringPropagationSpeed(2)
            .ringRepeatPeriod(500)
            .ringAltitude(0.0015);
    };

    const addArcs = () => {
        globe
            .arcsData(cities.filter((city) => city !== base))
            .arcStartLat((city) => base.lat)
            .arcStartLng((city) => base.lng)
            .arcEndLat((city) => city.lat)
            .arcEndLng((city) => city.lng)
            .arcLabel('')
            .arcColor((city) => [colors[city.type], colors[city.type + ' Label']])
            .arcDashInitialGap(1)
            .arcDashLength(1)
            .arcDashGap((city) => (city.type === 'Suggested' ? 1 : 0.5))
            .arcAltitudeAutoScale(0.35)
            .arcsTransitionDuration(500)
            .arcDashAnimateTime((city) => city.flightTime)
            .arcStroke((city) => (city.type === 'Suggested' ? 2 : 0.5));
    };

    const addInteractiveSuggestedLocations = () => {
        const suggestLocation = (lat, lng, name = '') => {
            const location = { lat, lng, name, type: 'Suggested' };
            location.flightTime = flightTime(base, location);
            globe.arcsData([...globe.arcsData(), location]);
            globe.ringsData([...globe.ringsData(), location]);
            globe.labelsData([...globe.labelsData(), location]);
            globe.pointsData([...globe.pointsData(), location]);
            setTimeout(() => {
                globe.arcsData(globe.arcsData().filter((city) => city !== location));
                globe.ringsData(globe.ringsData().filter((city) => city !== location));
                globe.labelsData(globe.labelsData().filter((city) => city !== location));
                globe.pointsData(globe.pointsData().filter((city) => city !== location));
            }, location.flightTime * 2);
        };
        globe.onGlobeClick(({ lat, lng }) => suggestLocation(lat, lng, "Here?"));
        globe.onHexPolygonClick((polygon, event, { lat, lng }) => {
            suggestLocation(lat, lng, countryName(polygon) + "?");
        });
    }

    let autoRotateTimeout;

    const autoRotateGlobe = () => {
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = -0.5;
        globe.controls().addEventListener('start', () => {
            globe.controls().autoRotate = false;
            clearTimeout(autoRotateTimeout);
            autoRotateTimeout = setTimeout(() => globe.controls().autoRotate = true, 5000);
        });
    }

    // Select the DOM container
    const element = document.getElementById('globeViz');

    // Initialize Globe.gl
    const globe = new Globe(element)
        .globeImageUrl('/assets/images/earth-white.jpg')
        .backgroundColor('#ffffff')
        .width(element.clientWidth)
        .height(element.clientHeight)
        .showAtmosphere(false)
        .pointOfView(pointOfView);

    window.addEventListener('resize', (event) => {
        const element = document.getElementById('globeViz');
        globe.width(element.clientWidth);
        globe.height(element.clientHeight);
    });

    addCountries();
    addLabels();
    addBars();
    addRings();
    addArcs();
    addInteractiveSuggestedLocations();
    autoRotateGlobe();

})();
