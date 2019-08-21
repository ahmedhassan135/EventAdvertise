var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var app	= express();
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/Xflow';
var Schema = mongoose.Schema;
var instance;
var db= mongoose.connection;
var Model,saveInstance;
mongoose.connect(mongoDB, {vseNewUrlParser: true});
db.on('error',console.error.bind(console, 'mongoDB connection error:'));
db.once('open',function(calllback){
	console.log('Connection Succeded');
});


function checkUniversityName(uni)
{
	if (uni == '1'){
		return 'IMS';
	}else if (uni == '2'){
		return 'NUST';
	}
	else if (uni == '3'){
		return 'GIKI';
	}
	else if (uni == '4'){
		return 'CUST';
	}
	else if (uni == '5'){
		return 'FAST';
	}
}

var model_schema = new Schema({
  Email: String,
  Name : String,
  PNumber: String,
  City: String,
  Password: String,
  CPassword: String,
  University: String,
});
//Event Schema
var eventSchema = new Schema({
   Name: String,
	 Email: String,
	 Contact: String,
	 RegisLink:String,
	 EventType:String,
	 Deadline:String,
	 StartDate:String,
	 Venue:String,
	 Description: String,
	 FileName:String,
});
Model = mongoose.model('users',model_schema);

Model_Creator = mongoose.model('creators',model_schema);

var EventModel = mongoose.model('Organizer',eventSchema);
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static('views'));

// app.get("/:id/", function(req, res){
//     res.render("Home.ejs");
// });
//
app.get("/login", function(req, res){
    res.render("Login.ejs");
});

app.get("/signup", function(req, res){
    res.render("Signup.ejs");
});



app.post("/login", urlencodedParser, function(req,res){
    //res.render("Login.ejs");
		var auth = 0;
    Model.find({"Email":req.body.Email.toString()},function(mreq,mres){
      console.log(mres);
      console.log(mres[0].Email.toString());
      console.log(mres[0].Password.toString());
      console.log(req.body.Password.toString());
      if(req.body.Email.toString() == mres[0].Email.toString() && req.body.Password.toString()==mres[0].Password.toString()){
        console.log('Access Granted');
				//res.redirect("/home");
				auth = 1;
      }
      else {
        console.log('Error! Wrong Credentials');
      }
			if (auth == 1)
			{
					var PID = Model.find({"Email":req.body.Email.toString()},{"_id":""});
					Model.find({"Email":req.body.Email.toString()},{"_id":""},function(mreq,mres){
			    console.log(mres[0]._id);})
					//console.log(PID._id);
					res.redirect("/" + mres[0]._id + "/home");
			}
    });

});

//app.get("/events", function(req,res){
//		res.render("events.ejs");
//});

//app.post("/events", urlencodedParser, function(req,res){
//		console.log(req.body);
//		res.render("events.ejs");
//});

app.post("/signup", urlencodedParser, function(req, res){
    res.render("Signup.ejs");
		var Chk = false;
		console.log(req.body);
		if (req.body.check){
			Chk = true;
		}

 if(req.body.Password==req.body.CPassword)
 {
	 var university_name = checkUniversityName(req.body.uniname);

   if (Chk == false)
	 {
		 instance = new Model({
	      Email : req.body.Email,
	      Name : req.body.Name,
	      PNumber : req.body.PhoneNo,
	      City : req.body.City,
	      Password : req.body.Password,
	      University: university_name
	   });
	 }else {
		 instance = new Model_Creator({
 			 Email : req.body.Email,
 			 Name : req.body.Name,
 			 PNumber : req.body.PhoneNo,
 			 City : req.body.City,
 			 Password : req.body.Password,
 			 University: university_name
 		});
	 }

	 instance.save(function(err){
		 if(err) return 'Error';
		 //save data
	 });

  /* Model.find({},{"Email":req.body.Email.toString()},function(mreq,mres){

     if(req.body.Email.toString() != mres[0].Email.toString())
     {

       instance.save(function(err){
         if(err) return 'Error';
         //save data
       });
     }
     else {
       console.log('Error! Already have an Email registered');
     }
   });

 }
 else {
   console.log('Wrong Password');
 }*/
}
});

