const { Customer, validate } = require('../models/customer');
const router = require('express').Router();


router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort('name');
        res.send(customers);
    } catch (ex) {
        res.status(404).send(ex.message);
    };
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        res.send(customer);
    } catch (ex) {
        console.error(ex.message);
        return res.status(404).send('Cannot find customer with that ID');
    };
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) { return res.status(400).send(error.details[0].message)}
    const { name, isGold, phone } = req.body;
    let customer = new Customer({ name, isGold, phone});
    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) { return res.status(400).send(error.details[0].message)}
    try {
        const { name, isGold, phone } = req.body;
        let customer = await Customer.findByIdAndUpdate(req.params.id, { name, isGold, phone }, {
            new: true
        });
        customer = await customer.save();
        res.send(customer);
    } catch (ex) {
        console.error(ex.message);
        res.status(404).send('Cannot find customer with that ID');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndRemove(req.params.id);
        res.send(customer);
    } catch (ex) {
        console.error(ex.message);
        return res.status(404).send('Cannot find customer with that ID');
    };
});

module.exports = router;