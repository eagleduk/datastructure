const CONTENTWIDTH = 60;
const MODULE = "linkedlist";
const CONTENTID = "linkedlist_";
const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;

let SEQ = 0;

const linkedlistRenderEvent = (e) => {
  SEQ = 0;
  const svg = document.querySelector("svg#line-svg");
  while (svg.hasChildNodes()) svg.removeChild(svg.firstChild);
  renderContent();
};

const backgroundClickEventHandler = (e) => {
  // 선택 초기화
  document
    .querySelector("div.linkedlist__content-value.selected")
    ?.classList.remove("selected");
  console.log("EEE");
};

const contentSelectEventHandler = (e) => {
  e.stopPropagation();
  e.target.classList.add("selected");
};

const prevInsertContentEvent = (e) => {
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
      prevContentID.replace(CONTENTID, ""),
      nextContentID.replace(CONTENTID, "")
    );

  selectedContent.remove();

  const resetMenu = document.querySelectorAll(
    "article span.control-abled:not(.render)"
  );
  resetMenu.forEach((menu) => menu.classList.add("control-disabled"));
};

export const CONTROLMENU = [
  {
    display: "Render",
    event: linkedlistRenderEvent,
    css: "control-abled render",
  },
  {
    display: "Prev Insert",
    event: prevInsertContentEvent,
    css: "control-abled control-disabled",
  },
  {
    display: "Next Insert",
    event: nextInsertContentEvent,
    css: "control-abled control-disabled",
  },
  {
    display: "Delete",
    event: deleteContentEvent,
    css: "control-abled control-disabled",
  },
];

// 연결된 라인 삭제
function deleteLine(fromID, toID) {
  const deleteLineID = `${fromID}--${toID}`;
  const deleteLine = document.querySelector(`line#${deleteLineID}`);
  deleteLine?.remove();
}

// 새로운 컨텐츠 추가
function insertContent(prevContentID, currentContentID) {
  const moduleContainer = document.querySelector(`div.${MODULECONTENTCLASS}`);
  const { clientWidth, clientHeight } = moduleContainer;
  const valueContent = createValueContent(
    clientWidth - CONTENTWIDTH,
    clientHeight - CONTENTWIDTH
  );
  document.querySelector(`#${currentContentID}`).before(valueContent);

  // 라인 추가
  const newContentID = valueContent.id;
  renderContentConnection(
    prevContentID?.replace(CONTENTID, ""),
    newContentID?.replace(CONTENTID, ""),
    currentContentID?.replace(CONTENTID, "")
  );
}

function insertContentBefore(prevContentID, currentContentID) {
  // 새로운 컨텐츠 추가
  const moduleContainer = document.querySelector(`div.${MODULECONTENTCLASS}`);
  const { clientWidth, clientHeight } = moduleContainer;
  const valueContent = createValueContent(
    clientWidth - CONTENTWIDTH,
    clientHeight - CONTENTWIDTH
  );
  document.querySelector(`#${currentContentID}`).before(valueContent);

  // 라인 추가
  const newContentID = valueContent.id;
  renderContentConnection(
    prevContentID?.replace(CONTENTID, ""),
    newContentID?.replace(CONTENTID, ""),
    currentContentID?.replace(CONTENTID, "")
  );
}

function insertContentAfter(prevContentID, currentContentID) {
  // 새로운 컨텐츠 추가
  const moduleContainer = document.querySelector(`div.${MODULECONTENTCLASS}`);
  const { clientWidth, clientHeight } = moduleContainer;
  const valueContent = createValueContent(
    clientWidth - CONTENTWIDTH,
    clientHeight - CONTENTWIDTH
  );
  document.querySelector(`#${prevContentID}`).after(valueContent);

  // 라인 추가
  const newContentID = valueContent.id;
  renderContentConnection(
    prevContentID?.replace(CONTENTID, ""),
    newContentID?.replace(CONTENTID, ""),
    currentContentID?.replace(CONTENTID, "")
  );
}

