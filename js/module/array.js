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

const insertEventHandler = (e) => {
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
  index.placeholder = "input array index";
  index.name = "index";
  index.required = true;

  const search = document.createElement("input");
  search.type = "submit";
  search.className = "search";
  search.value = "search";

  row1.appendChild(index);
  row1.appendChild(search);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", insertEventHandler);

  const value = document.createElement("input");
  value.type = "number";
  value.placeholder = "input array value";
  value.value = getRandomValue();
  value.name = "value";
  value.required = true;

  const insert = document.createElement("input");
  insert.type = "submit";
  insert.className = "insert";
  insert.value = "insert";

  row2.appendChild(value);
  row2.appendChild(insert);

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
