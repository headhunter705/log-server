const path = require("path");
const {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} = require("firebase/firestore");


async function listRequests(req, res, db) {
  try {
    if (!db) {
      throw new Error("Database not initialized");
    }
    res.sendFile(path.join(__dirname, "../views", "list.html"));
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve logs.",
      details: err.message,
    });
  }
}

// Function to update control state for all documents with the specified IP address.
async function updateControlStateByIP(req, res, db) {
    const { ip, newState } = req.body; // New control state from the request
  
    if (!newState || !ip) {
      return res.status(400).json({ error: "Invalid request data." });
    }
  
    try {
      const dataRef = collection(db, "registered");
      const q = query(dataRef, where("ip", "==", ip)); // Query to find documents with that IP
      const snapshot = await getDocs(q);
  
      if (snapshot.empty) {
        return res.status(404).json({ message: "No documents found with the specified IP address." });
      }
  
      // Update each document with the new control state
      const batch = writeBatch(db); // Optionally use batch if required
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { controlState: newState }); // Update controlState for each matching document
      });
  
      await batch.commit(); // Commit the batch
      res.status(200).json({ message: "Control state updated successfully for all matching documents." });
    } catch (err) {
      res.status(500).json({ error: "Failed to update control state.", details: err.message });
    }
  }

module.exports = { listRequests, updateControlStateByIP };
