console.log("Welcome to CSS Variables!");

const inputs = document.querySelectorAll(".controls input");
const currentValues = document.querySelectorAll(".value");
const codeBlock = document.querySelector(".output code");

function handleUpdate() {
  const unit = this.dataset.unit || "";
  const variable = this.dataset.var;
  const value = this.value + unit;
  document.documentElement.style.setProperty(variable, value);
  console.log(variable, value);
  updateCodeBlock();
}

inputs.forEach((input) => {
  input.addEventListener("change", handleUpdate);
  input.addEventListener("mousemove", handleUpdate);
});

// Update the Code Block with current CSS Variables

function updateCodeBlock() {
  const styles = getComputedStyle(document.documentElement);
  codeBlock.textContent = `
  .card {
    width: ${styles.getPropertyValue("--width")};
    height: ${styles.getPropertyValue("--height")};
    border-radius: ${styles.getPropertyValue("--border-radius")}
    padding: ${styles.getPropertyValue("--padding")};
    margin-top: ${styles.getPropertyValue("--margin-top")};
    margin-right: ${styles.getPropertyValue("--margin-right")};
    margin-bottom: ${styles.getPropertyValue("--margin-bottom")};
    margin-left: ${styles.getPropertyValue("--margin-left")};
    background-color: ${styles.getPropertyValue("--background-color")};
    box-shadow: ${styles.getPropertyValue("--box-shadow")};
    filter: blur(${styles.getPropertyValue("--blur")});
  }
  `.trim();
}
const copyButton = document.querySelector(".copy-button");
function copyToClipboard() {
  const codeText = codeBlock.textContent;
  navigator.clipboard.writeText(codeText).then(() => {
    copyButton.textContent = "Copied!";
  });
}

updateCodeBlock();
