const DEFAULTLENGTH = 3;
const NSADDRESS = "http://www.w3.org/2000/svg";

function getRandomValue(maxValue = 100) {
  return parseInt(Math.random() * maxValue + 1);
}

function createElement(tagName) {
  return document.createElement(tagName);
}

function createSpanElement() {
  return createElement("span");
}

function createDivElement() {
  return createElement("div");
}

function createSectionElement() {
  return createElement("section");
}

function createNumberInputElement(placeholder, defaultValue) {
  const input = createElement("input");
  input.type = "number";
  if (placeholder) input.placeholder = placeholder;
  if (defaultValue) input.value = defaultValue;

  return input;
}

function createButton(value = "Done") {
  const input = document.createElement("input");
  input.type = "button";
  input.value = value;

  return input;
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

window.addEventListener("DOMContentLoaded", (e) => {
  const module = "queue";
  globalThis.location.href = `#${module}`;
  moduleSelected(module);
  moduleLoader(module);
});

window.addEventListener("hashchange", (e) => {
  const module = globalThis.location.hash.slice(1);
  moduleSelected(module);
  moduleLoader(module);
});

/*
function renderController(CONTROLMENU) {
  const ul = document.createElement("ul");

  for (let { display, css, event } of CONTROLMENU) {
    let span = document.createElement("span");
    span.innerText = display;
    span.className = css;
    span.addEventListener("click", event);

    let li = document.createElement("li");
    li.appendChild(span);

    ul.appendChild(li);
  }

  const div = document.createElement("div");
  div.appendChild(ul);
  div.classList.add("array-controller");

  replaceModule(div, "article");
}

function replaceModule(module, targetTag) {
  const targetNode = document.querySelector(targetTag);
  targetNode.replaceChild(module, targetNode.children[0]);
}


*/
