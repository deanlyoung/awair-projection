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
		url: 'https://enterprise.awair.is/v1/orgs/self/devices/' + devType + '/' + devId + '/events/score/latest',
		type: 'GET',
		crossDomain: false,
		dataType: 'json',
		success: function(data) {
			tempDots = '<div class="dot" id="temp"></div>';
			humidDots = '<div class="dot" id="humid"></div>';
			co2Dots = '<div class="dot" id="co2"></div>';
			vocDots = '<div class="dot" id="voc"></div>';
			dustDots = '<div class="dot" id="dust"></div>';
			
			var tempDot = data.index.temp;
			var humidDot = data.index.humid;
			var co2Dot = data.index.co2;
			var vocDot = data.index.voc;
			var dustDot = data.index.dust;
			
			var color = data.color;
			
			if (color != null) {
				var colorDot = '<div class="color-dot" id="' + color + '-dot"></div>';
			}  else {
				var colorDot = '<div class="color-dot" id="blinking-dot"></div>';
				console.log('no color?');
			}
			
			for (var i = 0; i < tempDot; i++) {
				tempDots += '<div class="dot" id="temp"></div>';
			}						
			for (var i = 0; i < humidDot; i++) {
				humidDots += '<div class="dot" id="humid"></div>';
			}
			for (var i = 0; i < co2Dot; i++) {
				co2Dots += '<div class="dot" id="co2"></div>';
			}
			for (var i = 0; i < vocDot; i++) {
				vocDots += '<div class="dot" id="voc"></div>';
			}
			for (var i = 0; i < dustDot; i++) {
				dustDots += '<div class="dot" id="dust"></div>';
			}
			
			document.getElementById("dot-side").innerHTML = '<div class="dots" id="dustDots">' + dustDots + '</div><div class="dots" id="vocDots">' + vocDots + '</div><div class="dots" id="co2Dots">' + co2Dots + '</div><div class="dots" id="humidDots">' + humidDots + '</div><div class="dots" id="tempDots">' + tempDots + '</div>';
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