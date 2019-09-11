export const repeatToText = repeat => {
  if (repeat.length === 1) {
    if (repeat[0]) return 'PER DAY';
    else return 'PER WEEK';
  } else {
    let days = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
    return days.filter((day, i) => repeat[i]).join(' ');
  }
};

export const msToShortTime = ms => {
  let seconds = parseInt((ms / 1000) % 60);
  let minutes = parseInt((ms / (1000 * 60)) % 60);
  let hours = parseInt(ms / (1000 * 60 * 60));
  let sign = seconds < 0 ? '-' : '';

  hours = hours < 10 && hours > -10 ? '0' + Math.abs(hours) : Math.abs(hours);
  minutes =
    minutes < 10 && minutes > -10 ? '0' + Math.abs(minutes) : Math.abs(minutes);
  seconds =
    seconds < 10 && seconds > -10 ? '0' + Math.abs(seconds) : Math.abs(seconds);

  return sign + hours + ':' + minutes + ':' + seconds;
};
