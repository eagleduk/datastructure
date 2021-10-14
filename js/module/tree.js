const MODULENAME = "tree";
const MODULECONTENTCLASS = `module-container__content-${MODULENAME}`;

const BINARY = 2;
const ROOTVALUE = 50;
const ROOTNODEID = "rootNode";
const TREEINPUTVALUEID = `${MODULENAME}_value`;
const CONTENTWIDTH = 50;
const SVGCONTAINERID = "tree-SVG";
const RESULTTEXTID = "resultText";

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
  const input = document.getElementById(TREEINPUTVALUEID);
  const { value: inputValue } = input;
  insertInputValue(inputValue, 0, 0);
  input.value = getRandomValue();
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

    if (parseInt(comparsionValue) < parseInt(inputValue)) {
      insertInputValue(inputValue, row + 1, column * 2 + 1);
    } else {
      insertInputValue(inputValue, row + 1, column * 2);
    }
  } else {
    addValueContent(inputValue, row, column);

    connectContents(row, column);
  }
}

const searchButtonEventHandler = (e) => {
  const { value: inputValue } = document.getElementById(TREEINPUTVALUEID);
  const searchResult = searchInputValue(inputValue, 0, 0);

  document.getElementById(RESULTTEXTID).innerText = `Value[${inputValue}] is ${
    searchResult ? "" : "not"
  } found`;
};

function searchInputValue(inputValue, row, column) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );
  const rowContainers = mainContainer.childNodes;
  const columnContainer = rowContainers[row].childNodes[column];
  const comparsionContent = columnContainer?.childNodes[0];
  if (comparsionContent) {
    const { self: comparsionValue } = comparsionContent.dataset;

    if (comparsionValue === inputValue) {
      return true;
    } else {
      if (rowContainers.length <= row + 1) {
        return false;
      }
      if (parseInt(comparsionValue) < parseInt(inputValue)) {
        searchInputValue(inputValue, row + 1, column * 2 + 1);
      } else {
        searchInputValue(inputValue, row + 1, column * 2);
      }
    }
  } else {
    return false;
  }
}

export const CONTROLMENU = [];

function renderSVGContainer() {
  const svg = document.createElementNS(NSADDRESS, "svg");
  svg.id = SVGCONTAINERID;

  return svg;
}

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
  result.id = RESULTTEXTID;

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

  container.appendChild(renderSVGContainer());
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
    column.dataset.columnNumber = i;

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
  valueContent.dataset.parent = undefined;

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
  valueContent.dataset.parent = undefined;

  columnContainer.appendChild(valueContent);

  return columnContainer;
}

function connectContents(row, column) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );

  const parentRow = row - 1;
  const parentColumn = parseInt(column / 2);
  const childState = column % 2;

  const parentNode =
    mainContainer.childNodes[parentRow].childNodes[parentColumn].childNodes[0];
  const childNode =
    mainContainer.childNodes[row].childNodes[column].childNodes[0];

  if (childState) {
    parentNode.dataset.bigger = childNode.dataset.self;
  } else {
    parentNode.dataset.smaller = childNode.dataset.self;
  }

  childNode.dataset.parent = parentNode.dataset.self;

  const { offsetLeft: fromLeft, offsetTop: formTop } = parentNode;
  const { offsetLeft: toLeft, offsetTop: toTop } = childNode;

  const svgPallet = document.getElementById(SVGCONTAINERID);

  const line = document.createElementNS(NSADDRESS, "line");

  line.setAttribute("x1", fromLeft + CONTENTWIDTH / 2);
  line.setAttribute("y1", formTop + CONTENTWIDTH / 2);
  line.setAttribute("x2", toLeft + CONTENTWIDTH / 2);
  line.setAttribute("y2", toTop + CONTENTWIDTH / 2);

  line.style.stroke = "black";
  line.style.strokeWidth = 5;
  line.style.strokeOpacity = 1;
  svgPallet.appendChild(line);
}
