// Cloudflare Worker to send HTML + photo attachments via AWS SES Raw Email
// Required env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, SES_FROM
// POST JSON: { to, subject, html, photos:[{filename,dataUrl}] }

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })

    let payload
    try { payload = await request.json() } catch { return new Response('Invalid JSON', { status: 400 }) }
    const { to, subject, html, photos = [] } = payload || {}
    if (!to || !subject || !html) return new Response('Missing to/subject/html', { status: 400 })
    const from = env.SES_FROM
    if (!from) return new Response('Missing SES_FROM env', { status: 500 })

    const boundary = `BOUNDARY-${crypto.randomUUID()}`
    const parts = []
    parts.push(`--${boundary}\r\nContent-Type: text/html; charset="UTF-8"\r\nContent-Transfer-Encoding: 7bit\r\n\r\n${html}\r\n`)

    for (const p of photos.slice(0, 5)) {
      const { filename = 'photo.jpg', dataUrl = '' } = p || {}
      const base64 = dataUrl.split(',')[1]
      if (!base64) continue
      parts.push(`--${boundary}\r\nContent-Type: image/jpeg; name="${filename}"\r\nContent-Disposition: attachment; filename="${filename}"\r\nContent-Transfer-Encoding: base64\r\n\r\n${base64}\r\n`)
    }
    parts.push(`--${boundary}--`)

    const raw = `From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n` + parts.join('')
    const rawBase64 = btoa(raw)

    const region = env.AWS_REGION || 'us-east-1'
    const host = `email.${region}.amazonaws.com`
    const url = `https://${host}/v2/email/outbound-emails`

    const body = JSON.stringify({
      Content: { Raw: { Data: rawBase64 } },
      Destination: { ToAddresses: [to] },
      FromEmailAddress: from,
    })

    const headers = await signAws({
      method: 'POST',
      url,
      service: 'ses',
      region,
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      body,
    })

    const resp = await fetch(url, { method: 'POST', headers, body })
    if (!resp.ok) return new Response(await resp.text(), { status: 502 })
    return new Response('ok', { status: 200 })
  },
}

async function signAws({ method, url, service, region, accessKeyId, secretAccessKey, body = '' }) {
  const { pathname, host } = new URL(url)
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}Z$/g, '').replace('T', '') + 'Z'
  const datestamp = amzDate.slice(0, 8)

  const hashedPayload = await sha256Hex(body)
  const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-amz-date:${amzDate}\n`
  const signedHeaders = 'content-type;host;x-amz-date'
  const canonicalRequest = [method, pathname, '', canonicalHeaders, signedHeaders, hashedPayload].join('\n')
  const credentialScope = `${datestamp}/${region}/${service}/aws4_request`
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, await sha256Hex(canonicalRequest)].join('\n')

  const kDate = await hmac(`AWS4${secretAccessKey}`, datestamp)
  const kRegion = await hmac(kDate, region)
  const kService = await hmac(kRegion, service)
  const kSigning = await hmac(kService, 'aws4_request')
  const signature = await hmacHex(kSigning, stringToSign)

  return {
    'Content-Type': 'application/json',
    'X-Amz-Date': amzDate,
    Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  }
}

async function sha256Hex(message) {
  const data = typeof message === 'string' ? new TextEncoder().encode(message) : message
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return bufferToHex(hashBuffer)
}

async function hmac(key, msg) {
  const keyData = typeof key === 'string' ? new TextEncoder().encode(key) : key
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(msg))
}

async function hmacHex(keyBuf, msg) {
  const cryptoKey = await crypto.subtle.importKey('raw', keyBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(msg))
  return bufferToHex(sig)
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
