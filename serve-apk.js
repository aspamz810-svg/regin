const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const APK_PATH = path.join(__dirname, 'kinestex-demo.apk');
const HTML_PATH = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
  // Allow Camera and cross-origin permissions
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Permissions-Policy', 'camera=*, microphone=*, display-capture=*');

  if (req.url === '/kinestex-demo.apk') {
    if (!fs.existsSync(APK_PATH)) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      return res.end('kinestex-demo.apk not found');
    }
    const stat = fs.statSync(APK_PATH);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="kinestex-demo.apk"'
    });
    fs.createReadStream(APK_PATH).pipe(res);
  } else {
    // Serve Web App index.html
    if (!fs.existsSync(HTML_PATH)) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      return res.end('index.html not found');
    }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    fs.createReadStream(HTML_PATH).pipe(res);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/ and http://0.0.0.0:${PORT}/`);
});
