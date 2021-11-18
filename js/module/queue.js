const MODULE = "queue";
const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;
const MOVEDURATION = 3 * 1000;

const queueEnqueueEvent = (e) => {
  e.preventDefault();
  const {
    target: { value },
  } = e;

  const enqueueContainer = document.querySelector(
    `.${MODULECONTENTCLASS} .content-queue__top`
  );

  const valueContent = createValueContent(value.value);

  enqueueContainer.appendChild(valueContent);

  setTimeout((e) => {
    const container = document.querySelector(
      `.${MODULECONTENTCLASS} .content-queue__middle`
    );

    container.prepend(valueContent);
  }, MOVEDURATION);

  value.value = getRandomValue();
};

const queueDequeueEvent = (e) => {
  e.preventDefault();
  const container = document.querySelector(
    `.${MODULECONTENTCLASS} .content-queue__middle`
  );

  const lastChild = container.lastChild;

  if (!lastChild) return;

  lastChild.classList.add("dequeue-value");

  setTimeout((e) => {
    const enqueueContainer = document.querySelector(
      `.${MODULECONTENTCLASS} .content-queue__bottom`
    );

    enqueueContainer.appendChild(lastChild);

    setTimeout((e) => {
      if (enqueueContainer.hasChildNodes())
        enqueueContainer.removeChild(lastChild);
    }, MOVEDURATION);
  }, MOVEDURATION);
};

function renderControlQueue() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.draggable = true;
  toolbar.addEventListener("dragstart", controlPanelDragStartEventHandler);
  toolbar.addEventListener("drag", (e) => {});

  const controller = document.createElement("div");

  const row1 = document.createElement("form");
  row1.addEventListener("submit", queueEnqueueEvent);

  const index = document.createElement("input");
  index.type = "number";
  index.placeholder = "Enqueue Value";
  index.name = "value";
  index.required = true;

  const search = document.createElement("input");
  search.type = "submit";
  search.className = "insert";
  search.value = "Enqueue";

  row1.appendChild(index);
  row1.appendChild(search);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", queueDequeueEvent);

  const insert = document.createElement("input");
  insert.type = "submit";
  insert.className = "delete";
  insert.value = "Dequeue";

  row2.appendChild(insert);

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

  //renderContent(queueMiddle);

  return queueMiddle;
}
function renderContentQueueBottom() {
  const queueBottom = document.createElement("div");
  queueBottom.className = "content-queue content-queue__bottom";

  return queueBottom;
}

export const renderModule = () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderControlQueue());
  nodeModule.appendChild(renderContentQueue());

  renderModuleContent(nodeModule);
};
