export interface VoiceRecognitionOptions {
  continuous?: boolean
  lang?: string
  interimResults?: boolean
}

export class VoiceInputService {
  private recognition: SpeechRecognition | webkitSpeechRecognition | null
  private isSupported: boolean
  private onResult: ((text: string) => void) | null
  private onError: ((error: Error) => void) | null

  constructor() {
    this.isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    this.onResult = null
    this.onError = null

    this.recognition = null
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
    } else if ('SpeechRecognition' in window) {
      this.recognition = new window.SpeechRecognition()
    }

    if (this.recognition) {
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = 'es-ES'
      this.recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        this.onResult?.(transcript)
      }
      this.recognition.onerror = (event: any) => {
        this.onError?.(new Error('Voice recognition error: ' + event.error))
      }
    }
  }

  get isAvailable(): boolean {
    return this.isSupported && this.recognition !== null
  }

  start(onResult: (text: string) => void, onError?: (error: Error) => void): void {
    if (!this.isAvailable) {
      console.warn('Voice recognition not supported')
      return
    }
    this.onResult = onResult
    this.onError = onError
    this.recognition.start()
  }

  stop(): void {
    if (this.recognition) {
      this.recognition.stop()
      this.onResult = null
      this.onError = null
    }
  }
}

export const voiceInput = new VoiceInputService()
export default voiceInput