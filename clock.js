function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const day = now.getDay();

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeek[day];

    const clockDisplay = `${dayName} ${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').textContent = clockDisplay;
    
  }

  setInterval(updateClock, 1000);

  updateClock();