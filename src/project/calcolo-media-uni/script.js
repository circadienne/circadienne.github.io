let examCount = 0;

const examsInList = document.getElementById("exams-in");

/*
<div>
    <h2 contenteditable id="exam-name-1">Esame 1</h2>
    <label for="exam-cfu-1">CFU:</label>
    <input type="number" id="exam-cfu-1" value="6">
    <label for="exam-grade-1">Voto:</label>
    <input type="number" id="exam-grade-1" value="30">
</div>
 */

function attachToNumberElement(el, callback) {
    el.addEventListener("change", callback);
    el.addEventListener("keyup", callback);
}

function examsAdd() {
    const examId = examCount++;
    const div = examsInList.appendChild(document.createElement("div"));
    div.dataset.exam_id = examId;

    const header = div.appendChild(document.createElement("h2"));
    header.contentEditable = 'true';
    header.id = `exam-name-${examId}`;
    header.innerText = `Esame ${examId+1}`;

    const cfuId = `exam-cfu-${examId}`;
    const cfuLabel = div.appendChild(document.createElement("label"));
    cfuLabel.htmlFor = cfuId;
    cfuLabel.innerText = "CFU:";
    const cfuInput = div.appendChild(document.createElement("input"));
    cfuInput.id = cfuId;
    cfuInput.type = "number";
    cfuInput.value = 6;
    attachToNumberElement(cfuInput, calcAverage);

    const gradeId = `exam-grade-${examId}`;
    const gradeLabel = div.appendChild(document.createElement("label"));
    gradeLabel.htmlFor = gradeId;
    gradeLabel.innerText = "Voto:";
    const gradeInput = div.appendChild(document.createElement("input"));
    gradeInput.id = gradeId;
    gradeInput.type = "number";
    gradeInput.value = 30;
    attachToNumberElement(gradeInput, () => validateGradeEl(gradeInput));

    const buttonDelete = div.appendChild(document.createElement("button"));
    buttonDelete.id = `exam-button-delete-${examId}`;
    buttonDelete.innerText = "Rimuovi";
    buttonDelete.addEventListener("click", () => examsDelete(examId));

    calcAverage();
}

function examsDelete(id) {
    for (const child of examsInList.children) {
        if (+child.dataset.exam_id == id) {
            examsInList.removeChild(child);
            calcAverage();
            break;
        }
    }
}

const originalAvgEl = document.getElementById("control-original-avg");
const originalCfuEl = document.getElementById("control-original-cfu");

attachToNumberElement(originalAvgEl, () => validateGradeEl(originalAvgEl));
attachToNumberElement(originalCfuEl, calcAverage);

const resultAvgMin = document.getElementById("result-avg-min");
attachToNumberElement(resultAvgMin, calcAverage);

function validateGrade(val) {
    return !isNaN(val) && val >= 18 && val <= 31;
}

function validateGradeEl(el) {
    if (validateGrade(+el.value))
        el.classList.remove("error");
    else
        el.classList.add("error");
    calcAverage();
}

function calcAverage() {
    let gradeTotal = 0;
    let cfuTotal = 0;

    if (originalAvgEl.value && originalCfuEl.value) {
        cfuTotal = +originalCfuEl.value;
        gradeTotal = (+originalAvgEl.value) * cfuTotal;
    }

    for (const child of examsInList.children) {
        const id = child.dataset.exam_id;
        const cfuEl = document.getElementById(`exam-cfu-${id}`);
        const cfu = +cfuEl.value;
        const gradeEl = document.getElementById(`exam-grade-${id}`);
        const grade = +gradeEl.value;
        gradeTotal += grade * cfu;
        cfuTotal += cfu;
    }

    const avg = gradeTotal / cfuTotal;
    const grad = (avg * 110) / 30;
    const avgLabel = document.getElementById("result-avg");
    const gradLabel = document.getElementById("result-grad");
    const totalCfuLabel = document.getElementById("result-cfu");

    if (isNaN(avg)) {
        avgLabel.innerText = "N/A";
        gradLabel.innerText = "N/A";
        totalCfuLabel.innerText = "N/A";
    }
    else {
        avgLabel.innerText = avg.toFixed(2);
        gradLabel.innerText = grad.toFixed(2);
        if (validateGrade(+resultAvgMin.value) && avg < resultAvgMin.value)
            avgLabel.classList.add("error");
        else
            avgLabel.classList.remove("error");
        totalCfuLabel.innerText = cfuTotal;
    }
}

document.getElementById("control-exams-add").addEventListener("click", examsAdd);
document.getElementById("control-exams-clear").addEventListener("click", () => {
    if (!confirm("Sei sicuro di voler eliminare tutti gli esami inseriti?")) return;
    examCount = 0;
    examsInList.innerHTML = "";
    calcAverage();
});
