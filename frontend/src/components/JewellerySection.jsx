import React from "react";

const JewellerySection = () => {
  return (
    <section className="w-full bg-white  py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative border border-gray-300 p-2">
            <img
              src="https://images.pexels.com/photos/3641059/pexels-photo-3641059.jpeg"
              alt="Jewellery"
              className="w-96 h-auto object-cover"
            />
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="text-3xl font-[cursive] mb-2">Jina Fashion</h2>
            <p className="text-gray-700 mb-3">discover our new products</p>
            <img
              src="https://cdn.pixabay.com/photo/2023/05/23/09/23/pearl-8012322_1280.jpg"
              alt="Model"
              className="w-60 h-auto rounded"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="text-center md:text-left">
          <p className="text-sm text-[#8b2d2d] tracking-widest mb-2">OUR</p>
          <h1 className="text-5xl font-serif">JEWELLERY</h1>
          <h2 className="text-3xl font-serif mb-4">STORE</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            "At Jina Fashion, we bring you an enchanting collection of jewelry
            that blends timeless elegance with modern artistry, crafted to make
            every moment unforgettable and every outfit extraordinary."
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <button className="bg-black text-white px-6 py-2 font-semibold hover:bg-gray-900 transition">
              SHOP NOW
            </button>
            <button className="border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-100 transition">
              VIEW MORE
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default JewellerySection;
