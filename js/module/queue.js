const MODULECONTENTCLASS = "module-container__content-queue";
const MOVEDURATION = 3 * 1000;

const queueRenderEvent = (e) => {
  const container = document.querySelector(`.${MODULECONTENTCLASS}`);

  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  container.appendChild(renderContentQueueTop());
  container.appendChild(renderContentQueueMiddle());
  container.appendChild(renderContentQueueBottom());
};

const queueEnqueueEvent = (e) => {
  const enqueueContainer = document.querySelector(
    `.${MODULECONTENTCLASS} .content-queue__top`
  );
  const valueContent = createValueContent();

  enqueueContainer.appendChild(valueContent);

  setTimeout((e) => {
    const container = document.querySelector(
      `.${MODULECONTENTCLASS} .content-queue__middle`
    );

    container.prepend(valueContent);
  }, MOVEDURATION);
};

const queueDequeueEvent = (e) => {
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

export const CONTROLMENU = [
  {
    display: "Render",
    event: queueRenderEvent,
    css: "control-abled",
  },
  {
    display: "Enqueue",
    event: queueEnqueueEvent,
    css: "control-abled",
  },
  {
    display: "Dequeue",
    event: queueDequeueEvent,
    css: "control-abled",
  },
];

function createValueContent() {
  const div = createDivElement();
  div.className = "queue__content-value";

  div.innerText = getRandomValue();

  return div;
}

function renderContent(queueMiddle) {
  for (let index = 0; index < DEFAULTLENGTH; index++) {
    let valueContainer = createValueContent();
    queueMiddle.appendChild(valueContainer);
  }
}

function renderContentContainer() {
  const container = createDivElement();
  container.className = `${MODULECONTENTCLASS}`;

  container.appendChild(renderContentQueueTop());
  container.appendChild(renderContentQueueMiddle());
  container.appendChild(renderContentQueueBottom());

  return container;
}

function renderContentQueueTop() {
  const queueTop = createDivElement();
  queueTop.className = "content-queue content-queue__top";

  return queueTop;
}
function renderContentQueueMiddle() {
  const queueMiddle = createDivElement();
  queueMiddle.className = "content-queue content-queue__middle";

  renderContent(queueMiddle);

  return queueMiddle;
}
function renderContentQueueBottom() {
  const queueBottom = createDivElement();
  queueBottom.className = "content-queue content-queue__bottom";

  return queueBottom;
}

export const renderModule = () => {
  const nodeModule = createDivElement();
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderContentContainer());

  renderModuleContent(nodeModule);
};
