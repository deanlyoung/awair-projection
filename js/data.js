var tempDots;
var humidDots;
var co2Dots;
var vocDots;
var dustDots;
var orgId;
var devType;
var devId;
var devToken;
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

orgId = getParameterByName('orgId');
devType = getParameterByName('devType');
devId = getParameterByName('devId');
devToken = getParameterByName('devToken');
refreshTime = getParameterByName('refreshTime');
submitted = getParameterByName('submit-button');

if (submitted != undefined && submitted != null) {
    window.location = 'index.html?orgId=' + orgId + '&devType=' + devType + '&devId=' + devId + '&devToken=' + devToken + '&refreshTime=' + refreshTime;
}

function update_data() {
	$.ajax({
		url: 'https://developer-apis.awair.is/v1/orgs/' + orgId + '/devices/' + devType + '/' + devId + '/air-data/latest',
		type: 'GET',
		dataType: 'json',
		success: function(json) {
			tempDots = '<div class="dot" id="temp"></div>';
			humidDots = '<div class="dot" id="humid"></div>';
			co2Dots = '<div class="dot" id="co2"></div>';
			vocDots = '<div class="dot" id="voc"></div>';
			dustDots = '<div class="dot" id="dust"></div>';
			
			var data = json.data[0];
			var indices = json.data[0].indices;
			
			var tempHtmlDots, humidHtmlDots, co2HtmlDots, vocHtmlDots, dustHtmlDots;
			tempHtmlDots = humidHtmlDots = co2HtmlDots = vocHtmlDots = dustHtmlDots = '';
			
			for (index in indices) {
				switch (indices[index].comp) {
					case "temp":
						// Temperature (C)
						var tempDot = indices[index].value;
						tempDot = Math.abs(tempDot);
						for (var i = 0; i < tempDot; i++) {
							tempDots += '<div class="dot" id="temp"></div>';
						}
						tempHtmlDots = '<div class="dots" id="tempDots">' + tempDots + '</div>';
						break;
					case "humid":
						// Humidity (%)
						var humidDot = indices[index].value;
						humidDot = Math.abs(humidDot);
						for (var i = 0; i < humidDot; i++) {
							humidDots += '<div class="dot" id="humid"></div>';
						}
						humidHtmlDots = '<div class="dots" id="humidDots">' + humidDots + '</div>';
						break;
					case "co2":
						// Carbon Dioxide (ppm)
						var co2Dot = indices[index].value;
						for (var i = 0; i < co2Dot; i++) {
							co2Dots += '<div class="dot" id="co2"></div>';
						}
						co2HtmlDots = '<div class="dots" id="co2Dots">' + co2Dots + '</div>';
						break;
					case "voc":
						// Chemicals (ppb)
						var vocDot = indices[index].value;
						for (var i = 0; i < vocDot; i++) {
							vocDots += '<div class="dot" id="voc"></div>';
						}
						vocHtmlDots = '<div class="dots" id="vocDots">' + vocDots + '</div>';
						break;
					case "dust":
						// Dust (mcg/m^3)
						var dustDot = indices[index].value;
						for (var i = 0; i < dustDot; i++) {
							dustDots += '<div class="dot" id="dust"></div>';
						}
						dustHtmlDots = '<div class="dots" id="dustDots">' + dustDots + '</div>';
						break;
					case "pm25":
						// PM2.5 (mcg/m^3)
						var pm25Dot = indices[index].value;
						for (var i = 0; i < pm25Dot; i++) {
							dustDots += '<div class="dot" id="dust"></div>';
						}
						dustHtmlDots = '<div class="dots" id="dustDots">' + dustDots + '</div>';
						break;
					default:
						console.log("ignore: " + indices[index].comp);
						break;
				}
			}
			
			//var dots = indices.reduce( (indexes, sensor) => {
			//	var comp = sensor.comp;
			//	var val = sensor.value + 1;
			//	indexes[comp] = val;
			//	return indexes;
			//});
			
			
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
		xhr.setRequestHeader('Authorization', 'Bearer ' + devToken);
	}
}

if (refreshTime != null && refreshTime != undefined) {
	refreshTime = refreshTime * 1000;
} else {
	refreshTime = 10000;
}

setInterval(update_data, refreshTime);