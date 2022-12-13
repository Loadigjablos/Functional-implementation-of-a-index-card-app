const { diff, patch } = require("virtual-dom");
const createElement = require("virtual-dom/create-element");
const hh = require("hyperscript-helpers");
const { h } = require("virtual-dom");
// allows using html tags as functions in javascript
const { div, button, input, p, h1, from, select, option, a, hr } = hh(h);

const MSGS = {
    CREATE_INDEXCARD: "CREATE_INDEXCARD",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
    return div([
        button({ onclick: () => dispatch(MSGS.CREATE_INDEXCARD) }, "Add A Indexcard"),
        div({}, renderAllCardsHTML(model) )
    ]);
}

function renderAllCardsHTML(model) {
  const cards = model.cards;
  let cardsHTMLModel = []
  cards.forEach(card => {
    cardsHTMLModel.push(renderCard(card.question, card.solution, card));
  });
  return cardsHTMLModel;
}

function renderCard(questionString, answerString, index) {
  if (typeof questionString !== "string") {
    return null;
  }
  return div({ class: card }[
    p(questionString),
    a({ class: "showSolution" }, `Show Solution`),
    div({ class: "solution" }, [
      hr(),
      p(`Solution: `),
      p(answerString),
      select({onchange: (e) =>{
        e.target.value;
      }}, [
        option(`Poor`),
        option(`Good`),
        option(`Perfect`),
      ])
    ]),
    button({ onclick: () => {

    }}, `Edit`)
  ])
}

function createCardHTML() {
  return div([
    from({ }, [
      input({ onchange: (e) => {
        e.target.value;
      }}),
      input({ onchange: (e) =>{
        e.target.value;
      }}),
      button({ onclick: () => {

      }}, `Save`)
    ]),
  ])
}

function newCard() {
  return {
    question: "",
    solution: "",
    rate: 0,
  }
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
    switch (msg) {
      case MSGS.CREATE_INDEXCARD:
        return { cards: [ ...model.cards, newCard() ] };
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
    cards: [
      {
        question: "!TEST-TEST!",
        Solution: "!TEST-TEST!",
        rate: 1,
      }
    ],
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
