// Хотянович Эрик (2 группа)

// port JSON-server
let port = 3000;
let rootURL = 'http://localhost:' + port.toString() + '/students';

// objects array
var students = []; 

// display array from JSON
$(window).load(function() {
    $.renderStudents();
});

$.renderStudents = function () {
    $('tbody tr').remove();

    $.getJSON(rootURL, function(data) {
        for (var i = 0; i < data.length; i++) {
            students[i] = data[i];

            let ID = data[i].id;
            $.displayStudent(i, ID);
        }

        $.isArrayEmpty();
    });
}

// count average mark among all students
$.findAverageMark = function (size) {
    let sum = 0;

    for (let i = 0; i < size; i++)
        sum += students[i].averageMark;
    
    return parseFloat( sum / size ).toPrecision(3);
}

// add a new student to the table
$.displayStudent = function (index, ID) {
    let newColumn = [6];
    let columnsNum = 5;

    let newRow = $('<tr id="row_' + ID + '"></tr>');

    for (let j = 0; j < columnsNum; j++)
        newColumn[j] = $('<td></td>');

    newColumn[1].attr('id', 'name_id_' + ID);
    newColumn[2].attr('id', 'lastName_id_' + ID);
    newColumn[3].attr('id', 'age_id_' + ID);
    newColumn[4].attr('id', 'averageMark_id_' + ID);

    newColumn[0].text(index + 1);
    newColumn[1].text(students[index].firstName);
    newColumn[2].text(students[index].lastName);
    newColumn[3].text(students[index].age);
    newColumn[4].text(students[index].averageMark);

    for (let j = 0; j < columnsNum; j++)
        newRow.append(newColumn[j]);

    // delete and edit buttons
    let deleteButton = $('<button class="delete_btn" onclick="$.deleteStudent(' + ID + ')">Delete</button>');
    let editButton = $('<button class="edit_btn" onclick="$.editStudent(' + ID + ')">Edit</button>');

    deleteButton.attr('id', 'del_btn_' + ID);
    editButton.attr('id', 'edt_btn_' + ID);

    newRow.append(editButton);
    newRow.append(deleteButton);
    $('tbody').append(newRow);

    ID += 1;
}

$.isArrayEmpty = function() {
    let size = students.length;

    if (size == 0) {
        $("#info").text("Try to add a student using the form below");
        $("table").css("display", "none");
    } 
    else {
        $("#info").text("Average mark among all students: " + $.findAverageMark(size));
        $("table").css("display", "table");
    }
}

// checking if inputs are right
$.formValidator = function () {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val(); 
    var age = $('#age').val();
    var averageMark = $('#averageMark').val(); 

    if (firstName == "" 
        || lastName == "" 
        || age == "" || age <= 0 
        || age > 100 
        || (averageMark == "" && averageMark != 0) 
        || averageMark < 0 
        || averageMark > 10) {
        $('#error_message').css("display", "block");

        setTimeout(function() {
            $('#error_message').css("display", "none");
        }, 4000);

        return false;
    } else {
        for (var i = 0; i < firstName.length; i++) {
            if (firstName[i] == " ") {
                $('#error_message').css("display", "block");
                setTimeout(function() {
                    $('#error_message').css("display", "none");
                }, 4000);

                return false;
            }   
        }

        for (var i = 0; i < lastName.length; i++) {
            if (lastName[i] == " ") {
                $('#error_message').css("display", "block");
                setTimeout(function() {
                    $('#error_message').css("display", "none");
                }, 4000);

                return false;
            }   
        }

        return true;
    }
}

// post an array to JSON-server
$.postJSON = function(url, data, success, args) {
    args = $.extend({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: success
    }, args);

    return $.ajax(args);
}

$.editJSON = function(url, data, success, args) {
    args = $.extend({
        url: url,
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: success
    }, args);

    return $.ajax(args);
}

$.clearForm = function () {
    $('#form')[0].reset();
}

