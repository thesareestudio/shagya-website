interface WebhookResult {
  success: boolean
  statusCode?: number
  attempt: number
  error?: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendWebhook(
  url: string,
  payload: Record<string, unknown>,
  maxRetries = 3,
): Promise<WebhookResult> {
  let lastError: string | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10_000)

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (response.ok) {
        console.log(
          `[webhook] POST ${url} succeeded (attempt ${attempt}/${maxRetries})`,
        )
        return { success: true, statusCode: response.status, attempt }
      }

      // Server responded with error status — retry if attempts remain
      console.warn(
        `[webhook] POST ${url} returned ${response.status} (attempt ${attempt}/${maxRetries})`,
      )
      lastError = `HTTP ${response.status}`
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(
        `[webhook] POST ${url} failed: ${message} (attempt ${attempt}/${maxRetries})`,
      )
      lastError = message
    }

    // Exponential backoff before next retry: 500ms, 1500ms, 4500ms, ...
    if (attempt < maxRetries) {
      await delay(500 * Math.pow(3, attempt - 1))
    }
  }

  return { success: false, attempt: maxRetries, error: lastError }
}
