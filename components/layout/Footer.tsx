import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="p-16 border-t border-gray-200 dark:border-gray-800 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-500"></div>
            <span className="text-xl font-bold">Artify</span>
          </div>
          <p className="opacity-80 mb-6">
            The world's first and largest NFT marketplace for crypto
            collectibles and non-fungible tokens.
          </p>
          <div className="flex space-x-4">
            {["📱", "🐦", "📸", "💻"].map((icon, i) => (
              <button
                key={i}
                className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Marketplace</h3>
          <ul className="space-y-4">
            {["All NFTs", "Art", "Collectibles", "Photography"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="opacity-80 hover:opacity-100 hover:text-purple-500"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Resources</h3>
          <ul className="space-y-4">
            {["Help Center", "Platform Status", "Partners", "Blog"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="opacity-80 hover:opacity-100 hover:text-purple-500"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <br />
      <br />

      <div>
        <h3 className="font-bold text-lg mb-6">Newsletter</h3>
        <p className="opacity-80 mb-4">Stay updated with our latest news</p>
        <div className="flex">
          <input
            type="email"
            placeholder="Your email"
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-r-0 rounded-l-lg flex-grow"
          />
          <button className="px-4 py-2 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center opacity-70">
        <p>© 2023 Artify NFT Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;