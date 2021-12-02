const MODULE = "heap";

const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;
const MODULESVGCLASS = `module-container__canvas-${MODULE}`;

const BINARY = 2;
const ROOTVALUE = 50;
const CONTENTWIDTH = 60;
// const SVGCONTAINERID = `${MODULE}-SVG`;

const CLASSNAMES = {
  ROW: [`${MODULE}__row-container`],
  COLUMN: [`${MODULE}__column-container`],
  VALUECONTENT: [`value-content`],
};

const searchEventHandler = (e) => {
  e.preventDefault();
  const { value: inputValue } = e.target.searchValue;
  const searchResult = searchHeapData(inputValue, 0, 0);

  if (!searchResult) errorNotification(`Value[${inputValue}] is not found`);
};

function searchHeapData(inputValue, row, column) {
  const mainContainer = document.querySelector(`.${MODULECONTENTCLASS}`);
  let result = false;
  mainContainer.childNodes.forEach((row) => {
    row.childNodes.forEach((column) => {
      result = column.childNodes[0].dataset.value === String(inputValue);
    });
  });

  return result;
}

const insertEventHandler = async (e) => {
  e.preventDefault();
  e.target.insert.disabled = true;
  const { insertValue } = e.target;
  const inputValue = insertValue.value;
  const { row, column } = pushInputValue(inputValue, 0, 0);
  if (row !== 0) {
    connectContents(row, column);
    await compareToParent(row, column);
  }
  insertValue.value = getRandomValue();
  e.target.insert.disabled = false;
};

function pushInputValue(value) {
  const mainContainer = document.querySelector(`.${MODULECONTENTCLASS}`);
  const rowCounter = mainContainer.childNodes.length;
  if (rowCounter === 0) {
    // Add Root Row
    addRowContainer();

    // Add Root Value
    addValueContent(value, 0, 0);
    return { row: 0, column: 0 };
  } else {
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
}

const popEventHandler = async (e) => {
  e.preventDefault();
  e.target.pop.disabled = true;

  const deleteContent = getLastValue();

  if (deleteContent) {
    await changeRootContent(deleteContent);
    // 5. sort
    await sortHeap(0, 0);
  } else {
    notification("Value is not found");
  }
  e.target.pop.disabled = false;
};

function getLastValue() {
  const mainContainer = document.querySelector(`.${MODULECONTENTCLASS}`);

  const rowIndex = mainContainer.childNodes.length - 1;
  if (rowIndex < 0) return false;

  const columns = mainContainer.childNodes[rowIndex].childNodes;
  for (let columnIndex = columns.length - 1; columnIndex >= 0; columnIndex--) {
    let column = columns[columnIndex];
    if (column.hasChildNodes()) {
      let value = column.childNodes[0].dataset.value;
      return {
        column: columnIndex,
        row: rowIndex,
        value,
      };
    }
  }
  return false;
}

async function changeRootContent({ row, column, value }) {
  // 1. root Value 삭제
  const rootContent = getContent(0, 0);
  rootContent.classList.add("delete-value");
  rootContent.dataset.value = "";
  await _promiseTimeout(2000);

  // 2. 마지막 값 focus
  const deleteContent = getContent(row, column);
  deleteContent.classList.add("selected-value");
  await _promiseTimeout(2000);

  // 3. 마지막 값 root 로 이동
  rootContent.dataset.value = value;

  // 4. 마지막 node 삭제
  const deleteLine = document.querySelector(`[id*='${row}_${column}']`);
  if (deleteLine) deleteLine.remove();
  if (column === 0) {
    deleteContent.parentNode.parentNode.remove();
  }
  deleteContent.remove();
  rootContent.classList.remove("delete-value");
}

async function sortHeap(row, column) {
  const content = getContent(row, column);
  if (!content) return;

  const value = content.dataset.value;
  const child1 = getContent(row + 1, column * 2);
  const child2 = getContent(row + 1, column * 2 + 1);

  if (child1 && child2) {
    const value1 = child1.dataset.value;
    const value2 = child2.dataset.value;

    if (
      parseInt(value1) < parseInt(value2) &&
      parseInt(value) < parseInt(value2)
    ) {
      // 2 와 바꿈
      await changeContent(content, child2);
      sortHeap(row + 1, column * 2 + 1);
    } else if (
      parseInt(value2) < parseInt(value1) &&
      parseInt(value) < parseInt(value1)
    ) {
      // 1 과 바꿈
      await changeContent(content, child1);
      sortHeap(row + 1, column * 2);
    }
  } else if (child1 || child2) {
    if (child1) {
      const value1 = child1.dataset.value;
      if (parseInt(value) < parseInt(value1)) {
        // 1과 바꿈
        await changeContent(content, child1);
        sortHeap(row + 1, column * 2);
      }
    } else {
      const value2 = child2.dataset.value;
      if (parseInt(value) < parseInt(value2)) {
        // 2와 바꿈
        await changeContent(content, child2);
        sortHeap(row + 1, column * 2 + 1);
      }
    }
  }
}

async function changeContent(target, source) {
  target.classList.add("change-value");
  source.classList.add("change-value");
  await _promiseTimeout(2000);

  const temp = target.dataset.value;
  target.dataset.value = source.dataset.value;
  source.dataset.value = temp;

  target.classList.remove("change-value");
  source.classList.remove("change-value");

  return source;
}

function renderSVGContainer() {
  const svg = document.createElementNS(NSADDRESS, "svg");
  // svg.id = SVGCONTAINERID;
  svg.classList.add(MODULESVGCLASS);
  svg.addEventListener("dragover", contentDragoverEventHandler);
  svg.addEventListener("drop", contentDropEventHandler);

  return svg;
}

function renderControlHeap() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.draggable = true;
  toolbar.addEventListener("dragstart", controlPanelDragStartEventHandler);
  toolbar.addEventListener("drag", (e) => {});

  const controller = document.createElement("div");

  const row2 = document.createElement("form");
  row2.addEventListener("submit", insertEventHandler);

  const value = document.createElement("input");
  value.type = "number";
  value.placeholder = "Insert Value";
  value.value = getRandomValue();
  value.name = "insertValue";
  value.required = true;

  const insert = document.createElement("input");
  insert.type = "submit";
  insert.className = "insert";
  insert.value = "insert";
  insert.name = "insert";

  row2.appendChild(value);
  row2.appendChild(insert);

  const row3 = document.createElement("form");
  row3.addEventListener("submit", popEventHandler);

  const pop = document.createElement("input");
  pop.type = "submit";
  pop.className = "delete";
  pop.value = "pop";
  pop.name = "pop";

  row3.appendChild(pop);

  controller.appendChild(row2);
  controller.appendChild(row3);

  const controlPanel = document.createElement("div");
  controlPanel.className = `${MODULECONTROLCLASS} content-control`;
  controlPanel.appendChild(toolbar);
  controlPanel.appendChild(controller);
  return controlPanel;
}

