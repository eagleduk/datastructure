const MODULENAME = "tree_";
const MODULECONTENTCLASS = "module-container__content-tree";

export const CONTROLMENU = [];

function renderTreeHeaderContainer() {
  const treeHeaderContainer = createDivElement();
  treeHeaderContainer.className = "tree__header-container";

  return treeHeaderContainer;
}

function renderTreeMainContainer() {
  const treeMainContainer = createDivElement();
  treeMainContainer.className = "tree__main-container";

  return treeMainContainer;
}

function renderContentContainer() {
  const container = createDivElement();
  container.className = `${MODULECONTENTCLASS}`;

  container.appendChild(renderTreeHeaderContainer());
  container.appendChild(renderTreeMainContainer());

  return container;
}

export const renderModule = () => {
  const nodeModule = createDivElement();
  nodeModule.className = "module-container";
  nodeModule.appendChild(renderContentContainer());
  renderModuleContent(nodeModule);
};
