import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Smartphone,
  Mail
} from "lucide-react";
import pngegg from './pngegg.png'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0f2a5c] to-[#0b1f45] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

          {/* CATEGORIES (hide on small) */}
          <div className="hidden md:block">
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>Electronics</li>
              <li>Mobiles</li>
              <li>Fashion</li>
              <li>Home & Furniture</li>
              <li>Appliances</li>
              <li>Beauty</li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>Help Center</li>
              <li>Shipping Policy</li>
              <li>Return & Refund</li>
              <li>Track Order</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* ABOUT */}
          <div className="hidden sm:block">
            <h4 className="text-white font-semibold mb-4">About VendoMart</h4>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* APP + PAYMENTS */}
          <div className="hidden lg:block">
            <h4 className="text-white font-semibold mb-4">Download App</h4>
            <div className="space-y-3">
             
              <img
              src={pngegg}

className="w-46 -ml-3 cursor-pointer"
              />
            </div>

            <h4 className="text-white font-semibold mt-6 mb-3">
              Accepted Payments
            </h4>
            <div className="flex gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="w-10 bg-white p-1 rounded" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="w-10 bg-white p-1 rounded" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="w-10 bg-white p-1 rounded" />
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-semibold mb-3">
              Subscribe Newsletter
            </h4>
            <p className="text-sm mb-4">
              Get latest updates & offers.
            </p>

            <div className="flex rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Email here"
                className="w-full px-4 py-2 bg-amber-50/30 text-black outline-none"
              />
              <button className="bg-yellow-400 px-2 text-black font-semibold">
                Subscribe
              </button>
            </div>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-6">
              <Facebook className="hover:text-white cursor-pointer" />
              <Twitter className="hover:text-white cursor-pointer" />
              <Instagram className="hover:text-white cursor-pointer" />
              <Youtube className="hover:text-white cursor-pointer" />
            </div>
          </div>

        </div>

        {/* MOBILE QUICK INFO */}
        <div className="flex md:hidden justify-around text-sm mt-12 border-t border-white/20 pt-6">
          <div className="flex items-center gap-2">
            <Smartphone size={18} />
            <span>App</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} />
            <span>Support</span>
          </div>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/20 py-4 text-center text-sm">
        © 2025 <span className="text-white font-semibold">VendoMart</span>. All
        rights reserved.
      </div>
    </footer>
  );
}
