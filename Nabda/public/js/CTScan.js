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
    
  firebase.firestore().collection('accounts').doc(loginMail).onSnapshot((doc) => {
      if(doc.data().role =="Cardiologist"){
          document.getElementById("addCTScan").style.display = "none";
      }
  });
  var table = $('#MRITable').DataTable({
	//delete ordering table
	ordering:false,
	//delete dynamic entries and make it static
	dom: 'rtip',
	pageLength: 10
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
    
    /*********************************************************** get MRIs   **************************************************************/
    firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MRIs/MRI`).get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.exists){
                let json = doc.data();
                let inImgName = json["inImgName"];
                let outImgName = json["outImgName"];
                let date = json["date"];
                drawMRIRow(inImgName,outImgName, date);
            }
            else {
                console.log("doc not exists");
            }
        });
    })
    .catch((error) => {
        console.error(error);
    });
    /*********************************************************** on click rows   **************************************************************/

    $('#MRITable tbody').on('click', 'tr', handleRowClick);
    function handleRowClick(event){
        const tr = event.currentTarget ;
        console.log(tr);
        const imgsrc = tr.querySelector('h5').id;
        const inImgSrc = "/img/Out_img/Original/" + imgsrc.split('/')[0];
        const outImgSrc = "/img/Out_img/"+ imgsrc.split('/')[1];
        const innerModal = document.querySelector(".modal-body");
        innerModal.innerHTML = `
        <div class="row container-fluid text-uppercase font-weight-bold text-secondary ">
        <div class="col">
            <h5 > Result </h5>
            <img src="${inImgSrc}" class="m-4 w-75 rounded h-75 " >
        </div>
        <div class="col">
            <h5 > Take care of </h5>
            <img src="${outImgSrc}" class="mt-3 w-100 rounded h-75 border-left border-secondary" >
        </div>
        </div>
        `
        console.log("clicked");
    }
})//end of eventlistner 

/**************************************************** Set MRI Segmentation *******************************************************/
// (for only uploading one file at a time)

$('#file-upload').change(function(e){
    files = e.target.files;
    const formData = new FormData();
    formData.append('uploads', files[0], files[0].name);
    var csrf=$("#csrf").val();
    if (files.length != 0) {
    $.ajaxSetup({
        headers: {
        'X-CSRF-Token': csrf
        }
    });
    $.ajax({
        type: 'POST',
        url: 'http://localhost:5000/patientList/patient/ctScan/MRI-result',
        data:formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) { 
            console.log("here we go")
            //get current data
            var today = new Date();
            var date = today.getDate()+' / '+(today.getMonth()+1)+' / '+today.getFullYear();  
            //get input n output img
            console.log(response) 
            var imgs = response[0].split('/');
            var outImgName = "Seg"+imgs[0];
            var inImgName = imgs[1];

            Swal.fire({
                position: 'top-middle',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            })
            //build new row 
            drawMRIRow(inImgName,outImgName, date);
            //upload url path to firestore
            firebase.firestore().collection(`accounts/${loginMail}/users/${patientId}/patientData/MRIs/MRI`).add({
                "inImgName" : inImgName,
                "outImgName" : outImgName,
                "date" : date
            })
            // static mail just for testing ->
            firebase.firestore().collection(`accounts/marwan@gmail.com/users/${patientId}/patientData/MRIs/MRI`).add({
                "inImgName" : inImgName,
                "outImgName" : outImgName,
                "date" : date
            })
        }, // end of success 
        error: function(xhr, status, err) {
        // console.log(xhr.responseText);
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

function drawMRIRow(inImgName,outImgName, date){ 
    console.log("in",inImgName);
    console.log("out",outImgName);

    const id = inImgName+'/'+outImgName;
    var dataSet = [
    `<div class="align-left text-left ml-3">
    <img src="/img/viewPatient/document.svg" class="img-fluid rounded d-inline mr-3"> 
    <h5 class="d-inline" id="${id}">${inImgName}</h5>
    </div>`,
    date,
    `<td class="text-right pl-3 align-middle"> <button class="btn btn-sm btn-outline-info ml-5 px-3 rounded "
    type="submit" data-toggle="modal" data-target="#MRIModal">View</button>
    </td>`];
    table.row.add(dataSet).draw();
}