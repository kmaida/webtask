var mc = require('mongodb').MongoClient;
var assert = require('assert');

return function(context, callback) {
	var ctxData = context.data;
	var payload = context.webhook;
	var commitsArr = payload.commits;
	var todo;

	if (ctxData.mongo) {
		mc.connect(ctxData.mongo, function (err, db) {
			if (err) {
				callback(err);
			}

			assert.equal(null, err);

			for (var i = 0; i < commitsArr.length; i++) {
				var thisCommit = commitsArr[i];
				var commitMsg = thisCommit.message;
				var lowerCommit = commitMsg.toLowerCase();
				var iTodo = lowerCommit.indexOf('todo');

				todo = iTodo > -1 ? commitMsg.substr(iTodo, commitMsg.length) + ' - ' + thisCommit.author.name : null;

				if (todo) {
					db.collection('todos').insertOne({todo: todo}, function (err, result) {
						assert.equal(null, err);
						assert.equal(1, result.insertedCount);
						db.close();
					});
				}
			}

			return callback(null, todo);
		});
	} else {
		console.log('MongoDB not provided; could not save');
		return callback();
	}
};