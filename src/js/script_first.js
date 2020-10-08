//Global object containing the url for the server
let host = new Object();
host.url = "http://studenter.miun.se/~olan1700/dt057g/php_rest/";


// Async Function for retrieving the data from the APi with Fetch and GET
const reqData = async (url) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}
// Function for getting the data using promise
const getData = (url, func) => {
    func(url)
        .then(data => {
            displayData(data);
        })
        .catch((err) => {
            console.log("Fetch error " + err)
        })
}
// Function for GET single row and delete row
const PostData = async (url, method) => {
    if (method === 'GET') {
        const response = await fetch(url, {
            method: 'GET',
        });
        return response.json();
    } else {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        return response.json();
    }
}
const addData = (courseID, coursename, progression, syllabus) => {

    const jsonStr = JSON.stringify({
        courseID: courseID,
        coursename: coursename,
        progression: progression,
        courseSyllabus: syllabus
    });
    fetch(host.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonStr
    }).then((res) => {
        if(res.status !== 200){
            message("Kurs inte tillagd!", true, "wrapper");
            return;
        }
        message("Kurs tillagd!", true, "wrapper");
        getData(host.url, reqData);
        document.getElementById("course").reset();
        res.json()})
        .then(data => {
            console.log(data);

        }).catch(err => console.error("Fetch error:", err));
}
// Function for editing existing course
const editData = (data) => {
    document.querySelector("#course_edit h3").innerHTML = "Ändra kurs " + data.coursename;
    let formelement = [...document.getElementById("course_edit").elements].filter(item => item.id !== "editCourse");
    const arr = [data.courseID, data.coursename, data.progression, data.courseSyllabus];
    let count = 0;
    formelement.forEach(element => {
        element.value = arr[count];
        count++;
    });
    document.getElementById("course_edit").addEventListener('submit', function (e) {
        e.preventDefault();
        // add all elements in the array forms
        let forms = [...document.getElementById("course_edit").elements].filter(item => item.id !== "editCourse");
        let formsvalues = [];
        // Using foreach to push every form element value to the array formsvalue
        forms.forEach(item => {
            formsvalues.push(item.value);
        })
        // Created a json object for sending to the server
        const jsonData = JSON.stringify({
            ID: data.ID,
            courseID: formsvalues[0],
            coursename: formsvalues[1],
            progression: formsvalues[2],
            courseSyllabus: formsvalues[3],
        })
            // Use fetch for updating table row
            fetch(host.url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            }).then((res) => {
                //IF status code is not 200 call message and send error 
                if(res.status !== 200){
                    document.getElementById("edit_form").style.display = "none";
                    message("Kurs inte ändrad!", true, "wrapper");
                    return;
                }
                document.getElementById("edit_form").style.display = "none";
                message("Kurs ändrad!", true, "wrapper");
                getData(host.url, reqData);
                res.json()})
                .then(data => {
                    console.log(data);

                }).catch(err => console.error("Fetch error:", err));
    });
}

const displayData = (data) => {
    if (document.getElementById("display_data")) {
        document.getElementById("display_data").remove();
    }
    parent = document.getElementById("courses");
    table = document.createElement('table');
    table.id = "display_data";
    tablehead = document.createElement('thead');
    tableBody = document.createElement("tbody");
    tr = document.createElement('tr');
    parent.appendChild(table);

    tr.innerHTML += "<th>KursKod</th>" +
        "<th>Kursnamn</th>" +
        "<th>Progression</th>" +
        "<th>Kursplan</th>" +
        "<th>Ändra</th>";
    "<th>Radera</th>";
    table.appendChild(tr);

    table.appendChild(tr);
    const createData = () => {
        data.forEach(element => {
            tr = document.createElement("tr");
            tr.innerHTML = "<td>" + element.courseID +
                "</td><td>" + element.coursename + "</td><td>" + element.progression + "</td><td><a href=" +
                element.courseSyllabus + " target='_blank'>Webblänk</a></td><td class='edit' id='" + element.ID + "'>Ändra</td><td class='remove' id='" + element.courseID + "'>&#10005;</td>";
            table.appendChild(tr);
        });
        //Event listerner for the remove buttons
        document.querySelectorAll('.remove').forEach(item => {
            item.addEventListener("click", function () {
                if (window.confirm("Säker på att du vill ta bort kursen?")) {
                    PostData(host.url+"?courseID="+ this.getAttribute('id'))
                        .then(data => {
                            console.log(data)
                            this.parentNode.remove();
                            message("Kurs raderad!", true, "wrapper");
                        })
                        .catch((err) => {
                            console.log("Fetch error " + err)
                        })
                }
            });
        });
        //Event listerner for the edit button
        document.querySelectorAll('.edit').forEach(item => {
            item.addEventListener("click", function () {
                PostData(host.url+"?ID=" + this.getAttribute('id'), 'GET')
                    .then(data => {
                        document.getElementById("edit_form").style.display = "block";
                        editData(data);
                    })
                    .catch((err) => {
                        console.log("Fetch error " + err)
                    })
            });
        });
    }
    createData();
}
window.onload = () => {
    getData(host.url, reqData);
}