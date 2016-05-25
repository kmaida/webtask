var mc = require('mongodb').MongoClient;
var assert = require('assert');

return function(context, callback) {
	var ctxData = context.data;
	var payload = context.webhook;
	var commitsArr = payload.commits;

	if (ctxData.mongo) {
		mc.connect(ctxData.mongo, function (err, db) {
			if (err) {
				callback(err);
			}

			assert.equal(null, err);

			// for (var i = 0; i < commitsArr.length; i++) {
			// 	var commitMsg = commitsArr[i].message;

				db.collection('commits').insertOne({commit: 'hello'}, function (err, result) {
					assert.equal(null, err);
					assert.equal(1, result.insertedCount);

					db.close();
				});
			//}

			//db.close();
		});
	} else {
		console.log('MongoDB not provided; could not save');
		return callback();
	}
};