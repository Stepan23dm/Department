const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Emp = mongoose.model('employees')

router.get('/', (req, res) => {
    Emp.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
                
            });
        } 
        else 
        {
            console.log('Error in retieving employee list:' + err);
        }
    });
});

router.get('/searchTerm', (req, res) => {
    const searchTerm = req.params.searchTerm;
    const query = {
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { position: { $regex: searchTerm, $options: 'i' } },
            { degree: { $regex: searchTerm, $options: 'i' } }
        ]
    };
    Emp.find(query, (err, docs) => {
        if (!err) {
            res.render("employee", {
                list: docs
                
            });
        } 
        else 
        {
            console.log('Error in retieving employee list:' + err);
        }
    });
});

router.get('/addOrEdit', (req, res) => {
    res.render('employee/addOrEdit', {
        viewTitle: "Добавить преподавателя"
    })
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res){
    var employee = new Emp();
    employee.name = req.body.name;
    employee.employmentDate = req.body.employmentDate;
    employee.salary = req.body.salary;
    employee.position = req.body.position;
    employee.degree = req.body.degree;

    let message = req.body.disciplines;
    employee.disciplines = message.split(',');

    let workload = req.body.workload;
    if (workload <= 1)
        employee.workload = workload;
    else
        employee.workload = 1;

    employee.community_work = req.body.community_work;
    employee.save((err, doc) => {
        if (!err)
            res.redirect('employee');
        else {
            if (err.name == 'ValidationError'){
                handleValidationError(err, req.body);
                res.render('employee/addOrEdit', {
                    viewTitle: "Добавить преподавателя",
                    employee: req.body
                });
            }
            else
                console.log('Error during record insertion: ' + err)
        }
    });
}

function updateRecord(req, res) {
    const updateData = { $set: req.body };
    Emp.findOneAndUpdate({ _id: req.body._id }, updateData, { new: true }, (err, doc) => {
        if (!err) { res.redirect('employee'); }
        else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.redirect("employee/addOrEdit", {
                    viewTitle: 'Изменить данные',
                    employee: req.body
                })
            }
            else 
                console.log('Error during record update: ' + err);
        }
    });
}

router.get('/:id', (req, res) => {
    Emp.findById(req.params.id, (err, doc) => {
        if (!err){
            res.render('employee/addOrEdit', {
                viewTitle: 'Изменить данные',
                employee: doc
            })
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Emp.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee');
        }
        else console.log('Error in employee delete: ' + err);
    });
});

router.get('/search/:id', (req, res) => {
    const nameId = req.params.id;
    Emp.find({ _id: nameId }, (err, doc) => {
        if (!err) {
            res.render("employee/viewUser", {
                viewTitle: "Данные преподавателя",
                list: doc
            });
        }
        else {
            console.log('Error in retrieving searchArt list :' + err);
        }
    });
});

function handleValidationError(err, body){
   for (field in err.errors){
    switch (err.errors[field].path){
        case 'name':
            body['NameError'] = err.errors[field].message;
            break;
        case 'employmentDate':
            body['employmentDateError'] = err.errors[field].message;
            break;
        case 'salary':
            body['salaryError'] = err.errors[field].message;
            break;
        case 'position':
            body['positionError'] = err.errors[field].message;
            break;
        case 'degree':
            body['degreeError'] = err.errors[field].message;
            break;
        case 'disciplines':
            body['disciplinesError'] = err.errors[field].message;
            break;
        case 'workload':
            body['workloadError'] = err.errors[field].message;
            break;
        case 'community_work':
            body['community_workError'] = err.errors[field].message;
            break;
        default:
            break;
    }
   }
}

module.exports = router;