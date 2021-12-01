const MODULE = "array";
const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;

const searchEventHandler = async (e) => {
  e.preventDefault();
  e.target.search.disabled = true;
  const {
    target: {
      searchValue: { value },
    },
  } = e;
  await searchContent(value);

  e.target.search.disabled = false;
};

const insertEventHandler = (e) => {
  e.preventDefault();
  const {
    target: { insertValue },
  } = e;
  pushContent(insertValue.value);

  insertValue.value = getRandomValue();
};

function renderControlArray() {
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
  search.name = "search";
  search.value = "search";

  row1.appendChild(index);
  row1.appendChild(search);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", insertEventHandler);

  const value = document.createElement("input");
  value.type = "number";
  value.placeholder = "Input Value";
  value.value = getRandomValue();
  value.name = "insertValue";
  value.required = true;

  const insert = document.createElement("input");
  insert.type = "submit";
  insert.className = "insert";
  insert.value = "insert";

  row2.appendChild(value);
  row2.appendChild(insert);

  controller.appendChild(row1);
  controller.appendChild(row2);

  const controlPanel = document.createElement("div");
  controlPanel.className = `${MODULECONTROLCLASS} content-control`;
  controlPanel.appendChild(toolbar);
  controlPanel.appendChild(controller);

  return controlPanel;
}

/* 배열 본문 창 */
function renderContentArray() {
  const moduleContent = document.createElement("div");
  moduleContent.className = MODULECONTENTCLASS;
  moduleContent.addEventListener("dragover", contentDragoverEventHandler);
  moduleContent.addEventListener("drop", contentDropEventHandler);
  return moduleContent;
}

async function searchContent(value) {
  const moduleContent = document.querySelector(`div.${MODULECONTENTCLASS}`);

  const childNodes = moduleContent.childNodes;

  for (let index = 0; index < childNodes.length; index++) {
    let node = childNodes[index];
    node.classList.add("search-value");
    await _promiseTimeout(1000, () => node.classList.remove("search-value"));

    if (node.dataset.value === value) {
      node.classList.add("selected-value");

      await _promiseTimeout(3000, () => (node.className = "value-content"));
      return;
    } else {
    }
  }

  errorNotification(`Value[${value}] is not found.`);
}

function pushContent(value) {
  const moduleContent = document.querySelector(`div.${MODULECONTENTCLASS}`);

  const container = document.createElement("div");
  container.classList.add("value-content");
  container.dataset.value = value;

  moduleContent.appendChild(container);
}

export default () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderControlArray());
  nodeModule.appendChild(renderContentArray());

  renderModuleContent(nodeModule);
};
