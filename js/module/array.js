const MODULECONTENTCLASS = "module-container__content-array";

const renderButtonEvent = (e) => {
  const number = document.querySelector(
    ".module-container__control-array input[type=number]"
  ).value;
  renderContent(number);
};

export const CONTROLMENU = [
  {
    display: "LENGTH",
  },
];

/* 배열 사이즈 설정 창 */
function renderControlArray() {
  const lengthValue = document.createElement("input");
  lengthValue.type = "number";
  lengthValue.value = DEFAULTLENGTH;

  const renderButton = document.createElement("input");
  renderButton.type = "button";
  renderButton.value = "Set";
  renderButton.addEventListener("click", renderButtonEvent);

  const subController = createDivElement();
  subController.className = "module-container__control-array";
  subController.appendChild(lengthValue);
  subController.appendChild(renderButton);

  return subController;
}

/* 배열 본문 창 */
function renderContentArray() {
  const moduleContent = createDivElement();
  moduleContent.className = MODULECONTENTCLASS;
  return moduleContent;
}

/* 배열 그리기 */
function renderContent(number = DEFAULTLENGTH) {
  const moduleContent = document.querySelector(`div.${MODULECONTENTCLASS}`);

  while (moduleContent.hasChildNodes()) {
    moduleContent.removeChild(moduleContent.firstChild);
  }

  for (let index = 0; index < number; index++) {
    const container = createDivElement();
    let indexContainer = createSpanElement();
    indexContainer.innerText = `array[${index}]`;

    let valueContainer = createSpanElement();
    valueContainer.innerText = getRandomValue();

    container.appendChild(indexContainer);
    container.appendChild(valueContainer);

    moduleContent.appendChild(container);
  }
}

export const renderModule = () => {
  const nodeModule = createDivElement();
  nodeModule.className = "module-container";
  nodeModule.appendChild(renderControlArray());
  nodeModule.appendChild(renderContentArray());

  renderModuleContent(nodeModule);

  renderContent();
};
