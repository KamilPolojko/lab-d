const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        // this.currentWeatherLinkk = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={apiKey}&units=metric&lang=pl";
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";

        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        // this.forecastLinkk = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}&units=metric&lang=pl";

        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        // this.currentWeatherLinkk = this.currentWeatherLinkk.replace("{apiKey}", this.apiKey);
        // this.forecastLinkk = this.forecastLinkk.replace("{apiKey}", this.apiKey);

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = undefined;
        this.forecast = undefined;

        this.resultsBlock = document.querySelector(resultsBlockSelector);

    }

    getCurrentWeather(query) {
        // let numbers = query.split(",");
        // let url = this.currentWeatherLinkk.replace("{lat}",numbers[0]).replace("{lon}",numbers[1]);
        let url = this.currentWeatherLink.replace("{query}",query);
        let req = new XMLHttpRequest();
        req.open("GET",url,true);
        req.addEventListener("load", () =>{
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        req.send();

    }

    getForecast(query) {
        // let numbers = query.split(",");
        // let url = this.forecastLinkk.replace("{lat}", numbers[0]).replace("{lon}",numbers[1]);
        let url = this.forecastLink.replace("{query}", query);
        console.log(url);
        fetch(url).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            this.forecast = data.list;
            this.drawWeather();
        });
    }
    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    drawWeather() {
        // clear previous blocks
        this.resultsBlock.innerHTML = '';

        // add current weather block
        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

            const temperature = this.currentWeather.main.temp;
            const feelsLikeTemperature = this.currentWeather.main.feels_like;
            const iconName = this.currentWeather.weather[0].icon;
            const description = this.currentWeather.weather[0].description;

            const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
            this.resultsBlock.appendChild(weatherBlock);
        }

        // add forecast weather blocks
        if (this.forecast && this.forecast.length > 0) {
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
                const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

                const temperature = weather.main.temp;
                const feelsLikeTemperature = weather.main.feels_like;
                const iconName = weather.weather[0].icon;
                const description = weather.weather[0].description;

                const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
                this.resultsBlock.appendChild(weatherBlock);
            }
        }
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        const  weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";


        const dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerHTML = dateString;
        weatherBlock.appendChild(dateBlock);


        const temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        const temperatureFeelBlok = document.createElement("div");
        temperatureFeelBlok.className = "weather-temperature-feels-like";
        temperatureFeelBlok.innerHTML = ` Feel: ${feelsLikeTemperature} &deg;C`;
        weatherBlock.appendChild(temperatureFeelBlok);

        const iconImg = document.createElement("img");
        iconImg.className = "weather-icon";
        iconImg.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
        weatherBlock.appendChild(iconImg);


        const descriptionBlock = document.createElement("img");
        descriptionBlock.className = "weather-description";
        descriptionBlock.innerHTML = description;
        weatherBlock.appendChild(descriptionBlock);

    return weatherBlock;
    }
}


document.weatherApp = new WeatherApp("7ded80d91f2b280ec979100cc8bbba94", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});
