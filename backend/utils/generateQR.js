const QRCode = require('qrcode');

/**
 * Generate a base64 encoded QR Code
 * @param {string} data - The URL or string to encode
 * @returns {Promise<string>} Base64 data URI of the generated QR code
 */
const generateQR = async (data) => {
  try {
    const qrCodeBase64 = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return qrCodeBase64;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
};

module.exports = generateQR;
