// Server-only access token. The browser sends no name, phone or child details.
export async function POST(request) {
  const headers = {'Cache-Control':'no-store'};
  const reply = (data,status=200) => Response.json(data,{status,headers});
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  const permitted = new Set([requestUrl.origin]);
  if (process.env.SITE_URL) { try { permitted.add(new URL(process.env.SITE_URL).origin); } catch {} }
  if (!origin || !permitted.has(origin)) return reply({error:'Forbidden'},403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({error:'JSON required'},415);
  const length = Number(request.headers.get('content-length'));
  if (length > 4096) return reply({error:'Request too large'},413);
  let body;
  try {
    const raw=await request.text();
    if (raw.length>4096) return reply({error:'Request too large'},413);
    body=JSON.parse(raw);
  } catch { return reply({error:'Invalid JSON'},400); }
  if (body.consent !== true) return reply({error:'Consent required'},400);
  if (!['PageView','WhatsAppClick'].includes(body.event_name) || !/^[\w-]{5,100}$/.test(body.event_id || '')) return reply({error:'Invalid event'},400);
  let source;
  try { source=new URL(body.source_url); if (!permitted.has(source.origin)) throw new Error(); }
  catch { return reply({error:'Invalid source'},400); }
  const pixel=process.env.META_PIXEL_ID, token=process.env.META_CAPI_ACCESS_TOKEN, version=process.env.META_GRAPH_API_VERSION;
  if (!/^\d{5,25}$/.test(pixel || '') || !token || !/^v\d+\.\d+$/.test(version || '')) return reply({enabled:false});
  const userData={client_user_agent:(request.headers.get('user-agent') || '').slice(0,1024)};
  // Vercel supplies the original client's IP via this trusted platform header.
  const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (ip && /^[\da-fA-F:.]+$/.test(ip)) userData.client_ip_address=ip;
  for (const key of ['fbp','fbc']) if (typeof body[key]==='string' && /^fb\.\d\.\d+\.[\w-]{1,300}$/.test(body[key])) userData[key]=body[key];
  const event={
    event_name:body.event_name,event_time:Math.floor(Date.now()/1000),event_id:body.event_id,
    action_source:'website',event_source_url:source.origin+source.pathname,user_data:userData,
    custom_data:{segment:'turkish_relocating_families',placement:String(body.placement || '').replace(/[^a-z_]/g,'').slice(0,40)}
  };
  try {
    const response=await fetch(`https://graph.facebook.com/${version}/${pixel}/events`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({data:[event],access_token:token,...(process.env.META_TEST_EVENT_CODE?{test_event_code:process.env.META_TEST_EVENT_CODE}:{})}),
      signal:AbortSignal.timeout(5000)
    });
    if (!response.ok) return reply({error:'Measurement unavailable'},502);
    return reply({accepted:true});
  } catch { return reply({error:'Measurement unavailable'},502); }
}
