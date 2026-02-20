import React, { useEffect, useState } from "react";
import axios from "axios";
import SectionTypes from "./Sections/SectionTypes";
import DynamicImageSlider from "../components/DynamicImageSlider";
import ProductGrid from "./ProductGrid";
import TopRated from "./Sections/TopRated";

function Home() {
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    // Fetch slider images from API
    const fetchSliderImages = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/slider-images/");
        if (res.data && Array.isArray(res.data)) {
          // Filter only homepage = 1
          const homepageImages = res.data
            .filter((item) => item.homepage === 1)
            .map((item) => ({ slider_image: item.slider_image }));
          setSliderImages(homepageImages);
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
      }
    };

    fetchSliderImages();
  }, []);

  return (
    <div>
      {/* Render slider only if images exist */}
      {sliderImages.length > 0 && (
        <DynamicImageSlider images={sliderImages} interval={4000} />
      )}

      <SectionTypes />
      <TopRated/>
      <ProductGrid/>
    </div>
  );
}

export default Home;
