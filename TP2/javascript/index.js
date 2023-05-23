const API_KEY = "ee07e2bf337034f905cde0bdedae3db8"
let CURRENT_CITY = ""

async function getWeather(onFinish = null) {
    $(document).ready(async function () {
        $("#spinner").css("display", "inline-flex")
        let location = $("#input-city").val()

        let apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric&lang=fr`
        const weatherResponse = await fetch(apiWeatherURL)
        const weatherData = weatherResponse.ok ? await weatherResponse.json() : null

        switch (weatherResponse.status) {
            case 404:
                $(".container").hide()
                $(".base-message").html("La ville n'existe pas.")
                break
            case 200:
                CURRENT_CITY = weatherData.name

                $("#current-container").removeClass("d-none").addClass("d-block")
                $("#help-message").addClass("d-none")

                $(".base-message").html(`Météo à ${CURRENT_CITY} : ${weatherData.weather[0].main} <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png">`)
                $("#city-name").html(weatherData.name)
                $("#weather").html(weatherData.weather[0].description)
                $("#temp").html(weatherData.main.temp + `°C (Minimale : ${weatherData.main.temp_min}°C | Maximale : ${weatherData.main.temp_max}°C)`)
                $("#feels-like").html(weatherData.main.feels_like + "°C")
                $("#pressure").html(weatherData.main.pressure + " hPa")
                $("#humidity").html(weatherData.main.humidity + " %")
                $("#wind").html(weatherData.wind.speed + ` m/s (${getDirection(weatherData.wind.deg)})`)
                $("#sunrise").html(new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('fr-FR'))
                $("#sunset").html(new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('fr-FR'))
                break
        }

        $("#spinner").css("display", "none")
    })
}

async function getForecastWeather() {
    $(document).ready(async function () {
        let location = $("#input-city").val()

        let apiWeatherURL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${location}&appid=${API_KEY}&units=metric&lang=fr`
        const weatherResponse = await fetch(apiWeatherURL)
        const weatherData = weatherResponse.ok ? await weatherResponse.json() : null

        switch (weatherResponse.status) {
            case 404:
                $("#container").hide()
                $("#base-message").html("La ville n'existe pas.")
                break
            case 200:
                $(`<main id=\"forecast-container\">
                        <h1 class=\"base-message\">Météo à ${weatherData.city.name} pour les 6 prochains jours</h1>
                        <section class=\"container\"></section>
                   </main>`
                ).insertAfter($("main"))

                weatherData.list.slice(1).forEach((dayWeatherData) => {
                    $(`<details>
                            <summary>${new Date(dayWeatherData.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}</summary>
                                <div class=\"property\">
                                    <label>Météo : </label>
                                    <span>${dayWeatherData.weather[0].description}<span>
                                </div>
                                <div class=\"property\">
                                    <label>Températures : </label>
                                    <span>${dayWeatherData.temp.day + `°C (Minimale : ${dayWeatherData.temp.min}°C | Maximale : ${dayWeatherData.temp.max}°C)`}<span>
                                </div>
                                <div class=\"property\">
                                    <label>Ressenti : </label>
                                    <span>${dayWeatherData.feels_like.day}°C<span>
                                </div>
                                <div class=\"property\">
                                    <label>Pression : </label>
                                    <span>${dayWeatherData.pressure} hPa<span>
                                </div>
                                <div class=\"property\">
                                    <label>Pourcentage d'humidité : </label>
                                    <span>${dayWeatherData.humidity} %<span>
                                </div>
                                <div class=\"property\">
                                    <label>Vent : </label>
                                    <span>${dayWeatherData.speed + ` m/s (${getDirection(dayWeatherData.deg)})`}<span>
                                </div>
                                <div class=\"property\">
                                    <label>Lever du soleil : </label>
                                    <span>${new Date(dayWeatherData.sunrise * 1000).toLocaleTimeString('fr-FR')}<span>
                                </div>
                                <div class=\"property\">
                                    <label>Coucher du soleil : </label>
                                    <span>${new Date(dayWeatherData.sunset * 1000).toLocaleTimeString('fr-FR')}<span>
                                </div>
                            </details>`
                    ).appendTo($("#forecast-container > section"));
                })

                $("#current-container").addClass("slide-left")
                $("#forecast-container").removeClass("d-none").addClass("d-block slide-right")
                break
        }

    })
}

function getDirection(degrees) {
    if (degrees >= 0 && degrees < 11.25) return "N"
    else if (degrees >= 11.25 && degrees < 33.75) return "NNE"
    else if (degrees >= 33.75 && degrees < 56.25) return "NE"
    else if (degrees >= 56.25 && degrees < 78.75) return "ENE"
    else if (degrees >= 78.75 && degrees < 101.25) return "E"
    else if (degrees >= 101.25 && degrees < 123.75) return "ESE"
    else if (degrees >= 123.75 && degrees < 146.25) return "SE"
    else if (degrees >= 146.25 && degrees < 168.75) return "SSE"
    else if (degrees >= 168.75 && degrees < 191.25) return "S"
    else if (degrees >= 191.25 && degrees < 213.75) return "SSW"
    else if (degrees >= 213.75 && degrees < 236.25) return "SW"
    else if (degrees >= 236.25 && degrees < 258.75) return "WSW"
    else if (degrees >= 258.75 && degrees < 281.25) return "W"
    else if (degrees >= 281.25 && degrees < 303.75) return "WNW"
    else if (degrees >= 303.75 && degrees < 326.25) return "NW"
    else if (degrees >= 326.25 && degrees < 348.75) return "NNW"
    else if (degrees >= 348.75 && degrees <= 360) return "N"
}
