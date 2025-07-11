import { NextRequest } from 'next/server'

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
  const body = await req.json()
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19)
  console.log(`📩 Webhook received at ${timestamp}`)
  console.dir(body, { depth: null })

  return new Response('OK', { status: 200 })
}