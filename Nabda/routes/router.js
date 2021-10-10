const express = require('express');
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { PythonShell } = require('python-shell');

const routes = express.Router();


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nabdawebapp-default-rtdb.firebaseio.com",
});

routes.get("/patientList", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("patientList.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  });
  


  routes.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
  
    const expiresIn = 60 * 60 * 24 * 2 * 1000;
  
    admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          const options = { maxAge: expiresIn, httpOnly: true };
          res.cookie("session", sessionCookie, options);
          res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
          res.status(401).send("UNAUTHORIZED REQUEST!");
        }
      );
  });
  

  routes.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
  });
  

  
  routes.get("/profile", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("profile.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    // res.render("profile.html");
  });


  //rest of the 
  routes.get("/contactUs",  (req, res) =>{ // no 
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("contactUs.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
  
  });
  


  routes.get("/patientList/:id", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        console.log(sessionCookie);
        res.render("viewPatient.html");
  
      })
      .catch((error) => {
        res.redirect("/login");
      });
    // res.render("viewPatient.html");
  });
  


  routes.get("/patientList/patient/ctScan", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("ctScan.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    // res.render("ctScan.html");
  });
// MRI segmentation

  routes.get("/patientList/patient/ctScan/MRI-result", function (req, res) {
    console.log('run python');
    let options = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './projects',
         args: ['arg1']
    };
    PythonShell.run('MRI.py', options, function(err, results) {
        if (err) console.log(err);
            // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        res.send(results)
    });
    console.log("py script is done")
  });


  routes.get("/patientList/patient/medicine", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("medicine.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    res.render("medicine.html");
  });



  routes.get("/patientList/patient/doctorDiagnosis", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("doctorDiagnosis.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    res.render("doctorDiagnosis.html");
  
  });



  routes.get("/patientList/patient/ecgResult", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("ecgResult.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    res.render("ecgResult.html");
  });



  routes.get("/patientList/patient/medicalTest", function (req, res) {
    const sessionCookie = req.cookies.session || "";
  
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true /** checkRevoked */)
      .then(() => {
        res.render("medicalTest.html");
      })
      .catch((error) => {
        res.redirect("/login");
      });
    res.render("medicalTest.html");
  });
  
  
  

  


  module.exports = routes;
