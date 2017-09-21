// Initialize Firebase
var config = {
  apiKey: "AIzaSyBdBS7Pa2Cln8xJD8ZEcl4eWWUO2mZE26c",
  authDomain: "train-f6cf7.firebaseapp.com",
  databaseURL: "https://train-f6cf7.firebaseio.com",
  projectId: "train-f6cf7",
  storageBucket: "train-f6cf7.appspot.com",
  messagingSenderId: "493535797696"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Train Schedule
$("#add-trainSchedule-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainNum = $("#trainNum-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = moment($("#firstTrainTime-input").val().trim(), "hh:mm").format("X");
  var frequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train schedule data
  var newTrainSched = {
    name: trainNum,
    dest: destination,
    start: firstTrain,
    rate: frequency
  };

  // Uploads train schedule data to the database
  database.ref().push(newTrainSched);

  // Console Log during DB write
  console.log(newTrainSched.name);
  console.log(newTrainSched.dest);
  console.log(newTrainSched.start);
  console.log(newTrainSched.rate);

  // Alert
  alert("Spell cast successfully - Train Schedule added!");

  // Clears all of the text-boxes
  $("#trainNum-input").val("");
  $("#destination-input").val("");
  $("#firstTrainTime-input").val("");
  // $("#frequency-input").val("");

});

// 3. Create Firebase event for adding train schedule to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().start;
  var trainRate = childSnapshot.val().rate;

  // Console log during DB read
  console.log(trainName);
  console.log(trainDest);
  console.log(trainStart);
  console.log(trainRate);
 
  var diffTime = moment().diff(moment.unix(trainStart), "minutes");
  var momentTravis = moment().format("X");

  var timeRemainder = moment().diff(moment.unix(trainStart), "minutes") % trainRate;
  var minutes = trainRate - timeRemainder;

  // Prettify the next train start
  var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
  
  // Add each train's data into the table
  $("#train-table > tbody")
    .append($("<tr>").data('id', childSnapshot.key)
      .append($("<td>").text(trainName))
      .append($("<td>" + trainDest + "</td>"))
      .append($("<td>" + trainRate + "</td>"))
      .append($("<td>" + nextTrainArrival + "</td>"))
      .append($("<td>" + minutes + "</td>"))
      .append($("<td>")
        .append($("<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>"))
      ));
});

$("body").on("click", ".remove-train", function() {
     $(this).closest ('tr').remove();
     database.ref($(this).data('id')).remove(); // use id on create, append to button
});
