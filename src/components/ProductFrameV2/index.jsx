import React, { useMemo, useState } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import {
  addToWishlist,
  checkWishlistItem,
  removeFromWishlist,
} from "../../services/adminFunctions";
import { notifyError, notifySuccess } from "../../utils/notify";

export default function ProductFrameV2({
  height,
  width,
  price,
  name,
  image,
  productId,
  description,
  onClick,
}) {
  const hasSession = Boolean(
    localStorage.getItem("userId") || localStorage.getItem("adminId"),
  );
  const [isInWishlist, setIsInWishlist] = React.useState(false);
  const [wishlistItemId, setWishlistItemId] = React.useState(null);
  const [wishlistLoading, setWishlistLoading] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lgHover, setLgHover] = useState(false);

  // Convert single image to array for unified handling
  const imageArray = useMemo(() => {
    if (Array.isArray(image)) {
      return image.filter(Boolean);
    }

    if (typeof image === "string" && image) {
      return [image];
    }

    if (image && typeof image === "object" && (image.url || image.src)) {
      return [image.url || image.src];
    }

    return [];
  }, [image]);

  React.useEffect(() => {
    let isMounted = true;

    const fetchWishlistStatus = async () => {
      if (!productId) {
        if (isMounted) {
          setIsInWishlist(false);
          setWishlistItemId(null);
        }
        return;
      }

      if (!hasSession) {
        if (isMounted) {
          setIsInWishlist(false);
          setWishlistItemId(null);
        }
        return;
      }

      try {
        const response = await checkWishlistItem(productId);

        if (!isMounted) return;

        if (response?.success) {
          setIsInWishlist(Boolean(response.isInWishlist));
          setWishlistItemId(response.wishlistItem?.id || null);
          return;
        }

        setIsInWishlist(false);
        setWishlistItemId(null);
      } catch {
        if (!isMounted) return;
        setIsInWishlist(false);
        setWishlistItemId(null);
      }
    };

    fetchWishlistStatus();

    return () => {
      isMounted = false;
    };
  }, [productId, hasSession]);

  const resolvedImage = useMemo(() => {
    if (imageArray.length === 0) return "";
    return imageArray[currentImageIndex] || imageArray[0];
  }, [imageArray, currentImageIndex]);

  const sizeStyle = {
    width: width
      ? typeof width === "number"
        ? `${width}px`
        : width
      : "208.8px",
    height: height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : "242.6px",
  };

  const handleWishlistToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId || wishlistLoading) {
      return;
    }

    if (!hasSession) {
      notifyError("Please login or create an account to use wishlist");
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        const targetWishlistId = wishlistItemId;

        if (!targetWishlistId) {
          const checkResponse = await checkWishlistItem(productId);
          if (checkResponse?.success && checkResponse.wishlistItem?.id) {
            const removeResponse = await removeFromWishlist(
              checkResponse.wishlistItem.id,
            );

            if (!removeResponse?.success) {
              throw new Error(
                removeResponse?.message || "Failed to remove from wishlist",
              );
            }

            setIsInWishlist(false);
            setWishlistItemId(null);
            notifySuccess("Removed from wishlist");
            return;
          }

          throw new Error("Unable to locate wishlist item");
        }

        const removeResponse = await removeFromWishlist(targetWishlistId);
        if (!removeResponse?.success) {
          throw new Error(
            removeResponse?.message || "Failed to remove from wishlist",
          );
        }

        setIsInWishlist(false);
        setWishlistItemId(null);
        notifySuccess("Removed from wishlist");
        return;
      }

      const addResponse = await addToWishlist(productId);
      if (!addResponse?.success) {
        throw new Error(addResponse?.message || "Failed to add to wishlist");
      }

      setIsInWishlist(true);
      setWishlistItemId(addResponse?.wishlistItem?.id || null);
      notifySuccess("Added to wishlist");
    } catch (error) {
      notifyError(error.message || "Unable to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === imageArray.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageArray.length - 1 : prev - 1,
    );
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div
      onMouseEnter={() => setLgHover(true)}
      onMouseLeave={() => setLgHover(false)}
      className="flex flex-col gap-0 cursor-pointer h-full w-fit "
      onClick={onClick}
    >
      {/* Image Carousel Container */}
      <div className="relative bg-white overflow-hidden group shadow-sm hover:shadow-md transition-shadow duration-300 h-[242.6px] w-[208.8px] md:h-[380px] md:w-[380px] lg:h-[398px] lg:w-[398px] flex items-center justify-center">
        {/* Wishlist Button */}
        {productId && (
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className="absolute top-3 right-3 z-20 flex items-center justify-center disabled:opacity-60 transition-all"
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              className={`h-6 w-6 transition-all ${
                isInWishlist ? "fill-black text-black" : "text-white"
              }`}
            />
          </button>
        )}

        {/* Main Image */}
        <img
          src={resolvedImage || "/placeHolder.jpg"}
          alt={name || "Product"}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/placeHolder.jpg";
          }}
          className="min-w-full min-h-full w-auto h-auto object-center hover:scale-110 transition-transform duration-500"
        />
        {/* Navigation Arrows - Hidden by default, show on hover */}
        {imageArray.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-white" strokeWidth={3} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-white" strokeWidth={3} />
            </button>
          </>
        )}
        {/* Pagination Dots - Subtle line with dots */}
        {imageArray.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {imageArray.map((_, index) => (
              <button
                key={index}
                onClick={(e) => handleDotClick(e, index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-[#E6BD37] w-10"
                    : "bg-white w-1.5 hover:bg-gray-500"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Info Section */}
      {(price || name || description) && (
        <div className="bg-white p-2 flex flex-col gap-2.5">
          {/* Product Name */}
          <p className="text-base font-body font-normal text-[#010307] leading-[130%] tracking-[1.6px]">
            {name}
          </p>

          {/* Description - Small and muted */}
          {description ? (
            <p
              className={`text-xs lg:text-sm ${lgHover ? "lg:hidden" : "lg:block"} transition-transform duration-300 text-[#6C6D70] leading-[150%] tracking-[1.2px]`}
            >
              {description}
            </p>
          ) : null}

          {/* Price */}
          {price && (
            <p className="text-sm lg:text-base text-[#010307] leading-[110%] tracking-[1.4px]">
              {price}
            </p>
          )}

          {/* Add to Cart Button */}
          {productId && (
            <button
              // onClick={handleAddToCart}
              // disabled={cartLoading}
              className={`bg-black text-white text-sm md:text-base  ${lgHover ? "lg:block" : "lg:hidden"} transition-transform  p-3 uppercase duration-300 disabled:opacity-60`}
              aria-label="Add to cart"
            >
              Shop
            </button>
          )}
        </div>
      )}
    </div>
  );
}
