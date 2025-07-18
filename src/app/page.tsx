'use client'

import { useState } from 'react'

 

export default function Home() {

   const [to, setTo] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setStatus('Sending...')

  console.log('📨 Sending to:', to)
  console.log('✏️ Message text:', text)

  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, text }),
    })

    const result = await res.json()
    console.log('✅ API response:', result)

    setStatus(`✅ Sent! ID: ${result.messages?.[0]?.id ?? 'n/a'}`)
  } catch (error) {
    console.error('❌ Send error:', error)
    setStatus('❌ Failed to send message')
  }
}

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
       <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
      <input
        type="text"
        placeholder="WhatsApp number"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border p-2"
      />
      <textarea
        placeholder="Your message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-black text-white p-2">
        Send Message
      </button>
      {status && <p>{status}</p>}
    </form>
    </div>
  );
}
