const DEFAULTLENGTH = 5;

function getRandomValue() {
  return parseInt(Math.random() * 100);
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

function replaceModule(module, targetTag) {
  const targetNode = document.querySelector(targetTag);
  targetNode.replaceChild(module, targetNode.children[0]);
}

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

function renderModuleContent(moduleNode) {
  replaceModule(moduleNode, "section");
}

async function moduleLoader(module) {
  const importModule = await import(`./module/${module}.js`);
  renderController(importModule.CONTROLMENU);
  importModule.renderModule();
}

window.addEventListener("DOMContentLoaded", async (e) => {
  const module = "stack";
  moduleLoader(module);
});

window.addEventListener("hashchange", async (e) => {
  const module = globalThis.location.hash.slice(1);
  moduleLoader(module);
});
