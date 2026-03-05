const http = require('http');
const fs = require('fs');
const boundary = 'FormBoundary123456';
const fileBuffer = fs.readFileSync('/Users/abhijithjinnu/Desktop/Resume.pdf');

const body = Buffer.concat([
    Buffer.from('--' + boundary + '\r\nContent-Disposition: form-data; name="resume"; filename="Resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n'),
    fileBuffer,
    Buffer.from('\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="jobTitle"\r\n\r\nFull Stack Developer\r\n'),
    Buffer.from('--' + boundary + '\r\nContent-Disposition: form-data; name="jobDescription"\r\n\r\nLooking for a Full Stack Developer proficient in JavaScript React TypeScript Node.js and GraphQL.\r\n'),
    Buffer.from('--' + boundary + '--\r\n')
]);

const req = http.request({
    hostname: 'localhost', port: 3001, path: '/generate-resume', method: 'POST',
    headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': body.length
    }
}, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        const json = JSON.parse(data);
        if (!json.success) {
            console.error('Error:', json.message);
            if (json.stack) console.error(json.stack);
        } else {
            console.log('SUCCESS!');
            console.log('Summary snippet:', (json.data.optimizedJson.summary || '').substring(0, 250));
            console.log('Skills:', json.data.optimizedJson.skills.slice(0, 5));
            console.log('PDF available:', json.data.pdfAvailable);
        }
    });
});
req.on('error', e => console.error('Request error:', e.message));
req.write(body);
req.end();
