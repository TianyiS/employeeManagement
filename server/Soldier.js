const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soldierSchema = new Schema({
  name: { type: String, required: true },
  rank: { type: String, required: true },
  sex: { type: String, required: true },
  startDate: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  avastar: { type: String, default: null },
  superior: { type: Schema.Types.ObjectId, ref: 'Soldier' },
  subordinates: [{ type: Schema.Types.ObjectId, ref: 'Soldier' }]
});
const Soldier = mongoose.model('Soldier', soldierSchema);

module.exports = Soldier;