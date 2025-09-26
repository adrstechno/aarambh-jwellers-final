import { FaWhatsapp } from "react-icons/fa"

export default function WhatsAppButton() {
  const phoneNumber = "919876543210"
  const message = "Hello! I would like to know more about your products."

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <FaWhatsapp className="w-6 h-6" />
      </button>
    </div>
  )
}
