const mongoose = require('mongoose');
const Joi = require('Joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 5,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        min: 10
    }
});

const Customer = mongoose.model('customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(10)
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
