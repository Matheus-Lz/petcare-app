import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const base = process.env.EC2_API_BASE;
  if (!base) return res.status(500).send('EC2_API_BASE environment variable is not set.');

  const segs = (req.query.path as string[] | undefined) ?? [];
  const path = segs.join('/');

  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) {
    if (k === 'path') continue;
    if (Array.isArray(v)) v.forEach((vv) => params.append(k, String(vv)));
    else if (v != null) params.append(k, String(v));
  }

  const url =
    base.replace(/\/+$/, '') +
    '/' +
    path.replace(/^\/+/, '') +
    (params.toString() ? `?${params.toString()}` : '');

  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === 'string') headers[k] = v;
  }
  delete headers.host;
  delete headers['content-length'];
  delete headers['accept-encoding'];

  let body: any;
  if (req.method && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    if (Buffer.isBuffer(req.body) || typeof req.body === 'string') body = req.body;
    else if (req.body != null) {
      if (!headers['content-type']) headers['content-type'] = 'application/json';
      body = JSON.stringify(req.body);
    }
  }

  try {
    const upstream = await fetch(url, { method: req.method, headers, body, redirect: 'manual' });
    upstream.headers.forEach((v, k) => {
      if (k.toLowerCase() !== 'content-encoding') res.setHeader(k, v);
    });
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.status(upstream.status).send(buf);
  } catch (e) {
    res.status(502).send('Bad Gateway');
  }
}
