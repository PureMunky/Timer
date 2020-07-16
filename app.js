const Timer = (function () {
	const currentName = document.getElementById('currentName');
	const currentTime = document.getElementById('currentTime');
	const txtTitle = document.getElementById('txtTitle');
	const txtTimer = document.getElementById('txtTimer');
	const btnStart = document.getElementById('btnStart');
	const btnStop = document.getElementById('btnStop');
	const savedList = document.getElementById('savedList');

	var running = false;
	var started = null;
	var currentTimers = [
		{
			Name: 'Hello',
			Duration: 2000
		},
		{
			Name: 'Goodbye',
			Duration: 2000
		}
	];
	var savedTimers = [
		{
			Title: 'Test',
			Raw: 'Hello:2000|Goodbye:2000',
			Timer: [
				{
					Name: 'Hello',
					Duration: 2000
				},
				{
					Name: 'Goodbye',
					Duration: 2000
				}        
			]
		}
	]

	function start() {
		if(txtTimer.value.length > 0) {
			currentTimers = convertStringToTimer(txtTimer.value);
		}

		running = true;
		started = new Date();
		tick();
	}

	function convertStringToTimer(strInput) {
		return strInput.split('|').map(x => {
			return {
				Name: x.split(':')[0],
				Duration: x.split(':')[1]
			};
		});
	}

	function stop() {
		running = false;
	}

	function save() {
		savedTimers.push({
			Title: txtTitle.value,
			Raw: txtTimer.value,
			Timer: convertStringToTimer(txtTimer.value)
		});
		displaySavedTimers();
	}

	function tick() {
		let currentMS = new Date() - started;
		let newMS = currentMS;
		let found = false;

		for(var i = 0; i < currentTimers.length && !found; i++) {
			if(newMS < currentTimers[i].Duration) {
				found = true;
				currentName.innerText = currentTimers[i].Name;
			} else {
				newMS = newMS - currentTimers[i].Duration;
			}
		}

		if(!found) {
			currentName.innerText = 'Finished';
			stop();
		}

		currentTime.innerText = currentMS;
		if(running) {
			setTimeout(tick, 100);
		}
	}

	function displaySavedTimers() {
		var listHTML = '<ul>';

		for(var i = 0; i < savedTimers.length; i++) {
			listHTML += '<li><a href="#" onclick="Timer.LoadSaved(' + i + ')">' + savedTimers[i].Title + '</a></li>'
		}

		listHTML += '</ul>';

		savedList.innerHTML = listHTML;
	}

	function loadSaved(i) {
		txtTitle.value = savedTimers[i].Title;
		txtTimer.value = savedTimers[i].Raw;
	}

	displaySavedTimers();

	return {
		Start: start,
		Stop: stop,
		Save: save,
		LoadSaved: loadSaved
	};
}());
