$(document).ready(function() {
    var searchButton = $("#SearchButton");

    searchButton.on("click", search);

    function search(event){
        var date = moment().format('MMM DD YYYY');

        var city = $("#inlineFormInput").val();

        //Add searched item to local storage if not in already
        if(JSON.parse(localStorage.getItem("cities")) === null) {
            var cities = {[city]: 1};
            localStorage.setItem("cities", JSON.stringify(cities));
        }
        else if(JSON.parse(localStorage.getItem("cities"))[city] != 1) {
            var cities = JSON.parse(localStorage.getItem("cities"));
            cities[city] = 1;
            localStorage.setItem("cities", JSON.stringify(cities));
        }
        else {
            var cities = JSON.parse(localStorage.getItem("cities"));
        }

        //Render stored cities to the page after search
        function renderCities() {
            $("#StoredCities").empty();

            for(var storedCity in cities) {
                var cityDiv = $("<div>");
                cityDiv.attr("class", "cityDiv");
                cityDiv.text(storedCity);

                $("#StoredCities").append(cityDiv);
            }
        }
        renderCities();

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?APPID=10a0646374889cca48ebde2c7c4b3dcd&units=imperial&q=" + city;

        $.ajax({
            method: "GET",
            url: queryURL,
            error: onError
        }).then(render);

        function render(response) {
            var currentTemp = Math.round(response.main.temp);
            var currentHumidity = response.main.humidity;
            var currentWind = response.wind.speed;

            //Write response results onto page
            $("#City").text(city + " - " + date);
            $("#Temperature").text("Temperature: " + currentTemp + " " + String.fromCharCode(176) + "F");
            $("#Humidity").text("Humidity: " + currentHumidity + " %");
            $("#Wind").text("Wind speed: " + currentWind + " MPH");

            $("#City").css("visibility", "visible");
            $("#Temperature").css("visibility", "visible");
            $("#Humidity").css("visibility", "visible");
            $("#Wind").css("visibility", "visible");

            $("#WeatherIconDiv").empty();
            var icon = $("<img>");

            var iconName = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/" + iconName + "@2x.png";

            icon.attr("src", iconURL);
            icon.attr("width", "50%");
            $("#WeatherIconDiv").append(icon);

            //Get UV index if valid search
            var lat = response.coord.lat;
            var long = response.coord.lon;
            uvURL = "https://api.openweathermap.org/data/2.5/uvi?APPID=10a0646374889cca48ebde2c7c4b3dcd&lat=" + lat + "&lon=" + long;

            $.ajax({
                method: "GET",
                url: uvURL
            }).then(function(uvResponse) {
                var uvIndex = uvResponse.value;
                $("#UVvalue").text(uvIndex);

                //Set UV-Index background-color and text color based on value
                var color = "green";
                var textColor = "white";
                if (uvIndex > 2) {
                    color = 'yellow';
                    textColor = "black";
                }
                if (uvIndex > 5) {
                    color = "orange";
                    textColor = "black";
                }
                if (uvIndex > 7) {
                    color = "red";
                    textColor = "white";
                }

                $("#UVvalue").css("background-color", color);
                $("#UVvalue").css("color", textColor);
                $("#UV").css("visibility", "visible");
            });

            //Get 5-day forecast if valid search
            var cityID = response.id;
            var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?APPID=10a0646374889cca48ebde2c7c4b3dcd&units=imperial&id=" + cityID;

            $.ajax({
                method: "GET",
                url: fiveDayURL
            }).then(function(fiveDayResponse) {
                $("#FiveDayCards").empty();
                console.log(fiveDayResponse);

                //Get forecast at noon each day and make a weather div

                var UTCoffset = fiveDayResponse.city.timezone / (60*60); //hours

                for(var i = 0; i < 40; i++) {
                    var timeStamp = fiveDayResponse.list[i].dt_txt;
                    if (timeStamp.split(" ")[1] === (12 - UTCoffset) + ":00:00") {
                        var newDay = $("<div>");

                        var date = $("<h5>");
                        var icon = $("<img>");
                        var temp = $("<p>");
                        var humidity = $("<p>");

                        date.text(timeStamp.split(" ")[0]);

                        var iconName = fiveDayResponse.list[i].weather[0].icon;
                        var iconURL = "http://openweathermap.org/img/wn/" + iconName + "@2x.png";

                        icon.attr("src", iconURL);
                        icon.attr("width", "35%");

                        temp.text("Temp: " + Math.round(fiveDayResponse.list[i].main.temp) + " " + String.fromCharCode(176) + "F");
                        humidity.text("Humidity: " + fiveDayResponse.list[i].main.humidity + " %");

                        newDay.append(date);
                        newDay.append(icon);
                        newDay.append(temp);
                        newDay.append(humidity);

                        newDay.css("background-color", "lightblue");
                        newDay.attr("class", "newDay");

                        $("#FiveDayCards").append(newDay);
                    }
                }
            });
        }

        function onError(a, b, c) {
            $("#City").text(city + " - " + "City Not Found");

            $("#Temperature").css("visibility", "hidden");
            $("#Humidity").css("visibility", "hidden");
            $("#Wind").css("visibility", "hidden");
            $("#UV").css("visibility", "hidden");
            $("#WeatherIconDiv").empty();

            $("#FiveDayCards").empty();
        }
    }
});
