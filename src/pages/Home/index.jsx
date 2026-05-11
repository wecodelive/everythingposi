import React, { useEffect, useMemo, useState } from "react";
import ProductFrame from "../../components/ProductFrame";
import { Search } from "../../components/Inputs";
import Button from "../../components/Buttons";
import { useNavigate } from "react-router";
import {
  adminGetCategories,
  adminGetProducts,
  adminGetPromoCodes,
} from "../../services/adminFunctions";
import { notifyError, notifySuccess } from "../../utils/notify";
import { useCurrency } from "../../context/CurrencyContext";
import ProductFrameV2 from "../../components/ProductFrameV2";
import { mockProducts } from "../../utils/mockProducts";
import { div } from "framer-motion/client";

export default function Index() {
  const navigate = useNavigate();
  const { formatFromBase } = useCurrency();
  const [homeProducts, setHomeProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activePromo, setActivePromo] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const featuredProducts = useMemo(
    () => homeProducts.slice(0, 8),
    [homeProducts],
  );

  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return homeProducts
      .filter((product) => {
        const searchableValue = [product.name, product.category?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableValue.includes(query);
      })
      .slice(0, 5);
  }, [homeProducts, searchQuery]);

  const shouldShowSuggestions =
    isSearchFocused && searchQuery.trim() && searchSuggestions.length > 0;

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return featuredProducts;
    }

    return featuredProducts.filter((product) => {
      const searchableValue = [product.name, product.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableValue.includes(query);
    });
  }, [featuredProducts, searchQuery]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) {
      navigate("/products");
      return;
    }

    navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  const handleCopyPromoCode = async () => {
    if (!activePromo?.code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activePromo.code);
      notifySuccess("Promo code copied.");
    } catch {
      notifyError("Unable to copy promo code");
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setProductsLoading(true);

        const [productsResult, categoriesResult, promosResult] =
          await Promise.allSettled([
            adminGetProducts({ page: 1, limit: 16 }),
            adminGetCategories(),
            adminGetPromoCodes({ status: "active" }),
          ]);

        if (
          productsResult.status !== "fulfilled" ||
          !productsResult.value?.success
        ) {
          throw new Error(
            productsResult.status === "fulfilled"
              ? productsResult.value?.message || "Failed to load products"
              : "Failed to load products",
          );
        }

        setHomeProducts(productsResult.value.products || []);

        if (
          categoriesResult.status === "fulfilled" &&
          categoriesResult.value?.success
        ) {
          setCategories(categoriesResult.value.categories || []);
        }

        if (
          promosResult.status === "fulfilled" &&
          promosResult.value?.success
        ) {
          const promos = promosResult.value.promos || [];
          setActivePromo(promos[0] || null);
        }
      } catch (error) {
        console.error("Error fetching homepage products:", error);
        notifyError(error.message || "Unable to load products");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Featured product (first product with image)
  const heroProduct = useMemo(
    () => homeProducts.find((p) => p.images?.[0]) || homeProducts[0],
    [homeProducts],
  );

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen bg-neutral-100 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full w-auto h-auto object-cover"
        >
          <source src="/public/bg-vid.mp4" type="video/mp4" />
        </video>

        {/* Hero Content */}
        <div className="absolute bottom-20 right-0 w-full z-10 text-center text-white px-8">
          {/* <h1 className="font-serif text-6xl md:text-7xl font-light tracking-wider mb-4">
            Timeless Elegance
          </h1>
          <p className="font-body font-light text-xl md:text-2xl tracking-widest mb-12">
            Discover Our Newest Collection
          </p> */}
          <button
            onClick={() => navigate("/products")}
            className="px-12 py-4 text-white border border-white font-serif font-semibold tracking-widest text-sm hover:bg-white hover:text-black transition"
          >
            SHOP NOW
          </button>
        </div>
      </div>

      {/* search by category */}

      <div className="w-full flex items-center justify-center mt-15">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-5 mb-20 mx-auto">
          <h2 className="font-serif text-2xl font-light col-span-2 lg:col-span-4 tracking-widest text-black my-12 uppercase text-center">
            Shop By Category
          </h2>

          <div className="text-center flex flex-col gap-3 cursor-pointer">
            <div className=" h-[196.8px] w-[196.8px] md:w-[373px] md:h-[373px] bg-black bg-[url('/necklace.jpg')] bg-cover bg-bottom"></div>
            <h4 className="text-sm md:text-base">NECKLACES & PENDANTS</h4>
          </div>

          <div className="text-center flex flex-col gap-3 cursor-pointer">
            <div className=" h-[196.8px] w-[196.8px] md:w-[373px] md:h-[373px] bg-black bg-[url('/bracelet.jpg')] bg-cover bg-center"></div>
            <h4 className="text-sm md:text-base">BRACELETS</h4>
          </div>

          <div className="text-center flex flex-col gap-3 cursor-pointer">
            <div className=" h-[196.8px] w-[196.8px] md:w-[373px] md:h-[373px] bg-black bg-[url('/earrings.jpg')] bg-cover bg-center"></div>
            <h4 className="text-sm md:text-base">EARRINGS</h4>
          </div>

          <div className="text-center flex flex-col gap-3 cursor-pointer">
            <div className=" h-[196.8px] w-[196.8px] md:w-[373px] md:h-[373px] bg-black bg-[url('/rings.jpg')] bg-cover bg-center"></div>
            <h4 className="text-sm md:text-base">RINGS</h4>
          </div>
          {/* Collections Column */}

          {/* Discover Column */}

          {/* Featured Story */}
        </div>
      </div>

      {/* Featured Products */}
      <div className="flex flex-col gap-10 w-full px-5 md:px-10 bg-white">
        <div className="w-full flex gap-5 md:gap-10 overflow-x-scroll [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden  mb-20">
          {mockProducts.map((product) => (
            <ProductFrameV2
              key={product.id}
              productId={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.images}
              onClick={() => console.log("Product clicked:", product.id)}
            />
          ))}
        </div>

        {/* {
          <ProductFrameV2
            productId={mockProducts[0]?.id}
            name={mockProducts[0]?.name}
            description={mockProducts[0]?.description}
            price={mockProducts[0]?.price}
            image={mockProducts[0]?.images}
          />
        } */}
      </div>
    </>
  );
}

// <div className="absolute inset-0">
//   {heroProduct?.images?.[0] ? (
//     <img
//       src={heroProduct.images[0]}
//       alt="Featured Collection"
//       className="w-full h-full object-cover"
//     />
//   ) : (
//     <div className="w-full h-full bg-linear-to-br from-amber-50 via-neutral-100 to-slate-200" />
//   )}
//   <div className="absolute inset-0 bg-black/20" />
// </div>;
