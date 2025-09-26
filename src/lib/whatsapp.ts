// WhatsApp integration utilities

export interface WhatsAppContactOptions {
  phone: string
  message?: string
  professionalName?: string
  service?: string
}

export class WhatsAppService {
  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    return phone.replace(/\D/g, "")
  }

  static createContactUrl({ phone, message, professionalName, service }: WhatsAppContactOptions): string {
    const formattedPhone = this.formatPhoneNumber(phone)

    let defaultMessage = "Hola, vi tu perfil en ProConnect y me interesa contactarte."

    if (professionalName && service) {
      defaultMessage = `Hola ${professionalName}, vi tu perfil en ProConnect y me interesa contactarte para un proyecto de ${service}.`
    } else if (professionalName) {
      defaultMessage = `Hola ${professionalName}, vi tu perfil en ProConnect y me interesa contactarte para un proyecto.`
    }

    const finalMessage = message || defaultMessage
    const encodedMessage = encodeURIComponent(finalMessage)

    return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`
  }

  static openWhatsApp(options: WhatsAppContactOptions): void {
    const url = this.createContactUrl(options)
    window.open(url, "_blank")
  }

  static createQuickContactButton(
    professional: { name: string; phone: string; profession: string },
    customMessage?: string,
  ) {
    return () => {
      this.openWhatsApp({
        phone: professional.phone,
        professionalName: professional.name,
        service: professional.profession,
        message: customMessage,
      })
    }
  }
}
