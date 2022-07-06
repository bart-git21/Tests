
const question_container = document.querySelector(".methods-container");
let _counter;
let array = [];

function counter() {
    let i = 0;
    return function () {
        return i++;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

        // используем синтаксис "деструктурирующее присваивание"
        // то же самое: let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let listOfThemesWithArrays = [
    ["Math", math_answers],
    ["Chemistry", Chemistry_answers],
    ["Languages", Languages_answers],
]

shuffle(listOfThemesWithArrays);

// ========================= sorted buttons
const dropdownMenu__sortByLength = document.querySelector(".dropdownMenu__btn-sortByLength");
dropdownMenu__sortByLength.addEventListener("click", sortByLength);
function sortByLength() {
    listOfThemesWithArrays.sort((a,b) => a[1].length - b[1].length);
    createBtn();
}
const dropdownMenu__randomShuffle = document.querySelector(".dropdownMenu__btn-randomShuffle");
dropdownMenu__randomShuffle.addEventListener("click", randomShuffle);
function randomShuffle() {
    shuffle(listOfThemesWithArrays);
    createBtn();
}
const dropdownMenu__sortByName = document.querySelector(".dropdownMenu__btn-sortByName");
dropdownMenu__sortByName.addEventListener("click", sortByName);
function sortByName() {
    listOfThemesWithArrays.sort((a,b) => a[0] > b[0]);
    createBtn();
}

// ========================= create buttons
function createBtn() {
    const scene = document.querySelector(".scene__buttons");
    scene.innerHTML = null;
    for(let i = 0; i<listOfThemesWithArrays.length; i++) {
        const a = `
            <div class="scene__buttonBox">
                <button 
                    class="button pink-button ${listOfThemesWithArrays[i][0]}-start"
                    title="${listOfThemesWithArrays[i][1].length}">
                    ${listOfThemesWithArrays[i][0]}
                </button>
                <span onclick="deleteBtn(${i});"><i class="fa-solid fa-trash-can"></i></span>
                
            </div>
        `
        scene.innerHTML += a;
    }

    // add eventListener into buttons
    for (let i = 0; i < listOfThemesWithArrays.length; i++) {
        document.querySelector(`.${listOfThemesWithArrays[i][0]}-start`).addEventListener("click", start);
    }
}
createBtn();

// delete function
function deleteBtn(index) {
    listOfThemesWithArrays.splice(index,1);
    createBtn();
}

// start feature
function start(event) {
    _counter = new counter();
    question_container.innerHTML = "";
    for (let i = 0; i < listOfThemesWithArrays.length; i++) {
        if (event.target.className.includes(listOfThemesWithArrays[i][0])) array = listOfThemesWithArrays[i][1];
    }
    shuffle(array);
    currentButtonSetGreenColor(event.target);
    createNewQuestion();
}

// add button color feature
function currentButtonSetGreenColor(elem) {
    const buttons = document.querySelectorAll(".scene__buttonBox > button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("button--green");
    }
    elem.classList.add("button--green");
}


// ============================================= questions
// create questions
function createNewQuestion() {
    let iterator = _counter();
    let currentArrayOfQuestions = array;

    let li = document.createElement("li");
    li.classList.add("question-div");

    let span__nextQuestion = document.createElement("span");
    span__nextQuestion.textContent = currentArrayOfQuestions[iterator][0];

    let br = document.createElement("br");

    let span__contentBeforeUserAnswer = document.createElement("span");
    span__contentBeforeUserAnswer.textContent = "My answer is: ";
    span__contentBeforeUserAnswer.classList.add("fs-small");

    // let input = document.createElement("input");
    // input.classList.add("b-bottom");
    // input.title = currentArrayOfQuestions[iterator][1];
    // input.setAttribute("oninput", "this.size = this.value.length");
    // input.addEventListener("keypress", function(e) {
    //     if (e.key === "Enter") {
    //         check_user_answer();
    //         listenEnter();
    //         scrollDown(e);
    //     }
    // })
    let textarea = document.createElement("textarea");
    textarea.classList.add("b-bottom");
    // textarea.cols = "40";
    textarea.style.width = "100%";
    textarea.rows = "1";
    textarea.spellcheck = false;
    textarea.title = currentArrayOfQuestions[iterator][1];
    textarea.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            check_user_answer();
            listenEnter();
            scrollDown(e);
        }
    })


    li.appendChild(span__nextQuestion);
    li.appendChild(br);
    li.appendChild(span__contentBeforeUserAnswer);
    // li.appendChild(input);
    li.appendChild(textarea);
    question_container.appendChild(li);

    // input.focus();
    textarea.focus();




    function check_user_answer() {
        li.style.fontSize = "0.9rem";
        // input.style.fontSize = "0.9rem";
        textarea.style.fontSize = "0.9rem";
        // if (input.value == input.title) {
        if (textarea.value == textarea.title) {
            li.classList.add("correct");
            // input.classList.add("correct");
            textarea.classList.add("correct");
            textarea.style.height = textarea.scrollHeight + 20 + "px";
        }
        else {
            // input.value = input.title;
            textarea.value = textarea.title;
            li.classList.add("wrong");
            // input.classList.add("wrong");
            textarea.classList.add("wrong");
            // input.size = input.value.length;
            span__contentBeforeUserAnswer.textContent = "Correct answer is: ";
            textarea.style.height = textarea.scrollHeight + 20 + "px";
        }
    }

    function listenEnter() {
        if (iterator == array.length - 1) return;
        createNewQuestion();
    }

    function scrollDown(e) {
        document.documentElement.scrollTop = e.target.offsetTop - document.documentElement.clientHeight * 0.4;
    }
}