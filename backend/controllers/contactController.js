const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");


//@description Update Contact
//@route Put /api/contacts/:id
//access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    res.status(200).json(updateContact);
});

//@description Delete Contact
//@route Delete /api/contacts/:id
//access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json(contact);
});

module.exports = {
    updateContact,
    deleteContact
}
