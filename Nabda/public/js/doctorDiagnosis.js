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
  const patientId = localStorage.getItem("patientId");
  const loginMail = localStorage.getItem("email");

  /*********************************************************** DataTable  **************************************************************/
  var doctorDiagnosisTable = $('#doctorDiagnosisTable').DataTable({
      //delete ordering table
      ordering:false,
      //delete dynamic entries and make it static
      dom: 'rtip',
      pageLength: 10,
      order: [[ 0, "desc" ]]
      
      });
window.addEventListener("DOMContentLoaded", ()=>{
    
        // reAd the search 
        $('#search').keyup( function() {
        doctorDiagnosisTable.search($('#search').val()).draw();
        } );
    /************************************************************ get Diagnosis  *******************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/doctorDiagnosis/diagnosis`).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists){
                let json = doc.data();
                BuilrNewDiagnosisRow(json);
            }
            else {
                console.log("doc not exists");
            }
        });
    })
    .catch((error) => {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'some thing went wrong while getting the Diagnosis!',
            showConfirmButton: false,
            timer: 1000
        })
    });        
    /*********************************************************** on click rows   **************************************************************/
    $('#doctorDiagnosisTable tbody').on('click', 'tr', handleDiagnoseRowClick);
    function handleDiagnoseRowClick(event){
        const tr = event.currentTarget ;
        const btn = tr.querySelector('button');
        const data = btn.getAttribute("data-set").split("+");
        document.querySelector(".modal-body #DrName").innerHTML = data[0];
        document.querySelector(".modal-body #diagnoseDate").innerHTML = data[1];
        document.querySelector(".modal-body #currentSymptoms").innerHTML = data[2];
        document.querySelector(".modal-body #currentDiagnosis").innerHTML = data[3];
        console.log("clicked");
    }
});// end of event listner
/*********************************************************** Form Modal validation  **************************************************************/

(function () {
    'use strict'
    var forms = document.querySelectorAll('.needs-validation')
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            
            event.preventDefault();
            if (!form.checkValidity()) {
                event.stopPropagation();
                console.log("not valid");
            }
            else {
                console.log("valid");
                const newSymptoms = event.target.newSymptoms.value;
                const newDiagnosis = event.target.newDiagnosis.value;
                addNewDiagnosis(newSymptoms,newDiagnosis,patientId,loginMail);
            }
        form.classList.add('was-validated')
    }, false)
})
})()

/******************************************************* Set New Diagnosis  **********************************************************/

function addNewDiagnosis(newSymptoms,newDiagnosis,patientId,loginMail){
    //get date
    var today = new Date();
    var date = today.getFullYear()+' / '+(today.getMonth()+1)+' / '+today.getDate();
    //get doctor's name
    const DoctorName = localStorage.getItem("name");
    var data = {"newSymptoms":newSymptoms,"newDiagnosis":newDiagnosis,"date":date,"DoctorName":DoctorName};
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/doctorDiagnosis/diagnosis`).add(data)
    .then(() => {
        console.log("Diagnosis inserted successfully !");
        BuilrNewDiagnosisRow(data);
        Swal.fire({
            position: 'top-middle',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          }).then(()=>{
            window.location.reload();
        })
        
    })   
    .catch((error) => {
        console.error("Error writing document: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'some thing went wrong !',
            showConfirmButton: false,
            timer: 1000
        })
    });
}

function BuilrNewDiagnosisRow(data){
    const DoctorName = data.DoctorName;
    const date = data.date;
    const dataid = `${DoctorName}+${date}+${data.newSymptoms}+${data.newDiagnosis}`
    var dataSet = [`<img src="/img/viewPatient/doctor.jpg" class="img-fluid rounded-circle" alt="doctorImg" id="doctorImg">`,
    DoctorName,
    date,
    `<button id="viewBtn" class="btn btn-sm btn-outline-info ml-4 px-3 rounded text-center"type="submit" data-toggle="modal"  data-target="#viewDiagnosis"  data-set="${dataid}">View</button>`
    ];
    doctorDiagnosisTable.row.add(dataSet).draw();
}