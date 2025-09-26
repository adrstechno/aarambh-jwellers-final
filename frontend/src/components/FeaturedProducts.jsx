import { useState } from 'react'
import ProductCard from './ProductCard'
import { products } from '../data/products'

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('necklace')

  const categories = ['necklace', 'rings', 'bracelets']
  
  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 italic mb-4">Eternal Elegance</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">FEATURED PRODUCTS</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            "Celebrate your moments with timeless designs, meticulously crafted to perfection by Jina Fashion."
          </p>
        </div>

{/* Tab Navigation */}
<div className="flex justify-center mb-12">
  <div className="bg-white rounded-lg shadow-sm p-1">
    {categories.map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-8 py-3 text-sm font-medium rounded-md transition-colors ${
          activeTab === tab
            ? 'bg-amber-400 text-gray-900 shadow-sm' // active = golden
            : 'text-gray-700 hover:text-amber-600 hover:bg-amber-50'
        }`}
      >
        {tab.toUpperCase()}
      </button>
    ))}
  </div>
</div>


        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {getProductsByCategory(activeTab).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}