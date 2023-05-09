const API_KEY = "ee07e2bf337034f905cde0bdedae3db8"

async function getWeather() {
    let location = document.getElementById("input-city").value
    let apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric&lang=fr`
    const weatherResponse = await fetch(apiWeatherURL)
    const weatherData = await weatherResponse.json()

    switch(weatherData.cod) {
        case 404:
            console.log(weatherData)
            break
        case 200:
            document.getElementById("city-name").innerText = location
            document.getElementById("weather").innerText = weatherData.weather[0].description
            document.getElementById("temp").innerText = weatherData.main.temp + `°C (Minimale : ${weatherData.main.temp_min}°C | Maximale : ${weatherData.main.temp_max}°C)`
            document.getElementById("feels-like").innerText = weatherData.main.feels_like + "°C"
            document.getElementById("pressure").innerText = weatherData.main.pressure + " hPa"
            document.getElementById("humidity").innerText = weatherData.main.humidity + " %"
            document.getElementById("wind").innerText = weatherData.wind.speed + ` m/s ()`
            document.getElementById("sunrise").innerText = location
            document.getElementById("sunset").innerText = location

            console.log(weatherData)
            break
    }
}

