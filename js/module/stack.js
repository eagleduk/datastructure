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

  const enqueueContainer = document.querySelector(
    `.${MODULECONTENTCLASS} .content-stack__left`
  );
  const valueContent = createValueContent(value.value);

  enqueueContainer.appendChild(valueContent);
  const container = document.querySelector(
    `.${MODULECONTENTCLASS} .content-stack__center`
  );

  await _promiseTimeout(MOVEDURATION, () => container.prepend(valueContent));

  value.value = getRandomValue();

  e.target.push.disabled = false;
};

const popEventHandler = async (e) => {
  e.preventDefault();
  e.target.pop.disabled = true;

  const container = document.querySelector(
    `.${MODULECONTENTCLASS} .content-stack__center`
  );
  const firstChild = container.firstChild;
  if (!firstChild) return;
  firstChild.classList.add("pop-value");

  const enqueueContainer = document.querySelector(
    `.${MODULECONTENTCLASS} .content-stack__right`
  );

  await _promiseTimeout(MOVEDURATION, () =>
    enqueueContainer.appendChild(firstChild)
  );
  await _promiseTimeout(
    MOVEDURATION,
    () =>
      enqueueContainer.hasChildNodes() &&
      enqueueContainer.removeChild(firstChild)
  );

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
  div.className = "stack__content-value value-content";
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

  moduleContent.appendChild(renderContentStackLeft());
  moduleContent.appendChild(renderContentStackCenter());
  moduleContent.appendChild(renderContentStackRight());

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
