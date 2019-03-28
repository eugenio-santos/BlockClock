document.addEventListener('DOMContentLoaded', function () {
  var nS = new NoSleep();
  var audio = new Audio('beep-09.mp3');


  document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    nS.enable();
  }, false);

  var clock = document.getElementById('clock');

  window.onresize = function () {
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
  window.onresize();

  var blocks = [];
  blocks.push({ t: moment({ seconds: 3 }), c: 'red' });
  blocks.push({ t: moment({ seconds: 2 }), c: 'blue' });



  //var d = moment.duration(10, 'ms');

  var timeStep = 100;
  var currentT = blocks.shift();
  clock.style.color = currentT.c;
  async function startTime() {
    currentT.t = currentT.t.subtract(timeStep, 'ms');
    document.getElementById('clock').innerHTML = currentT.t.format('ss:S');
    if (currentT.t.seconds() === 0 && currentT.t.milliseconds() === 0) {
      audio.play();
      await sleep(1000);
      if (blocks.length !== 0) {
        currentT = blocks.shift();
        clock.style.color = currentT.c;
      } else {
        return;
      }
    }

    t = setTimeout(function () {
      startTime()
    }, timeStep);
  }
  startTime();













  var doc = document.documentElement;
  var fsFlag = false;
  function openFullscreen() {
    fsFlag = true;
    if (doc.requestFullscreen) {
      doc.requestFullscreen();
    } else if (doc.mozRequestFullScreen) { /* Firefox */
      doc.mozRequestFullScreen();
    } else if (doc.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      doc.webkitRequestFullscreen();
    } else if (doc.msRequestFullscreen) { /* IE/Edge */
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
  doc.ondblclick = function (event) {
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