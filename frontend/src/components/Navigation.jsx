import { useNavigate } from 'react-router-dom'

export default function Navigation() {
  const navigate = useNavigate()

  const menuItems = [
    { name: 'RAKHI', highlight: true, path: '/category/rakhi' },
    { name: 'GIFTS', path: '/category/gifts' },
    { name: 'NECKLACE', path: '/category/necklace' },
    { name: 'WEDDING COLLECTION', path: '/category/wedding' },
    { name: 'PENDENT SET', path: '/category/pendants' },
    { name: 'RINGS', path: '/category/rings' },
    { name: 'BRACELETS', path: '/category/bracelets' },
    { name: 'EAR RINGS', path: '/category/earrings' },
    { name: 'JEWELS FOR BABY', path: '/category/baby' },
    { name: 'JEWELS FOR MEN', path: '/category/men' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-30 py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div
          className="flex items-center justify-center space-x-3 md:space-x-5 py-2 overflow-x-auto"
          style={{
            scrollbarWidth: 'none',     // Firefox
            msOverflowStyle: 'none',    // IE/Edge
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Inline scrollbar removal for Chrome/Safari */}
          <style>{`
            nav div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`px-2 py-1 text-xs md:text-sm font-medium transition-colors relative ${
                item.highlight
                  ? 'bg-red-100 text-red-800 rounded-full'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50 rounded whitespace-nowrap'
              } hover:scale-105 transform transition-transform`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
