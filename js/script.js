// Earliest time the page displays (in military time)
const workTime = 8;

// Latest time the page displays (in military time)
const endTime = 18;


let saveData = [];
/* looping through 24 hours of a day and then
pushing making the array blank*/
for(let i = 0; i < 25; i++){
    saveData.push("");
}

// Get hourly tasks from the local storage
let storageData = JSON.parse(localStorage.getItem("hourlyTasks"));

// If storage data exists, write it to saveData for use on page
if(storageData){
    saveData = storageData;
}

// Create page elements
for (let i = workTime; i < endTime; i++){
    // making a row to then store our time and save button to
    let row = $("<div>").addClass("row time-block").attr("id", i);

    // gets current date from luxon api
    let currentDate = luxon.DateTime.now().toLocaleString(luxon.DateTime.DATE_HUGE);
    
    // shows the current day and year
    $("#currentDay").text(currentDate);

    // gives us what hour it currently is
    let currentHour = luxon.DateTime.fromObject({hour: i}).toLocaleString(luxon.DateTime.TIME_SIMPLE);

    // shows hours
    let hour = $("<div>").addClass("hour col-1").text(currentHour);

    let input = $("<textarea>").addClass("description col-10 past").attr("id", "input").attr("data-id", i).val(saveData[i]);

    let saveButton = $("<button>").addClass("btn saveBtn col-1").html('<i class="fas fa-save"></i>').attr("data-id", i);

    row.append(hour, input, saveButton);
    $(".container").append(row);
}

// Changes the colors of the textareas depending on if theyre in the present or future
function setCurrentHour(){
    let currentHour = luxon.DateTime.now().hour;
    
    let currTextAreaEl = $("#" + currentHour).children("textarea");
    currTextAreaEl.removeClass("past").addClass("present");

    for(let i = currentHour + 1; i < endTime; i++){
        let row = $("#" + i);
        row.children("textarea").removeClass("past").addClass("future");
    }
}

// When the save button is clicked, it saves the related textbox value
function saveInput(saveId){
    let saveString = $("textarea[data-id='" + saveId + "']").val();

    saveData[saveId] = saveString;
    localStorage.setItem("hourlyTasks", JSON.stringify(saveData));
}

// When textarea loses focus, save the data if save button was clicked. Otherwise revert the changes made
$("textarea").on("blur", function(event){
    let textAreaId = $(this).attr("data-id");

    console.log(event.relatedTarget);

    if(event.relatedTarget){
        if(event.relatedTarget.dataset.id === $("button[data-id='" + textAreaId + "']").attr("data-id")){
            saveInput(textAreaId);
        } else {
            $(this).val(saveData[textAreaId]);
        }   
    } else {
        $(this).val(saveData[textAreaId]);
    }
});

setCurrentHour();