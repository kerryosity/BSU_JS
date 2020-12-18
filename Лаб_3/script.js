// Хотянович Эрик (2 группа)
// Извините, не мог долго добраться до выполнения лабы, 
// а когда добрался, то очень много времени пытался разобраться, как это сделать

// ----------------------- private module ----------------------- //
let tableModule = (function () {

    // count average mark among all students
    let findAverageMark = function (studentArray, size) {
        let sum = 0;
        for (let i = 0; i < size; i++)
            sum += studentArray[i].averageMark;

        return sum / size;
    };

    // add a new student to the table
    let newStudent = function () {
        let size = studentArray.length;
        let table = document.querySelector("tbody");
        let newRow = document.createElement('tr');
        newRow.id = 'row_' + (size).toString();

        for (let j = 0; j < columnsNum; j++)
            newColumn[j] = document.createElement('td');

        newColumn[1].id = 'name_id_' + (size).toString();
        newColumn[2].id = 'lastName_id_' + (size).toString();
        newColumn[3].id = 'age_id_' + (size).toString();
        newColumn[4].id = 'averageMark_id_' + (size).toString();

        newColumnContent[0] = document.createTextNode(size);
        newColumnContent[1] = document.createTextNode(studentArray[size - 1].firstName);
        newColumnContent[2] = document.createTextNode(studentArray[size - 1].lastName);
        newColumnContent[3] = document.createTextNode(studentArray[size - 1].age);
        newColumnContent[4] = document.createTextNode(studentArray[size - 1].averageMark);

        for (let j = 0; j < columnsNum; j++) {
            newColumn[j].appendChild(newColumnContent[j]);
            newRow.appendChild(newColumn[j]);
        }

        // delete and edit buttons
        let deleteButton = document.createElement('button');
        let editButton = document.createElement('button');

        deleteButton.classList.add('delete_btn');
        deleteButton.id = 'del_btn_' + (size).toString();
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteStudent(' + (size).toString() + ')');

        editButton.classList.add('edit_btn');
        editButton.id = 'edit_btn_' + (size).toString();
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'editStudent(' + (size).toString() + ')');

        newRow.appendChild(editButton);
        newRow.appendChild(deleteButton);

        table.appendChild(newRow);
    };

    let editedStudent = function (id, studentIndex) {
        let firstName = document.getElementById('name_id_' + String(id));
        let lastName = document.getElementById('lastName_id_' + String(id)); 
        let age = document.getElementById('age_id_' + String(id));
        let averageMark = document.getElementById('averageMark_id_' + String(id));

        firstName.innerText = studentArray[studentIndex].firstName;
        lastName.innerText = studentArray[studentIndex].lastName;
        age.innerText = studentArray[studentIndex].age;
        averageMark.innerText = studentArray[studentIndex].averageMark;

        closeEditing(id);
    };

    return {
        findAverageMark: findAverageMark,
        newStudent: newStudent,
        editedStudent: editedStudent
    }
}());
// --------------------- private module end --------------------- //

function makeStudent(firstName, lastName, age, averageMark, stud_id) {
    return {
        firstName: firstName,
        lastName: lastName,
        age: age,
        averageMark: averageMark,
        stud_id: stud_id
    };
}

function isArrayEmpty() {
    if (studentArray.length == 0) {
        document.querySelector("p").innerText = "Try to add a student using the form below";
        document.querySelector("table").style.display = "none";
    } 
    else {
        document.querySelector("p").innerText = "Average mark among all students: " + tableModule.findAverageMark(studentArray, studentArray.length);
        document.querySelector("table").style.display = "table";
    }
}

function clearForm() {
    document.getElementById('firstName').value = "";
    document.getElementById('lastName').value = "";;
    document.getElementById('age').value = "";
    document.getElementById('averageMark').value = "";
}

// checking if values are right
function formValidator() {
    let firstName = String(document.getElementById('firstName').value);
    let lastName = String(document.getElementById('lastName').value); 
    let age = Number(document.getElementById('age').value);
    let averageMark = Number(document.getElementById('averageMark').value);

    if (firstName == "" || lastName == "" || age == "" || age <= 0 || (averageMark == "" && averageMark != 0) || averageMark < 0) {
        let error = document.getElementById('error_message');
        error.style.display = 'block';

        setTimeout(function(){
            error.style.display = 'none';
        }, 4000);

        return false;
    } else return true;
}

function deleteFromArray(btn_id) {
    studentArray.splice(studentArray.findIndex(function(i) {
        return i.stud_id === btn_id;
    }), 1);
}

function addStudent() {
    if (formValidator()) {
        let firstName = String(document.getElementById('firstName').value);
        let lastName = String(document.getElementById('lastName').value); 
        let age = Number(document.getElementById('age').value);
        let averageMark = Number(document.getElementById('averageMark').value);

        // add the student to array
        studentArray[studentArray.length] = makeStudent(firstName, lastName, age, averageMark, studentArray.length + 1); 
        tableModule.newStudent();
        isArrayEmpty();
        clearForm();
    }
}

function deleteStudent(btn_id) {
    let row = document.getElementById('row_' + btn_id);
    row.remove();

    deleteFromArray(btn_id);
    isArrayEmpty();
}

function lockButtons() {
    document.getElementById('btn_column').style.display = 'none';
    del = document.querySelectorAll(".delete_btn");
    ed = document.querySelectorAll(".edit_btn");

    del.forEach(function(item) {
        item.style.display = 'none';
    });

    ed.forEach(function(item) {
        item.style.display = 'none';
    });
}

function unlockButtons() {
    document.getElementById('btn_column').style.display = "";
    del = document.querySelectorAll('.delete_btn');
    ed = document.querySelectorAll('.edit_btn');

    del.forEach(function(item) {
        item.style.display = "";
    });

    ed.forEach(function(item) {
        item.style.display = "";
    });
}

function editStudent(btn_id) {
    // highlighting of the row being edited
    document.getElementById('row_' + btn_id).style.backgroundColor = "lightblue";

    // block buttons for editing and deleting
    lockButtons();

    var studentIndex = studentArray.findIndex(function(obj){
        return obj.stud_id === btn_id;
    })
    document.getElementById('firstName').value = studentArray[studentIndex].firstName;
    document.getElementById('lastName').value = studentArray[studentIndex].lastName;
    document.getElementById('age').value = studentArray[studentIndex].age;
    document.getElementById('averageMark').value = studentArray[studentIndex].averageMark;

    button = document.getElementById('main_btn'); 
    button.innerText = 'Save';
    button.setAttribute('onclick', 'saveStudent(' + btn_id + ')');
}

function closeEditing(id) {
    isArrayEmpty();
    clearForm();
    unlockButtons();

    document.getElementById('row_' + id).style.backgroundColor = "";
    button = document.getElementById('main_btn'); 
    button.innerText = 'Add to the table';
    button.setAttribute('onclick', 'addStudent()');
}

function saveStudent(id) {
    if (formValidator()) {
        let firstName = String(document.getElementById('firstName').value);
        let lastName = String(document.getElementById('lastName').value); 
        let age = Number(document.getElementById('age').value);
        let averageMark = Number(document.getElementById('averageMark').value);

        var studentIndex = studentArray.findIndex(function(obj){
            return obj.stud_id === id;
        })
        studentArray[studentIndex] = makeStudent(firstName, lastName, age, averageMark, id); 
        tableModule.editedStudent(id, studentIndex);
    }
}

var studentArray = []; // object array
let newColumn = [6];
let newColumnContent = [6];
let columnsNum = 5;

isArrayEmpty();