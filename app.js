const DisplayModule = (function() {
	// TODO: Pretty display for running timer.
	
	const currentName = document.getElementById('currentName');
	const currentTime = document.getElementById('currentTime');
	const currentTimerList = document.getElementById('currentTimerList');
	const savedList = document.getElementById('savedList');

	return {
		setName: function (s) { currentName.innerText = s; },
		setTime: function (s) { currentTime.innerText = s; },
		setTimerList: function (h) { currentTimerList.innerHTML = h; },
		setSavedList: function (h) { savedList.innerHTML = h; }
	};

}());

const ConvertModule = (function () {
	function stringToTimer(strInput) {
		var rtnValue = [];

		if(strInput) {
			rtnValue = strInput.split('|').map(x => {
				return {
					Name: x.split(':')[0],
					Duration: x.split(':')[1]
				};
			});
		}

		return rtnValue;
	}

	function timerToString(timer) {
		var rtnValue = '';

		console.log(timer);

		for(var i = 0; i < timer.length; i++) {
			rtnValue += (i>0?'|':'') + timer[i].Name + ':' + timer[i].Duration;
		}
		
		return rtnValue;
	}

	function stringToMilliseconds(strInput) {
		// TODO: Convert input text to ms duration.

		return strInput;
	}

	function millisecondsToString(ms) {
		// TODO: Convert milliseconds to text.

		return ms;
	}

	return {
		StringToTimer: stringToTimer,
		TimerToString: timerToString,
		StringToMilliseconds: stringToMilliseconds,
		MillisecondsToString: millisecondsToString
	};
}());

const Timer = (function (Display, Convert) {
	// TODO: Editing a queue/timer
	// FIX: Saved overwritting

	const txtTitle = document.getElementById('txtTitle');
	const txtName = document.getElementById('txtName');
	const txtDuration = document.getElementById('txtDuration');
	const txtTimer = document.getElementById('txtTimer');
	const localStorageKey = "Timers";
	const qsKey = "timer";

	var running = false;
	var started = null;
	
	var currentTimers = [];

	var savedTimers = [];

	function start() {
		if(txtTimer.value.length > 0) {
			currentTimers = Convert.StringToTimer(txtTimer.value);
		}

		running = true;
		started = new Date();
		tick();
	}

	function stop() {
		running = false;
	}

	function save() {
		savedTimers.push({
			Title: txtTitle.value,
			Timer: currentTimers
		});
		localStorage.setItem(localStorageKey, JSON.stringify(savedTimers));
		displaySavedTimers();
	}

	function add() {
		currentTimers.push({
			Name: txtName.value,
			Duration: Convert.StringToMilliseconds(txtDuration.value)
		});
		displayCurrentTimer();
	}

	function tick() {
		let currentMS = new Date() - started;
		let newMS = currentMS;
		let found = false;

		for(var i = 0; i < currentTimers.length && !found; i++) {
			if(newMS < currentTimers[i].Duration) {
				found = true;
				Display.setName(currentTimers[i].Name);
			} else {
				newMS = newMS - currentTimers[i].Duration;
			}
		}

		if(!found) {
			Display.setName('Finished');
			stop();
		}

		Display.setTime(currentMS);
		if(running) {
			setTimeout(tick, 100);
		}
	}

	function displayCurrentTimer() {
		var listHTML = '<ul>';

		for(var i = 0; i < currentTimers.length; i++) {
			listHTML += '<li>' + currentTimers[i].Name + ' - ' + currentTimers[i].Duration + '</li>';
		}

		listHTML += '</ul>';

		Display.setTimerList(listHTML);
	}

	function displaySavedTimers() {
		var listHTML = '<ul>';

		for(var i = 0; i < savedTimers.length; i++) {
			listHTML += '<li><a href="#" onclick="Timer.QueueSaved(' + i + ')">' + savedTimers[i].Title + '</a></li>'
		}

		listHTML += '</ul>';

		Display.setSavedList(listHTML);
	}

	function queueSaved(i) {
		txtTitle.value = savedTimers[i].Title;
		txtTimer.value = Convert.TimerToString(savedTimers[i].Timer);
		currentTimers = savedTimers[i].Timer;

		savedTimers.splice(i, 1);
		displaySavedTimers();
		displayCurrentTimer();
	}

	function clearSaved() {
		localStorage.removeItem(localStorageKey);
		savedTimers = [];
		displaySavedTimers();
	}

	function load() {
		var ls = localStorage.getItem(localStorageKey);

		if(ls) {
			savedTimers = JSON.parse(ls);
		}
		
		var qs = new URLSearchParams(window.location.search);
		var qsTimer = qs.get(qsKey);

		txtTimer.value = qsTimer;
		currentTimers = Convert.StringToTimer(qsTimer);
		displaySavedTimers();
		displayCurrentTimer();
	}

	load();

	return {
		Start: start,
		Stop: stop,
		Save: save,
		QueueSaved: queueSaved,
		ClearSaved: clearSaved,
		Add: add
	};
}(DisplayModule, ConvertModule));
