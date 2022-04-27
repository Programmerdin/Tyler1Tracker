const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const LpRequirementSchema = new Schema({
        challengerLpRequirement: {type: Number},
        grandmasterLpRequirement: {type: Number},
    },{timestamps: true});

const LpRequirement = mongoose.model('LpRequirement', LpRequirementSchema);

module.exports = LpRequirement;