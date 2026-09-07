const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export interface Analysis {
  category: string
  style: string
  palette: string
  gender: string
}

export interface Match {
  id: number
  name: string
  type: string
  image: string
}

export interface LookbookResult {
  image: string
}

const MOCK_MATCHES: Match[] = [
  { id: 1, name: 'Jeans Azules Compatibles', type: 'bottom', image: '/assets/jeans.jpg' },
  { id: 2, name: 'Zapatillas Blancas Compatibles', type: 'shoes', image: '/assets/sneakers.jpg' },
  { id: 3, name: 'Chaqueta de Cuero', type: 'top', image: '/assets/jacket.jpg' },
]

function guessFromHint(hint: string): Analysis {
  const h = hint.toLowerCase()
  let category = 'top'
  if (/pantal[oó]n|jeans?|falda|short|bottom/.test(h)) category = 'bottom'
  else if (/zapat|zapato|tenis|sneaker|shoe/.test(h)) category = 'shoes'
  else if (/bolso|gafa|reloj|gorra|sombrero|bufanda|accesor/.test(h)) category = 'accessory'
  return { category, style: 'casual', palette: 'neutral', gender: 'unisex' }
}

export async function analyzeImage(formData: FormData): Promise<Analysis> {
  try {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Error en análisis')
    return res.json()
  } catch {
    // Sin backend: heurística local con la pista de voz/texto. Cero coste.
    return guessFromHint((formData.get('hint') as string) ?? '')
  }
}

export async function getMatches(category: string): Promise<Match[]> {
  try {
    const res = await fetch(`${API_BASE}/api/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    })
    if (!res.ok) throw new Error('Error getting matches')
    return res.json()
  } catch {
    const found = MOCK_MATCHES.filter((m) => m.type === category)
    return found.length > 0 ? found : MOCK_MATCHES
  }
}

export async function generateLookbook(match1: Match, match2: Match, stylePreference = 'casual'): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/generate-look`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match1, match2, stylePreference }),
    })
    if (!res.ok) throw new Error('Error generating lookbook')
    const data = await res.json()
    return data.image
  } catch {
    return `https://picsum.photos/seed/lookbook-${match1.id}-${match2.id}/800/600`
  }
}