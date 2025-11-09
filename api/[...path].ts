import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const base = process.env.EC2_API_BASE;
  if (!base) return res.status(500).send('EC2_API_BASE environment variable is not set.');

  const q = { ...req.query };
  const path = Array.isArray(q.path) ? q.path.join('/') : (q.path as string) || '';
  delete q.path;

  const u = new URL(base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, ''));
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) {
    if (Array.isArray(v)) v.forEach((vv) => sp.append(k, String(vv)));
    else if (v != null) sp.append(k, String(v));
  }
  const qs = sp.toString();
  if (qs) u.search = qs;

  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === 'string') headers[k] = v;
  }
  delete headers.host;
  delete headers['content-length'];
  delete headers['accept-encoding'];

  let body: any = undefined;
  if (req.method && !['GET', 'HEAD'].includes(req.method)) {
    if (Buffer.isBuffer(req.body) || typeof req.body === 'string') {
      body = req.body as any;
    } else if (req.body != null) {
      if (!headers['content-type']) headers['content-type'] = 'application/json';
      body = JSON.stringify(req.body);
    }
  }

  try {
    const upstream = await fetch(u.toString(), { method: req.method, headers, body, redirect: 'manual' });
    upstream.headers.forEach((v, k) => {
      if (k.toLowerCase() !== 'content-encoding') res.setHeader(k, v);
    });
    res.status(upstream.status);
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (e) {
    res.status(502).send('Bad Gateway');
  }
}
