const ADMIN_KEY = 'metro99';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function isAdmin(url) {
  return url.searchParams.get('manage') === ADMIN_KEY;
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id');
  const deals = (await context.env.DEALS_KV.get('deals', { type: 'json' })) || [];

  if (id) {
    const deal = deals.find((d) => d.id === id);
    if (!deal) return json({ error: 'Not found' }, 404);
    return json(deal);
  }

  return json(deals);
}

export async function onRequestPost(context) {
  const url = new URL(context.request.url);
  if (!isAdmin(url)) return json({ error: 'Unauthorized' }, 401);

  const deal = await context.request.json();
  if (!deal.address || !deal.price) return json({ error: 'address and price are required' }, 400);

  const deals = (await context.env.DEALS_KV.get('deals', { type: 'json' })) || [];
  const newDeal = {
    id: Date.now().toString(),
    address: deal.address,
    price: deal.price,
    beds: deal.beds || '',
    baths: deal.baths || '',
    sqft: deal.sqft || '',
    description: deal.description || '',
    status: deal.status || 'Available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  deals.unshift(newDeal);
  await context.env.DEALS_KV.put('deals', JSON.stringify(deals));
  return json(newDeal, 201);
}

export async function onRequestPut(context) {
  const url = new URL(context.request.url);
  if (!isAdmin(url)) return json({ error: 'Unauthorized' }, 401);

  const updates = await context.request.json();
  if (!updates.id) return json({ error: 'id is required' }, 400);

  const deals = (await context.env.DEALS_KV.get('deals', { type: 'json' })) || [];
  const idx = deals.findIndex((d) => d.id === updates.id);
  if (idx === -1) return json({ error: 'Not found' }, 404);

  deals[idx] = { 
    ...deals[idx], 
    ...updates,
    updatedAt: new Date().toISOString()
  };
  await context.env.DEALS_KV.put('deals', JSON.stringify(deals));
  return json(deals[idx]);
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url);
  if (!isAdmin(url)) return json({ error: 'Unauthorized' }, 401);

  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'id is required' }, 400);

  const deals = (await context.env.DEALS_KV.get('deals', { type: 'json' })) || [];
  const filtered = deals.filter((d) => d.id !== id);
  await context.env.DEALS_KV.put('deals', JSON.stringify(filtered));
  return json({ success: true });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
