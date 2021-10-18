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
  const comparsionContent = getContent(row, column);
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
  const comparsionContent = getContent(row, column);

  if (comparsionContent) {
    const { self: comparsionValue } = comparsionContent.dataset;

    if (comparsionValue === String(inputValue)) {
      return { row, column };
    } else {
      if (rowContainers.length <= row + 1) {
        return false;
      }
      if (parseInt(comparsionValue) < parseInt(inputValue)) {
        return searchInputValue(inputValue, row + 1, column * 2 + 1);
      } else {
        return searchInputValue(inputValue, row + 1, column * 2);
      }
    }
  }
  return false;
}

const deleteButtonEventHandler = (e) => {
  const { value: inputValue } = document.getElementById(TREEINPUTVALUEID);
  const searchResult = searchInputValue(inputValue, 0, 0);

  if (searchResult) {
    deleteContent(searchResult);
  } else {
    document.getElementById(
      RESULTTEXTID
    ).innerText = `Value[${inputValue}] is not found`;
  }
};

function deleteContent({ row, column }) {
  let deleteContent = getContent(row, column);

  let smaller = getContent(row + 1, column * 2);
  let bigger = getContent(row + 1, column * 2 + 1);

  // case 1: child node 두개 => 작은 child node 중 제일 큰수와 자리 변경
  /**
   *  본인과 본인보다 작은 자식들중 큰 수와 dataset.self 값 변경
   */
  //console.log("변경전 ", deleteContent, row, column);
  if (smaller && bigger) {
    const changeNode = getChildNodeBigOfSmall(row + 1, column * 2);
    //const changeNode = getLeafChildNode(row + 1, column * 2, 1);
    deleteContent = changeContent(deleteContent, changeNode.sourceContent);
    row = changeNode.row;
    column = changeNode.column;
  }
  //console.log("변경후 ", deleteContent, row, column);

  // case 2: child node 한개 => case 1 ==> 자식이 있을 때, 부모와 최하위 자식과 자리 변경
  /**
   *  본인과 최 하위 자식의 dataset.self 값 변경
   */
  smaller = getContent(row + 1, column * 2);
  bigger = getContent(row + 1, column * 2 + 1);
  //console.log("변경전 ", deleteContent, row, column);
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
  //console.log("변경후 ", deleteContent, row, column);

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

function getLeafChildNode(row, column, childType) {
  const sourceContent = getContent(row, column + childType);
  const childNode = getContent(row + 1, column * 2 + childType);
  if (childNode) return getLeafChildNode(row + 1, column * 2, childType);
  return {
    sourceContent,
    row,
    column,
  };
}

function changeContent(target, source) {
  const temp = target.dataset.self;
  target.dataset.self = source.dataset.self;
  source.dataset.self = temp;
  return source;
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

  const del = document.createElement("input");
  del.type = "button";
  del.value = "Delete";
  del.addEventListener("click", deleteButtonEventHandler);

  buttonContainer.appendChild(search);
  buttonContainer.appendChild(insert);
  buttonContainer.appendChild(del);

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
  //valueContent.innerText = ROOTVALUE;
  valueContent.className = CLASSNAMES.VALUECONTENT.join(" ");
  valueContent.id = ROOTNODEID;
  valueContent.dataset.self = ROOTVALUE;

  column.appendChild(valueContent);
}

function addValueContent(inputValue, row, column) {
  const mainContainer = document.querySelector(
    `.${MODULENAME}__main-container`
  );

  const columnContainer = mainContainer.childNodes[row].childNodes[column];

  const valueContent = createSpanElement();
  //valueContent.innerText = inputValue;
  valueContent.className = CLASSNAMES.VALUECONTENT.join(" ");
  valueContent.dataset.self = inputValue;

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

  /*
  if (childState) {
    parentNode.dataset.bigger = childNode.dataset.self;
  } else {
    parentNode.dataset.smaller = childNode.dataset.self;
  }

  childNode.dataset.parent = parentNode.dataset.self;
  */

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
