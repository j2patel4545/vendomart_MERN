// ProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DynamicImageSlider from "../components/DynamicImageSlider";
import TypeOfProduct from "./Sections/TypeOfProduct";

const BASE_URL = "http://localhost:9999";

const ProductPage = () => {
  const { productTypeName } = useParams(); // URL param
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/slider-images/`);
        if (res.data && Array.isArray(res.data)) {
          console.log("API Data:", res.data);

          // Filter ONLY by productTypeName
          const filtered = res.data
            .filter((item) => {
              const typeName = item.productTypeId?.productTypeName || "";

              console.log(
                "Comparing:",
                typeName,
                productTypeName,
                "=>",
                typeName.toLowerCase().trim() ===
                  productTypeName.toLowerCase().trim()
              );

              return typeName.toLowerCase().trim() ===
                productTypeName.toLowerCase().trim();
            })
            .map((item) => ({
              slider_image: item.slider_image,
              sliderName: item.sliderName,
            }));

          console.log("Filtered Images:", filtered);
          setSliderImages(filtered);
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
        setSliderImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderImages();
  }, [productTypeName]);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-400">
        Loading slider for "{productTypeName}"...
      </div>
    );
  }

  if (sliderImages.length === 0) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        No slider images found for "{productTypeName}".
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Slider Images for "{productTypeName}"
      </h1>

      {/* Use the DynamicImageSlider component */}
      <DynamicImageSlider images={sliderImages} interval={4000} />

      <TypeOfProduct/>
    </div>
  );
};

export default ProductPage;
