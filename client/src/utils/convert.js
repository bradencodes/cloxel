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
  if (Math.abs(ms) < 1000) return '00:00:00';
  let seconds = parseInt((ms / 1000) % 60);
  let minutes = parseInt((ms / (1000 * 60)) % 60);
  let hours = parseInt(ms / (1000 * 60 * 60));
  let sign = ms < 0 ? '-' : '';

  hours = hours < 10 && hours > -10 ? '0' + Math.abs(hours) : Math.abs(hours);
  minutes =
    minutes < 10 && minutes > -10 ? '0' + Math.abs(minutes) : Math.abs(minutes);
  seconds =
    seconds < 10 && seconds > -10 ? '0' + Math.abs(seconds) : Math.abs(seconds);

  return sign + hours + ':' + minutes + ':' + seconds;
};

export const shortTimeToMS = shortTime => {
  let timeParts = shortTime.split(':');
  let sign = 1;
  if (timeParts[0][0] === '-') {
    sign = -1;
    timeParts[0] = timeParts[0].substring(1);
  }
  return (
    (+timeParts[0] * (1000 * 60 * 60) +
      +timeParts[1] * 1000 * 60 +
      +timeParts[2] * 1000) *
    sign
  );
};
