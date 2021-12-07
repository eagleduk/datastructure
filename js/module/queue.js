const MODULE = "queue";
const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;

const enqueueEventHandler = async (e) => {
  e.preventDefault();
  e.target.insert.disabled = true;
  const {
    target: { value },
  } = e;

  const enqueueContainer = document.querySelector(
    `.${MODULECONTENTCLASS} .content-queue__top`
  );

  const valueContent = createValueContent(value.value);
  enqueueContainer.appendChild(valueContent);

  const container = document.querySelector(
    `.${MODULECONTENTCLASS} .content-queue__middle`
  );

  await _promiseTimeout(DELETETIME, () => container.prepend(valueContent));

  value.value = getRandomValue();
  e.target.insert.disabled = false;
};

const dequeueEventHandler = async (e) => {
  e.preventDefault();
  e.target.remove.disabled = true;
  const container = document.querySelector(
    `.${MODULECONTENTCLASS} .content-queue__middle`
  );

  const lastChild = container.lastChild;

  if (!lastChild) return;

  lastChild.classList.add("dequeue-value");
  const enqueueContainer = document.querySelector(
    `.${MODULECONTENTCLASS} .content-queue__bottom`
  );

  await _promiseTimeout(DELETETIME, () =>
    enqueueContainer.appendChild(lastChild)
  );
  await _promiseTimeout(
    DELETETIME,
    () =>
      enqueueContainer.hasChildNodes() &&
      enqueueContainer.removeChild(lastChild)
  );

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
  div.className = "queue__content-value value-content";
  div.dataset.value = value;
  // div.innerText = value;

  return div;
}

function renderContentQueue() {
  const moduleContent = document.createElement("div");
  moduleContent.className = MODULECONTENTCLASS;
  moduleContent.addEventListener("dragover", contentDragoverEventHandler);
  moduleContent.addEventListener("drop", contentDropEventHandler);

  moduleContent.appendChild(renderContentQueueTop());
  moduleContent.appendChild(renderContentQueueMiddle());
  moduleContent.appendChild(renderContentQueueBottom());

  return moduleContent;
}

function renderContentQueueTop() {
  const queueTop = document.createElement("div");
  queueTop.className = "content-queue content-queue__top";

  return queueTop;
}
function renderContentQueueMiddle() {
  const queueMiddle = document.createElement("div");
  queueMiddle.className = "content-queue content-queue__middle";

  return queueMiddle;
}
function renderContentQueueBottom() {
  const queueBottom = document.createElement("div");
  queueBottom.className = "content-queue content-queue__bottom";

  return queueBottom;
}

export default () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderControlQueue());
  nodeModule.appendChild(renderContentQueue());

  renderModuleContent(nodeModule);
};
