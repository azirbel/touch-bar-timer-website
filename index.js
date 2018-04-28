'use strict';

window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};

function pad(num, size) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
}

const DOUBLE_TAP_MS = 300;
const LONG_HOLD_MS = 650;

let active = true;
let celebrating = false;
let seconds = 1;
let lastMousedown = null;
let lastMouseup = null;

window.mdown = _.debounce((event) => {
  if (celebrating) {
    location.reload();
    return;
  }

  lastMousedown = new Date();
  let myLast = lastMousedown;

  setTimeout(() => {
    if (myLast === lastMousedown) {
      lastMousedown = null;
      celebrate();
    }
  }, LONG_HOLD_MS);
}, 100);

window.mup = _.debounce(() => {
  if (celebrating || !lastMousedown) {
    return;
  }

  let now = new Date();
  let durationMs = now - lastMousedown;

  console.log(now, lastMouseup, now - lastMouseup);
  if (lastMouseup && (now - lastMouseup < DOUBLE_TAP_MS)) {
    reset();
  } else if (durationMs < LONG_HOLD_MS) {
    toggle();
  }

  lastMouseup = now;
  lastMousedown = null;
}, 100);

window.cmenu = () => {
  if (celebrating) {
    return;
  }

  celebrate();
  return false;
}

function toggle() {
  active = !active;
  if (active) {
    document.getElementById('timer').style.backgroundColor = 'rgb(42, 160, 28)';
    document.getElementById('mobile-timer').style.backgroundColor = 'rgb(42, 160, 28)';
  } else {
    document.getElementById('timer').style.backgroundColor = '#363636';
    document.getElementById('mobile-timer').style.backgroundColor = '#363636';
  }
}

function reset() {
  seconds = 1;
  active = false;
  document.getElementById('timer').innerText = `0:00`;
  document.getElementById('mobile-timer').innerText = `0:00`;
  document.getElementById('timer').style.backgroundColor = '#363636';
  document.getElementById('mobile-timer').style.backgroundColor = '#363636';
}

setInterval(() => {
  if (active) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds / 60) % 60;
    let s = seconds % 60;

    let timeStr;
    if (h > 0) {
      timeStr = `${pad(h, 1)}h:${pad(m, 2)}`;
    } else {
      timeStr = `${pad(m, 1)}:${pad(s, 2)}`;
    }

    document.getElementById('timer').innerText = timeStr;
    document.getElementById('mobile-timer').innerText = timeStr;

    seconds += 1;
  }
}, 1000);

function celebrate() {
  celebrating = true;

  doFireworks();
  doSideConfetti();

  active = false;
  document.getElementById('timer').style.backgroundColor = 'red';
  document.getElementById('mobile-timer').style.backgroundColor = 'red';
  document.getElementById('timer').innerText = 'WOW';
  document.getElementById('mobile-timer').innerText = 'WOW';
  document.getElementById('title').innerText = `GREAT JOB!`;
  document.getElementById('subtitle').innerHTML = `😲 YOU'RE SO GOOD AT HOLDING BUTTONS!<br/>YOU WILL HAVE NO TROUBLE OPENING THE PREFERENCES!`;
  document.getElementById('li-1').innerText = `You are just the kind of user we want!`;
  document.getElementById('li-2').innerHTML = `Congratulations, your download is now absolutely <strong>FREE!</strong>`;
  document.getElementById('li-3').innerText = '';
  document.body.classList += 'celebrate';
}

function doFireworks() {
  var end = Date.now() + (15 * 1000);

  var interval = setInterval(function() {
      if (Date.now() > end) {
          return clearInterval(interval);
      }

      confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
              x: Math.random(),
              // since they fall down, start a bit higher than random
              y: Math.random() - 0.2
          }
      });
  }, 200);
}

function doSideConfetti() {
  // https://www.kirilv.com/canvas-confetti/
  var end = Date.now() + (15 * 1000);

  // go Buckeyes!
  var colors = ['#bb0000', '#ffffff'];

  (function frame() {
      confetti({
          particleCount: 3,
          angle: 60,
          spread: 85,
          origin: {
              x: 0
          },
          colors: colors
      });
      confetti({
          particleCount: 3,
          angle: 120,
          spread: 85,
          origin: {
              x: 1
          },
          colors: colors
      });

      if (Date.now() < end) {
          requestAnimationFrame(frame);
      }
  }());
}
