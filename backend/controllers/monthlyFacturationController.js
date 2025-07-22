const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const MonthlyFacturation = require("../models/monthlyFacturationModel");

//@description Create a new facturation
//@route POST /contactauth/profile/facturation
//@access Private
const addMonthlyReading = asyncHandler(async (req, res) => {
  const { current_index, customDate } = req.body;
  const contactId = req.contact.id;

  if (current_index === undefined || isNaN(current_index)) {
    res.status(400);
    throw new Error("Please provide a valid current_index");
  }

  const dateObj = customDate ? new Date(customDate) : new Date();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  // Check if a reading already exists for this month and year
  const existing = await MonthlyFacturation.findOne({ contact: contactId, month, year });
  if (existing) {
    res.status(400);
    throw new Error("Reading for this month already exists");
  }

  // Get the previous month's reading (prev_index)
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = year - 1;
  }

  const prevFact = await MonthlyFacturation.findOne({ contact: contactId, month: prevMonth, year: prevYear });

  let difference = 0;
  if (prevFact) {
    if (current_index < prevFact.current_index) {
      res.status(400);
      throw new Error("Current index cannot be less than previous month's index");
    }
    difference = current_index - prevFact.current_index;
  } else {
    // If no previous reading, consider the difference as the current reading
    difference = current_index;
  }

  const newFact = await MonthlyFacturation.create({
    contact: contactId,
    current_index,
    difference,
    month,
    year,
    total: 0
  });

  res.status(201).json(newFact);
});

//@description Calculate monthly facturation
//@route post /contactauth/profile/facturation/calculate
//@access Private
const calculateFacturations = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;

  // Get all invoices with total = 0
  const facturesToCalculate = await MonthlyFacturation.find({ contact: contactId, total: 0 });

  if (facturesToCalculate.length === 0) {
    return res.status(200).json({
      message: "No invoices to calculate",
      total: 0,
      data: []
    });
  }

  const updatedFactures = [];

  for (const facture of facturesToCalculate) {
    const consommation = facture.difference;

    let total = 0;
    if (consommation < 150) total = consommation * 0.3;
    else if (consommation < 300) total = consommation * 0.4;
    else total = consommation * 0.5;

    facture.total = total;
    await facture.save();

    updatedFactures.push(facture);
  }

  res.status(200).json({
    message: "Prices calculated successfully",
    total: updatedFactures.length,
    data: updatedFactures
  });
});

//@description Get all facturations for a contact
//@route GET /contactauth/profile/facturation
//@access Private
const getAllFacturations = asyncHandler(async (req, res) => {
  const contactId = req.contact.id;

  const allFacturations = await MonthlyFacturation.find({ contact: contactId }).sort({ year: -1, month: -1 });

  res.status(200).json({
    total: allFacturations.length,
    data: allFacturations,
  });
});

module.exports = {
  addMonthlyReading,
  calculateFacturations,
  getAllFacturations
};
