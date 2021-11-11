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

const stackPushEvent = (e) => {
  e.preventDefault();
  const {
    target: { value },
  } = e;

  const enqueueContainer = document.querySelector(
    `.${MODULECONTENTCLASS} .content-stack__left`
  );
  const valueContent = createValueContent(value.value);

  enqueueContainer.appendChild(valueContent);

  setTimeout((e) => {
    const container = document.querySelector(
      `.${MODULECONTENTCLASS} .content-stack__center`
    );

    container.prepend(valueContent);
  }, MOVEDURATION);

  value.value = getRandomValue();
};

const stackPopEvent = (e) => {
  e.preventDefault();

  const container = document.querySelector(
    `.${MODULECONTENTCLASS} .content-stack__center`
  );
  const firstChild = container.firstChild;
  if (!firstChild) return;
  firstChild.classList.add("pop-value");

  setTimeout((e) => {
    const enqueueContainer = document.querySelector(
      `.${MODULECONTENTCLASS} .content-stack__right`
    );

    enqueueContainer.appendChild(firstChild);

    setTimeout((e) => {
      if (enqueueContainer.hasChildNodes())
        enqueueContainer.removeChild(firstChild);
    }, MOVEDURATION);
  }, MOVEDURATION);
};

function renderControlStack() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.draggable = true;
  toolbar.addEventListener("dragstart", controlPanelDragStartEventHandler);
  toolbar.addEventListener("drag", (e) => {});

  const controller = document.createElement("div");

  const row1 = document.createElement("form");
  row1.addEventListener("submit", stackPushEvent);

  const index = document.createElement("input");
  index.type = "number";
  index.placeholder = "input array index";
  index.name = "value";
  index.required = true;

  const search = document.createElement("input");
  search.type = "submit";
  search.className = "insert";
  search.value = "push";

  row1.appendChild(index);
  row1.appendChild(search);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", stackPopEvent);

  const insert = document.createElement("input");
  insert.type = "submit";
  insert.className = "delete";
  insert.value = "pop";

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
  div.className = "stack__content-value value-content";
  div.dataset.value = value;

  // div.innerText = getRandomValue();

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

  // renderContent(queueMiddle);

  return queueMiddle;
}

function renderContentStackRight() {
  const queueBottom = document.createElement("div");
  queueBottom.className = "content-stack content-stack__right";

  return queueBottom;
}

export const renderModule = () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderControlStack());
  nodeModule.appendChild(renderContentStack());

  renderModuleContent(nodeModule);
};
