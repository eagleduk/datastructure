const MODULENAME = "heap";
const MODULECONTENTCLASS = `module-container__content-${MODULENAME}`;

const BINARY = 2;
const ROOTVALUE = 50;
const ROOTNODEID = "rootNode";
const HEAPINPUTVALUEID = `${MODULENAME}_value`;
const CONTENTWIDTH = 50;
const SVGCONTAINERID = `${MODULENAME}-SVG`;
const RESULTTEXTID = "resultText";

const CLASSNAMES = {
  ROW: [`${MODULENAME}__row-container`],
  COLUMN: [`${MODULENAME}__column-container`],
  VALUECONTENT: [`${MODULENAME}__value-container`],
};

const insertButtonEventHandler = (e) => {
  const input = document.getElementById(HEAPINPUTVALUEID);
  const { value } = input;
  const { row, column } = pushInputValue(value, 0, 0);
  connectContents(row, column);
  compareToParent(row, column);
  console.log(row, column);
  input.value = getRandomValue();
};

function pushInputValue(value) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );
  const rowCounter = mainContainer.childNodes.length;
  const childNodes = mainContainer.lastChild.childNodes;
  const ll = childNodes.length;

  for (let columnIndex = 0; columnIndex < ll; columnIndex++) {
    if (!childNodes[columnIndex].hasChildNodes()) {
      addValueContent(value, rowCounter - 1, columnIndex);
      return { row: rowCounter - 1, column: columnIndex };
    }
  }
  addRowContainer();

  addValueContent(value, rowCounter, 0);
  return { row: rowCounter, column: 0 };
}

export const CONTROLMENU = [];

function renderHeapSVGContainer() {
  const svg = document.createElementNS(NSADDRESS, "svg");
  svg.id = SVGCONTAINERID;

  return svg;
}

function renderHeapHeaderContainer() {
  const heapHeaderContainer = createDivElement();
  heapHeaderContainer.className = `${MODULENAME}__header-container`;

  heapHeaderContainer.appendChild(renderHeapActionContainer());
  heapHeaderContainer.appendChild(renderHeapResultContainer());

  return heapHeaderContainer;
}
function renderHeapResultContainer() {
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

function renderHeapInputValueContainer() {
  const inputValueContainer = createDivElement();

  const label = createElement("h3");
  label.innerText = "Value";

  const input = createElement("input");
  input.type = "number";
  input.value = getRandomValue();
  input.id = HEAPINPUTVALUEID;

  inputValueContainer.appendChild(label);
  inputValueContainer.appendChild(input);

  return inputValueContainer;
}

function renderHeapButtonContainer() {
  const buttonContainer = createDivElement();

  const search = document.createElement("input");
  search.type = "button";
  search.value = "Insert";
  search.addEventListener("click", insertButtonEventHandler);

  const insert = document.createElement("input");
  insert.type = "button";
  insert.value = "Pop";
  //insert.addEventListener("click", inputButtonEventHandler);

  //const del = document.createElement("input");
  //del.type = "button";
  //del.value = "Delete";
  //del.addEventListener("click", deleteButtonEventHandler);

  buttonContainer.appendChild(search);
  buttonContainer.appendChild(insert);
  //   buttonContainer.appendChild(del);

  return buttonContainer;
}

function renderHeapActionContainer() {
  const actionContainer = createDivElement();
  actionContainer.className = `${MODULENAME}__action-container`;

  actionContainer.appendChild(renderHeapInputValueContainer());
  actionContainer.appendChild(renderHeapButtonContainer());

  return actionContainer;
}

function renderHeapMainContainer() {
  const heapMainContainer = createDivElement();
  heapMainContainer.className = `${MODULENAME}__main-container`;

  return heapMainContainer;
}

function renderHeapContentContainer() {
  const container = createDivElement();
  container.className = `${MODULECONTENTCLASS}`;

  container.appendChild(renderHeapSVGContainer());
  container.appendChild(renderHeapHeaderContainer());
  container.appendChild(renderHeapMainContainer());

  return container;
}

export const renderModule = () => {
  const nodeModule = createDivElement();
  nodeModule.className = "module-container";
  nodeModule.appendChild(renderHeapContentContainer());
  renderModuleContent(nodeModule);

  // Add Root Row
  addRowContainer();

  // Add Root Value
  addValueContent(ROOTVALUE, 0, 0);
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

function addValueContent(inputValue, row, column) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );

  const columnContainer = mainContainer.childNodes[row].childNodes[column];

  const valueContent = createSpanElement();
  valueContent.className = CLASSNAMES.VALUECONTENT.join(" ");
  valueContent.dataset.value = inputValue;

  columnContainer.appendChild(valueContent);

  return columnContainer;
}
function connectContents(row, column) {
  const parentRow = row - 1;
  const parentColumn = parseInt(column / 2);

  const parentNode = getContent(parentRow, parentColumn);
  const childNode = getContent(row, column);

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
  line.id = `${parentRow}_${parentColumn}-${row}_${column}`;
  svgPallet.appendChild(line);
}

function getContent(row, column) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );
  return mainContainer?.childNodes[row]?.childNodes[column]?.childNodes[0];
}

function compareToParent(row, column) {
  const parentRow = row - 1;
  const parentColumn = parseInt(column / 2);

  const parentNode = getContent(parentRow, parentColumn);
  const childNode = getContent(row, column);

  if (
    parentNode &&
    parseInt(parentNode.dataset.value) < parseInt(childNode.dataset.value)
  ) {
    changeContent(parentNode, childNode);
    compareToParent(parentRow, parentColumn);
  }
}

function changeContent(target, source) {
  const temp = target.dataset.value;
  target.dataset.value = source.dataset.value;
  source.dataset.value = temp;
  return source;
}
