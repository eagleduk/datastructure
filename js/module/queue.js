const MODULE = "queue";
const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;

const enqueueEventHandler = async (e) => {
  e.preventDefault();
  e.target.insert.disabled = true;
  const {
    target: { value },
  } = e;

  const valueContent = createValueContent(value.value);

  const container = document.querySelector(`.${MODULECONTENTCLASS}`);
  container.appendChild(valueContent);

  await _promiseTimeout(SELECTTIME, () =>
    valueContent.classList.remove("change-value")
  );

  value.value = getRandomValue();
  e.target.insert.disabled = false;
};

const dequeueEventHandler = async (e) => {
  e.preventDefault();
  e.target.remove.disabled = true;
  const container = document.querySelector(`.${MODULECONTENTCLASS}`);

  const firstChild = container.firstChild;
  if (!firstChild) {
    notification("No have Value.");
  } else {
    firstChild.classList.add("selected-value");
    await _promiseTimeout(DELETETIME, () => firstChild.remove());
  }

  e.target.remove.disabled = false;
};

function renderControlQueue() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.draggable = true;
  toolbar.addEventListener("dragstart", controlPanelDragStartEventHandler);
  toolbar.addEventListener("drag", (e) => {});

  const controller = document.createElement("div");

  const row1 = document.createElement("form");
  row1.addEventListener("submit", enqueueEventHandler);

  const value = document.createElement("input");
  value.type = "number";
  value.placeholder = "Enqueue Value";
  value.name = "value";
  value.required = true;
  value.value = getRandomValue();

  const insert = document.createElement("input");
  insert.type = "submit";
  insert.className = "insert";
  insert.value = "Enqueue";
  insert.name = "insert";

  row1.appendChild(value);
  row1.appendChild(insert);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", dequeueEventHandler);

  const remove = document.createElement("input");
  remove.type = "submit";
  remove.className = "delete";
  remove.value = "Dequeue";
  remove.name = "remove";

  row2.appendChild(remove);

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

function renderContentQueue() {
  const moduleContent = document.createElement("div");
  moduleContent.className = MODULECONTENTCLASS;
  moduleContent.addEventListener("dragover", contentDragoverEventHandler);
  moduleContent.addEventListener("drop", contentDropEventHandler);

  return moduleContent;
}

export default () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderControlQueue());
  nodeModule.appendChild(renderContentQueue());

  renderModuleContent(nodeModule);
};
