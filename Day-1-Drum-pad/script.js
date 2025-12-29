console.log("Welcome to Drum Pad.");

window.addEventListener("keydown", function (e) {
  // remove case sensitivity.
  const key = e.key.toLocaleLowerCase();
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  const drum = document.querySelector(`.drum[data-key="${key}"]`);
  if (!audio || !drum) return; // stop playing if no audio data key matches;
  audio.currentTime = 0; // rewind to the start.
  audio.play();
  drum.classList.add("drum-playing");
});

function removeTransition(e) {
  console.log(e.propertyName);
  if (e.propertyName !== "transform") return; // skip if it is not a transform;
  this.classList.remove("drum-playing");
}

const drums = document.querySelectorAll(".drum");
// For mouse click and touch support
function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  const drum = document.querySelector(`.drum[data-key="${key}"]`);
  if (!audio || !drum) return;
  audio.currentTime = 0; // rewind to the start
  audio.play();
  drum.classList.add("drum-playing");
}
drums.forEach((drum) => {
  drum.addEventListener("pointerdown", () => {
    playSound(drum.dataset.key);
  });
  drum.addEventListener("transitionend", removeTransition);
});
// To enable audio playback on first user interaction (for browsers that block autoplay)
// window.addEventListener(
//   "pointerdown",
//   () => {
//     document.querySelectorAll("audio").forEach((audio) => {
//       audio.play().then(() => audio.pause());
//     });
//   },
//   { once: true }
// );
