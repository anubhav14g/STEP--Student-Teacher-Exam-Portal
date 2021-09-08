require('dotenv').config();
const express=require('express');
const app=express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));


// connection to mongodb
mongoose.connect(
	process.env.MONGODB_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => console.log("Successfully connected to mongodb cloud database")
);
// mongoose.set("useCreateIndex", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useUnifiedTopology", false);

app.get('/',(req,res)=>{
	res.status(200).json({
		"status": "true",
		"message": "Welcome to the Student Teacher Exam Portal (STEP)",
	});
});

//Import Routes
const authRoute=require('./routes/auth');
const testRoute=require('./routes/test');
const submitRoute=require('./routes/submit');
const queryRoute=require('./routes/query');
const adminRoute=require('./routes/admin');

//Route Middleware
app.use('/api/auth',authRoute);
app.use('/api/test',testRoute);
app.use('/api/submit',submitRoute);
app.use('/api/query',queryRoute);
app.use('/api/admin',adminRoute);

const PORT = process.env.PORT || 5000;
app.listen(`${PORT}`, function() {
	console.log(`Server started on port ${PORT}`);
});