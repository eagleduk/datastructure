const MODULE = "array";
const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;

const searchEventHandler = (e) => {
  e.preventDefault();
  const {
    target: {
      index: { value },
    },
  } = e;
  searchContent(value);
};

const pushEventHandler = (e) => {
  e.preventDefault();
  const {
    target: { value },
  } = e;
  pushContent(value.value);

  value.value = getRandomValue();
};

function renderControlArray() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  const controller = document.createElement("div");

  const row1 = document.createElement("form");
  row1.addEventListener("submit", searchEventHandler);

  const index = document.createElement("input");
  index.type = "number";
  index.placeholder = "Index";
  index.name = "index";
  index.required = true;

  const searchButton = document.createElement("input");
  searchButton.type = "submit";
  searchButton.value = "search";

  row1.appendChild(index);
  row1.appendChild(searchButton);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", pushEventHandler);

  const value = document.createElement("input");
  value.type = "number";
  value.placeholder = "Value";
  value.value = getRandomValue();
  value.name = "value";
  value.required = true;

  const push = document.createElement("input");
  push.type = "submit";
  push.value = "push";

  row2.appendChild(value);
  row2.appendChild(push);

  controller.appendChild(row1);
  controller.appendChild(row2);

  const controlPanel = document.createElement("div");
  controlPanel.className = MODULECONTROLCLASS;
  controlPanel.appendChild(toolbar);
  controlPanel.appendChild(controller);

  return controlPanel;
}

/* 배열 본문 창 */
function renderContentArray() {
  const moduleContent = document.createElement("div");
  moduleContent.className = MODULECONTENTCLASS;
  return moduleContent;
}

function searchContent(index) {
  const moduleContent = document.querySelector(`div.${MODULECONTENTCLASS}`);

  console.log(moduleContent.childNodes[index]);
}

function pushContent(value) {
  const moduleContent = document.querySelector(`div.${MODULECONTENTCLASS}`);

  const container = document.createElement("div");
  let indexContainer = document.createElement("span");
  indexContainer.innerText = `${moduleContent.childNodes.length}`;

  let valueContainer = document.createElement("span");
  valueContainer.innerText = value;

  container.appendChild(indexContainer);
  container.appendChild(valueContainer);

  moduleContent.appendChild(container);
}

export const renderModule = () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";
  nodeModule.appendChild(renderControlArray());
  nodeModule.appendChild(renderContentArray());

  renderModuleContent(nodeModule);
};