$.makeStudent = function (firstName, lastName, age, averageMark) {
    return {
        firstName: firstName,
        lastName: lastName,
        age: age,
        averageMark: averageMark
    };
}

$.deleteFromArray = function (btn_id) {
    students.splice(students.findIndex(function(i) {
        return i.id === btn_id;
    }), 1);
}

$.lockButtons = function () {
    $('#btn_column').css("display", "none");
    $(".delete_btn, .edit_btn").each(function() {
        $(this).css("display", "none");
    });
}

$.unlockButtons = function () {
    $('#btn_column').css("display", "");
    $(".delete_btn, .edit_btn").each(function() {
        $(this).css("display", "");
    });
}

$.saveStudent = function (id) {
    if ($.formValidator()) {
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val(); 
        let age = Number($('#age').val());
        let averageMark = Number($('#averageMark').val());

        var studentIndex = students.findIndex(function(obj){
            return obj.id === id;
        });

        let student = $.makeStudent(firstName, lastName, age, averageMark);
        students[studentIndex] = student; // changing local array

        // edit a JSON element
        $.editJSON(rootURL + '/' + id, student);

        $.editedStudent(id, studentIndex);
    }
}

$.editedStudent = function (id, studentIndex) {
    let firstName = $('#name_id_' + id);
    let lastName = $('#lastName_id_' + id); 
    let age = $('#age_id_' + id);
    let averageMark = $('#averageMark_id_' + id);

    firstName.text(students[studentIndex].firstName);
    lastName.text(students[studentIndex].lastName);
    age.text(students[studentIndex].age);
    averageMark.text(students[studentIndex].averageMark);

    $.isArrayEmpty();
    $.clearForm();
    $.unlockButtons();

    $('#row_' + id).css("backgroundColor", "");
    button = $('#main_btn'); 
    button.text('Add to the table');
    button.attr('onclick', '$.addStudent()');
}





///////////////// ADD A STUDENT /////////////////
$.addStudent = function () {
    if ($.formValidator()) {
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val(); 
        let age = Number($('#age').val());
        let averageMark = Number($('#averageMark').val());

        let student = $.makeStudent(firstName, lastName, age, averageMark); 
        $.postJSON(rootURL, student);
        
        $.renderStudents();
        $.clearForm();
        $.isArrayEmpty();
    }
}

///////////////// EDIT A STUDENT /////////////////
$.editStudent = function (btn_id) {
    // highlighting of the row being edited
    $('#row_' + btn_id).css("backgroundColor", "lightblue");
    // block buttons for editing and deleting
    $.lockButtons();

    var studentIndex = students.findIndex(function(obj){
        return obj.id === btn_id;
    });

    $('#firstName').val(students[studentIndex].firstName);
    $('#lastName').val(students[studentIndex].lastName);
    $('#age').val(students[studentIndex].age);
    $('#averageMark').val(students[studentIndex].averageMark);

    button = $('#main_btn'); 
    button.text('Save');
    button.attr('onclick', '$.saveStudent(' + btn_id + ')');
}

//////////////// DELETE A STUDENT ////////////////
$.deleteStudent = function (btn_id) {
    // delete an element from JSON
    $.ajax({
        url: rootURL + '/' + btn_id,
        type: 'DELETE',
        success: function(result) {
            $.deleteFromArray(btn_id);
            $('#row_' + btn_id).remove();
            $.isArrayEmpty();
        },
        error: function(request,msg,error) {
            alert("Server error");
        }
    });
}

effects();

// hover effects (doesnt work for some reason)
function effects () {
    let id;
    $('.delete_btn, .edit_btn').hover(function(){ 
        id = String($(this).attr('id'));
        id = id.slice(8);

        $('#row_' + id).css( "backgroundColor", "cornsilk" );
    }, function () { 
        $('#row_' + id).css( "backgroundColor", "" );
    });
};