const DEFAULTLENGTH = 3;
const NSADDRESS = "http://www.w3.org/2000/svg";

const SELECTTIME = 1000;
const SEARCHTIME = 3000;
const DELETETIME = 2000;

function allButtonDisableControl(disabled) {
  const allButtons = document.querySelectorAll("input[type=submit]");
  allButtons.forEach((button) => (button.disabled = disabled));
}

function allButtonabled() {
  allButtonDisableControl(false);
}

function allButtonDisabled() {
  allButtonDisableControl(true);
}

function _promiseTimeout(ms, fn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof fn === "function") fn();
      resolve();
    }, ms);
  });
}

function controlPanelDragStartEventHandler(e) {
  const { layerX, layerY } = e;
  var parentNode = e.target.parentElement;
  e.dataTransfer.setDragImage(parentNode, layerX, layerY);
  e.dataTransfer.setData("targetClass", parentNode.className);
  e.dataTransfer.setData("offsetX", layerX);
  e.dataTransfer.setData("offsetY", layerY);
}

function contentDragoverEventHandler(e) {
  e.preventDefault();
}

function contentDropEventHandler(e) {
  const { layerX, layerY } = e;
  const targetClass = e.dataTransfer.getData("targetClass");
  const offsetX = e.dataTransfer.getData("offsetX");
  const offsetY = e.dataTransfer.getData("offsetY");
  const controlPanel = document.querySelector(
    `.${targetClass.replace(" ", ".")}`
  );
  controlPanel.style.top = `${layerY - offsetY}px`;
  controlPanel.style.left = `${layerX - offsetX}px`;
}

function getRandomValue(maxValue = 100) {
  return parseInt(Math.random() * maxValue + 1);
}

const getRandomColor = () => {
  const result = "#" + Math.floor(Math.random() * 16777215).toString(16);
  if (result.length < 7) return getRandomColor();
  return result;
};

function renderModuleContent(moduleNode) {
  const main = document.querySelector("main");
  if (main.hasChildNodes()) main.removeChild(main.firstChild);
  main.appendChild(moduleNode);
}

async function moduleLoader(module = "array") {
  const { default: render } = await import(`./module/${module}.js`);
  render();
}

function moduleSelected(selected = "array") {
  const modules = document.querySelectorAll("header ul li a");
  modules.forEach((module) => {
    module.className = "";
    if (selected === module.dataset.module) {
      module.className = "selectedModule";
    }
  });
}

function notification(message, className = "") {
  const article = document.querySelector("article");
  article.className = `notification display ${className}`;
  article.innerHTML = message;
  setTimeout(() => (article.className = `notification`), 5000);
}

function errorNotification(message) {
  notification(message, "error");
}

function warnNotification(message) {
  notification(message, "warning");
}

window.addEventListener("DOMContentLoaded", (e) => {
  const module = "array";
  globalThis.location.href = `#${module}`;
  moduleSelected(module);
  moduleLoader(module);
});

window.addEventListener("hashchange", (e) => {
  const module = globalThis.location.hash.slice(1);
  moduleSelected(module);
  moduleLoader(module);
});
