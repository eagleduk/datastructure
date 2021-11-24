const CONTENTWIDTH = 60;

const MODULE = "linkedlist";
const SVGID = `${MODULE}-svg`;

const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;
const MODULESVGCLASS = `module-container__canvas-${MODULE}`;

let SEQ = 0;

const searchEventHandler = async (e) => {
  e.preventDefault();
  clearContentSelected();
  e.target.search.disabled = true;
  const {
    target: {
      searchValue: { value },
    },
  } = e;
  await searchContent(value);

  e.target.search.disabled = false;
};

async function searchContent(value) {
  const moduleContent = document.querySelector(`div.${MODULECONTENTCLASS}`);

  const childNodes = moduleContent.childNodes;

  for (let index = 0; index < childNodes.length; index++) {
    let node = childNodes[index];
    node.classList.add("search-value");
    await _promiseTimeout(1000, () => node.classList.remove("search-value"));

    if (node.dataset.value === value) {
      node.classList.add("selected-value");

      await _promiseTimeout(
        3000,
        () => (node.className = "linkedlist__content-value value-content")
      );
      return;
    } else {
    }
  }

  errorNotification(`Value[${value}] is not found.`);
}

const clearContentSelected = () => {
  // 선택 초기화
  document
    .querySelector("div.linkedlist__content-value.selected")
    ?.classList.remove("selected");
};

const backgroundClickEventHandler = (e) => {
  clearContentSelected();
};

const contentSelectEventHandler = (e) => {
  e.stopPropagation();
  clearContentSelected();
  e.target.classList.add("selected");
};

const prevInsertContentEvent = (e) => {
  e.stopPropagation();
  const selectedContent = document.querySelector(
    "div.linkedlist__content-value.selected"
  );

  if (!selectedContent) return;

  const {
    dataset: { prev: prevContentID },
    id: currentContentID,
  } = selectedContent;

  deleteLine(prevContentID, currentContentID);
  insertContentBefore(prevContentID, currentContentID);
};

const nextInsertContentEvent = (e) => {
  e.stopPropagation();
  const selectedContent = document.querySelector(
    "div.linkedlist__content-value.selected"
  );

  if (!selectedContent) return;

  const {
    dataset: { next: nextContentID },
    id: currentContentID,
  } = selectedContent;

  deleteLine(currentContentID, nextContentID);
  insertContentAfter(currentContentID, nextContentID);
};

const deleteContentEvent = (e) => {
  e.stopPropagation();
  const selectedContent = document.querySelector(
    "div.linkedlist__content-value.selected"
  );

  if (!selectedContent) return;

  const {
    dataset: { prev: prevContentID, next: nextContentID },
    id: currentContentID,
  } = selectedContent;

  deleteLine(prevContentID, currentContentID);
  deleteLine(currentContentID, nextContentID);

  if (prevContentID && nextContentID)
    renderContentConnection(
      prevContentID.replace(MODULE, ""),
      nextContentID.replace(MODULE, "")
    );

  selectedContent.remove();

  const resetMenu = document.querySelectorAll(
    "article span.control-abled:not(.render)"
  );
  resetMenu.forEach((menu) => menu.classList.add("control-disabled"));
};

// 연결된 라인 삭제
function deleteLine(fromID, toID) {
  const deleteLineID = `${fromID}--${toID}`;
  const deleteLine = document.querySelector(`line#${deleteLineID}`);
  deleteLine?.remove();
}

// 새로운 컨텐츠 추가 - Prev
function insertContentBefore(prevContentID, currentContentID) {
  const moduleContainer = document.querySelector(`div.${MODULECONTENTCLASS}`);
  const { clientWidth, clientHeight } = moduleContainer;

  const valueContent = createValueContent(
    getRandomValue(clientHeight - CONTENTWIDTH),
    getRandomValue(clientWidth - CONTENTWIDTH)
  );
  document.querySelector(`#${currentContentID}`).before(valueContent);

  // 라인 추가
  const newContentID = valueContent.id;
  renderContentConnection(
    prevContentID?.replace(MODULE, ""),
    newContentID?.replace(MODULE, ""),
    currentContentID?.replace(MODULE, "")
  );
}

// 새로운 컨텐츠 추가 - Next
function insertContentAfter(prevContentID, currentContentID) {
  const moduleContainer = document.querySelector(`div.${MODULECONTENTCLASS}`);
  const { clientWidth, clientHeight } = moduleContainer;
  const valueContent = createValueContent(
    getRandomValue(clientHeight - CONTENTWIDTH),
    getRandomValue(clientWidth - CONTENTWIDTH)
  );
  document.querySelector(`#${prevContentID}`).after(valueContent);

  // 라인 추가
  const newContentID = valueContent.id;
  renderContentConnection(
    prevContentID?.replace(MODULE, ""),
    newContentID?.replace(MODULE, ""),
    currentContentID?.replace(MODULE, "")
  );
}

