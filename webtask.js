var mc = require('mongodb').MongoClient;
var assert = require('assert');

return function(context, callback) {
	var mdbUri = context.data.mongo;
	var ghPayload = context.webhook;
	var commitsArr = ghPayload.commits;

	if (mdbUri) {
		mc.connect(mdbUri, function (err, db) {
			if (err) {
				callback(err);
			}

			assert.equal(null, err);

			for (var i = 0; i < commitsArr.length; i++) {
				var thisCommit = commitsArr[i];
				var commitMsg = thisCommit.message;
				var lowerCommit = commitMsg.toLowerCase();
				var iTodo = lowerCommit.indexOf('todo');
				var thisTodo = {};

				if (iTodo > -1) {
					thisTodo.todo = commitMsg.substr(iTodo, commitMsg.length) + ' - ' + thisCommit.author.name;
				}

				if (thisTodo.todo) {
					db.collection('todos').insertOne(thisTodo, function (err, result) {
						assert.equal(null, err);
						assert.equal(1, result.insertedCount);
						db.close();
					});
				}
			}

			return callback(null, { commits: commitsArr });
		});
	} else {
		console.log('MongoDB not provided; could not save');
		return callback();
	}
};