import { useState } from 'react'
import { Heart, Eye, ShoppingCart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useApp()
  const navigate = useNavigate()
  
  const isInWishlist = wishlist.some(item => item.id === product.id)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!product.isSoldOut) {
      addToCart(product)
    }
  }

  const handleWishlistToggle = (e) => {
    e.stopPropagation()
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    navigate(`/product/${product.id}`)
  }

  const handleCardClick = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer will-change-transform"
      style={{
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0px)',
        boxShadow: isHovered 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover will-change-transform"
          style={{
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-2 z-20">
          {product.discount && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              NEW
            </span>
          )}
          {product.isSoldOut && (
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div 
          className="absolute top-3 right-3 space-y-2 z-20"
          style={{
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(0px) scale(1)' : 'translateX(16px) scale(0.8)',
            visibility: isHovered ? 'visible' : 'hidden'
          }}
        >
          <button 
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm will-change-transform ${
              isInWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
            style={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleQuickView}
            className="bg-white/90 p-2 rounded-full shadow-lg text-gray-600 hover:bg-blue-50 hover:text-blue-500 backdrop-blur-sm will-change-transform"
            style={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Overlay Add to Cart */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            background: isHovered ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: isHovered && !product.isSoldOut ? 1 : 0,
            visibility: isHovered && !product.isSoldOut ? 'visible' : 'hidden',
            backdropFilter: isHovered ? 'blur(2px)' : 'blur(0px)'
          }}
        >
          <button 
            onClick={handleAddToCart}
            className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 flex items-center space-x-2 shadow-xl will-change-transform"
            style={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isHovered ? 'translateY(0px) scale(1)' : 'translateY(20px) scale(0.9)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(0px) scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px) scale(1)'
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
          style={{
            transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            color: isHovered ? '#dc2626' : '#111827'
          }}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Bottom Add to Cart */}
<button 
  onClick={handleAddToCart}
  className={`w-full py-3 cursor-pointer px-4 rounded-lg font-medium border will-change-transform ${
    product.isSoldOut
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
      : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
  }`}
  style={{
    transition: 'all 0.3s ease',
    transform: 'scale(1)'
  }}
  onMouseEnter={(e) => {
    if (!product.isSoldOut) {
      e.currentTarget.style.transform = 'scale(1.02)'
    }
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'scale(1)'
  }}
  disabled={product.isSoldOut}
>
  {product.isSoldOut ? 'SOLD OUT' : 'ADD TO CART'}
</button>

      </div>
    </div>
  )
}