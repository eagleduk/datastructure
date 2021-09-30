const MODULENAME = "hashtable_";
const MODULECONTENTCLASS = "module-container__content-hashtable";

const HASHTABLEKEYID = `${MODULENAME}_key`;
const HASHTABLERESULTID = `${MODULENAME}_result`;
const HASHTABLEVALUEID = `${MODULENAME}_value`;
const HASHTABLEVALUEROW = `${MODULENAME}_row_`;
const HASHTABLEVALUEARRAYCLASS = "valueArrays";

const hashtableValueArray = (index, key, value) => {
  const hashtableRow = document.querySelector(
    `#${HASHTABLEVALUEROW}${index} div.${HASHTABLEVALUEARRAYCLASS}`
  );

  const h3 = document.createElement("h3");
  h3.innerText = key;

  const h1 = document.createElement("h1");
  h1.innerText = value;

  const div = document.createElement("div");

  div.appendChild(h3);
  div.appendChild(h1);

  hashtableRow.appendChild(div);
};

const putButtonEventHandler = (e) => {
  const { value: key } = document.getElementById(HASHTABLEKEYID);
  const index = parseInt(key) % DEFAULTLENGTH;
  const value = getRandomValue();

  document.getElementById(HASHTABLERESULTID).innerText = index;
  document.getElementById(HASHTABLEVALUEID).innerText = value;

  hashtableValueArray(index, key, value);
};

export const CONTROLMENU = [];

function renderContentContainer() {
  const container = createDivElement();
  container.className = `${MODULECONTENTCLASS}`;

  container.appendChild(renderHashtableHeaderContainer());
  container.appendChild(renderContentMainContainer());

  return container;
}

function renderHashtableHeaderContainer() {
  const hashContainer = createDivElement();
  hashContainer.className = "hashtable__hash-container";

  hashContainer.appendChild(renderHashtableHeaderHashContainer());
  hashContainer.appendChild(renderHashtableHeaderValueContainer());

  return hashContainer;
}

function renderHashtableHeaderHashContainer() {
  const hashKeyContainer = createDivElement();
  hashKeyContainer.className = "hash-container__hash-key";

  hashKeyContainer.appendChild(renderHashtableHeaderHashKeyContainer());
  hashKeyContainer.appendChild(renderHashtableHeaderHashButtonContainer());
  hashKeyContainer.appendChild(renderHashtableHeaderHashArrowContainer());
  hashKeyContainer.appendChild(renderHashtableHeaderHashResultContainer());

  return hashKeyContainer;
}

function renderHashtableHeaderHashKeyContainer() {
  const container = createDivElement();

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
  const container = createDivElement();

  const searchButton = createElement("input");
  searchButton.type = "button";
  searchButton.value = "Search";

  const putButton = createElement("input");
  putButton.type = "button";
  putButton.value = "Put";
  putButton.addEventListener("click", putButtonEventHandler);

  container.appendChild(searchButton);
  container.appendChild(putButton);

  return container;
}

function renderHashtableHeaderHashArrowContainer() {
  const container = createDivElement();

  container.innerText = ">>>>";

  return container;
}

function renderHashtableHeaderHashResultContainer() {
  const container = createDivElement();

  const label = createElement("h3");
  label.innerText = "Key";

  const result = createElement("h1");
  result.id = HASHTABLERESULTID;

  container.appendChild(label);
  container.appendChild(result);

  return container;
}

function renderHashtableHeaderValueContainer() {
  const hashValueContainer = createDivElement();
  hashValueContainer.className = "hash-container__hash-value";

  const label = createElement("h3");
  label.innerText = "Value";

  const result = createElement("h1");
  result.id = HASHTABLEVALUEID;

  hashValueContainer.appendChild(label);
  hashValueContainer.appendChild(result);

  return hashValueContainer;
}

function renderContentMainContainer() {
  const mainContainer = createDivElement();
  mainContainer.className = "hashtable__main-container";

  for (let i = 0; i < DEFAULTLENGTH; i++) {
    mainContainer.appendChild(renderContentSection(i));
  }

  return mainContainer;
}

function renderContentSection(index) {
  const section = createSectionElement();
  section.className = `${MODULENAME}rows`;
  section.id = `${HASHTABLEVALUEROW}${index}`;
  // hashtable__hash
  section.appendChild(renderContentSectionKeyContainer(index));
  // hashtable__value
  section.appendChild(renderContentSectionValueContainer(index));
  return section;
}

function renderContentSectionKeyContainer(index) {
  const container = createDivElement();
  container.innerText = index;
  return container;
}

function renderContentSectionValueContainer(index) {
  const container = createDivElement();
  //container.id = `${HASHTABLEVALUEROWS}${index}`;
  container.className = HASHTABLEVALUEARRAYCLASS;
  return container;
}

export const renderModule = () => {
  const nodeModule = createDivElement();
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderContentContainer());

  renderModuleContent(nodeModule);
};
