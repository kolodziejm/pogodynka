// Pobieranie pogody
class Api {
    constructor(city) {
        this.key = '6eba906653802ba0';
        this.city = city;
    }

    async getData() {
        const reply = await fetch(`http://api.wunderground.com/api/${this.key}/conditions/q/${this.city}.json`);

        const resData = await reply.json();

        return resData.current_observation;
    }

    changeCity(city) {
        this.city = city;
    }
}

// Local storage
class Storage {
    constructor() {
        this.city;
        this.defaultCity = 'Warszawa';
    }

    getLocation() {
        if(localStorage.getItem('miasto') === null) {
            this.city = this.defaultCity;
        } else {
            this.city = localStorage.getItem('miasto');
        }

        return {
            city: this.city
        };
    }

    setLocation(city) {
        localStorage.setItem('miasto', city);
    }
}

// Wpisywanie w HTML
class UI {
    constructor() {
        this.location = document.getElementById('location');
        this.icon = document.getElementById('icon');
        this.temperature = document.getElementById('temp');
        this.wind = document.getElementById('wind');
        this.feel = document.getElementById('feel');
        this.humidity = document.getElementById('humidity');
        this.pressure = document.getElementById('pressure');
        this.uv = document.getElementById('uv');
    }

    write(weather) {
        this.location.textContent = weather.display_location.city;
        this.icon.setAttribute('src', weather.icon_url);
        this.temperature.textContent = weather.temp_c + ' ℃';
        this.wind.textContent = `Wiatr: ${weather.wind_kph} km/h`;
        this.feel.textContent = `Temp. odczuwalna: ${weather.feelslike_c}℃`;
        this.humidity.textContent = `Wilgotność: ${weather.relative_humidity}`;
        this.pressure.textContent = `Ciśnienie: ${weather.pressure_mb} hPa`;
        this.uv.textContent = `UV: ${weather.UV}`;
    }
}

// ************************************************************

const storage = new Storage();
const place = storage.getLocation();

const weather = new Api(place.city);
const ui = new UI();


const btn = document.getElementById('search-btn');

function getWeather() {
    weather.getData()
        .then(res => ui.write(res))
        .catch(err => console.log(err));
}

document.addEventListener('DOMContentLoaded', getWeather);

btn.addEventListener('click', (e) => {
    const city = document.getElementById('location-input').value;
    const input = document.getElementById('location-input');

    weather.changeCity(city);

    storage.setLocation(city);

    getWeather()
    input.value = '';

    e.preventDefault();
});
