const { diff, patch } = require("virtual-dom");
const createElement = require("virtual-dom/create-element");
const hh = require("hyperscript-helpers");
const { h } = require("virtual-dom");
// allows using html tags as functions in javascript
const { div, button, input, p, select, option, a, hr, br, form } = hh(h);

const MSGS = {
    CREATE_INDEXCARD: "CREATE_INDEXCARD",
    DELETE_INDEXCARD: "DELETE_INDEXCARD",
    EDIT_INDEXCARD: "EDIT_INDEXCARD",
    RATING_CHANGED: "RATING_CHANGED",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
    return div([
        button({ onclick: () => dispatch(MSGS.CREATE_INDEXCARD, { }) }, "Add A Indexcard"),
        div(),
        div({ className: "cardDeck" }, renderAllCardsHTML(model, dispatch) )
    ]);
}

/**
 * Using a Array and pushing the result in, isn't really imutable, but well it works
 * @param {*} model this has a array that will be converted to make indexcards
 * @returns Array with the HTML of all indexcards
 */
function renderAllCardsHTML(model, dispatch) {
  const cards = model.cards;
  let cardsHTMLModel = []
  cards.forEach((card, index) => {
    cardsHTMLModel.push(renderCard(card.question, card.Solution, index, dispatch));
  });
  return cardsHTMLModel;
}

function renderCard(questionString, answerString, index, dispatch) {
  if (typeof questionString !== "string" && typeof answerString !== "string") {
    return null;
  }
  const returnData = div({ className: "card" }, [
    p(questionString),
    a({ className: "showSolution", tabindex: 0, href: "#" }, `Show Solution`),
    div({ className: "solution", tabindex: 0 }, [
      hr(),
      p(`Solution: `),
      p(answerString),
      select({ onchange: (e) =>{
          dispatch(MSGS.RATING_CHANGED, { newRating: e.target.value, index: index });
        }
      }, [
        option({ name: "0" }, `Poor`),
        option({ name: "1" }, `Good`),
        option({ name: "2" }, `Perfect`),
      ])
    ]),
    br(),
    a({ className: "showEditCard", tabindex: 0, href: "#" }, `Edit Card`),
    div({ className: "editCard" }, editCardHTML(questionString, answerString, index, dispatch)),
    br(),
    button({ onclick: () => dispatch(MSGS.DELETE_INDEXCARD, { index })}, `Delete`)
  ]);
  return returnData;
}

function editCardHTML(questionString, answerString, index, dispatch) {
  return div([
    form({ }, [
      p(`Question: `),
      input({ value: questionString, onchange: (e) => {
        dispatch(MSGS.EDIT_INDEXCARD, { questionString: e.target.value, index: index });
      }}),
      p(`Answer: `),
      input({ value: answerString, onchange: (e) => {
        dispatch(MSGS.EDIT_INDEXCARD, { answerString: e.target.value, index: index });
      }}),
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

// Update function which takes a message, a model and command that returns a new/updated model
function update(msg, model, command) {
    model.cards.sort((a, b) => a.rate - b.rate);
    switch (msg) {
      case MSGS.CREATE_INDEXCARD:
        return { cards: [ ...model.cards, newCard() ] };
      case MSGS.DELETE_INDEXCARD:
        return { cards: model.cards.filter((card, index) => index !== command.index)} ;
      case MSGS.EDIT_INDEXCARD:
        // if questionString is defined
        if(typeof command.questionString === "string") {
          // returns a changed card in the array
          return { cards: model.cards.map((card, index) => {
              if (index === command.index) {
                return { ...card, question: command.questionString };
              }
              return card;
            })
          };
          // if answerString is defined.
        } else if(typeof command.answerString === "string") {
          // returns a changed card in the array
          return { cards: model.cards.map((card, index) => {
              if (index === command.index) {
                return { ...card, Solution: command.answerString };
              }
              return card;
            })
          };
        }
        return model;
      case(MSGS.RATING_CHANGED):
        return { cards: model.cards.map((card, index) => {
            if (index === command.index) {
              if (command.newRating == "Perfect") {
                return { ...card, rate: card.rate + 0 };
              } else if (command.newRating == "Good") {
                return { ...card, rate: card.rate + 1 };
              } else if (command.newRating == "Poor") {
                return { ...card, rate: card.rate + 2 };
              }
            }
            return card;
          })
        };
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
    cards: [],
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);

// To test, coment out app and rootNode 
module.exports = { initModel, newCard, editCardHTML, renderCard, renderAllCardsHTML, view, MSGS };
