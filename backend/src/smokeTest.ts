/**
 * Quick smoke test that posts a real PDF to the running backend.
 * Run with: npx ts-node src/smokeTest.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// We'll just fire at the /generate-resume endpoint with a pre-existing PDF
async function post(filePath: string) {
    const boundary = `----FormBoundary${Date.now()}`;
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="resume"; filename="${fileName}"\r\nContent-Type: application/pdf\r\n\r\n`),
        fileBuffer,
        Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="jobTitle"\r\n\r\nSoftware Engineer\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="jobDescription"\r\n\r\nLooking for a Software Engineer proficient in JavaScript, React, TypeScript, and Node.js.\r\n`),
        Buffer.from(`--${boundary}--\r\n`)
    ]);

    return new Promise<string>((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3001,
            path: '/generate-resume',
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length,
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

const pdfPath = process.argv[2];
if (!pdfPath) {
    console.error('Usage: npx ts-node src/smokeTest.ts /path/to/resume.pdf');
    process.exit(1);
}

post(pdfPath).then(result => {
    const json = JSON.parse(result);
    if (!json.success) {
        console.error('❌ Error:', json.message);
        console.error(json.stack || '');
    } else {
        console.log('✅ Success!');
        console.log('Optimized summary:', json.data.optimizedJson?.summary?.substring(0, 200));
        console.log('PDF available:', json.data.pdfAvailable);
    }
}).catch(err => console.error('Request failed:', err));
