const renderController = () => {
  const article = document.querySelector("article");

  const addLi = document.createElement("li");
  addLi.innerText = "ADD";

  const ul = document.createElement("ul");
  ul.appendChild(addLi);

  const div = document.createElement("div");
  div.appendChild(ul);

  article.replaceChild(div, article.children[0]);
};

const render = () => {
  renderController();
};

export default render;
