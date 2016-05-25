var mc = require('mongodb').MongoClient;
var assert = require('assert');

module.exports = function(context, done) {
	var query = context.data;
	var staticMsg = query.message;

	mc.connect(query.mongo, function(err, db) {
		if (err) {
			return done(err);
		}

		assert.equal(null, err);

		db.collection('messages').insertOne({message: staticMsg}, function(err, r) {
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);

			db.close();
		});

		return done(null, staticMsg);
	});
};