//NEW CODE STARTS HERE

//EventHandler
var routeuni = 1;
// var routecat = 2;

app.post('/:id/OrganizeEvent',urlencodedParser ,function(req,res){

	saveInstance = new EventModel({
	   Name: req.body.ename,
		 Email: req.body.email,
		 Contact: req.body.phoneno,
		 RegisLink:req.body.weblink,
		 EventType:req.body.events,
		 Deadline:req.body.sDate,
		 StartDate:req.body.sDate,
		 Venue:req.body.venue,
		 Description: req.body.Description,
		 FileName:req.body.photo,
		 //Store ID here  URGENT
	});
	console.log(req.params.id);
	saveInstance.save(function(err){
		if(err) return 'Error';
		//save data
	});

	//Model.find({"Email":req.body.Email.toString()},function(mreq,mres){
		//console.log(mres);
res.render("profile.ejs", {Name:req.body.ename,Email:req.body.email, Venue:req.body.venue, idvarhome: "/" + req.params.id.toString() + "/home", idvaruniversities: "/" + req.params.id.toString() + "/universities", idvarcategories: "/" + req.params.id.toString() + "/categories", logout: "Logout"});
});

app.get("/categories", function(req, res){
	if (routeuni == 2)
	{
    res.render("cat.ejs", {idvarhome: "/home", idvarprofile: "/login", idvaruniversities: "/universities", idvarroute: "/events", logout: "Login"});
		routeuni = routeuni + 1;
	} else if (routeuni == 1)
	{
		res.render("cat.ejs", {idvarhome: "/home", idvarprofile: "/login", idvaruniversities: "/universities", idvarroute:"/categories", logout: "Login"});
		routeuni = routeuni + 1;
	}
});

app.get("/:id/categories", function(req, res){
	if (routeuni == 2)
	{
    res.render("cat.ejs", {idvaruniversities: "/" + req.params.id.toString() + "/universities", idvarhome: "/" + req.params.id.toString() + "/home", idvarprofile: "/" + req.params.id.toString() + "/profile", idvarroute: "/" + req.params.id.toString() + "/events", logout: "Logout"});
	} else if (routeuni == 1)
	{
		res.render("cat.ejs", {idvaruniversities: "/" + req.params.id.toString() + "/universities", idvarhome: "/" + req.params.id.toString() + "/home", idvarprofile: "/" + req.params.id.toString() + "/profile", idvarroute: "/" + req.params.id.toString() + "/universities", logout: "Logout"});
		routeuni = routeuni + 1;
	}
});

app.get("/events", function(req, res){
    res.render("events.ejs", {idvarhome:"/home", idvarprofile:"/login", idvaruniversities:"/universities", logout: "Login"});
		if (routeuni >= 3)
		{
			routeuni = 1;
		}
});


app.get("/:id/events", function(req, res){
    res.render("events.ejs", {idvarhome: "/" + req.params.id.toString() + "/home", idvarprofile: "/" + req.params.id.toString() + "/profile", idvaruniversities: "/" + req.params.id.toString() + "/universities", logout: "Logout"});
		if (routeuni >= 3)
		{
			routeuni = 1;
		}
});

app.get("/", function(req, res){
    res.redirect("/home");
});

app.get("/home", function(req, res){
    res.render("homepage.ejs", {idvarlogin: "/login", logout: "Login", idvarhome:"/home", idvarprofile:"/login", idvarcategories:"/categories", idvarcreateevents: "/login"});
});


var count;
var data;
app.get("/:id/profile", function(req,res){

	//{"Email":"hammadak10@gmail.com"}
	EventModel.countDocuments({"Email":"sermad@gmail.com"},function(mreq,mres){
		count = mres;
	//	console.log(count);
		});

	EventModel.find({"Email":"sermad@gmail.com"},{"_id":0,"Name":"","Venue":"","Deadline":"","RegisLink":""},function(mreq,mres){
		//console.log(mres);
		data = mres;
	//	console.log(data)


	});
	console.log("should display here");
	console.log(count);
	console.log(data);
		res.render("profile.ejs", {Name:"Sarmad", Email:"sarmad@gmail.com", Venue:"Islamabad", idvarhome: "/" + req.params.id.toString() + "/home", idvaruniversities: "/" + req.params.id.toString() + "/universities", idvarcategories: "/" + req.params.id.toString() + "/categories", logout: "Logout", Events: data, Count: count});
});



