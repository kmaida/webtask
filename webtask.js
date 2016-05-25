var parallel = require('async').parallel;
var mc = require('mongodb').MongoClient;

module.exports = function(context, done) {
	var query = context.data;
	var staticMsg = query.message;

	mc.connect(query.mongo, function(error, db) {
		if (error) {
			return done(error);
		}

		done(null, 'Hello, ' + query.name + db);
	});
};