const CONTENTID = "hashtable_";
const MODULECONTENTCLASS = "module-container__content-hashtable";

export const CONTROLMENU = [];

function renderContentContainer() {
  const container = createDivElement();
  container.className = `${MODULECONTENTCLASS}`;

  container.appendChild(renderHashtableHeaderContainer());
  //container.appendChild(renderContentMainContainer());

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
  input.type = "text";

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
  result.innerText = "result";

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
  result.innerText = "value";

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
  section.className = `${CONTENTID}${index}`;
  // hashtable__hash
  section.appendChild(createDivElement());
  // hashtable__value
  section.appendChild(createDivElement());
  return section;
}

export const renderModule = () => {
  const nodeModule = createDivElement();
  nodeModule.className = "module-container";

  nodeModule.appendChild(renderContentContainer());

  renderModuleContent(nodeModule);
};
