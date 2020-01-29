$(document).ready(function() {
    var searchButton = $("#SearchButton");

    searchButton.on("click", search);

    function search(event){
        var date = moment().format('MMM DD YYYY');

        var city = $("#inlineFormInput").val();
        $("#City").text(city + " - " + date);

        $("#City").css("visibility", "visible");

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?APPID=10a0646374889cca48ebde2c7c4b3dcd&q=" + city;

        console.log(queryURL);

        $.ajax({
            method: "GET",
            url: queryURL
        }).then(render);

        function render(response) {
            console.log(response);
            var currentTemp = Math.round((response.main.temp - 273.15) * (9/5) + 32);
            var currentHumidity = response.main.humidity;
            var currentWind = response.wind.speed;

            $("#Temperature").text("Temperature: " + currentTemp + " " + String.fromCharCode(176) + "F");
            $("#Humidity").text("Humidity: " + currentHumidity + " %");
            $("#Wind").text("Wind speed: " + currentWind + " MPH");

            $("#Temperature").css("visibility", "visible");
            $("#Humidity").css("visibility", "visible");
            $("#Wind").css("visibility", "visible");
        }
        $.ajax({
            method: "GET",
            url:  "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=44&lon=-93&APPID=10a0646374889cca48ebde2c7c4b3dcd"
        }).then(renderUV);

        function renderUV(response) {
            console.log(response);
        }
    }
});
