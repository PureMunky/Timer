const Timer = (function () {
    const currentName = document.getElementById('currentName');
    const currentTime = document.getElementById('currentTime');
    const txtTimer = document.getElementById('txtTimer');
    const btnStart = document.getElementById('btnStart');
    const btnStop = document.getElementById('btnStop');

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

    function start() {
        if(txtTimer.value.length > 0) {
            currentTimers = txtTimer.value.split('|').map(x => {
                return {
                    Name: x.split(':')[0],
                    Duration: x.split(':')[1]
                };
            });
        }

        running = true;
        started = new Date();
        tick();
    }

    function stop() {
        running = false;
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

    return {
        Start: start,
        Stop: stop
    };
}());
