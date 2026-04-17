const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '905000000000'

export function generateWhatsAppMessage(items, totalPrice) {
  const productLines = items
    .map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
    .join('\n')

  const message = `Merhaba, şu ürünleri sipariş etmek istiyorum:\n\n${productLines}\n\n💰 Toplam: ${formatPrice(totalPrice)}\n\nSipariş onayı için lütfen iletişime geçin. Teşekkürler! 🛍️`

  return message
}

export function generateWhatsAppUrl(items, totalPrice) {
  const message = generateWhatsAppMessage(items, totalPrice)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WA_NUMBER}?text=${encoded}`
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}
