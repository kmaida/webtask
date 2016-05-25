var mc = require('mongodb').MongoClient;
var assert = require('assert');

return function(context, cb) {
	var ctxData = context.data;
	var payload = context.webhook;

	if (ctxData.mongo) {
		mc.connect(ctxData.mongo, function (err, db) {
			if (err) {
				cb(err);
			}

			var collection = db.collection('messages');

			assert.equal(null, err);

			// collection.insertOne({todo: todoItem}, function(err, result) {
			// 	assert.equal(null, err);
			// 	assert.equal(1, result.insertedCount);
			//
			// 	db.close();
			// });

			console.log(payload);

			db.close();

			cb(null, payload);
		});
	} else {
		console.log('MongoDB not provided; could not save');
		return cb();
	}
};