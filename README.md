# Nabda WebApp 

**Website for doctors using Nabda's DigitalTwin System**
## Overview 
Nabda is a **Digital Twin** for the human heart, a smartwatch that is reading and sending heartbeats and vital signals instantly to our machine learning module to analyze and classify any irregular signals are detected from those real-time data that might be one of the 14 arrhythmias we diagnose.
**Patients** can monitor their heart status and vitals through our mobile application too, which is also connected to their nearest local hospital for automatic calls for help in any emergency case, attached with the diagnosis and heart rate interval.
**Cardiologists** are having the access to the vital signals and the full medical history about their patients. 
## Features
- Asynchronous and fully responsive web app. 
- Access patient vital signal 24/7h.
- get the irregular signals of the ECG test.
- Access the full medical history added by another cardiologist.
- Add new diagnosis.
- Have a look at the current medicines the patient has, to avoid any conflicts.
- Add new medicines for the patient to have, easily.
- Access the entered MRIs and get our segmentation.
- Access medical tests/ blood tests.
- Adding MRIs/ MedicalTests (only the radiologists' can)
- Access Patient lifestyle that might affect his health

## Technologies

Nabda uses a number of open-source projects to work properly here are some of them:
- `jQuery` : duh
- `node.js` : evented I/O for the backend
- `Express` : fast node.js network app framework
- `fireBase` :  manage backend infrastructure
- `python shell` : simple way to run Python scripts from Node.js 
- `Bootstrap4` : great UI boilerplate for modern web apps
- `Datatable` : plugin for creating table listings and adding interactions to them
- `plotly` : provides online graphing, analytics, and statistics
- `sweetalert2` : (WAI-ARIA) replacement for JavaScript's popup boxes
- `AOS` : some amaizing animations
 
> Note : I didn't use front end frameworks to make it more challenging, but it was a huge mistake, lol


## Installation
**After downloading or cloning this repo. to install the npm packages used in this app:**
1- Open the terminal.
2- make sure you are in the right directory.
3- Run the following command to install all the dependencies globally: 

Install the dependencies and devDependencies and start the server.
```
npm install -g
```

4- It might take a couple of minutes but after that write

```
node server.js
```
5- open ur browser n write localhost:5000 in ur url 
> Note: Nabda requires [Node.js](https://nodejs.org/) v10+ to run.
