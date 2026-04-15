const puppeteer = require('puppeteer');

/**
 * Generates a completely native HTML/CSS PDF certificate Buffer using Puppeteer
 * @param {Object} data
 * @param {string} data.studentName
 * @param {string} data.courseName
 * @param {string} data.issueDate
 * @param {string} data.hash
 * @param {string} data.qrCodeBase64
 * @returns {Promise<Buffer>} PDF Buffer
 */
const generatePDF = async ({ studentName, courseName, issueDate, hash, qrCodeBase64 }) => {
  try {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Montserrat:wght@400;600;700&family=Pinyon+Script&display=swap');
        
        @page {
          size: 1123px 794px;
          margin: 0;
        }

        body, html {
          margin: 0;
          padding: 0;
          width: 1123px;
          height: 794px;
          background-color: #f7f5ed; /* Classic Parchment / Ivory */
        }
        
        .cert-container {
          position: relative;
          width: 1123px;
          height: 794px;
          background: #fdfbf7;
          color: #062b53;
          font-family: 'Montserrat', sans-serif;
          overflow: hidden;
          box-sizing: border-box;
          padding: 30px;
        }

        /* Elaborate Classic Borders */
        .outer-border {
          position: absolute;
          top: 20px; left: 20px; right: 20px; bottom: 20px;
          border: 1px solid #b89151;
          z-index: 1;
        }

        .inner-border {
          position: absolute;
          top: 30px; left: 30px; right: 30px; bottom: 30px;
          border: 10px solid #062b53;
          border-radius: 2px;
          z-index: 2;
        }

        .inner-thin-border {
          position: absolute;
          top: 45px; left: 45px; right: 45px; bottom: 45px;
          border: 1px solid #b89151;
          z-index: 3;
        }

        .inner-bg {
          position: absolute;
          top: 45px; left: 45px; right: 45px; bottom: 45px;
          background: #fdfbf7;
          z-index: 4;
          padding: 50px 60px;
          text-align: center;
          background-image: repeating-linear-gradient(45deg, rgba(184, 145, 81, 0.03) 0, rgba(184, 145, 81, 0.03) 1px, transparent 1px, transparent 10px);
        }

        /* Logo Area */
        .logo-area {
          font-size: 36px;
          font-weight: 800;
          font-family: 'Montserrat', sans-serif;
          color: #062b53;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }
        .logo-cyan {
          color: #00e5ff;
        }

        .header {
          position: relative;
          z-index: 5;
        }
        
        h1 {
          font-family: 'Cinzel', serif;
          font-size: 58px;
          color: #062b53;
          margin: 0;
          letter-spacing: 15px;
          font-weight: 800;
        }

        h2.subtitle {
          font-size: 18px;
          color: #b89151;
          letter-spacing: 14px;
          margin-top: 10px;
          margin-bottom: 40px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .certifies {
          font-size: 18px;
          color: #444;
          margin-bottom: 15px;
          font-family: 'Cinzel', serif;
          letter-spacing: 2px;
          font-style: italic;
        }

        .student-name {
          font-family: 'Pinyon Script', cursive;
          font-size: 72px;
          color: #062b53;
          margin: 0;
          font-weight: normal;
          border-bottom: 2px solid #b89151;
          display: inline-block;
          padding-bottom: 0px;
          margin-bottom: 20px;
          min-width: 600px;
          line-height: 1.2;
        }

        .completed-text {
          font-size: 16px;
          color: #444;
          margin-bottom: 20px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
          letter-spacing: 1px;
        }

        .course-name {
          font-size: 32px;
          font-weight: 700;
          color: #062b53;
          font-family: 'Cinzel', serif;
          text-transform: uppercase;
          margin: 0 0 15px 0;
          letter-spacing: 3px;
        }

        /* Gold Seal */
        .gold-seal {
          position: absolute;
          top: 60px;
          right: 80px;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, #e6c875 0%, #b89151 70%, #8a6a32 100%);
          border-radius: 50%;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-family: 'Cinzel', serif;
          font-weight: bold;
          font-size: 18px;
          border: 3px dotted #fff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }
        .outer-dots {
           position: absolute;
           top: -8px; left: -8px; right: -8px; bottom: -8px;
           border-radius: 50%;
           border: 2px dashed #b89151;
        }

        /* Footer Grid */
        .footer {
          position: absolute;
          bottom: 40px;
          left: 60px;
          right: 60px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          z-index: 5;
        }

        .signature-block {
          text-align: center;
          width: 200px;
          margin-bottom: 10px;
        }
        .signature-line {
          border-bottom: 1px solid #062b53;
          margin-bottom: 5px;
          height: 40px;
        }
        .signature-text {
          font-size: 12px;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .qr-container {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        }

        .qr-img {
          width: 90px;
          height: 90px;
          border: 2px solid #b89151;
          padding: 4px;
          background: white;
        }

        .scan-text {
          font-size: 10px;
          font-weight: 700;
          color: #062b53;
          margin-top: 5px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .hash-code {
          font-family: monospace;
          color: #777;
          font-size: 10px;
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
        }
      </style>
    </head>
    <body>
      <div class="cert-container">
        <div class="outer-border"></div>
        <div class="inner-border"></div>
        <div class="inner-thin-border"></div>
        
        <div class="inner-bg">
          <div class="gold-seal">
            <div class="outer-dots"></div>
            <span>OFFICIAL</span>
            <span style="font-size: 10px; margin-top:5px; color:#fff;">VirtualLabX</span>
          </div>

          <div class="logo-area">
            VirtualLab<span class="logo-cyan">X</span>
          </div>

          <div class="header">
            <h1>CERTIFICATE</h1>
            <h2 class="subtitle">Of Achievement</h2>
          </div>

          <div class="certifies">This is to certify that</div>
          <div class="student-name">${studentName}</div>
          <div class="completed-text">has verified mastery and successfully met the requirements for</div>
          
          <div class="course-name">${courseName}</div>
          
          <div class="footer">
            <div class="signature-block">
              <div class="signature-line" style="font-family:'Pinyon Script', cursive; font-size: 32px; color: #062b53;">${issueDate}</div>
              <div class="signature-text">Date of Issue</div>
            </div>
            
            <div class="qr-container">
              <img class="qr-img" src="${qrCodeBase64}" alt="Verification QR"/>
              <div class="scan-text">Scan To Verify</div>
            </div>

            <div class="signature-block">
              <div class="signature-line" style="font-family:'Pinyon Script', cursive; font-size: 32px; color: #062b53; padding-top:10px;">Admin</div>
              <div class="signature-text">Authorized Signature</div>
            </div>
          </div>
          
          <div class="hash-code">Credential ID: ${hash}</div>
        </div>
      </div>
    </body>
    </html>`;

    const browser = await puppeteer.launch({ 
       headless: 'new',
       args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
    });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Enforce strict 0 margins from chromium to eliminate white space bleeding
    const pdfUint8Array = await page.pdf({
      width: '1123px',
      height: '794px',
      printBackground: true,
      pageRanges: '1',
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    await browser.close();
    return Buffer.from(pdfUint8Array);
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  }
};

module.exports = generatePDF;
