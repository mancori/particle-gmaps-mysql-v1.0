// 1. Install dependencies
// 	npm install
// 
// 2. Set your auth token:
//  export AUTH_TOKEN=xxxxxxx
// You can generate one, or get it from the Settings tab at https://build.particle.io.
// 
// 3. Run the program:
//	npm start
//
// You can also save the auth token in a file config.json that will be read at startup if present.
const config = require('./config');
var mysqlx = require('mysqlx');
var mySession =
mysqlx.getSession({
    host: 'localhost',
    port: 33060,
    dbUser: 'particle',
    dbPassword: 'S4k1l4!$'
});
var Particle = require('particle-api-js');
var particle = new Particle();

// You must set AUTH_TOKEN in an enviroment variable!
particle.listDevices({ auth:config.get('AUTH_TOKEN') }).then(
		function(devices) {
			// console.log("devices", devices);
			for(var ii = 0; ii < devices.body.length; ii++) {
				console.log(devices.body[ii].id + "," + devices.body[ii].name);
			}
		},
		function(err) {
			console.log("error listing devices", err);
		}
		);

process.on('SIGINT', function() {
    console.log("Caught interrupt signal. Exiting...");
    process.exit()
});

particle.getEventStream({ name: 'deviceLocator', auth:config.get('AUTH_TOKEN')}).then(function(stream) {
  stream.on('event', function(data) {
    console.log("Event: ", data);
	                                mySession.then(session => {
                                                session.getSchema("particle").getCollection("gps")
                                                .add(  data  )
                                                .execute(function (row) {
                                                }).catch(err => {
                                                        console.log(err);
                                                })
                                                .then( function (notices) { 
                                                });
                                }).catch(function (err) {
                                              console.log(err);
                                              process.exit();
                                });
                               
                });
}).catch(function (err) {
                                              console.log(err.stack);
                                              process.exit();
});	
