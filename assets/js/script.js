// military time
const startDay = 8;
const endDay = 18;


let saveData = [];
/* looping through 24 hours of a day and then
pushing blank quotes into the array fields inside localStorage until filled out by user */
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
for (let i = startDay; i < endDay; i++){
    // making a row to then store our time and save button to
    let row = $("<div>").addClass("row time-block").attr("id", i);

    // gets current date from luxon api
    let todaysDate = luxon.DateTime.now().toLocaleString(luxon.DateTime.DATE_HUGE);
    
    // shows the current day and year
    $("#currentDay").text(todaysDate);

    // gives us what hour it currently is
    let currenthour = luxon.DateTime.fromObject({hour: i}).toLocaleString(luxon.DateTime.TIME_SIMPLE);

    let hours = $("<div>").addClass("hour col-1").text(currenthour);
    
    let input = $("<textarea>").addClass("description col-10 past").attr("id", "input").attr("data-id", i).val(saveData[i]);

    let saveButton = $("<button>").addClass("btn saveBtn col-1").html('<i class="fas fa-save"></i>').attr("data-id", i);

    // appending our hours, input, and saveButton on the screen inside our container class in html
    row.append(hours, input, saveButton);
    $(".container").append(row);
}

/* Changes the colors of the textareas
 depending on if they are in the present 
 or future */
const setCurrenthour = () => {
    let currenthour = luxon.DateTime.now().hour;
    
    let currTextAreaEl = $("#" + currenthour).children("textarea");
    currTextAreaEl.removeClass("past").addClass("present");

    for(let i = currenthour + 1; i < endDay; i++){
        let row = $(`#${i}`);
        row.children("textarea").removeClass("past").addClass("future");
    }
}

// When the save button is clicked, it saves the related textbox value
const saveInput = saveId => {
    let saveTask = $(`textarea[data-id="${saveId}"]`).val();

    saveData[saveId] = saveTask;
    localStorage.setItem("hourlyTasks", JSON.stringify(saveData));
}

/* save the data if save button was clicked.
Otherwise revert the changes made */
$("textarea").on("blur", function(event){
    let textAreaId = $(this).attr("data-id");
    
    console.log(event.relatedTarget);
    
    if(event.relatedTarget){
        if(event.relatedTarget.dataset.id === $(`button[data-id="${textAreaId}"]`).attr("data-id")){
            let savedText = $("#storage-updated")

            saveInput(textAreaId);
            
            // display message and then hide after 2second
            savedText.html("Task has been updated in LocalStorage " + `<i class="fas fa-check-double"></i>`).addClass("text-center").show();
            setTimeout(() => {
                savedText.hide()
            }, 2000);
        } else {
            $(this).val(saveData[textAreaId]);
        }   
    } else {
        $(this).val(saveData[textAreaId]);
    }
    
});

setCurrenthour();
