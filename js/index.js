const DEFAULTLENGTH = 3;
const NSADDRESS = "http://www.w3.org/2000/svg";

function _promiseTimeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
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
  const importModule = await import(`./module/${module}.js`);
  importModule.renderModule();
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

function notification(message, className) {
  const article = document.querySelector("article");
  article.className = `notification display ${className}`;
  article.innerHTML = message;
  setTimeout(() => (article.className = `notification`), 5000);
}

function errorNotification(message) {
  notification(message, "error");
}

window.addEventListener("DOMContentLoaded", (e) => {
  const module = "heap";
  globalThis.location.href = `#${module}`;
  moduleSelected(module);
  moduleLoader(module);
});

window.addEventListener("hashchange", (e) => {
  const module = globalThis.location.hash.slice(1);
  moduleSelected(module);
  moduleLoader(module);
});
