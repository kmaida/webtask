var mc = require('mongodb').MongoClient;
var assert = require('assert');

return function(context, callback) {
	var _MDBURI = context.data.mongo;
	var ghPayload = context.webhook;
	var commitsArr = ghPayload.commits;

	if (_MDBURI) {
		mc.connect(_MDBURI, function(err, db) {
			if (err) {
				callback(err);
			}
			assert.equal(null, err);

			for (var _i = 0; _i < commitsArr.length; _i++) {
				var _thisCommit = commitsArr[_i];
				var _commitMsg = _thisCommit.message;
				var _lowerCommit = _commitMsg.toLowerCase();
				var _iTodo = _lowerCommit.indexOf('todo');
				var thisTodo = {};

				if (_iTodo > -1) {
					thisTodo.todo = _commitMsg.substr(_iTodo, _commitMsg.length) + ' - ' + _thisCommit.author.name;

					db.collection('todos').insertOne(thisTodo, function(err, result) {
						assert.equal(null, err);
						assert.equal(1, result.insertedCount);
					});
				}
			}

			db.close();
			return callback(null, { commits: commitsArr });
		});
	} else {
		console.log('MongoDB not provided; could not save any todo items!');
		return callback();
	}
};