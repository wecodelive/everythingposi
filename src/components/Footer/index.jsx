import React from "react";
// import { useNavigate } from "react-router";
import { Input } from "../Inputs";
import Button from "../Buttons";
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  // const navigate = useNavigate();
  const [mail, setMail] = React.useState("");

  const handleNewsletterSignup = () => {
    // Implement newsletter signup logic here
    alert(`Subscribed with email: ${mail}`);
    setMail("");
  };

  return (
    <div className="bg-white w-full flex flex-col">
      {/* Newsletter Section */}
      <div className="bg-[#F5F5F5] px-6 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-8">
          <div className="flex flex-col w-full md:items-center md:text-center gap-4">
            <h3 className="text-lg md:text-xl tracking-widest font-light">
              Latest from EverythingPossy
            </h3>
            <p className="text-sm md:text-base tracking-wide text-gray-600 max-w-md">
              Get all our latest updates and offers delivered straight to your
              inbox.
            </p>
          </div>

          <div className="flex flex-col w-full md:flex-row md:items-center md:justify-center gap-3">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              id="email"
              type="email"
              inputVariant="h-[56px] w-full md:w-[400px] lg:w-[500px] border-[#DFDFDF]"
              placeVariant=""
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
            <Button
              className="h-[56px] md:w-[150px] text-center bg-black text-white font-medium tracking-wider"
              value="Sign Up"
              onClick={handleNewsletterSignup}
            />
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="px-6 py-12 md:py-16 lg:py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-12">
            {/* Support Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold tracking-widest text-sm md:text-base uppercase">
                Support
              </h4>
              <ul className="flex flex-col gap-3 text-sm md:text-base">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Track Your Order
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Book an Appointment
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Frequently Asked Questions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Shipping & Return Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Store Information
                  </a>
                </li>
              </ul>
            </div>

            {/* Services Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold tracking-widest text-sm md:text-base uppercase">
                Services
              </h4>
              <ul className="flex flex-col gap-3 text-sm md:text-base">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Contact a Specialist
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Request Repair
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Personalization
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Corporate Accounts
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Financing Options
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Gift Services
                  </a>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold tracking-widest text-sm md:text-base uppercase">
                About
              </h4>
              <ul className="flex flex-col gap-3 text-sm md:text-base">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Our Story
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Sustainability
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Foundation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Press & Media
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Jewelry Guide
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold font-body tracking-widest text-sm md:text-base uppercase">
                Legal
              </h4>
              <ul className="flex flex-col gap-3 text-sm md:text-base">
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Accessibility Statement
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Cookie Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    California Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-black transition tracking-wide"
                  >
                    Supply Chain Transparency
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="px-6 py-8 md:py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left: Copyright & Location */}
            <div className="flex flex-col gap-3 text-xs md:text-sm text-gray-600">
              <p className="tracking-wide">
                &copy; {new Date().getFullYear()} EverythingPossy. All rights
                reserved.
              </p>
              {/* <a href="#" className="text-gray-700 hover:text-black transition tracking-wide underline">
                Change Location: United States
              </a> */}
            </div>

            {/* Center: Brand Logo/Text */}
            <div className="flex justify-center md:justify-center">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-light tracking-widest">
                  ❖ PoSi
                </div>
              </div>
            </div>

            {/* Right: Social Icons */}
            <div className="flex items-center justify-start md:justify-end gap-6">
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-600 hover:text-black transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-600 hover:text-black transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-600 hover:text-black transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-gray-600 hover:text-black transition"
              >
                <Youtube size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-600 hover:text-black transition"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
