const API_KEY = "ee07e2bf337034f905cde0bdedae3db8"

async function getWeather() {
    let location = document.getElementById("input-city").value
    let apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric&lang=fr`
    const weatherResponse = await fetch(apiWeatherURL)
    const weatherData = weatherResponse.ok ? await weatherResponse.json() : null

    switch(weatherResponse.status) {
        case 404:
            document.getElementById("container").hidden = true
            document.getElementById("base-message").innerText = "La ville n'existe pas."
            break
        case 200:
            document.getElementById("container").hidden = false
            document.getElementById("base-message").innerText = `Météo à ${weatherData.name} : ${weatherData.weather[0].main}`

            document.getElementById("city-name").innerText = weatherData.name
            document.getElementById("weather").innerText = weatherData.weather[0].description
            document.getElementById("temp").innerText = weatherData.main.temp + `°C (Minimale : ${weatherData.main.temp_min}°C | Maximale : ${weatherData.main.temp_max}°C)`
            document.getElementById("feels-like").innerText = weatherData.main.feels_like + "°C"
            document.getElementById("pressure").innerText = weatherData.main.pressure + " hPa"
            document.getElementById("humidity").innerText = weatherData.main.humidity + " %"
            document.getElementById("wind").innerText = weatherData.wind.speed + ` m/s (${getDirection(weatherData.wind.deg)})`
            document.getElementById("sunrise").innerText = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('fr-FR')
            document.getElementById("sunset").innerText = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('fr-FR')
            break
    }
}

function getDirection(degrees) {
    if(degrees >= 0 && degrees < 11.25) return "N"
    else if(degrees >= 11.25 && degrees < 33.75) return "NNE"
    else if(degrees >= 33.75 && degrees < 56.25) return "NE"
    else if(degrees >= 56.25 && degrees < 78.75) return "ENE"
    else if(degrees >= 78.75 && degrees < 101.25) return "E"
    else if(degrees >= 101.25 && degrees < 123.75) return "ESE"
    else if(degrees >= 123.75 && degrees < 146.25) return "SE"
    else if(degrees >= 146.25 && degrees < 168.75) return "SSE"
    else if(degrees >= 168.75 && degrees < 191.25) return "S"
    else if(degrees >= 191.25 && degrees < 213.75) return "SSW"
    else if(degrees >= 213.75 && degrees < 236.25) return "SW"
    else if(degrees >= 236.25 && degrees < 258.75) return "WSW"
    else if(degrees >= 258.75 && degrees < 281.25) return "W"
    else if(degrees >= 281.25 && degrees < 303.75) return "WNW"
    else if(degrees >= 303.75 && degrees < 326.25) return "NW"
    else if(degrees >= 326.25 && degrees < 348.75) return "NNW"
    else if(degrees >= 348.75 && degrees <= 360) return "N"
}

