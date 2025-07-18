import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase/supabase'

const VERIFY_TOKEN = process.env.VERIFY_TOKEN!

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WEBHOOK VERIFIED')
    return new Response(challenge ?? '', { status: 200 })
  } else {
    return new Response('❌ Verification failed', { status: 403 })
  }
}



export async function POST(req: NextRequest) {
  const body = await req.json();

  const change = body?.entry?.[0]?.changes?.[0];
  const value = change?.value;

  const contact = value?.contacts?.[0];
  const message = value?.messages?.[0];

  // Only handle text messages for now
  if (!message || message.type !== 'text') {
    console.log('📦 Non-text message received, skipping');
    return new Response("EVENT_RECEIVED", { status: 200 });
  }

  const entry = {
    from: contact?.wa_id ?? 'unknown',
    body: message.text.body,
    direction: 'incoming',
    created_at: new Date(Number(message.timestamp) * 1000).toISOString()
  };

   console.log('📦 Entry to insert:', entry);


  const { data, error } = await supabase.from('messages').insert([entry]);
  if (error) {
    console.error('❌ DB error:', error.message);
  } else {
    console.log('✅ Message saved:', data);
  }

  return new Response("EVENT_RECEIVED", { status: 200 });
}