function renderContentHeap() {
  const container = document.createElement("div");
  container.className = `${MODULECONTENTCLASS}`;
  // container.addEventListener("dragover", contentDragoverEventHandler);
  // container.addEventListener("drop", contentDropEventHandler);

  return container;
}

function addRowContainer() {
  const mainContainer = document.querySelector(`.${MODULECONTENTCLASS}`);

  const rowContainer = document.createElement("div");
  rowContainer.className = CLASSNAMES.ROW.join(" ");
  rowContainer.dataset.rowNumber = mainContainer.childNodes.length;

  addColumn(rowContainer, mainContainer.childNodes.length);

  mainContainer.appendChild(rowContainer);
}

function addColumn(rowContainer, rowNumber = 0) {
  const length = BINARY ** rowNumber;

  for (let i = 0; i < length; i++) {
    let column = document.createElement("div");
    column.className = CLASSNAMES.COLUMN.join(" ");
    column.dataset.columnNumber = i;

    rowContainer.appendChild(column);
  }
}

function addValueContent(inputValue, row, column) {
  const mainContainer = document.querySelector(`.${MODULECONTENTCLASS}`);

  const columnContainer = mainContainer.childNodes[row].childNodes[column];

  const valueContent = document.createElement("div");
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

  // const svgPallet = document.getElementById(SVGCONTAINERID);
  const svgPallet = document.querySelector(`svg.${MODULESVGCLASS}`);

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
  const mainContainer = document.querySelector(`.${MODULECONTENTCLASS}`);
  return mainContainer?.childNodes[row]?.childNodes[column]?.childNodes[0];
}

async function compareToParent(row, column) {
  const parentRow = row - 1;
  const parentColumn = parseInt(column / 2);

  const parentNode = getContent(parentRow, parentColumn);
  const childNode = getContent(row, column);

  if (
    parentNode &&
    parseInt(parentNode.dataset.value) < parseInt(childNode.dataset.value)
  ) {
    await changeContent(parentNode, childNode);
    compareToParent(parentRow, parentColumn);
  }
}

export default () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderSVGContainer());
  nodeModule.appendChild(renderControlHeap());
  nodeModule.appendChild(renderContentHeap());
  renderModuleContent(nodeModule);

  // Add Root Row
  addRowContainer();

  // Add Root Value
  addValueContent(ROOTVALUE, 0, 0);
};
