var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var documentSequenceId = null;
var messageSequenceId = null;
var contactSequenceId = null;

function SequenceGenerator() {

  Sequence.find()
    .exec(function(err, sequences) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }

      console.log(`sequences: ${sequences}`);

      sequences.map((seq) => {
        switch(seq.type) {
          case 'documents':
            documentSequenceId = seq._id;
            maxDocumentId = seq.value;
            break;
          case 'messages':
            messageSequenceId = seq._id;
            maxMessageId = seq.value;
            break;
          case 'contacts':
            contactSequenceId = seq._id;
            maxContactId = seq.value;
            break;
        }
      });
    });
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  var sequenceId;
  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = {value: maxDocumentId};
      nextId = maxDocumentId;
      sequenceId = documentSequenceId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = {value: maxMessageId};
      nextId = maxMessageId;
      sequenceId = messageSequenceId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = {value: maxContactId};
      nextId = maxContactId;
      sequenceId = contactSequenceId;
      break;
    default:
      return -1;
  }

  Sequence.update({_id: sequenceId}, {$set: updateObject},
    function(err) {
      if (err) {
        console.log("nextId error = " + err);
        return null
      }
    });

  console.log(nextId);
  return nextId;
}

module.exports = new SequenceGenerator();
