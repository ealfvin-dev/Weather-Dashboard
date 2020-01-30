$(document).ready(function() {
    var searchButton = $("#SearchButton");

    searchButton.on("click", search);

    function search(event){
        var date = moment().format('MMM DD YYYY');

        var city = $("#inlineFormInput").val();
        $("#City").text(city + " - " + date);

        $("#City").css("visibility", "visible");

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?APPID=10a0646374889cca48ebde2c7c4b3dcd&q=" + city;

        $.ajax({
            method: "GET",
            url: queryURL,
            error: onError
        }).then(render);

        function render(response) {
            var currentTemp = Math.round((response.main.temp - 273.15) * (9/5) + 32);
            var currentHumidity = response.main.humidity;
            var currentWind = response.wind.speed;

            $("#Temperature").text("Temperature: " + currentTemp + " " + String.fromCharCode(176) + "F");
            $("#Humidity").text("Humidity: " + currentHumidity + " %");
            $("#Wind").text("Wind speed: " + currentWind + " MPH");

            $("#Temperature").css("visibility", "visible");
            $("#Humidity").css("visibility", "visible");
            $("#Wind").css("visibility", "visible");

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
        }

        function onError(a, b, c) {
            $("#City").text(city + " - " + "City Not Found");

            $("#Temperature").css("visibility", "hidden");
            $("#Humidity").css("visibility", "hidden");
            $("#Wind").css("visibility", "hidden");
            $("#UV").css("visibility", "hidden");
        }
    }
});
