const Contact = require("../models/contactModel");
const natural = require("natural");
const { kmeans } = require("ml-kmeans");
const fs = require("fs");
const path = require("path");

// @description Cluster contacts by address
// @route POST /users/cluster
// @access Private
const clusterContacts = async (req, res) => {
    try {
        // Fetch contacts who have address only
        const contacts = await Contact.find({ address: { $exists: true, $ne: "" } });
        if (!contacts.length)
            return res.status(400).json({ message: "No contacts found" });

        // Extract all addresses
        const addresses = contacts.map(c => c.address);

        // All unique words for all addresses
        const allTermsSet = new Set();
        addresses.forEach(addr => {
            const tfidfTemp = new natural.TfIdf();
            tfidfTemp.addDocument(addr);
            tfidfTemp.listTerms(0).forEach(item => allTermsSet.add(item.term));
        });
        const allTerms = Array.from(allTermsSet);

        // Convert each address to a fixed-length vector.
        const vectors = addresses.map(addr => {
            const vec = [];
            const tfidfTemp = new natural.TfIdf();
            tfidfTemp.addDocument(addr);

            const tfidfMap = {};
            tfidfTemp.listTerms(0).forEach(item => tfidfMap[item.term] = item.tfidf);

            allTerms.forEach(term => vec.push(tfidfMap[term] || 0));
            return vec;
        });

        // Number of clusters = Number of unique addresses
        const uniqueAddresses = [...new Set(addresses)];
        const k = uniqueAddresses.length;

        // KMeans implementation
        const kmResult = kmeans(vectors, k);
        const clusters = kmResult.clusters;

        // Associate each contact with a cluster
        const clusteredContacts = contacts.map((c, idx) => ({
            _id: c._id,
            name: c.user_name,
            address: c.address,
            cluster: clusters[idx]
        }));

        res.status(200).json({ clusters: clusteredContacts });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @description Get the address
// @route GET /users/cluster/list
// @access Private
const getAddress = async (req, res) => {
    try {
        const contacts = await Contact.find({ address: { $exists: true, $ne: "" } });

        const { address } = req.query;

        if (!address) {
            const uniqueAddresses = [...new Set(contacts.map(c => c.address))];
            return res.json({ addresses: uniqueAddresses });
        }

        const filtered = contacts.filter(c => c.address === address);
        res.json({ address, contacts: filtered });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @description Get clients by specific address AND copy their CSV files
// @route GET /users/cluster/address?address=Tunis (example)
// @access Private

const getContactsByAddress = async (req, res) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ message: "Please provide an address" });
        }

        // Only bring in customers who have the desired address
        const filteredContacts = await Contact.find({ address });

        if (!filteredContacts.length) {
            return res.status(404).json({ message: "No clients found for this address" });
        }

        // Primary CSV folder path
        const sourceFolder = path.join(__dirname, "../csv/merged_clients");

        // Destination folder by address
        const destFolder = path.join(__dirname, "../csv/clusters", address);

        // Create the destination folder if it does not exist.
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }

        // Copy customer id.csv files
        filteredContacts.forEach(contact => {
            const contactId = contact._id.toString();
            const sourceFile = path.join(sourceFolder, `${contactId}.csv`);
            const destFile = path.join(destFolder, `${contactId}.csv`);

            console.log("Looking for:", sourceFile);

            if (fs.existsSync(sourceFile)) {
                fs.copyFileSync(sourceFile, destFile);
                console.log(`Copied: ${sourceFile} -> ${destFile}`);
            } else {
                console.log(`File not found: ${sourceFile}`);
            }
        });

        res.json({
            address,
            clients: filteredContacts,
            message: `CSV files copied to ${destFolder}`
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { 
    clusterContacts,
    getAddress,
    getContactsByAddress
 };