function renderConnection(prev, next) {
  const svg = document.querySelector("svg#line-svg");
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
  line.style.stroke = color;
  line.style.strokeWidth = 5;
  line.style.strokeOpacity = 1;
  line.id = lineId;
  line.dataset.color = color;
  svg.appendChild(line);
}

function renderContentConnection(prev, current, next) {
  const currentContent = document.querySelector(`div#${CONTENTID}${current}`);

  const prevContent = document.querySelector(`div#${CONTENTID}${prev}`);
  if (prevContent) {
    currentContent.dataset.prev = `${CONTENTID}${prev}`;
    prevContent.dataset.next = `${CONTENTID}${current}`;
    renderConnection(prevContent, currentContent);
  }

  const nextContent = document.querySelector(`div#${CONTENTID}${next}`);
  if (nextContent) {
    currentContent.dataset.next = `${CONTENTID}${next}`;
    nextContent.dataset.prev = `${CONTENTID}${current}`;
    renderConnection(currentContent, nextContent);
  }
}

function createValueContent(x, y) {
  const div = document.createElement("div");
  div.className = "linkedlist__content-value value-content";
  div.addEventListener("click", contentSelectEventHandler);

  div.id = `${CONTENTID}${SEQ++}`;

  const top = getRandomValue(y);
  const left = getRandomValue(x);

  div.style.top = top + "px";
  div.style.left = left + "px";
  div.innerText = getRandomValue();

  return div;
}

function renderContent(number = DEFAULTLENGTH) {
  const moduleContainer = document.querySelector(`div.${MODULECONTENTCLASS}`);

  while (moduleContainer.hasChildNodes()) {
    moduleContainer.removeChild(moduleContainer.firstChild);
  }

  const { clientWidth, clientHeight } = moduleContainer;

  for (let index = 0; index < number; index++) {
    const valueContent = createValueContent(
      clientWidth - CONTENTWIDTH,
      clientHeight - CONTENTWIDTH
    );
    moduleContainer.appendChild(valueContent);

    renderContentConnection(index - 1, index);
  }
}

function renderContentContainer() {
  const container = document.createElement("div");
  container.className = `${MODULECONTENTCLASS}`;
  container.addEventListener("click", backgroundClickEventHandler);
  return container;
}

function renderDefaultContent() {
  const moduleContainer = document.querySelector(`div.${MODULECONTENTCLASS}`);

  const { clientWidth, clientHeight } = moduleContainer;

  const valueContent = document.createElement("div");
  valueContent.className = "linkedlist__content-value value-content";
  valueContent.addEventListener("click", contentSelectEventHandler);
  valueContent.id = `${MODULE}_${SEQ++}`;

  const top = (clientHeight - CONTENTWIDTH) / 2;
  const left = (clientWidth - CONTENTWIDTH) / 2;

  valueContent.style.top = top + "px";
  valueContent.style.left = left + "px";
  valueContent.dataset.value = getRandomValue();

  const prev = document.createElement("input");
  prev.type = "button";
  prev.value = "prev";
  prev.addEventListener("click", prevInsertContentEvent);

  const del = document.createElement("input");
  del.type = "button";
  del.value = "del";
  del.addEventListener("click", deleteContentEvent);

  const next = document.createElement("input");
  next.type = "button";
  next.value = "next";
  next.addEventListener("click", nextInsertContentEvent);

  valueContent.appendChild(prev);
  valueContent.appendChild(del);
  valueContent.appendChild(next);

  moduleContainer.appendChild(valueContent);
}

export const renderModule = () => {
  SEQ = 0;
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  const svg = document.createElementNS(NSADDRESS, "svg");
  svg.id = "line-svg";

  nodeModule.appendChild(svg);
  nodeModule.appendChild(renderContentContainer());

  renderModuleContent(nodeModule);

  renderDefaultContent();
};
