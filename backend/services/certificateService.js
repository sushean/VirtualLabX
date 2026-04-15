const generateQR = require('../utils/generateQR');
const generatePDF = require('../utils/generatePDF');

/**
 * Service to generate the final PDF Certificate Buffer
 * @param {Object} certificateData 
 * @param {string} certificateData.studentName
 * @param {string} certificateData.courseName
 * @param {Date} certificateData.issueDate
 * @param {string} certificateData.hash
 * @returns {Promise<Buffer>}
 */
const generateCertificatePDF = async ({ studentName, courseName, issueDate, hash }) => {
  try {
    // Assuming the frontend app will run on VITE_APP_URL or localhost
    const frontendUrl = process.env.VITE_APP_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify/${hash}`;

    // 1. Generate QR Code Base64
    const qrCodeBase64 = await generateQR(verifyUrl);

    // 2. Format Date
    const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 3. Generate PDF Buffer using puppeteer
    const pdfBuffer = await generatePDF({
      studentName,
      courseName,
      issueDate: formattedDate,
      hash,
      qrCodeBase64
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Error in certificate service:', error);
    throw error;
  }
};

module.exports = {
  generateCertificatePDF
};
