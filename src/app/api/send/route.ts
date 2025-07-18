// app/api/send/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { to, text } = await req.json();

  const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    }),
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
