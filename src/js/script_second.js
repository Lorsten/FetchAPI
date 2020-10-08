
// Using a promise to remove message after 3 seconds
const handleMessage = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('finished');
        }, 3000);
    });
}
//Function for removing message after promise is finished
const removeMessage = async () => {
    const remove = await handleMessage();
    if (remove) {
        if(document.getElementById("message")){
            document.getElementById("message").remove();
        }
    }
}


// Function for creating and displaying errormessage. Three parameters is used, the message, if a timmer should be used, and the parentelement
const message = (message, timer, parentElement) => {
    let parent = document.getElementById(parentElement);
    if (document.getElementById('message')) {
        while (document.getElementById('message').lastChild) {
            document.getElementById('message').lastChild.remove();
        }
    }

    if (!document.getElementById('message')) {
        let element = document.createElement("div");
        element.id = "message";
        if (Array.isArray(message)) {
            parent.appendChild(element);
            element.innerHTML = "<h4>Det har blivit något fel! </h4>";
            message.forEach(item => {
                element.innerHTML += "<h4>" + item + "</h4>";
            })
        } else {
            parent.insertBefore(element, document.getElementById("course"));
            element.innerHTML = "<h3>" + message + "</h3>";
            if (timer) {
                removeMessage();
            }
        }
    } else if (Array.isArray(message)) {
        document.getElementById('message').innerHTML = "<h4>Det har blivit något fel! </h4>";
        message.forEach(item => {
            document.getElementById('message').innerHTML += "<h4>" + item + "</h4>";
        })
    } else {
        parent.insertBefore(document.getElementById('message'), document.getElementById("course"));
        document.getElementById('message').innerHTML = "<h3>" + message + "</h3>";
        if (timer) {
            removeMessage();
        }
    }
}




// Eventlistener for validating the formdata
document.getElementById("course").addEventListener('submit', function (e) {

    /* create an array with the form elements using first a spread operator to fill an array with all the form elements
     and then using filter on the created array adding all elements expect for the id addCourse which is the submit button */
    formelement = [...this.elements].filter(item => item.id !== "addCourse");
    // Array for storing the inputed values
    let formvalue = [];
    // array for storing the id of filed inputed wrong
    let errorInput = [];
    e.preventDefault();
    // Using a foreach loop on the formelement array
    formelement.forEach(element => {
        if (element.getAttribute('id') === "progression") {
            if (element.value.length > 1) {
                errorInput.push("Fältet "+element.name + " kan bara var en bokstav långt");
            }
            else if(element.value.length > 0){
                formvalue.push(element.value);
            }
            else{
                errorInput.push("Fältet "+element.name+" är tomt!");
            }
        } else if (element.value.length < 1) {
            errorInput.push("Fältet "+element.name+" är tomt!");
        } else {
            formvalue.push(element.value);
        }
    });
    // If errors send message else call function addData using spread operator with the value from the forms
    if (errorInput.length > 0) {
        message(errorInput, false, "wrapper");
    } else {
        addData(...formvalue);
    }
});
    
document.getElementById("close").addEventListener("click", function () {
    if (confirm("säker på att du vill avbryta?")) {
        document.getElementById("edit_form").style.display = "none";
    }
});