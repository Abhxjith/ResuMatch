"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Quick smoke test that posts a real PDF to the running backend.
 * Run with: npx ts-node src/smokeTest.ts
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const http = __importStar(require("http"));
// We'll just fire at the /generate-resume endpoint with a pre-existing PDF
function post(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
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
        return new Promise((resolve, reject) => {
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
    });
}
const pdfPath = process.argv[2];
if (!pdfPath) {
    console.error('Usage: npx ts-node src/smokeTest.ts /path/to/resume.pdf');
    process.exit(1);
}
post(pdfPath).then(result => {
    var _a, _b;
    const json = JSON.parse(result);
    if (!json.success) {
        console.error('❌ Error:', json.message);
        console.error(json.stack || '');
    }
    else {
        console.log('✅ Success!');
        console.log('Optimized summary:', (_b = (_a = json.data.optimizedJson) === null || _a === void 0 ? void 0 : _a.summary) === null || _b === void 0 ? void 0 : _b.substring(0, 200));
        console.log('PDF available:', json.data.pdfAvailable);
    }
}).catch(err => console.error('Request failed:', err));
