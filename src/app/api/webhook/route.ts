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


