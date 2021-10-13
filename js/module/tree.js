const MODULENAME = "tree";
const MODULECONTENTCLASS = `module-container__content-${MODULENAME}`;

const BINARY = 2;
const ROOTVALUE = 50;
const ROOTNODEID = "rootNode";
const TREEINPUTVALUEID = `${MODULENAME}_value`;

const DATASET = {
  ROW: [],
  COLUMN: [],
};

const CLASSNAMES = {
  ROW: ["tree__row-container"],
  COLUMN: ["tree__column-container"],
  VALUECONTENT: ["tree__value-container"],
};

const inputButtonEventHandler = (e) => {
  const { value: inputValue } = document.getElementById(TREEINPUTVALUEID);
  insertInputValue(inputValue, 0, 0);
};

function insertInputValue(inputValue, row, column) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );

  // 비교 값 추출
  const rowContainers = mainContainer.childNodes;
  const columnContainer = rowContainers[row].childNodes[column];
  const comparsionContent = columnContainer?.childNodes[0];
  if (comparsionContent) {
    const { self: comparsionValue } = comparsionContent.dataset;

    if (rowContainers.length <= row + 1) {
      addRowContainer();
    }

    if (comparsionValue < inputValue) {
      insertInputValue(inputValue, row + 1, column * 2 + 1);
    } else {
      insertInputValue(inputValue, row + 1, column * 2);
    }
  } else {
    addValueContent(inputValue, row, column);
  }
}

const searchButtonEventHandler = (e) => {
  const { value: inputValue } = document.getElementById(TREEINPUTVALUEID);
  searchInputValue(inputValue, 0, 0);
};

function searchInputValue(inputValue, row, column) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );
  const rowContainers = mainContainer.childNodes;
  const columnContainer = rowContainers[row].childNodes[column];
  const comparsionContent = columnContainer?.childNodes[0];
  const { self: comparsionValue } = comparsionContent.dataset;

  if (comparsionValue === inputValue) {
    console.log("값이 있다..");
    return;
  } else {
    if (rowContainers.length <= row + 1) {
      console.log("값이 없음");
      return;
    }
    if (comparsionValue < inputValue) {
      searchInputValue(inputValue, row + 1, column * 2 + 1);
    } else {
      searchInputValue(inputValue, row + 1, column * 2);
    }
  }
}

export const CONTROLMENU = [];

function renderTreeHeaderContainer() {
  const treeHeaderContainer = createDivElement();
  treeHeaderContainer.className = `${MODULENAME}__header-container`;

  treeHeaderContainer.appendChild(renderActionContainer());
  treeHeaderContainer.appendChild(renderResultContainer());

  return treeHeaderContainer;
}

function renderActionContainer() {
  const actionContainer = createDivElement();
  actionContainer.className = `${MODULENAME}__action-container`;

  actionContainer.appendChild(renderInputValueContainer());
  actionContainer.appendChild(renderButtonContainer());

  return actionContainer;
}

function renderInputValueContainer() {
  const inputValueContainer = createDivElement();

  const label = createElement("h3");
  label.innerText = "Value";

  const input = createElement("input");
  input.type = "number";
  input.value = 54;
  input.id = TREEINPUTVALUEID;

  inputValueContainer.appendChild(label);
  inputValueContainer.appendChild(input);

  return inputValueContainer;
}

function renderButtonContainer() {
  const buttonContainer = createDivElement();

  const search = document.createElement("input");
  search.type = "button";
  search.value = "Search";
  search.addEventListener("click", searchButtonEventHandler);

  const insert = document.createElement("input");
  insert.type = "button";
  insert.value = "Insert";
  insert.addEventListener("click", inputButtonEventHandler);

  buttonContainer.appendChild(search);
  buttonContainer.appendChild(insert);

  return buttonContainer;
}

function renderResultContainer() {
  const resultContainer = createDivElement();

  const label = createElement("h3");
  label.innerText = "Result";

  const result = createElement("h1");
  result.innerText = "-";

  resultContainer.appendChild(label);
  resultContainer.appendChild(result);

  return resultContainer;
}

function renderTreeMainContainer() {
  const treeMainContainer = createDivElement();
  treeMainContainer.className = `${MODULENAME}__main-container`;

  return treeMainContainer;
}

function renderContentContainer() {
  const container = createDivElement();
  container.className = `${MODULECONTENTCLASS}`;

  container.appendChild(renderTreeHeaderContainer());
  container.appendChild(renderTreeMainContainer());

  return container;
}

export const renderModule = () => {
  const nodeModule = createDivElement();
  nodeModule.className = "module-container";
  nodeModule.appendChild(renderContentContainer());
  renderModuleContent(nodeModule);

  // Add Root Row
  addRowContainer();

  // Add Root Value
  addRootValue();
};

function addRowContainer() {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );

  const rowContainer = createDivElement();
  rowContainer.className = CLASSNAMES.ROW.join(" ");
  rowContainer.dataset.rowNumber = mainContainer.childNodes.length;

  addColumn(rowContainer, mainContainer.childNodes.length);

  mainContainer.appendChild(rowContainer);
}

function addColumn(rowContainer, rowNumber = 0) {
  const length = BINARY ** rowNumber;

  for (let i = 0; i < length; i++) {
    let column = createDivElement();
    column.className = CLASSNAMES.COLUMN.join(" ");

    rowContainer.appendChild(column);
  }
}

function addRootValue() {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );

  const row = mainContainer.childNodes[0];
  const column = row.childNodes[0];
  column.dataset.columnNumber = 0;

  const valueContent = createSpanElement();
  valueContent.innerText = ROOTVALUE;
  valueContent.className = CLASSNAMES.VALUECONTENT.join(" ");
  valueContent.id = ROOTNODEID;
  valueContent.dataset.self = ROOTVALUE;
  valueContent.dataset.smaller = undefined;
  valueContent.dataset.bigger = undefined;

  column.appendChild(valueContent);
}

function addValueContent(inputValue, row, column) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );

  const columnContainer = mainContainer.childNodes[row].childNodes[column];

  const valueContent = createSpanElement();
  valueContent.innerText = inputValue;
  valueContent.className = CLASSNAMES.VALUECONTENT.join(" ");
  valueContent.dataset.self = inputValue;
  valueContent.dataset.smaller = undefined;
  valueContent.dataset.bigger = undefined;

  columnContainer.appendChild(valueContent);
}
