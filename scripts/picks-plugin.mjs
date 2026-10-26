// Dev-server endpoint for the figure gallery: GET /__picks returns the saved picks, POST /__picks saves them
// to research/figure-briefs/picks.json so the lecturer's selections and notes live in the project.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../research/figure-briefs/picks.json');

export default function picksPlugin() {
  return {
    name: 'figure-picks',
    configureServer(server) {
      server.middlewares.use('/__picks', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => (body += chunk));
          req.on('end', () => {
            try {
              fs.writeFileSync(FILE, JSON.stringify(JSON.parse(body), null, 2));
              res.end('saved');
            } catch {
              res.statusCode = 400;
              res.end('invalid');
            }
          });
          return;
        }
        res.setHeader('content-type', 'application/json');
        res.end(fs.existsSync(FILE) ? fs.readFileSync(FILE) : '{}');
      });
    },
  };
}
