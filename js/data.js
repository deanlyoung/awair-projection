var tempDots;
var humidDots;
var co2Dots;
var vocDots;
var dustDots;
var devType;
var devId;
var orgToken;
var refreshTime;
var submitted;

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	//name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

setInterval(getParameterByName, 1000);

devType = getParameterByName('devType');
devId = getParameterByName('devId');
orgToken = getParameterByName('orgToken');
refreshTime = getParameterByName('refreshTime');
submitted = getParameterByName('submit-button');

if (submitted != undefined && submitted != null) {
    window.location = 'index.html?devType=' + devType + '&devId=' + devId + '&orgToken=' + orgToken + '&refreshTime=' + refreshTime;
}

function update_data() {
	$.ajax({
		url: 'https://afb-api.awair.is/v1/orgs/self/devices/' + devType + '/' + devId + '/air-data?type=raw&limit=1&desc=true',
		type: 'GET',
		dataType: 'json',
		success: function(json) {
			tempDots = '<div class="dot" id="temp"></div>';
			humidDots = '<div class="dot" id="humid"></div>';
			co2Dots = '<div class="dot" id="co2"></div>';
			vocDots = '<div class="dot" id="voc"></div>';
			dustDots = '<div class="dot" id="dust"></div>';
			
			var data = json.data[0];
			
			// Temperature (C)
			var temp = data.sensor.temp;
			var tempDot = 0;
			if ((temp >= 21.50) && (temp < 26.50)) {
				// index 1
				tempDot = 0;
			} else if (((temp >= 18.50) && (temp < 21.50)) || ((temp >= 26.50) && (temp < 28.50))) {
				// index 2
				tempDot = 1;
			} else if (((temp >= 15.50) && (temp < 21.50)) || ((temp >= 28.50) && (temp < 30.50))) {
				// index 3
				tempDot = 2;
			} else if (((temp >= 12.50) && (temp < 15.50)) || ((temp >= 30.50) && (temp < 32.50))) {
				// index 4
				tempDot = 3;
			} else {
				// index 5
				tempDot = 4;
			}
			
			for (var i = 0; i < tempDot; i++) {
				tempDots += '<div class="dot" id="temp"></div>';
			}
			
			var tempHtmlDots = '';
			if (tempDots) {
				tempHtmlDots = '<div class="dots" id="tempDots">' + tempDots + '</div>';
			}
			
			
			// Humidity (%)
			var humid = data.sensor.humid;
			var humidDot = 0;
			if ((humid >= 39.50) && (humid < 50.50)) {
				// index 1
				humidDot = 0;
			} else if (((humid >= 34.50) && (humid < 39.50)) || ((humid >= 50.50) && (humid < 60.50))) {
				// index 2
				humidDot = 1;
			} else if (((humid >= 19.50) && (humid < 34.50)) || ((humid >= 60.50) && (humid < 64.50))) {
				// index 3
				humidDot = 2;
			} else if (((humid >= 14.50) && (humid < 19.50)) || ((humid >= 64.50) && (humid < 80.50))) {
				// index 4
				humidDot = 3;
			} else {
				// index 5
				humidDot = 4;
			}
			
			for (var i = 0; i < humidDot; i++) {
				humidDots += '<div class="dot" id="humid"></div>';
			}
			
			var humidHtmlDots = '';
			if (humidDots) {
				humidHtmlDots = '<div class="dots" id="humidDots">' + humidDots + '</div>';
			}
			
			
			// Carbon Dioxide (ppm)
			var co2 = data.sensor.co2;
			var co2Dot = 0;
			if (co2 < 600.50) {
				// index 1
				co2Dot = 0;
			} else if ((co2 >= 600.50) && (co2 < 1000.50)) {
				// index 2
				co2Dot = 1;
			} else if ((co2 >= 1000.50) && (co2 < 1500.50)) {
				// index 3
				co2Dot = 2;
			} else if ((co2 >= 1500.50) && (co2 < 2500.50)) {
				// index 4
				co2Dot = 3;
			} else {
				// index 5
				co2Dot = 4;
			}
			
			//var est_co2 = data.sensor.est_co2;
				//var estCo2Dot = 0;
				//var estCo2Dot = 1;
				//var estCo2Dot = 2;
				//var estCo2Dot = 3;
				//var estCo2Dot = 4;
			
			if (devType == 'awair-mint') {
				co2Dots = '';
			} else {
				for (var i = 0; i < co2Dot; i++) {
					co2Dots += '<div class="dot" id="co2"></div>';
				}
			}
			
			var co2HtmlDots = '';
			if (co2Dots) {
				co2HtmlDots = '<div class="dots" id="co2Dots">' + co2Dots + '</div>';
			}
			
			
			// Chemicals (ppb)
			var voc = data.sensor.voc;
			var vocDot = 0;
			if (voc < 333.50) {
				// index 1
				vocDot = 0;
			} else if ((voc >= 333.50) && (voc < 1000.50)) {
				// index 2
				vocDot = 1;
			} else if ((voc >= 1000.50) && (voc < 3333.50)) {
				// index 3
				vocDot = 2;
			} else if ((voc >= 3333.50) && (voc < 8332.50)) {
				// index 4
				vocDot = 3;
			} else {
				// index 5
				vocDot = 4;
			}
			
			for (var i = 0; i < vocDot; i++) {
				vocDots += '<div class="dot" id="voc"></div>';
			}
			
			var vocHtmlDots = '';
			if (vocDots) {
				vocHtmlDots = '<div class="dots" id="vocDots">' + vocDots + '</div>';
			}
			
			
			// Dust (mcg/m^3)
			var dust = data.sensor.dust;
			var dustDot = 0;
			if (dust < 20.50) {
				// index 1
				dustDot = 0;
			} else if ((dust >= 20.50) && (dust < 47.50)) {
				// index 2
				dustDot = 1;
			} else if ((dust >= 47.50) && (dust < 73.50)) {
				// index 3
				dustDot = 2;
			} else if ((dust >= 73.50) && (dust < 100.50)) {
				// index 4
				dustDot = 3;
			} else {
				// index 5
				dustDot = 4;
			}
			
			// PM2.5 (mcg/m^3)
			var pm25 = data.sensor.pm25;
			var pm25Dot = 0;
			if (pm25 <= 15.50) {
				// index 1
				pm25Dot = 0;
			} else if ((pm25 > 15.50) && (pm25 <= 35.50)) {
				// index 2
				pm25Dot = 1;
			} else if ((pm25 > 35.50) && (pm25 <= 55.50)) {
				// index 3
				pm25Dot = 2;
			} else if ((pm25 > 55.50) && (pm25 <= 75.50)) {
				// index 4
				pm25Dot = 3;
			} else {
				// index 5
				pm25Dot = 4;
			}
			
			// PM10 (mcg/m^3)
			var pm10 = data.sensor.pm10;
			var pm10Dot = 0;
			if (pm10 <= 15.50) {
				// index 1
				pm10Dot = 0;
			} else if ((pm10 > 15.50) && (pm10 <= 35.50)) {
				// index 2
				pm10Dot = 1;
			} else if ((pm10 > 35.50) && (pm10 <= 55.50)) {
				// index 3
				pm10Dot = 2;
			} else if ((pm10 > 55.50) && (pm10 <= 75.50)) {
				// index 4
				pm10Dot = 3;
			} else {
				// index 5
				pm10Dot = 4;
			}
			
			if (devType == 'awair') {
				for (var i = 0; i < dustDot; i++) {
					dustDots += '<div class="dot" id="dust"></div>';
				}
			} else if ((devType == 'awair-omni') || (devType == 'awair-mint')) {
				for (var i = 0; i < pm25Dot; i++) {
					dustDots += '<div class="dot" id="dust"></div>';
				}
			} else {
				dustDots = '';
			}
			
			var dustHtmlDots = '';
			if (dustDots) {
				dustHtmlDots = '<div class="dots" id="dustDots">' + dustDots + '</div>';
			}
			
			
			// Color Dot
			var col = data.score;
			var color
			if (col >= 80) {
				color = 'green';
			} else if (col >= 60) {
				color = 'amber';
			} else if (col >= 0) {
				color = 'red';
			}
			
			if (color != null) {
				var colorDot = '<div class="color-dot" id="' + color + '-dot"></div>';
			}  else {
				var colorDot = '<div class="color-dot" id="blinking-dot"></div>';
				console.log('no color?');
			}
			
			
			// HTML
			document.getElementById("dot-side").innerHTML = tempHtmlDots + humidHtmlDots + co2HtmlDots + vocHtmlDots + dustHtmlDots;
			document.getElementById("status-number").innerText = data.score;
			document.getElementById("status-dot").innerHTML = colorDot;
			console.log(data);
		},
		error: function(request) {
			// document.getElementById("score-side").innerText = 'Err';
			console.log(request.responseText);
		},
		beforeSend: setHeader
	});
	
	function setHeader(xhr) {
		xhr.setRequestHeader('Authorization', 'Bearer ' + orgToken);
	}
}

if (refreshTime != null && refreshTime != undefined) {
	refreshTime = refreshTime * 1000;
} else {
	refreshTime = 1000;
}

setInterval(update_data, refreshTime);