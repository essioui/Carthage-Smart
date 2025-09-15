const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const Contact = require("../models/contactModel");
const MonthlyFacturation = require("../models/monthlyFacturationModel");
const AddressConsumption = require("../models/addressConsumptionModel");

// @description Get last month consumption grouped by address, save it in DB and export to CSV
// @route POST /users/data
// @access Private
const getLastConsumptionByAddress = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: "Address is required" });

    // Fetch all contacts for this address
    const contacts = await Contact.find({ address });
    if (contacts.length === 0)
      return res.json({ message: "No contacts found for this address" });

    const contactIds = contacts.map((c) => c._id);

    // Get the last consumption for each contact
    const consumptionData = await MonthlyFacturation.aggregate([
      { $match: { contact: { $in: contactIds } } },
      { $sort: { contact: 1, year: -1, month: -1 } },
      {
        $group: {
          _id: "$contact",
          totalConsumption: { $first: "$totalConsumption" },
        },
      },
    ]);

    // Data preparation
    const contactsData = contacts.map((contact) => {
      const found = consumptionData.find(
        (d) => d._id.toString() === contact._id.toString()
      );
      return {
        contactId: contact._id,
        totalConsumption: found ? found.totalConsumption : 0,
      };
    });

    // Store data in AddressConsumption collection
    const saved = await AddressConsumption.create({
      address,
      contacts: contactsData,
    });

    // Convert data to CSV
    const csvFields = ["contactId", "totalConsumption"];
    const parser = new Parser({ fields: csvFields });
    const csv = parser.parse(contactsData);

    // Save the file in the /csv folder
    const dir = path.join(__dirname, "../csv/userData");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${address}.csv`);
    fs.writeFileSync(filePath, csv);

    res.json({
      message: "Data saved successfully",
      data: saved,
      csvPath: filePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLastConsumptionByAddress };
