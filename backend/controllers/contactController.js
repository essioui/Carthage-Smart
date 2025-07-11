const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@description Update Contact
//@route PUT /api/contacts/:id
//access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact._id.toString() !== req.contact.id) {
        res.status(403);
        throw new Error("You are not allowed to update this contact");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedContact);
});

//@description Delete Contact
//@route DELETE /api/contacts/:id
//access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact._id.toString() !== req.contact.id) {
        res.status(403);
        throw new Error("You are not allowed to delete this contact");
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Contact deleted successfully" });
});

module.exports = {
    updateContact,
    deleteContact,
};
