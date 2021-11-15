const MODULE = "tree";

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
  const searchResult = searchTreeData(inputValue, 0, 0);

  console.log(inputValue, " +++ ", searchResult);
  if (!searchResult) errorNotification("Value is not found");
};

function searchTreeData(inputValue, row, column) {
  const mainContainer = document.querySelector(`.${MODULECONTENTCLASS}`);
  const rowContainers = mainContainer.childNodes;
  const comparsionContent = getContent(row, column);

  if (comparsionContent) {
    const { value: comparsionValue } = comparsionContent.dataset;

    if (comparsionValue === String(inputValue)) {
      return { row, column };
    } else {
      if (rowContainers.length <= row + 1) {
        return false;
      }
      if (parseInt(comparsionValue) < parseInt(inputValue)) {
        return searchTreeData(inputValue, row + 1, column * 2 + 1);
      } else {
        return searchTreeData(inputValue, row + 1, column * 2);
      }
    }
  }
  return false;
}

const insertEventHandler = (e) => {
  e.preventDefault();
  const { insertValue } = e.target;
  const inputValue = insertValue.value;
  insertInputValue(inputValue, 0, 0);
  insertValue.value = getRandomValue();
};

function insertInputValue(inputValue, row, column) {
  const mainContainer = document.querySelector(`.${MODULECONTENTCLASS}`);

  // 비교 값 추출
  const rowContainers = mainContainer.childNodes;
  const comparsionContent = getContent(row, column);
  if (comparsionContent) {
    const { value: comparsionValue } = comparsionContent.dataset;

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

const deleteEventHandler = (e) => {
  e.preventDefault();
  const { value: inputValue } = e.target.deleteValue;
  const searchResult = searchTreeData(inputValue, 0, 0);

  if (searchResult) {
    deleteContent(searchResult);
  } else {
    console.log("Value is not found");
    notification("Value is not found");
  }
};

function deleteContent({ row, column }) {
  let deleteContent = getContent(row, column);

  let smaller = getContent(row + 1, column * 2);
  let bigger = getContent(row + 1, column * 2 + 1);

  // case 1: child node 두개 => 작은 child node 중 제일 큰수와 자리 변경
  /**
   *  본인과 본인보다 작은 자식들중 큰 수와 dataset.value 값 변경
   */
  if (smaller && bigger) {
    const changeNode = getChildNodeBigOfSmall(row + 1, column * 2);
    //const changeNode = getLeafChildNode(row + 1, column * 2, 1);
    deleteContent = changeContent(deleteContent, changeNode.sourceContent);
    row = changeNode.row;
    column = changeNode.column;
  }

  // case 2: child node 한개 => case 1 ==> 자식이 있을 때, 부모와 최하위 자식과 자리 변경
  /**
   *  본인과 최 하위 자식의 dataset.value 값 변경
   */
  smaller = getContent(row + 1, column * 2);
  bigger = getContent(row + 1, column * 2 + 1);
  while (smaller || bigger) {
    let childType = 0;
    if (bigger) childType = 1;
    row += 1;
    column = column * 2 + childType;
    let changeNode = getContent(row, column);
    deleteContent = changeContent(deleteContent, changeNode);
    smaller = getContent(row + 1, column * 2);
    bigger = getContent(row + 1, column * 2 + 1);
  }

  // case 3: child node 없을 때 => case 2 ==> 최하위 자식 삭제
  /**
   *  본인과 연결선 삭제
   */
  const deleteLine = document.querySelector(`[id*='${row}_${column}']`);
  deleteLine.remove();
  deleteContent.remove();
}

function getChildNodeBigOfSmall(row, column) {
  const sourceContent = getContent(row, column);
  const biggerChild = getContent(row + 1, column * 2 + 1);
  if (biggerChild) return getChildNodeBigOfSmall(row + 1, column * 2 + 1);
  return {
    sourceContent,
    row,
    column,
  };
}

function changeContent(target, source) {
  const temp = target.dataset.value;
  target.dataset.value = source.dataset.value;
  source.dataset.value = temp;
  return source;
}

function renderSVGContainer() {
  const svg = document.createElementNS(NSADDRESS, "svg");
  svg.classList.add(MODULESVGCLASS);
  // svg.id = SVGCONTAINERID;

  svg.addEventListener("dragover", contentDragoverEventHandler);
  svg.addEventListener("drop", contentDropEventHandler);

  return svg;
}

function renderControlTree() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.draggable = true;
  toolbar.addEventListener("dragstart", controlPanelDragStartEventHandler);
  toolbar.addEventListener("drag", (e) => {});

  const controller = document.createElement("div");

  const row1 = document.createElement("form");
  row1.addEventListener("submit", searchEventHandler);

  const index = document.createElement("input");
  index.type = "number";
  index.placeholder = "input array index";
  index.name = "searchValue";
  index.required = true;

  const search = document.createElement("input");
  search.type = "submit";
  search.className = "search";
  search.value = "search";

  row1.appendChild(index);
  row1.appendChild(search);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", insertEventHandler);

  const value = document.createElement("input");
  value.type = "number";
  value.placeholder = "input array value";
  value.value = getRandomValue();
  value.name = "insertValue";
  value.required = true;

  const insert = document.createElement("input");
  insert.type = "submit";
  insert.className = "insert";
  insert.value = "insert";

  row2.appendChild(value);
  row2.appendChild(insert);

  const row3 = document.createElement("form");
  row3.addEventListener("submit", deleteEventHandler);

  const value1 = document.createElement("input");
  value1.type = "number";
  value1.placeholder = "input array value";
  value1.value = getRandomValue();
  value1.name = "deleteValue";
  value1.required = true;

  const del = document.createElement("input");
  del.type = "submit";
  del.className = "delete";
  del.value = "delete";

  row3.appendChild(value1);
  row3.appendChild(del);

  controller.appendChild(row1);
  controller.appendChild(row2);
  controller.appendChild(row3);

  const controlPanel = document.createElement("div");
  controlPanel.className = `${MODULECONTROLCLASS} content-control`;
  controlPanel.appendChild(toolbar);
  controlPanel.appendChild(controller);
  return controlPanel;
}

function renderContentTree() {
  const moduleContent = document.createElement("div");
  moduleContent.className = MODULECONTENTCLASS;
  // moduleContent.addEventListener("dragover", contentDragoverEventHandler);
  // moduleContent.addEventListener("drop", contentDropEventHandler);

  return moduleContent;
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
  const childState = column % 2;

  const parentNode = getContent(parentRow, parentColumn);
  const childNode = getContent(row, column);

  childNode.dataset.type = childState;

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

export const renderModule = () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderSVGContainer());
  nodeModule.appendChild(renderControlTree());
  nodeModule.appendChild(renderContentTree());

  renderModuleContent(nodeModule);

  // Add Root Row
  addRowContainer();

  // Add Root Value
  addValueContent(ROOTVALUE, 0, 0);
};
