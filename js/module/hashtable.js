const MODULE = "hashtable";

const MODULECONTROLCLASS = `module-container__control-${MODULE}`;
const MODULECONTENTCLASS = `module-container__content-${MODULE}`;

const HASHTABLEKEYID = `${MODULE}_key`;
const HASHTABLERESULTID = `${MODULE}_result`;
const HASHTABLEVALUEID = `${MODULE}_value`;
const HASHTABLEVALUEROW = `${MODULE}_row_`;
const HASHTABLEVALUEARRAYCLASS = "valueArrays";

const searchValue = (node, key) => {
  const childLength = node.childNodes.length;

  for (let i = 0; i < childLength; i++) {
    let child = node.childNodes[i];
    child.classList.add("searchValue");
    if (child.dataset.key === key) return i;
  }

  return -1;
};

const searchButtonEventHandler = (e) => {
  const { value: key } = document.getElementById(HASHTABLEKEYID);
  const index = parseInt(key) % DEFAULTLENGTH;

  document.getElementById(HASHTABLERESULTID).innerText = index;

  const hashtableRow = document.querySelector(`#${HASHTABLEVALUEROW}${index}`);

  const hashtableRowkey = hashtableRow.querySelector("div:first-child");
  hashtableRowkey.classList.add("selectedKey");

  const hashtableRowValues = hashtableRow.querySelector(
    `div.${HASHTABLEVALUEARRAYCLASS}`
  );

  const nodeIndex = searchValue(hashtableRowValues, key);
  let value = `Key[${key}] is not found.`;
  if (nodeIndex > -1) {
    value =
      hashtableRowValues.childNodes[nodeIndex].querySelector("h1").innerText;
  }

  document.getElementById(HASHTABLEVALUEID).innerText = value;
};

const hashtableValueArray = (index, key, value) => {
  const hashtableRow = document.querySelector(`#${HASHTABLEVALUEROW}${index}`);

  const hashtableRowkey = hashtableRow.querySelector("div:first-child");
  hashtableRowkey.classList.add("selectedKey");

  const hashtableRowValues = hashtableRow.querySelector(
    `div.${HASHTABLEVALUEARRAYCLASS}`
  );

  const nodeIndex = searchValue(hashtableRowValues, key);

  if (nodeIndex > -1) {
    const correctChild = hashtableRowValues.childNodes[nodeIndex];

    const h1 = correctChild.querySelector("h1");
    h1.innerText = value;
  } else {
    const newChild = document.createElement("div");
    newChild.dataset.key = key;

    const h3 = document.createElement("h3");
    h3.innerText = key;

    const h1 = document.createElement("h1");
    h1.innerText = value;

    newChild.appendChild(h3);
    newChild.appendChild(h1);

    hashtableRowValues.appendChild(newChild);
  }

  hashtableRowkey.classList.remove("selectedKey");
};

const putButtonEventHandler = (e) => {
  const { value: key } = document.getElementById(HASHTABLEKEYID);
  const index = parseInt(key) % DEFAULTLENGTH;
  const value = getRandomValue();

  document.getElementById(HASHTABLERESULTID).innerText = index;
  document.getElementById(HASHTABLEVALUEID).innerText = value;

  hashtableValueArray(index, key, value);

  document.getElementById(HASHTABLEKEYID).value = getRandomValue();
};

export const CONTROLMENU = [];

function renderContentContainer() {
  const container = document.createElement("div");
  container.className = `${MODULECONTENTCLASS}`;

  container.appendChild(renderHashtableHeaderContainer());
  container.appendChild(renderContentMainContainer());

  return container;
}

function renderHashtableHeaderContainer() {
  const hashContainer = document.createElement("div");
  hashContainer.className = "hashtable__hash-container";

  hashContainer.appendChild(renderHashtableHeaderHashContainer());
  hashContainer.appendChild(renderHashtableHeaderValueContainer());

  return hashContainer;
}

function renderHashtableHeaderHashContainer() {
  const hashKeyContainer = document.createElement("div");
  hashKeyContainer.className = "hash-container__hash-key";

  hashKeyContainer.appendChild(renderHashtableHeaderHashKeyContainer());
  hashKeyContainer.appendChild(renderHashtableHeaderHashButtonContainer());
  hashKeyContainer.appendChild(renderHashtableHeaderHashArrowContainer());
  hashKeyContainer.appendChild(renderHashtableHeaderHashResultContainer());

  return hashKeyContainer;
}

function renderHashtableHeaderHashKeyContainer() {
  const container = document.createElement("div");

  const label = createElement("h3");
  label.innerText = "Key";

  const input = createElement("input");
  input.type = "number";
  input.value = 54;
  input.id = HASHTABLEKEYID;

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

function renderHashtableHeaderHashButtonContainer() {
  const container = document.createElement("div");

  const searchButton = createElement("input");
  searchButton.type = "button";
  searchButton.value = "Search";
  searchButton.addEventListener("click", searchButtonEventHandler);

  const putButton = createElement("input");
  putButton.type = "button";
  putButton.value = "Put";
  putButton.addEventListener("click", putButtonEventHandler);

  container.appendChild(searchButton);
  container.appendChild(putButton);

  return container;
}

function renderHashtableHeaderHashArrowContainer() {
  const container = document.createElement("div");

  container.innerText = ">>>>";

  return container;
}

function renderHashtableHeaderHashResultContainer() {
  const container = document.createElement("div");

  const label = createElement("h3");
  label.innerText = "Hashed Key";

  const result = createElement("h1");
  result.innerText = "-";
  result.id = HASHTABLERESULTID;

  container.appendChild(label);
  container.appendChild(result);

  return container;
}

function renderHashtableHeaderValueContainer() {
  const hashValueContainer = document.createElement("div");
  hashValueContainer.className = "hash-container__hash-value";

  const label = createElement("h3");
  label.innerText = "Value";

  const result = createElement("h1");
  result.id = HASHTABLEVALUEID;
  result.innerText = "-";

  hashValueContainer.appendChild(label);
  hashValueContainer.appendChild(result);

  return hashValueContainer;
}

function renderContentMainContainer() {
  const mainContainer = document.createElement("div");
  mainContainer.className = "hashtable__main-container";

  for (let i = 0; i < DEFAULTLENGTH; i++) {
    mainContainer.appendChild(renderContentSection(i));
  }

  return mainContainer;
}

function renderContentSection(index) {
  const section = createSectionElement();
  section.className = `${MODULE}_rows`;
  section.id = `${HASHTABLEVALUEROW}${index}`;
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
  //container.id = `${HASHTABLEVALUEROWS}${index}`;
  container.className = HASHTABLEVALUEARRAYCLASS;
  return container;
}

export const renderModule = () => {
  const nodeModule = document.createElement("div");
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderContentContainer());

  renderModuleContent(nodeModule);
};
