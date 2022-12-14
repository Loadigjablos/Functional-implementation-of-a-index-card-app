const { initModel, newCard, editCardHTML, renderCard, renderAllCardsHTML, view, MSGS } = require("./index");

test("new card", () => {
    const expected = {
        question: "",
        solution: "",
        rate: 0,
      };
    expect(newCard()).toStrictEqual(expected);
});

test("new card", () => {
    const expected = {
        question: "",
        solution: "",
        rate: 0,
      };
    expect(newCard()).toStrictEqual(expected);
});


