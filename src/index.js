const { diff, patch } = require("virtual-dom");
const createElement = require("virtual-dom/create-element");
const hh = require("hyperscript-helpers");
const { h } = require("virtual-dom");
// allows using html tags as functions in javascript
const { div, button, p, h1 } = hh(h);

const MSGS = {
    UPDATE_MODEL: "UPDATE_MODEL",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
    return div([
        h1(`My Title`),
        button({ onclick: () => dispatch(MSGS.UPDATE_MODEL) }, "Update Model"),
        p(`Time: ${model.currentTime}`),
    ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
    switch (msg) {
      case MSGS.UPDATE_MODEL:
        return { ...model, currentTime: new Date().toLocaleTimeString() };
      default:
        return model;
    }
}

// Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
    currentTime: new Date().toLocaleTimeString(),
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
