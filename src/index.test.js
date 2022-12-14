const { initModel, newCard, editCardHTML, renderCard, renderAllCardsHTML, view, MSGS } = require("./index");

test("new card", () => {
    const expected = {
        question: "",
        solution: "",
        rate: 0,
      };
    expect(newCard()).toBe(expected);
});

test("render one crad the HTML", () => {
    expect(renderCard("1", "2", 0, () => {})).toBeDefined();
});


