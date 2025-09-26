import { useNavigate } from "react-router-dom";
// import {silverProducts} from '../assets/silverProducts.png';
// import {jewelleryVid} from '../assets/jewellery.mp4';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50">
      <img src="/secretGems.png" className="rounded-lg  w-7xl m-auto" alt="secretgems"  />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 py-16">
        
        {/* Left: Video/Image */}
        <div className="w-full">
          <video
            src="/jewellery.mp4" // replace with your video
          
            autoPlay
            loop
            muted
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </div>

        {/* Right: Text Content */}
        <div className="space-y-6">
          <p className="text-lg text-amber-600 font-serif">Dual Elegance</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            ROSE RADIANCE JEWEL
          </h1>
          <p className="text-gray-600 max-w-lg">
            A stunning fusion of ring and bracelet in a luxe rose gold finish,
            crafted to captivate.
          </p>
          <button
            onClick={() => navigate("/category/rings")}
            className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition"
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* Discount Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          {/* Left - Discount Text */}
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">
              DISCOUNT OF <span className="text-amber-600">20%</span>
            </h2>
            <p className="text-2xl font-serif text-gray-700">
              ON ALL SILVER PRODUCTS
            </p>
            <p className="text-gray-500">
              Sparkle with elegance – Enjoy 20% off on all silver products at
              Jina Fashion!
            </p>
          </div>

          {/* Right - Silver Products Grid */}
          <div className="bg-gradient-to-br from-amber-100 to-gray-50  rounded-lg shadow-md">
            <img src="/silverProducts.png" alt="Silver Products" className="rounded-lg border border-gray-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
