document.addEventListener('DOMContentLoaded', function () {
  var nS = new NoSleep();

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

  var d = moment({ seconds: 30, minutes: 2 });
  var timeStep = 10;

  console.log(d.format('mm:ss:S'));


  function startTime() {

    d = d.subtract(timeStep, 'ms');
    document.getElementById('clock').innerHTML = d.format('mm:ss');
    //console.log(d.format('mm:ss:S'));

    t = setTimeout(function () {
      startTime()
    }, timeStep);
  }
  startTime();

});