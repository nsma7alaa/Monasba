const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedSchema = new Schema({

user: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
},

hall: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hall',
    required: true
 },

},{
    timestamps:true
});

savedSchema.pre(/^find/, function (next) {
    // this points to the current query.
    this.find({ active: { $ne: false } });
    next();
  });

const Saved = mongoose.model('Saved', savedSchema)
module.exports = Saved;