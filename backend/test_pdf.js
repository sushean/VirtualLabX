require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    try {
        console.log("Connecting database...");
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/VirtualLabX'); // Guessing local if no env
        
        console.log("DB connected.");
        const Certificate = require('./models/Certificate');
        const User = require('./models/User');
        const { generateCertificatePDF } = require('./services/certificateService');

        const hash = "fcd4fc0b-42da-47f9-96ca-d484cee883f1";
        const certificate = await Certificate.findOne({ certificateId: hash });
        
        if (!certificate) {
            console.log("Certificate not found!");
            return;
        }
        
        console.log("Found certificate:", certificate.certificateId);
        
        const userDoc = await User.findById(certificate.userId);
        if (!userDoc) {
             console.log("User not found!");
             return;
        }
        
        console.log(`Generating PDF for ${userDoc.firstName} ${userDoc.lastName}`);
        
        const pdfBuffer = await generateCertificatePDF({
          studentName: `${userDoc.firstName} ${userDoc.lastName}`,
          courseName: certificate.examName,
          issueDate: certificate.date,
          hash: certificate.certificateId
        });
        
        console.log("PDF BUffer Size:", pdfBuffer.length);
        
        certificate.pdfBuffer = pdfBuffer;
        await certificate.save();
        
        console.log("Saved to DB!");
        
    } catch (e) {
        console.error("Test failed with error:");
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
})();
