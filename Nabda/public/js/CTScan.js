var firebaseConfig = {
    apiKey: "AIzaSyAjI9w1Nyj6QCFhmTOdSYN8SitzTb96pJ0",
    authDomain: "nabdawebapp.firebaseapp.com",
    databaseURL: "https://nabdawebapp-default-rtdb.firebaseio.com",
    projectId: "nabdawebapp",
    storageBucket: "nabdawebapp.appspot.com",
    messagingSenderId: "583448274380",
    appId: "1:583448274380:web:9a9a75834b599ab2bd6969"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var table = $('#MRITable').DataTable({
	//delete ordering table
	ordering:false,
	//delete dynamic entries and make it static
	dom: 'rtip',
	pageLength: 20
	});
  // DataTable
  $(document).ready( function () {
	// reAd the search 
	$('#search').keyup( function() {
	table.search($('#search').val()).draw();
	} );

	$('#MRITable tbody tr').hover(function() {
        $(this).css('cursor','pointer');
    });

    const patientId = localStorage.getItem("patientId");
    const loginMail = localStorage.getItem("email");
    /*********************************************************** get MRIs   **************************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MRIs/MRI`).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists){
                let json = doc.data();
                let URLofMRI = json["URLofMRI"];
                let URLName = json["URLName"];
                let date = json["date"];
                
                console.log("URLofMRI -->",URLofMRI)
                drawMRIRow(URLName, date);
                
            }
            else {
                console.log("doc not exists");
            }
        });
    })
    .catch((error) => {
        console.error(error);
    });
})

/**************************************************** Set MRI Segmentation *******************************************************/
// Not the best Need some improvments (for only uploading one file at a time) ---------------------------------------->  
const patientId = localStorage.getItem("patientId");
const loginMail = localStorage.getItem("email");
$('#file-upload').change(function(e){
    files = e.target.files;
    if (files.length != 0) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5000/patientList/patient/ctScan/MRI-result',
            dataType: "text", 
            success: function(response) { 
                // upload result to firebase 
                const task = firebase.storage().ref(`MRIs/${files[0].name}`).put(files[0]);
                console.log("here we go")
                //get current data
                var today = new Date();
                var date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();  
                //build new row 
                drawMRIRow(response, date);
                //upload url path to firestore
                Swal.fire({
                    position: 'top-middle',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(response);
                task
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(url => {
                  firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MRIs/MRI`).add({
                    "URLName" : response,
                    "URLofMRI" : url,
                    "date" : date
                  })
                  // need to change doctor's mail (temp) 
                  firebase.firestore().collection(`accounts/marwan@gmail.com/users/${patientId}/patientData/MRIs/MRI`).add({
                    "URLName" : response,
                    "URLofMRI" : url,
                    "date" : date
                })
                })
                

            }, // end of success 
            error: function(xhr, status, err) {
            console.log(xhr.responseText);
            // failed msg 
            Swal.fire({
                position: 'top-middle',
                icon: 'error',
                title:"Oops",
                text:"something went wrong",
                showConfirmButton: false,
                timer: 1500
            })
            }
        });
    }
    else {
        alert("No file chosen");
        Swal.fire({
            position: 'top-middle',
            icon: 'error',
            test:"No file chosen",
            showConfirmButton: false,
            timer: 1500
        })
    }  

});

function drawMRIRow(URLName,date){
    let fileName = URLName.substring(2,URLName.length -2);
        
    var dataSet = [`<div>
    <img src="/img/viewPatient/document.svg" class="img-fluid rounded d-inline mr-3" alt="doctorImg" id="doctorImg"> 
     <h5 id="doctorName" class="d-inline">${fileName}</h5>
    </div>`,date,`<td class="text-right pl-3  align-middle"> <button class="btn btn-sm btn-outline-info ml-5 px-3 rounded "
    type="submit" data-toggle="modal" data-target="#MRIModal">View</button>
    </td>`];
    table.row.add(dataSet).draw();
}