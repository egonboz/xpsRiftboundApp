const BASE_URL = '/api'

export async function apiGet<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as T
  console.log(`[API] ${path}:`, data)
  return data
}
