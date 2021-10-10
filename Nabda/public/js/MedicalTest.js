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
	pageLength: 20
	});
  // DataTable
  $(document).ready( function () {
	// reAd the search 
	$('#search').keyup( function() {
	table.search($('#search').val()).draw();
	} );

	$('#medicalTestTable tbody tr').hover(function() {
        $(this).css('cursor','pointer');
    });

    const patientId = localStorage.getItem("patientId");
    const loginMail = localStorage.getItem("email");
   /********************************************************* get MEdicalTests   *******************************************************/
   firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MedicalTests/Test`).get()
   .then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
           if (doc.exists){
               let json = doc.data();
               let URLofPdf = json["URLofPdf"];
               let URLName = json["URLName"];
               let date = json["date"];
               
               console.log("URLofPdf -->",URLofPdf);

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
// Not the best Need some improvments (for only uploading one file at a time) ---------------------------------------->  
const patientId = localStorage.getItem("patientId");
const loginMail = localStorage.getItem("email");
$('#test-upload').change(function(e){
    files = e.target.files;
    if (files.length != 0) {
        const task = firebase.storage().ref(`MedicalTests/${files[0].name}`).put(files[0]);
        console.log("here we go")
        //build new row
        const testName = files[0] ;
        console.log(URL.createObjectURL(testName))
        //upload url path to firestore
        Swal.fire({
            position: 'top-middle',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        })
        
        task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          var today = new Date();
          var date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();     
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
    var dataSet = [`<div>
    <img src="/img/viewPatient/document.svg" class="img-fluid rounded d-inline mr-3" alt="doctorImg" id="doctorImg"> 
     <h5 id="doctorName" class="d-inline">${testName}</h5>
    </div>`,date,`<td class="text-right pl-3  align-middle"> <button class="btn btn-sm btn-outline-info ml-5 px-3 rounded "
    type="submit" data-toggle="modal"data-target="#MedicalTestModal">View</button>
    </td>`];

    table.row.add(dataSet).draw();
    document.getElementById("medicalTestImg").src=  testUrl;

}