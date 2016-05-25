var mc = require('mongodb').MongoClient;
var assert = require('assert');

return function(context, callback) {
	var ctxData = context.data;
	var payload = context.webhook;
	var commitsArr = payload.commits;
	var todoObj = {};

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

				if (iTodo > -1) {
					todoObj.todo = commitMsg.substr(iTodo, commitMsg.length) + ' - ' + thisCommit.author.name;
				}

				if (todoObj.todo) {
					db.collection('todos').insertOne(todoObj, function (err, result) {
						assert.equal(null, err);
						assert.equal(1, result.insertedCount);
						db.close();
					});
				}
			}

			return callback(null, todoObj);
		});
	} else {
		console.log('MongoDB not provided; could not save');
		return callback();
	}
};