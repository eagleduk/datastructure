const MODULECONTENTCLASS = "module-container__content-stack";
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
  const enqueueContainer = document.querySelector(
    `.${MODULECONTENTCLASS} .content-stack__left`
  );
  const valueContent = createValueContent();

  enqueueContainer.appendChild(valueContent);

  setTimeout((e) => {
    const container = document.querySelector(
      `.${MODULECONTENTCLASS} .content-stack__center`
    );

    container.prepend(valueContent);
  }, MOVEDURATION);
};

const stackPopEvent = (e) => {
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

export const CONTROLMENU = [
  {
    display: "Render",
    event: stackRenderEvent,
    css: "control-abled",
  },
  {
    display: "Push",
    event: stackPushEvent,
    css: "control-abled",
  },
  {
    display: "Pop",
    event: stackPopEvent,
    css: "control-abled",
  },
];

function createValueContent() {
  const div = createDivElement();
  div.className = "stack__content-value";

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

  container.appendChild(renderContentStackLeft());
  container.appendChild(renderContentStackCenter());
  container.appendChild(renderContentStackRight());

  return container;
}

function renderContentStackLeft() {
  const queueTop = createDivElement();
  queueTop.className = "content-stack content-stack__left";

  return queueTop;
}
function renderContentStackCenter() {
  const queueMiddle = createDivElement();
  queueMiddle.className = "content-stack content-stack__center";

  renderContent(queueMiddle);

  return queueMiddle;
}
function renderContentStackRight() {
  const queueBottom = createDivElement();
  queueBottom.className = "content-stack content-stack__right";

  return queueBottom;
}

export const renderModule = () => {
  const nodeModule = createDivElement();
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderContentContainer());

  renderModuleContent(nodeModule);
};
