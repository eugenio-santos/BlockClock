document.addEventListener('DOMContentLoaded', function () {
  var nS = new NoSleep();
  var finalBeep = new Audio('beep-09.mp3');
  var aboutToEndBeep = new Audio('beep-02.mp3');
  var clock = document.getElementById('clock');
  var timeStep = 10;
  var blocks = [];
  var timerEl = [];
  var mTimers = document.getElementById('m-timers');
  var currentT;
  var currentTimeOut;


  finalBeep.volume = 0;
  aboutToEndBeep.volume = 0;

  document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    nS.enable();
  }, false);
  window.onresize = resizeText;

  document.getElementById('add-block').onclick = addBlock;
  document.getElementById('add-repeat').onclick = addRepeat;
  document.getElementById('del').onclick = deleteBlock;
  document.getElementById('start').onclick = startTimer;


  function resizeText() {
    var vw = window.innerWidth;
    clock.style.fontSize = vw / 2 + "px";
    recFillFont(clock);

    function recFillFont(el) {
      var fs = clock.style.fontSize.substring(0, clock.style.fontSize.length - 2);
      if (el.clientWidth > vw) {
        clock.style.fontSize = fs * 0.75 + 'px';
        recFillFont(el);
      } else if (vw - el.clientWidth > 5) {
        clock.style.fontSize = fs * 1.25 + 'px';
        recFillFont(el);
      }
    }
  };
  resizeText();

  function addBlock() {
    var el = document.createElement('input');
    el.classList.add('block');

    el.onkeyup = function (ev) {
      if (ev.target.value.length === 2 && event.keyCode !== 8) {
        ev.target.value = ev.target.value + ":"
      }
      if (ev.target.value.length === 3 && !ev.target.value.endsWith(':')) {
        ev.target.value = ev.target.value.replace(/.$/, ':')
      }
    };

    el.setAttribute('type', 'text');
    el.setAttribute('minlength', '5');
    el.setAttribute('maxlength', '5');
    el.setAttribute('size', '3');
    el.setAttribute('inputmode', 'numeric');
    el.setAttribute('placeholder', 'min:sec');
    mTimers.appendChild(el);
    el.focus();

    timerEl.push(el);
  }

  function addRepeat() {
    if (mTimers.lastElementChild !== null) {

      var label = document.createElement('label');
      var el = document.createElement('input');
      var repeatDiv = document.createElement('div');

      repeatDiv.classList.add('repeat-div');
      mTimers.appendChild(repeatDiv);

      while (mTimers.childNodes.length !== 1) {
        repeatDiv.appendChild(mTimers.childNodes[0]);
      }
      label.innerHTML = 'X:';
      el.classList.add('repeat');
      el.setAttribute('type', 'number');
      el.setAttribute('min', '1');
      el.setAttribute('max', '100');

      repeatDiv.appendChild(label);
      repeatDiv.appendChild(el);

      el.focus();

      timerEl.push(el);
    }
  }

  function deleteBlock() {
    var child = mTimers.lastElementChild;
    if (child !== null) {
      if (child.classList.contains('block')) {
        mTimers.removeChild(child);
      } else if (child.classList.contains('repeat-div')) {
        while (child.childNodes.length !== 0) {
          mTimers.appendChild(child.childNodes[0]);
        }
        mTimers.removeChild(mTimers.lastElementChild);
        mTimers.removeChild(mTimers.lastElementChild);
        child.remove();
      }
      timerEl.pop();
    }
  }

  function startTimer() {
    blocks = [];
    timerEl.forEach(el => {
      if (el.classList.contains('block')) {
        var times = getBlockTimes(el.value);
        blocks.push({
          t: moment({
            seconds: times[1], minutes: times[0]
          }),
          c: getRandomColor()
        });
      } else if (el.classList.contains('repeat')) {
        if (el.value) {
          var i = parseInt(el.value);
          var og = blocks.slice();
          while (i > 1) {
            og.forEach(b => {
              var newB = { t: b.t.clone(), c: b.c };
              blocks.push(newB);
            });

            i--;
          }
        }
      }
    });

    if (blocks.length !== 0) {
      currentT = blocks.shift();
      clock.style.color = currentT.c;
      clearTimeout(currentTimeOut);
      startTime();
      document.getElementById('menu').style.display = 'none';
    }
  }

  function getBlockTimes(val) {
    var t = [];
    if (val === '') {
      t[0] = 0;
      t[1] = 0;
    } else {
      t[0] = parseInt(val.slice(0, 2));
      t[1] = parseInt(val.slice(3, 5));
    }
    return t;
  }

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async function startTime() {
    currentT.t = currentT.t.subtract(timeStep, 'ms');

    if (currentT.t.minutes() === 0) {
      document.getElementById('clock').innerHTML = currentT.t.format('ss:SS');
    } else {
      document.getElementById('clock').innerHTML = currentT.t.format('mm:ss');
    }

    if (currentT.t.seconds() < 4 && currentT.t.seconds() > 0 && currentT.t.milliseconds() === 0) {
      aboutToEndBeep.play();
    }
    if (currentT.t.minutes() === 0 && currentT.t.seconds() === 0 && currentT.t.milliseconds() === 0) {
      finalBeep.play();
      await sleep(1000);
      if (blocks.length !== 0) {
        currentT = blocks.shift();
        clock.style.color = currentT.c;
      } else {
        return;
      }
    }

    currentTimeOut = setTimeout(function () {
      startTime()
    }, timeStep);
  }

  var volIcoClass = document.getElementById('vol-ico').classList;
  document.getElementById('volume').onclick = function () {
    if (volIcoClass.contains('fa-volume-off')) {
      volIcoClass.remove('fa-volume-off');
      volIcoClass.add('fa-volume-down');
      finalBeep.volume = 0.5;
      aboutToEndBeep.volume = 0.5;
    } else if (volIcoClass.contains('fa-volume-down')) {
      volIcoClass.remove('fa-volume-down');
      volIcoClass.add('fa-volume-up');
      finalBeep.volume = 1;
      aboutToEndBeep.volume = 1;
    } else if (volIcoClass.contains('fa-volume-up')) {
      volIcoClass.remove('fa-volume-up');
      volIcoClass.add('fa-volume-off');
      finalBeep.volume = 0;
      aboutToEndBeep.volume = 0;
    }
  }

  document.getElementById('open-menu').onclick = function (ev) {
    document.getElementById('menu').style.display = 'flex';
  }

  document.getElementById('close-menu').onclick = function () {
    document.getElementById('menu').style.display = 'none';
  }

  var doc = document.documentElement;
  var fsFlag = false;

  function openFullscreen() {
    fsFlag = true;
    if (doc.requestFullscreen) {
      doc.requestFullscreen();
    } else if (doc.mozRequestFullScreen) {
      /* Firefox */
      doc.mozRequestFullScreen();
    } else if (doc.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      doc.webkitRequestFullscreen();
    } else if (doc.msRequestFullscreen) {
      /* IE/Edge */
      doc.msRequestFullscreen();
    }
  }

  function closeFullscreen() {
    fsFlag = false;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  document.getElementById('toggle-full-screen').onclick = function (event) {
    if (fsFlag) {
      closeFullscreen();
    } else {
      openFullscreen();
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});