app.get("/:id/home", function(req, res){
	// Model.find({"id":req.body.ObjectId.toString()}, function(mreq,mres){
	// 	console.log(mres);
	// 	console.log(mres[0].Email.toString());
	// 	console.log(mres[0].Password.toString());
	// 	console.log(req.body.Password.toString());
	// 	if(req.body.Email.toString() == mres[0].Email.toString() && req.body.Password.toString()==mres[0].Password.toString()){
	// 		console.log('Access Granted');
	// 		db.users.find({"Email":"ahmed@gmail.com"},{_id:""});
	// });
		var logout= "Logout";
    res.render("homepage.ejs", {idvarcreateevents: "/" + req.params.id.toString() + "/createevent",idvarcategories: "/" + req.params.id.toString() + "/categories", idvarprofile: "/" + req.params.id.toString() + "/profile", logout: logout, idvarhome: "/" + req.params.id.toString() + "/home"});
});

app.get("/homel", function(req, res){
	// Model.find({"id":req.body.ObjectId.toString()}, function(mreq,mres){
	// 	console.log(mres);
	// 	console.log(mres[0].Email.toString());
	// 	console.log(mres[0].Password.toString());
	// 	console.log(req.body.Password.toString());
	// 	if(req.body.Email.toString() == mres[0].Email.toString() && req.body.Password.toString()==mres[0].Password.toString()){
	// 		console.log('Access Granted');
	// 		db.users.find({"Email":"ahmed@gmail.com"},{_id:""});
	// });

    res.render("homepage2.ejs");
});
app.get("/universities", function(req, res){
	if (routeuni == 1)
	{
    res.render("Universities.ejs", {idvarcategories:"/categories", idvarhome: "/home", idvarprofile: "/profile", idvarroute:"/categories", logout:"Login"});
		routeuni = routeuni + 1;
	} else if (routeuni == 2)
	{
		res.render("Universities.ejs", {idvarcategories:"/categories",idvarhome: "/home", idvarprofile: "/profile", idvarroute:"/events", logout:"Login"});
		routeuni = routeuni + 1;
	}
});

app.get("/:id/universities", function(req, res){
	if (routeuni == 1)
	{
    res.render("Universities.ejs", {idvarcategories: "/" + req.params.id.toString() + "/categories", idvarroute: "/" + req.params.id.toString() + "/categories", idvarhome: "/" + req.params.id.toString() + "/home", idvarprofile: "/" + req.params.id.toString() + "/profile", logout: "Logout"});
		routeuni = routeuni + 1;
	} else if (routeuni == 2)
	{
		res.render("Universities.ejs", {idvarcategories: "/" + req.params.id.toString() + "/categories", idvarroute: "/" + req.params.id.toString() + "/events", idvarhome: "/" + req.params.id.toString() + "/home", idvarprofile: "/" + req.params.id.toString() + "/profile", logout: "Logout"});
		routeuni = routeuni + 1;
	}
});

app.get("/:id/createevent", function(req, res){	//also make sure all the attributes are named correctly
    res.render("createevents.ejs", {id: req.params.id, idvarcategories: "/" + req.params.id.toString() + "/categories", idvarhome: "/" + req.params.id.toString() + "/home", idvarprofile: "/" + req.params.id.toString() + "/profile", idvaruniversities: "/" + req.params.id.toString() + "/universities"});	//Ensure event is past the current date
		console.log(req.params.id);
});
//
// app.post("/createevent", urlencodedParser, function(req,res){
//     console.log(req.body);	//Enter the data in the DB
//     res.render("createevents.ejs"); //Take the user to his profile and say the event has been created.
// });



//NEW CODE ENDS HERE


app.listen("80","172.16.6.172", function(){
    console.log("Server is listening");
});
