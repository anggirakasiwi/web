const mongoose = require('mongoose');
const dataraportSchema = mongoose.Schema({
    no                  : {type: String, unique: true},
    mapel 	            : String,
    kkm	                : String,
    nilaiangka	        : String,
    nilaihuruf          : String,
    kemampuanbelajar    : String,
    created_at		    : String
});
module.exports = mongoose.model('dataraport', dataraportSchema);
