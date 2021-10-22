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
  var table = $('#medicalTestTable').DataTable({
	//delete ordering table
	ordering:false,
	//delete dynamic entries and make it static
	dom: 'rtip',
	pageLength: 10
});
// DataTable
$(document).ready( function () {
    

    const patientId = localStorage.getItem("patientId");
    const loginMail = localStorage.getItem("email");
    firebase.firestore().collection('accounts').doc(loginMail).onSnapshot((doc) => {
        if(doc.data().role =="Cardiologist"){
            document.getElementById("addmedicalTest").style.display = "none"; 
        }
    });
    // read the search 
	$('#search').keyup( function() {
        table.search($('#search').val()).draw();
	} );
    
	$('#medicalTestTable tbody tr').hover(function() {
        $(this).css('cursor','pointer');
    });
    
    /*************************************************************** Dynamic rows ***********************************************************/
        
    $('#medicalTestTable tbody').on('click', 'tr', handleRowClick);
    function handleRowClick(event){
        const tr = event.currentTarget ;
        const imgsrc = tr.querySelector('h5').id;
        const innerModal = document.querySelector(".modal-body");
        innerModal.innerHTML = `
        <div class="container-fluid">
        <img src=${imgsrc} alt="test-result" >

        <div class="modal-footer pr-4">
            <button type="button" class="btn btn-secondary text-center" data-dismiss="modal">Close</button>
        </div>
        </div>
        `
        console.log("clicked");
    }

   /********************************************************* get MEdicalTests   *******************************************************/
   firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MedicalTests/Test`).get()
   .then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
           if (doc.exists){
               let json = doc.data();
               let URLofPdf = json["URLofPdf"];
               let URLName = json["URLName"];
               let date = json["date"];
               buildMedicalTestrow(URLofPdf, URLName, date);
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

/**************************************************** Set MedicalTest *******************************************************/
const patientId = localStorage.getItem("patientId");
const loginMail = localStorage.getItem("email");
$('#test-upload').change(function(e){
    files = e.target.files;
    if (files.length != 0) {
        const task = firebase.storage().ref(`MedicalTests/${files[0].name}`).put(files[0]);
        //build new row
        const testName = files[0] ;
        //upload url path to firestore
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          var today = new Date();
          var date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();     
          
            Swal.fire({
                position: 'top-middle',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
          //draw new row 
          buildMedicalTestrow(url,testName.name,date);
          firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MedicalTests/Test`).add({
            "URLName" : testName.name,
            "URLofPdf" : url,
            "date":date
          })
          // need to change doctor's mail 
          firebase.firestore().collection(`accounts/marwan@gmail.com/users/${patientId}/patientData/MedicalTests/Test`).add({
            "URLName" : testName.name,
            "URLofPdf" : url,
            "date":date
            })
        })
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

function buildMedicalTestrow(testUrl, testName, date) {        
    var dataSet = [
    `<div class="align-left text-left ml-3" >
    <img src="/img/viewPatient/document.svg" class="img-fluid rounded d-inline mr-3" alt="doctorImg" id="doctorImg"> 
     <h5 class="d-inline" id=${testUrl}>${testName}</h5>
    </div>`,
    date,
    `<td class="text-right pl-3  align-middle" ">
    <button class="btn btn-sm btn-outline-info ml-5 px-3 rounded "
    type="submit" data-toggle="modal"data-target="#MedicalTestModal">View</button>
    </td>`];
    table.row.add(dataSet).draw();

}
