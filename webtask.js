var mc = require('mongodb').MongoClient;
var assert = require('assert');

module.exports = function(context, req, res) {
	var ctxData = context.data;
	var staticMsg = ctxData.message;

	mc.connect(ctxData.mongo, function(err, db) {
		if (err) {
			res.writeHead(500, { 'Content-Type': 'text/html'});
			res.end('<p>An error occurred.</p>');
		}

		var collection = db.collection('messages');

		assert.equal(null, err);

		collection.insertOne({message: staticMsg}, function(err, result) {
			assert.equal(null, err);
			assert.equal(1, result.insertedCount);

			db.close();
		});

		res.writeHead(200, { 'Content-Type': 'text/html'});
		res.end('<h1>' + staticMsg + '</h1>');
	});
};