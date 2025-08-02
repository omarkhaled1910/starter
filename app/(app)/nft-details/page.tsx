"use client";
import { FC, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast, Toaster } from "react-hot-toast";
import { RotateCw } from "lucide-react";

const MintPage: FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    previewUrl: "",
    properties: [{ key: "", value: "" }],
  });
  const [mintingStatus, setMintingStatus] = useState<
    "idle" | "minting" | "success" | "error"
  >("idle");
  const [txHash, setTxHash] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setNftData({
          ...nftData,
          image: file,
          previewUrl: URL.createObjectURL(file),
        });
        toast.success("Image uploaded successfully!");
      }
    },
  });

  const addProperty = () => {
    setNftData({
      ...nftData,
      properties: [...nftData.properties, { key: "", value: "" }],
    });
  };

  const removeProperty = (index: number) => {
    const newProperties = [...nftData.properties];
    newProperties.splice(index, 1);
    setNftData({
      ...nftData,
      properties: newProperties,
    });
  };

  const updateProperty = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const newProperties = [...nftData.properties];
    newProperties[index][field] = newValue;
    setNftData({
      ...nftData,
      properties: newProperties,
    });
  };

  const simulateMint = async () => {
    if (!nftData.name || !nftData.image) {
      toast.error("Please provide a name and image for your NFT");
      return;
    }

    setMintingStatus("minting");

    try {
      // Simulate blockchain interaction
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate fake transaction hash
      const fakeTxHash = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`;

      setTxHash(fakeTxHash);
      setMintingStatus("success");
      toast.success("NFT minted successfully!");
    } catch (error) {
      console.error(error);
      setMintingStatus("error");
      toast.error("Error minting NFT");
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">Mint Your NFT</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-800 text-yellow-400"
                : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Upload */}
          <div>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors
                ${
                  isDragActive
                    ? "border-purple-500 bg-purple-500/10"
                    : darkMode
                    ? "border-gray-700"
                    : "border-gray-300"
                }
                ${
                  nftData.previewUrl
                    ? "h-auto"
                    : "h-96 flex flex-col items-center justify-center"
                }`}
            >
              <input {...getInputProps()} />

              {nftData.previewUrl ? (
                <div className="relative">
                  <img
                    src={nftData.previewUrl}
                    alt="NFT preview"
                    className="rounded-2xl w-full h-auto max-h-[500px] object-cover"
                  />
                  <button
                    className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNftData({ ...nftData, previewUrl: "", image: null });
                    }}
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-5xl mb-4">🖼️</div>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop your NFT artwork here
                  </p>
                  <p className="opacity-70 mb-4">
                    Supports JPG, PNG, GIF, WEBP
                  </p>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    Browse Files
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-xl mb-4">
                ERC-721 Contract Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-70">Contract Address:</span>
                  <span className="font-mono text-sm">0x8a90...CAb2</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Network:</span>
                  <span>Ethereum Mainnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Token Standard:</span>
                  <span>ERC-721</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Mint Fee:</span>
                  <span className="font-bold">0.05 ETH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="font-bold text-xl mb-4">NFT Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={nftData.name}
                    onChange={(e) =>
                      setNftData({ ...nftData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="My Awesome NFT"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={nftData.description}
                    onChange={(e) =>
                      setNftData({ ...nftData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 bg-transparent border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your NFT..."
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">
                      Properties
                    </label>
                    <button
                      onClick={addProperty}
                      className="text-sm text-purple-500 hover:text-purple-600"
                    >
                      + Add Property
                    </button>
                  </div>

                  <div className="space-y-3">
                    {nftData.properties.map((property, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={property.key}
                          onChange={(e) =>
                            updateProperty(index, "key", e.target.value)
                          }
                          className="flex-1 px-3 py-2 bg-transparent border rounded-lg text-sm"
                          placeholder="Trait (e.g. Color)"
                        />
                        <input
                          type="text"
                          value={property.value}
                          onChange={(e) =>
                            updateProperty(index, "value", e.target.value)
                          }
                          className="flex-1 px-3 py-2 bg-transparent border rounded-lg text-sm"
                          placeholder="Value (e.g. Blue)"
                        />
                        {nftData.properties.length > 1 && (
                          <button
                            onClick={() => removeProperty(index)}
                            className="p-2 text-gray-500 hover:text-red-500"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mint Button and Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h2 className="font-bold text-xl mb-4">Ready to Mint</h2>

              {mintingStatus === "idle" && (
                <button
                  onClick={simulateMint}
                  disabled={!nftData.name || !nftData.image}
                  className={`w-full py-3 rounded-xl font-bold transition-colors
                    ${
                      !nftData.name || !nftData.image
                        ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                    }
                  `}
                >
                  Mint NFT
                </button>
              )}

              {mintingStatus === "minting" && (
                <div className="flex flex-col items-center justify-center py-4">
                  <RotateCw className="w-12 h-12 text-purple-500 animate-spin mb-3" />
                  <p className="font-medium">Minting your NFT...</p>
                  <p className="text-sm opacity-70 mt-1">
                    Confirm transaction in your wallet
                  </p>
                </div>
              )}

              {mintingStatus === "success" && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="font-bold text-xl mb-2">
                    NFT Minted Successfully!
                  </h3>
                  <p className="mb-4">
                    Your NFT has been minted on the Ethereum blockchain
                  </p>

                  <div className="bg-gray-800 text-gray-200 rounded-lg p-3 text-sm font-mono break-all mb-4">
                    TX: {txHash}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setMintingStatus("idle");
                        setTxHash("");
                      }}
                      className="flex-1 py-2 bg-purple-500 text-white rounded-lg"
                    >
                      Mint Another
                    </button>
                    <button className="flex-1 py-2 border border-purple-500 text-purple-500 rounded-lg">
                      View NFT
                    </button>
                  </div>
                </div>
              )}

              {mintingStatus === "error" && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-3">⚠️</div>
                  <h3 className="font-bold text-xl mb-2">Minting Failed</h3>
                  <p className="mb-4">
                    There was an error processing your transaction
                  </p>

                  <button
                    onClick={() => setMintingStatus("idle")}
                    className="w-full py-3 bg-purple-500 text-white rounded-lg font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              <div className="mt-6 text-sm opacity-80">
                <p className="mb-2">
                  By minting, you agree to our Terms of Service
                </p>
                <p>Gas fees will apply for blockchain transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintPage;
