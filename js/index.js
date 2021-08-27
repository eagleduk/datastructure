const test = () => {
  console.log("ERERE");
};

window.addEventListener("DOMContentLoaded", async (e) => {
  const module = "array";
  const importModule = await import(`./module/${module}.js`);
  importModule.default();
});

window.addEventListener("hashchange", async (e) => {
  const module = globalThis.location.hash.slice(1);
  const importModule = await import(`./module/${module}.js`);
  importModule.default();
});
