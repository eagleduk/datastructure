const MODULE = "stack";
const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;
const MOVEDURATION = 3 * 1000;

const stackRenderEvent = (e) => {
  const container = document.querySelector(`.${MODULECONTENTCLASS}`);

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  container.appendChild(renderContentStackLeft());
  container.appendChild(renderContentStackCenter());
  container.appendChild(renderContentStackRight());
};

const pushEventHandler = async (e) => {
  e.preventDefault();
  e.target.push.disabled = true;
  const {
    target: { value },
  } = e;

  const valueContent = createValueContent(value.value);

  const container = document.querySelector(`.${MODULECONTENTCLASS}`);
  container.prepend(valueContent);

  await _promiseTimeout(SELECTTIME, () =>
    valueContent.classList.remove("change-value")
  );

  value.value = getRandomValue();

  e.target.push.disabled = false;
};

const popEventHandler = async (e) => {
  e.preventDefault();
  e.target.pop.disabled = true;

  const container = document.querySelector(`.${MODULECONTENTCLASS}`);

  const firstChild = container.firstChild;
  if (!firstChild) {
    notification("Value is no have.");
  } else {
    firstChild.classList.add("selected-value");
    await _promiseTimeout(DELETETIME, () => firstChild.remove());
  }

  e.target.pop.disabled = false;
};

function renderControlStack() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.draggable = true;
  toolbar.addEventListener("dragstart", controlPanelDragStartEventHandler);
  toolbar.addEventListener("drag", (e) => {});

  const controller = document.createElement("div");

  const row1 = document.createElement("form");
  row1.addEventListener("submit", pushEventHandler);

  const value = document.createElement("input");
  value.type = "number";
  value.placeholder = "Push Value";
  value.name = "value";
  value.required = true;
  value.value = getRandomValue();

  const push = document.createElement("input");
  push.type = "submit";
  push.className = "insert";
  push.value = "push";
  push.name = "push";

  row1.appendChild(value);
  row1.appendChild(push);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", popEventHandler);

  const pop = document.createElement("input");
  pop.type = "submit";
  pop.className = "delete";
  pop.value = "pop";
  pop.name = "pop";

  row2.appendChild(pop);

  controller.appendChild(row1);
  controller.appendChild(row2);

  const controlPanel = document.createElement("div");
  controlPanel.className = `${MODULECONTROLCLASS} content-control`;
  controlPanel.appendChild(toolbar);
  controlPanel.appendChild(controller);

  return controlPanel;
}

function createValueContent(value) {
  const div = document.createElement("div");
  div.className = "value-content change-value";
  div.dataset.value = value;

  return div;
}

function renderContent(queueMiddle) {
  for (let index = 0; index < DEFAULTLENGTH; index++) {
    let valueContainer = createValueContent();
    queueMiddle.appendChild(valueContainer);
  }
}
function renderContentStack() {
  const moduleContent = document.createElement("div");
  moduleContent.className = MODULECONTENTCLASS;
  moduleContent.addEventListener("dragover", contentDragoverEventHandler);
  moduleContent.addEventListener("drop", contentDropEventHandler);

  // moduleContent.appendChild(renderContentStackLeft());
  // moduleContent.appendChild(renderContentStackCenter());
  // moduleContent.appendChild(renderContentStackRight());

  return moduleContent;
}

function renderContentStackLeft() {
  const queueTop = document.createElement("div");
  queueTop.className = "content-stack content-stack__left";

  return queueTop;
}

function renderContentStackCenter() {
  const queueMiddle = document.createElement("div");
  queueMiddle.className = "content-stack content-stack__center";

  return queueMiddle;
}

function renderContentStackRight() {
  const queueBottom = document.createElement("div");
  queueBottom.className = "content-stack content-stack__right";

  return queueBottom;
}

export default () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderControlStack());
  nodeModule.appendChild(renderContentStack());

  renderModuleContent(nodeModule);
};
