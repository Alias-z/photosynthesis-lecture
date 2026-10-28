// Dev-server endpoint for each slide's status (lecturer, 29 Oct 2026: "a freeze button on the slide; show me which one
// is frozen and which one you are building").
// - research/figure-briefs/status.json holds only the lecturer's freezes; only this server writes it.
// - research/figure-briefs/status-building.json holds the assistant's "building" notes; only the assistant writes it.
// GET /__status returns both. POST /__status with { n, on } freezes (on) or unfreezes one slide, applied to the file as
// it is now. A whole list is never written from a page, so a page with an old list can't wipe freezes made elsewhere
// (29 Oct 2026, late: freezes were lost that way). An old page that still sends { frozen } can only add freezes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../research/figure-briefs');
const FILE = path.join(DIR, 'status.json'), BFILE = path.join(DIR, 'status-building.json');
const readJson = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const frozenNow = () => readJson(FILE, {}).frozen ?? {};
const buildingNow = () => readJson(BFILE, {}).building ?? {};

export default function statusPlugin() {
  return {
    name: 'slide-status',
    configureServer(server) {
      server.middlewares.use('/__status', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => (body += chunk));
          req.on('end', () => {
            try {
              const msg = JSON.parse(body), frozen = { ...frozenNow() };
              if (typeof msg.n === 'string') { if (msg.on) frozen[msg.n] = true; else delete frozen[msg.n]; }
              else if (msg.frozen && typeof msg.frozen === 'object') for (const [n, v] of Object.entries(msg.frozen)) if (v) frozen[n] = true;
              fs.writeFileSync(FILE, JSON.stringify({ frozen, savedAt: new Date().toISOString() }, null, 2));
              res.setHeader('content-type', 'application/json');
              res.end(JSON.stringify({ frozen, building: buildingNow() }));
            } catch {
              res.statusCode = 400;
              res.end('invalid');
            }
          });
          return;
        }
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ frozen: frozenNow(), building: buildingNow() }));
      });
    },
  };
}