function renderConnection(prev, next) {
  // const svg = document.querySelector(`svg#${SVGID}`);
  const svg = document.querySelector(`svg.${MODULESVGCLASS}`);
  const { offsetLeft: fromLeft, offsetTop: formTop, id: fromId } = prev;
  const { offsetLeft: toLeft, offsetTop: toTop, id: toId } = next;

  const lineId = `${fromId}--${toId}`;
  if (document.querySelector(`line#${lineId}`)) {
    return;
  }
  const color = getRandomColor();
  const line = document.createElementNS(NSADDRESS, "line");

  line.setAttribute("x1", fromLeft + CONTENTWIDTH / 2);
  line.setAttribute("y1", formTop + CONTENTWIDTH / 2);

  line.setAttribute("x2", toLeft + CONTENTWIDTH / 2);
  line.setAttribute("y2", toTop + CONTENTWIDTH / 2);

  line.style.stroke = "url(#TEST)";
  line.style.strokeWidth = 5;
  line.style.strokeOpacity = 1;
  line.id = lineId;
  line.dataset.color = color;

  svg.appendChild(line);
}

function renderContentConnection(prev, current, next) {
  const currentContent = document.querySelector(`div#${MODULE}${current}`);

  const prevContent = document.querySelector(`div#${MODULE}${prev}`);
  if (prevContent) {
    currentContent.dataset.prev = `${MODULE}${prev}`;
    prevContent.dataset.next = `${MODULE}${current}`;
    renderConnection(prevContent, currentContent);
  }

  const nextContent = document.querySelector(`div#${MODULE}${next}`);
  if (nextContent) {
    currentContent.dataset.next = `${MODULE}${next}`;
    nextContent.dataset.prev = `${MODULE}${current}`;
    renderConnection(currentContent, nextContent);
  }
}

function renderControlLinkedList() {
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
  index.placeholder = "Search Value";
  index.name = "searchValue";
  index.required = true;

  const search = document.createElement("input");
  search.type = "submit";
  search.className = "search";
  search.value = "search";
  search.name = "search";

  row1.appendChild(index);
  row1.appendChild(search);

  controller.appendChild(row1);

  const controlPanel = document.createElement("div");
  controlPanel.className = `${MODULECONTROLCLASS} content-control`;
  controlPanel.appendChild(toolbar);
  controlPanel.appendChild(controller);
  return controlPanel;
}

function renderContentLinkedList() {
  const container = document.createElement("div");
  container.className = `${MODULECONTENTCLASS}`;
  //container.addEventListener("click", backgroundClickEventHandler);
  return container;
}

function renderDefaultContent() {
  const moduleContainer = document.querySelector(`div.${MODULECONTENTCLASS}`);

  const { clientWidth, clientHeight } = moduleContainer;

  const top = (clientHeight - CONTENTWIDTH) / 2;
  const left = (clientWidth - CONTENTWIDTH) / 2;
  const valueContent = createValueContent(top, left);

  moduleContainer.appendChild(valueContent);
}

function createValueContent(top, left) {
  const valueContent = document.createElement("div");
  valueContent.className = "linkedlist__content-value value-content";
  valueContent.addEventListener("click", contentSelectEventHandler);
  valueContent.id = `${MODULE}${SEQ++}`;

  valueContent.style.top = top + "px";
  valueContent.style.left = left + "px";
  valueContent.dataset.value = getRandomValue();

  const prev = document.createElement("input");
  prev.type = "button";
  prev.className = "insert";
  prev.value = "prev";
  prev.addEventListener("click", prevInsertContentEvent);

  const del = document.createElement("input");
  del.type = "button";
  del.className = "delete";
  del.value = "del";
  del.addEventListener("click", deleteContentEvent);

  const next = document.createElement("input");
  next.type = "button";
  next.className = "insert";
  next.value = "next";
  next.addEventListener("click", nextInsertContentEvent);

  valueContent.appendChild(prev);
  valueContent.appendChild(del);
  valueContent.appendChild(next);

  return valueContent;
}

function renderSVGContainer() {
  const svg = document.createElementNS(NSADDRESS, "svg");
  // svg.id = SVGID;
  svg.classList.add(MODULESVGCLASS);

  svg.addEventListener("dragover", contentDragoverEventHandler);
  svg.addEventListener("drop", contentDropEventHandler);
  svg.addEventListener("click", backgroundClickEventHandler);

  const linearGradient = document.createElementNS(NSADDRESS, "linearGradient");
  linearGradient.id = "TEST";
  linearGradient.setAttribute("x1", "0%");
  linearGradient.setAttribute("y1", "0%");
  linearGradient.setAttribute("x2", "100%");
  linearGradient.setAttribute("y2", "100%");

  const stop1 = document.createElementNS(NSADDRESS, "stop");
  stop1.setAttribute("offset", "0%");

  const stop2 = document.createElementNS(NSADDRESS, "stop");
  stop2.setAttribute("offset", "100%");

  linearGradient.appendChild(stop1);
  linearGradient.appendChild(stop2);

  svg.appendChild(linearGradient);

  return svg;
}

export const renderModule = () => {
  SEQ = 0;
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderSVGContainer());
  nodeModule.appendChild(renderControlLinkedList());
  nodeModule.appendChild(renderContentLinkedList());

  renderModuleContent(nodeModule);

  renderDefaultContent();
};
