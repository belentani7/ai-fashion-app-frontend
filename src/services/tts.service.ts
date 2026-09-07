export interface TTSOptions {
  lang?: string
  rate?: number
  pitch?: number
  volume?: number
}

export class TTSService {
  private utterance: SpeechSynthesisUtterance
  private isSupported: boolean

  constructor() {
    this.utterance = new SpeechSynthesisUtterance()
    this.isSupported = 'speechSynthesis' in window

    this.utterance.onend = () => {}
    this.utterance.onerror = (event) => {
      console.error('TTS error', event)
    }
  }

  get isAvailable(): boolean {
    return this.isSupported
  }

  speak(text: string, options: TTSOptions = {}): void {
    if (!this.isAvailable) {
      console.warn('TTS not supported in this browser')
      return
    }

    const {
      lang = 'es-ES',
      rate = 1,
      pitch = 1,
      volume = 1,
    } = options

    this.utterance.lang = lang
    this.utterance.rate = rate
    this.utterance.pitch = pitch
    this.utterance.volume = volume
    this.utterance.text = text

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(this.utterance)
  }

  stop(): void {
    if (this.isAvailable) {
      window.speechSynthesis.cancel()
    }
  }
}

export const tts = new TTSService()
export default tts