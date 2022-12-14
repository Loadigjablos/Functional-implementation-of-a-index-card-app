const { diff, patch } = require("virtual-dom");
const createElement = require("virtual-dom/create-element");
const hh = require("hyperscript-helpers");
const { h } = require("virtual-dom");
// allows using html tags as functions in javascript
const { div, button, input, p, h1, from, select, option, a, hr, br } = hh(h);

const MSGS = {
    CREATE_INDEXCARD: "CREATE_INDEXCARD",
    DELETE_INDEXCARD: "DELETE_INDEXCARD",
    EDIT_INDEXCARD: "EDIT_INDEXCARD",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
    return div([
        button({ onclick: () => dispatch(MSGS.CREATE_INDEXCARD) }, "Add A Indexcard"),
        div(),
        div({ class: "cardDeck" }, renderAllCardsHTML(model) )
    ]);
}

/**
 * Using a Array and pushing the result in, isn't really functional but it works
 * @param {*} model this has a array that will be converted to make indexcards
 * @returns Array with the HTML of all indexcards
 */
function renderAllCardsHTML(model) {
  const cards = model.cards;
  let cardsHTMLModel = []
  cards.forEach((card, index) => {
    cardsHTMLModel.push(renderCard(card.question, card.Solution, index));
  });
  return cardsHTMLModel;
}

function renderCard(questionString, answerString, index) {
  if (typeof questionString !== "string" && typeof answerString !== "string") {
    return null;
  }
  const returnData = div({ className: "card" }, [
    p(questionString),
    a({ className: "showSolution" }, `Show Solution`),
    div({ className: "solution" }, [
      hr(),
      p(`Solution: `),
      p(answerString),
      select({onchange: (e) =>{
        e.target.value;
      }}, [
        option({ name: "0" }, `Poor`),
        option({ name: "1" }, `Good`),
        option({ name: "2" }, `Perfect`),
      ])
    ]),
    br(),
    button({ onclick: () => {
      dispatch(MSGS.EDIT_INDEXCARD, { index });
    }}, `Edit`),
    button({ onclick: () => {
      dispatch(MSGS.DELETE_INDEXCARD, { index });
    }}, `Delete`)
  ]);
  return returnData;
}

function editCardHTML() {
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
function update(msg, model, command) {
  console.log(model, command);
    switch (msg) {
      case MSGS.CREATE_INDEXCARD:
        return { cards: [ ...model.cards, newCard() ] };
      case MSGS.DELETE_INDEXCARD:
        return model.cards !== command.index;
      case MSGS.EDIT_INDEXCARD:

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
  function dispatch(msg, command) {
    model = update(msg, model, command);
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
