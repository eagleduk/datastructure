const MODULECONTENTCLASS = "module-container__content-queue";

const arrayEnqueueEvent = (e) => {
  const enqueueContainer = document.querySelector(
    ".module-container__content-queue .content-queue__top"
  );
  const span = createSpanElement();
  span.innerText = getRandomValue();
  enqueueContainer.appendChild(span);
};

const arrayDequeueEvent = (e) => {
  console.log("Dequeue");
};

export const CONTROLMENU = [
  {
    display: "Enqueue",
    event: arrayEnqueueEvent,
    css: "control-abled",
  },
  {
    display: "Dequeue",
    event: arrayDequeueEvent,
    css: "control-abled",
  },
];

function renderContentContainer() {
  const container = createDivElement();
  container.className = "module-container__content-queue";

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
