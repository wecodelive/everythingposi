import React from "react";
import { Handbag } from "lucide-react";
import { UserRound } from "lucide-react";
import { Menu } from "lucide-react";
import Modal from "../Modals/Modal";
import SideNav from "./SideNav";
import { useNavigate, useLocation } from "react-router";
import Cart from "./Cart";
import { APP_CART_UPDATED_EVENT, getCartSummary } from "../../utils/cart";
import { useCurrency } from "../../context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = React.useState(false);
  const [showCart, setShowCart] = React.useState(false);
  const [cartItemCount, setCartItemCount] = React.useState(0);
  const [navToShow, setNavToShow] = React.useState("");

  // Detect if we're on the home page
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const {
    currency,
    detectedCurrency,
    isAuto,
    supportedCurrencies,
    setCurrency,
  } = useCurrency();
  const isAdminSession = Boolean(localStorage.getItem("adminId"));
  const profileRoute = isAdminSession ? "/admin" : "/user";

  const navOptions = {
    "High Jewelry": {
      columns: [
        {
          title: "Coming Soon",
          items: [],
        },
      ],
    },
    Jewelry: {
      columns: [
        {
          title: "Shop By Category",
          items: [
            "Necklaces & Pendants",
            "Bracelets",
            "Earrings",
            "Rings",
            "Silver Jewelry",
            "Men's Jewelry",
            "Women's Jewelry",
            "Explore All Jewelry",
          ],
        },
        {
          title: "Collections",
          items: [
            "Gold Jewelry",
            "Silver Jewelry",
            "Diamond Jewelry",
            "Pearl Jewelry",
          ],
        },
        {
          title: "Featured",
          items: ["New Arrivals", "Most Popular", "Best Sellers"],
        },
      ],
    },
    Watches: {
      columns: [
        {
          title: "Shop By Category",
          items: ["Women's Watches", "Men's Watches", "All Fine Watches"],
        },
      ],
    },
    "Bags and Accessories": {
      columns: [
        {
          title: "Bags",
          items: [
            "Men's Bags",
            "Women's Bags",
            "Handbags",
            "Crossbody Bags",
            "Totes",
            "Clutches",
            "Travel Bags",
          ],
        },
        {
          title: "Accessories",
          items: ["Scarves", "Belts", "Hats", "Gloves", "Sunglasses"],
        },
        {
          title: "Featured",
          items: ["New Arrivals", "Most Popular"],
        },
      ],
    },
    "Engagement & Bridal": {
      columns: [
        {
          title: "Shop By Style",
          items: [
            "Engagement Rings",
            "Wedding Bands",
            "Bridal Sets",
            "Promise Rings",
          ],
        },
        {
          title: "Resources",
          items: [
            "Ring Guide",
            "Engagement Guide",
            "Financing",
            "Custom Design",
          ],
        },
      ],
    },
    Fragrance: {
      columns: [
        {
          title: "Shop By Type",
          items: ["Perfumes", "Colognes", "Body Care", "Home Fragrance"],
        },
        {
          title: "Featured",
          items: ["New Arrivals", "Best Sellers", "Gift Sets"],
        },
      ],
    },
    Gifts: {
      columns: [
        // {
        //   title: "Shop By Category",
        //   items: ["Under $500", "Under $1000", "$1000 - $5000", "$5000+"],
        // },
        {
          title: "By Recipient",
          items: ["For Her", "For Him", "For Teens", "Unisex Gifts"],
        },
        {
          title: "Gift Ideas",
          items: [
            "Corporate Gifts",
            "Wedding Gifts",
            "Birthday Gifts",
            "Personalized Gifts",
          ],
        },
      ],
    },
  };

  // const isCartRelatedRoute = location.pathname.startsWith("/checkout");
  // const isUserRelatedRoute =
  //   location.pathname.startsWith("/admin") ||
  //   location.pathname.startsWith("/user") ||
  //   location.pathname.startsWith("/wishlist") ||
  //   location.pathname.startsWith("/orders") ||
  //   location.pathname.startsWith("/login") ||
  //   location.pathname.startsWith("/create-account");

  React.useEffect(() => {
    const syncCartCount = () => {
      setCartItemCount(getCartSummary().itemCount);
    };

    syncCartCount();
    window.addEventListener(APP_CART_UPDATED_EVENT, syncCartCount);

    return () => {
      window.removeEventListener(APP_CART_UPDATED_EVENT, syncCartCount);
    };
  }, []);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const toggleCart = () => {
    setShowCart((prev) => !prev);
  };

  return (
    <>
      <div
        className={` ${isHomePage ? "absolute top-0 left-0 bg-transparent text-white hover:text-black hover:bg-white" : "relative text-black bg-white"} z-2 w-full `}
      >
        <header
          className={`flex justify-between md:items-start items-center py-6 px-4 md:px-8 md:py-8 `}
        >
          <button onClick={toggleModal} className="transition lg:hidden">
            {/* <img className="h-5 w-6" src="/icons/hamburger.svg" alt="Menu" /> */}
            <Menu className="h-6 w-6 hover:text-[#E6BD37]" />
          </button>

          <div className=" flex-1 flex md:gap-6 flex-col items-center justify-center">
            <button
              onClick={() => navigate("/")}
              className="font-serif text-2xl lg:text-7xl font-light tracking-widest transition"
            >
              EVERYTHING POSSY
            </button>

            <div className="hidden lg:flex gap-6 transition text-[15px] uppercase tracking-[1px] font-body flex-col items-center">
              <div className="flex gap-6">
                {[
                  "High Jewelry",
                  "Jewelry",
                  "Watches",
                  "Bags and Accessories",
                  "Engagement & Bridal",
                  "Fragrance",
                  "Gifts",
                ].map((item) => (
                  <div key={item} className="relative">
                    <h3
                      className="cursor-pointer"
                      onMouseEnter={() => setNavToShow(item)}
                    >
                      {item}
                    </h3>
                    {navToShow === item && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E6BD37]"
                        layoutId="underline"
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <select
              className="h-9 text-[11px] hidden md:block font-body uppercase tracking-[1px] px-3 rounded hover:border-black transition text-xs"
              value={isAuto && detectedCurrency ? "AUTO" : currency}
              onChange={(event) => setCurrency(event.target.value)}
              aria-label="Currency selector"
            >
              {detectedCurrency && (
                <option value="AUTO">Auto ({detectedCurrency})</option>
              )}
              {supportedCurrencies.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={toggleCart}
              className="relative flex justify-center items-center transition"
            >
              <Handbag className="h-6 w-6 hover:text-[#E6BD37]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 rounded-full text-[10px] flex items-center justify-center px-1 bg-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(profileRoute)}
              className="flex justify-center items-center transition"
            >
              <UserRound className="h-6 w-6 hover:text-[#E6BD37]" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {navToShow !== "" && navOptions[navToShow] && (
            <motion.div
              key={navToShow}
              onMouseLeave={() => setNavToShow("")}
              className="h-auto py-10 absolute top-full left-0 w-full bg-white z-10 font-serif text-black border-t-2 border-gray-300 flex gap-20 pl-100 overflow-hidden"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {navOptions[navToShow].columns.map((column, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <h3 className="text-neutral-600 font-semibold">
                    {column.title}
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {column.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="cursor-pointer hover:text-[#E6BD37] transition"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* <div className="h-auto py-10 bg-white"></div> */}
      </div>

      {showModal && (
        <Modal
          styles="w-full md:w-[50%] lg:w-[40%]"
          position="modal-right"
          closeModal={toggleModal}
        >
          <SideNav close={toggleModal} />
        </Modal>
      )}

      {showCart && (
        <Modal
          styles="w-full md:w-[50%] lg:w-[40%]"
          position="modal-right"
          closeModal={toggleCart}
        >
          <Cart close={toggleCart} />
        </Modal>
      )}
    </>
  );
}
