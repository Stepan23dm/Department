const mongoose = require('mongoose');

var empSchema = mongoose.Schema({
    name: {
        type: String, 
        required: 'This field is required.'
    },
    employmentDate: {
        type: Date, 
        required: 'This field is required.'
    },
    salary: {
        type: Number, 
        required: 'This field is required.'
    },
    position: {
        type: String, 
        required: 'This field is required.'
    },
    degree: {
        type: String, 
        required: 'This field is required.'
    },
    disciplines: {
        type: Array, 
        required: 'This field is required.'
    },
    workload: {
        type: Number, 
        required: 'This field is required.'
    },
    community_work: {
        type: String, 
        required: 'This field is required.'
    },
},
{collection: 'employees'});

var employees = mongoose.model('employees', empSchema);