import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Minus, Plus, Star, Share2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { products } from '../data/products'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useApp()

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id))
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      navigate('/')
    }
  }, [id, navigate])

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const isInWishlist = wishlist.some(item => item.id === product.id)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-red-600">Home</button>
            <span>/</span>
            <button onClick={() => navigate(`/category/${product.category}`)} className="hover:text-red-600 capitalize">
              {product.category}
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.images ? product.images[selectedImage] : product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-500">(24 reviews)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                    -{product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Material</h3>
                <p className="text-gray-600">{product.material}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SKU</h3>
                <p className="text-gray-600">{product.sku}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.isSoldOut}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                    product.isSoldOut
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.isSoldOut ? 'SOLD OUT' : 'ADD TO CART'}</span>
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>

                <button className="p-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              <button className="w-full py-3 px-6 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
                BUY NOW
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Authentic Products</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>1 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}