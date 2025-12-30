console.log("Hello Dual clock");
// Analog clock hands
const secondsHand = document.querySelector(".second-hand");
const minuteHand = document.querySelector(".minute-hand");
const hourHand = document.querySelector(".hour-hand");
// Digital clock digits
const secondDigit = document.querySelector(".seconds");
const minuteDigit = document.querySelector(".minutes");
const hourDigit = document.querySelector(".hours");

function setDate() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // Remove transition for jump at 0 seconds backward.
  if (seconds === 0) {
    secondsHand.style.transition = "none";
  } else {
    secondsHand.style.transition = "transform 0.05s linear";
  }

  //   seconds
  const secondsDegrees = (seconds / 60) * 360;
  secondsHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
  //minutes
  const minutesDegrees = ((minutes + seconds / 60) / 60) * 360;
  minuteHand.style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
  //hours
  const hoursDegrees = (((hours % 12) + minutes / 60) / 12) * 360;
  hourHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;
  //   For digital Clock

  secondDigit.textContent = seconds.toString().padStart(2, "0");
  minuteDigit.textContent = minutes.toString().padStart(2, "0");
  hourDigit.textContent = hours.toString().padStart(2, "0");
}
setDate();
setInterval(setDate, 1000);
