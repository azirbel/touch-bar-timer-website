'use strict';

function pad(num, size) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
}

let seconds = 0;
setInterval(() => {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  document.getElementById('timer').innerText = `${pad(m, 2)}:${pad(s, 2)}`;
  seconds += 1;
}, 1000);
