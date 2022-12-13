let quizCards = []; // has all the Quizcard infromation

/**
 * Generates a new Quizcard
 */
const createQuizCard = () => {
    let newQuizCard = {
        question: "",
        solution: "",
        rating: 0,
    };
    quizCards.push(newQuizCard);
    renderQuizCardList();
};

// Edit an Quizcard
const editQuizCard = (index) => {
    let quizCardEdit = quizCards[index];
    // Render the edit form
    const editForm = `
                        <form>
                            <div>
                                <label>Question:</label>
                                <input type="text" name="question" value="${
                                    quizCardEdit.question
                                }" />
                            </div>
                            <div>
                                <label>Solution:</label>
                                <input type="text" name="solution" value="${
                                    quizCardEdit.solution
                                }" />
                            </div>
                            <div>
                                <label>Rating:</label>
                                <select name="rating">
                                    <option value="0" ${
                                        quizCardEdit.rating === 0 ? "selected" : ""
                                    }>Poor</option>
                                    <option value="1" ${
                                        quizCardEdit.rating === 1 ? "selected" : ""
                                    }>Good</option>
                                    <option value="2" ${
                                        quizCardEdit.rating === 2 ? "selected" : ""
                                    }>Perfect</option>
                                </select>
                            </div>
                            <div>
                                <button type="submit">Save</button>
                            </div>
                        </form>
                    `;
    // Add the edit form to the page
    document.querySelector("#quizCardList").innerHTML = editForm;
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        // Update the Quizcard
        quizCards[index].question = e.target.question.value;
        quizCards[index].solution = e.target.solution.value;
        quizCards[index].rating = Number(e.target.rating.value);
        // Render the Quizcard list
        renderQuizCardList();
    });
};

// Delete an existing Quizcard
const deleteQuizCard = (index) => {
    // Remove the Quizcard from the array
    quizCards.splice(index, 1);
    // Render the Quizcard list
    renderQuizCardList();
};

// View the solution to the Quizcard
const viewSolution = (index) => {
    let quizCardSolution = quizCards[index];
    // Render the solution
    const solution = `
                        <div class="card">
                            <div class="card-body">
                                <h4>Question: ${quizCardSolution.question}</h4>
                                <hr>
                                <p>Solution: ${quizCardSolution.solution}</p>
                            </div>
                        </div>
                    `;
    // Add the solution to the page
    document.querySelector("#quizCardList").innerHTML = solution;
    // Add an event listener to the card
    document.querySelector(".card").addEventListener("click", (e) => {
        // Update the rating
        quizCards[index].rating++;
        // Render the Quizcard list
        renderQuizCardList();
    });
};

// Render the Quizcard list
const renderQuizCardList = () => {
    // Sort the quiz cards by rating
    quizCards.sort((a, b) => b.rating - a.rating);

    let quizCardList = "";
    quizCards.forEach((quizCard, index) => {
        quizCardList += `
                            <div class="card">
                                <div class="card-body">
                                    <h4>Question: ${quizCard.question}</h4>
                                    <button class="btn btn-secondary" onclick="viewSolution(${index})">View Solution</button>
                                    <button class="btn btn-primary" onclick="editQuizCard(${index})">Edit</button>
                                    <button class="btn btn-danger" onclick="deleteQuizCard(${index})">Delete</button>
                                </div>
                            </div>
                        `;
    });
    document.querySelector("#quizCardList").innerHTML = quizCardList;
};

document.querySelector("#createQuizCard").addEventListener("click", createQuizCard);

// renders the cards at the start.
renderQuizCardList();
