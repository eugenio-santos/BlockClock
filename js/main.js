document.addEventListener('DOMContentLoaded', function () {

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

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  function checkMilli(i) {
    if (i < 10) {
      i = '0' + i;
    }
    if (i < 99) {
      i = '0' + i;
    }

    return i;

  }

  function startTime() {
    var today = new Date();

    var m = today.getMinutes();
    var s = today.getSeconds();
    var mm = today.getMilliseconds();
    m = checkTime(m);
    s = checkTime(s);
    mm = checkMilli(mm);

    document.getElementById('clock').innerHTML = s;
    //document.getElementById('clock').innerHTML = s + ":" + mm;


    t = setTimeout(function () {
      startTime()
    }, 10);
  }
  startTime();

});