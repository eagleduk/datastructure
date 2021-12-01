const MODULE = "hashtable";
const HASHTABLELENGTH = 5;

const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;

const HASHTABLEKEYID = `${MODULE}_key`;
const HASHTABLERESULTID = `${MODULE}_result`;
const HASHTABLEVALUEID = `${MODULE}_value`;
const HASHTABLEVALUEROW = `${MODULE}_row_`;
const HASHTABLEVALUEARRAYCLASS = "valueArrays";

const searchButtonEventHandler = async (e) => {
  e.preventDefault();
  e.target.button.disabled = true;

  const { value } = e.target.input;
  const index = parseInt(value) % HASHTABLELENGTH;

  // document.getElementById(HASHTABLERESULTID).innerText = index;
  const hashtableRow = document.querySelector(`.${MODULECONTENTCLASS}`)
    .childNodes[index];

  const hashtableRowkey = hashtableRow.querySelector("div:first-child");
  hashtableRowkey.classList.add("selectedKey");

  const hashtableRowValues = hashtableRow.querySelector(`div:last-child`);

  const nodeIndex = await searchValue(hashtableRowValues, value);

  if (nodeIndex === -1) {
    errorNotification(`Value[${value}] is not found.`);
  }
  hashtableRowkey.classList.remove("selectedKey");
  e.target.button.disabled = false;
};

async function searchValue(node, key) {
  const childLength = node.childNodes.length;

  for (let i = 0; i < childLength; i++) {
    let child = node.childNodes[i];

    child.classList.add("search-value");
    await _promiseTimeout(1000, () => child.classList.remove("search-value"));

    if (child.dataset.value === key) {
      child.classList.add("selected-value");
      await _promiseTimeout(3000, () => (child.className = "value-content"));

      return i;
    }
  }

  return -1;
}

const putEventHandler = async (e) => {
  e.preventDefault();
  e.target.button.disabled = true;
  const { input } = e.target;

  const index = parseInt(input.value) % HASHTABLELENGTH;
  const value = input.value;

  await putHashtableValueContent(index, input.value, value);

  input.value = getRandomValue();
  e.target.button.disabled = false;
};

async function putHashtableValueContent(index, key, value) {
  const hashtableRow = document.querySelector(
    `div.${MODULECONTENTCLASS} section:nth-child(${index + 1})`
  );

  const hashtableRowkey = hashtableRow.querySelector("div:first-child");
  hashtableRowkey.classList.add("selectedKey");

  const hashtableRowValues = hashtableRow.querySelector(`div:last-child`);

  const nodeIndex = await searchValue(hashtableRowValues, key);

  if (nodeIndex === -1) {
    const container = document.createElement("div");
    container.classList.add("value-content");
    container.dataset.value = value;

    hashtableRowValues.appendChild(container);
  }

  hashtableRowkey.classList.remove("selectedKey");
}

function renderControlHashTable() {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  toolbar.draggable = true;
  toolbar.addEventListener("dragstart", controlPanelDragStartEventHandler);
  toolbar.addEventListener("drag", (e) => {});

  const controller = document.createElement("div");

  const row1 = document.createElement("form");
  row1.addEventListener("submit", searchButtonEventHandler);

  const searchValue = document.createElement("input");
  searchValue.type = "number";
  searchValue.placeholder = "Search Value";
  searchValue.name = "input";
  searchValue.required = true;

  const searchValueBtn = document.createElement("input");
  searchValueBtn.type = "submit";
  searchValueBtn.className = "search";
  searchValueBtn.value = "search";
  searchValueBtn.name = "button";

  row1.appendChild(searchValue);
  row1.appendChild(searchValueBtn);

  const row2 = document.createElement("form");
  row2.addEventListener("submit", putEventHandler);

  const putValue = document.createElement("input");
  putValue.type = "number";
  putValue.placeholder = "Put value";
  putValue.name = "input";
  putValue.required = true;
  putValue.value = getRandomValue();

  const putValueBtn = document.createElement("input");
  putValueBtn.type = "submit";
  putValueBtn.className = "insert";
  putValueBtn.value = "put";
  putValueBtn.name = "button";

  row2.appendChild(putValue);
  row2.appendChild(putValueBtn);

  controller.appendChild(row1);
  controller.appendChild(row2);

  const controlPanel = document.createElement("div");
  controlPanel.className = `${MODULECONTROLCLASS} content-control`;
  controlPanel.appendChild(toolbar);
  controlPanel.appendChild(controller);

  return controlPanel;
}

function renderContentHashTable() {
  const moduleContent = document.createElement("div");
  moduleContent.className = MODULECONTENTCLASS;
  moduleContent.addEventListener("dragover", contentDragoverEventHandler);
  moduleContent.addEventListener("drop", contentDropEventHandler);

  for (let i = 0; i < HASHTABLELENGTH; i++) {
    moduleContent.appendChild(renderContentSection(i));
  }

  return moduleContent;
}

function renderContentSection(index) {
  const section = document.createElement("section");
  section.className = `${MODULE}_rows`;
  // section.id = `${HASHTABLEVALUEROW}${index}`;
  // hashtable__hash
  section.appendChild(renderContentSectionKeyContainer(index));
  // hashtable__value
  section.appendChild(renderContentSectionValueContainer(index));
  return section;
}

function renderContentSectionKeyContainer(index) {
  const container = document.createElement("div");
  container.innerText = index;
  return container;
}

function renderContentSectionValueContainer(index) {
  const container = document.createElement("div");
  // container.className = HASHTABLEVALUEARRAYCLASS;
  return container;
}

export default () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderControlHashTable());
  nodeModule.appendChild(renderContentHashTable());

  renderModuleContent(nodeModule);
};
