var mc = require('mongodb').MongoClient;
var assert = require('assert');

return function(context, callback) {
	var _MDBURI = context.data.mongo;
	var ghPayload = context.webhook;
	var commitsArr = ghPayload.commits;

	/**
	 * Connected to MongoDB
	 * Loop over commit messages in GitHub push payload
	 * For each pushed commit, check if the commit message contains a to do
	 * If so, grab the applicable text (just takes anything after the keyword)
	 * Save object to MongoDB
	 *
	 * @param err
	 * @param db
	 * @returns {function} callback
	 * @private
	 */
	function _mdbConnect(err, db) {
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

				db.collection('todos').insertOne(thisTodo, _mdbInsertCB);
			}
		}

		db.close();
		return callback(null, { commits: commitsArr });
	}

	/**
	 * Inserted one to do object into database
	 *
	 * @param err
	 * @param result {object}
	 * @private
	 */
	function _mdbInsertCB(err, result) {
		assert.equal(null, err);
		assert.equal(1, result.insertedCount);
	}

	// if there is a MongoDB URI (mongo query param), connect to MongoDB
	if (_MDBURI) {
		mc.connect(_MDBURI, _mdbConnect);
	} else {
		console.log('MongoDB not provided; could not save any todo items!');
		return callback();
	}
};