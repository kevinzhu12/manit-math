"use client";
import { useEffect, useState } from "react";

interface VideoResponse {
  request_id?: string;
  status?: string;
  error?: string;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useGemini, setUseGemini] = useState(false);
  const [renderQuality, setRenderQuality] = useState("480p");
  const [selectedModel, setSelectedModel] = useState("deepseek-v3");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showBackground, setShowBackground] = useState(true);
  const [leftVideoIndices, setLeftVideoIndices] = useState([0, 1, 2]);
  const [middleVideoIndices, setMiddleVideoIndices] = useState([3, 4, 5]);
  const [rightVideoIndices, setRightVideoIndices] = useState([6, 7, 8]);

  const loadingMessages = [
    "Teaching math to pixels... 🎨",
    "Summoning 3Blue1Brown's spirit... 👻",
    "Calculating the perfect animation... 🧮",
    "Rendering mathematical beauty... ✨",
    "Making math visually delicious... 🍕",
    "Sprinkling mathematical magic... 🪄",
    "Converting equations to art... 🎭",
    "Brewing visual mathematics... ☕️",
    "Crafting elegant explanations... 🎯",
    "Adding that special mathematical sauce... 🌟",
  ];

  const galleryItems = [
    {
      title: "Trefoil Knot Animation",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/trefoil_knot.mp4",
    },
    {
      title: "Sine & Cosine Waves",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/sin_cos_waves.mp4",
    },
    {
      title: "Linear Regression",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/linear_regression_residuals.mp4",
    },
    {
      title: "Neural Network",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/neural_network.mp4",
    },
    {
      title: "Mobius Strip",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/mobius_strip.mp4",
    },
    {
      title: "Sound Frequencies",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/sound_frequencies.mp4",
    },
    {
      title: "Circle Fractal",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/circle_fractal.mp4",
    },
    {
      title: "Spirals",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/spirals.mp4",
    },
    {
      title: "Graph with Nodes",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/graph_with_nodes.mp4",
    },
    {
      title: "Smile",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/smiley_face.mp4",
    },
    {
      title: "Frown to Smile",
      videoUrl:
        "https://kevin-manim-gallery-bucket.s3.us-east-1.amazonaws.com/frown_to_smile.mp4",
    },
  ];

  // const galleryItems = [
  //   {
  //     title: "Trefoil Knot Animation",
  //     videoUrl: "/videos/trefoil_knot.mp4",
  //   },
  //   {
  //     title: "Sine & Cosine Waves",
  //     videoUrl: "/videos/sin_cos_waves.mp4",
  //   },
  //   {
  //     title: "Linear Regression",
  //     videoUrl: "/videos/linear_regression_residuals.mp4",
  //   },
  //   {
  //     title: "Neural Network",
  //     videoUrl: "/videos/neural_network.mp4",
  //   },
  //   {
  //     title: "Mobius Strip",
  //     videoUrl: "/videos/mobius_strip.mp4",
  //   },
  //   {
  //     title: "Sound Frequencies",
  //     videoUrl: "/videos/sound_frequencies.mp4",
  //   },
  //   {
  //     title: "Circle Fractal",
  //     videoUrl: "/videos/circle_fractal.mp4",
  //   },
  //   {
  //     title: "Spirals",
  //     videoUrl: "/videos/spirals.mp4",
  //   },
  //   {
  //     title: "Graph with Nodes",
  //     videoUrl: "/videos/graph_with_nodes.mp4",
  //   },
  //   {
  //     title: "Smile",
  //     videoUrl: "/videos/smiley_face.mp4",
  //   },
  //   {
  //     title: "Frown to Smile",
  //     videoUrl: "/videos/frown_to_smile.mp4",
  //   },
  // ];

  // Cycle through loading messages
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Function to rotate video indices
  const rotateVideos = (indices: number[]) => {
    // Get all currently playing video indices from both sides
    const currentLeftIndices = new Set(leftVideoIndices);
    const currentMiddleIndices = new Set(middleVideoIndices);
    const currentRightIndices = new Set(rightVideoIndices);
    const allPlayingIndices = new Set([
      ...currentLeftIndices,
      ...currentMiddleIndices,
      ...currentRightIndices,
    ]);

    // Get available indices (ones that aren't currently playing)
    const allIndices = Array.from({ length: galleryItems.length }, (_, i) => i);
    const availableIndices = allIndices.filter(
      (i) => !allPlayingIndices.has(i)
    );

    return indices.map((currentIndex) => {
      if (availableIndices.length === 0) {
        console.warn("No unique videos available");
        return currentIndex; // Keep current video if no alternatives
      }

      // Pick a random index from available ones
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const nextIndex = availableIndices[randomIndex];

      // Remove the chosen index from available ones to prevent duplicates
      availableIndices.splice(randomIndex, 1);

      return nextIndex;
    });
  };

  // Update video indices with proper state updates
  const handleVideoEnd = (
    direction: "left" | "middle" | "right",
    position: number
  ) => {
    if (direction === "left") {
      setLeftVideoIndices((prev) => {
        const newIndices = [...prev];
        const [newIndex] = rotateVideos([prev[position]]);
        newIndices[position] = newIndex;
        return newIndices;
      });
    } else if (direction === "middle") {
      setMiddleVideoIndices((prev) => {
        const newIndices = [...prev];
        const [newIndex] = rotateVideos([prev[position]]);
        newIndices[position] = newIndex;
        return newIndices;
      });
    } else {
      setRightVideoIndices((prev) => {
        const newIndices = [...prev];
        const [newIndex] = rotateVideos([prev[position]]);
        newIndices[position] = newIndex;
        return newIndices;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoUrl(null);
    setError(null);
    setIsLoading(true);

    try {
      // Initial request to start video generation
      const response = await fetch("http://54.166.84.241:2000/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputText,
          use_gemini: useGemini,
          render_quality: renderQuality,
          model: selectedModel,
        }),
      });

      const data: VideoResponse = await response.json();

      if (!data.request_id) {
        throw new Error("No request ID received");
      }

      const pollVideo = async () => {
        const videoResponse = await fetch(
          `http://54.166.84.241:2000/video/${data.request_id}`
        );

        // Check content type before parsing
        const contentType = videoResponse.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          // It's JSON (probably an error or status message)
          const videoData: VideoResponse = await videoResponse.json();
          if (videoData.error) {
            throw new Error(videoData.error);
          }
        } else if (contentType?.includes("video")) {
          // It's a video file
          const videoBlob = await videoResponse.blob();
          const url = URL.createObjectURL(videoBlob);
          setVideoUrl(url);
          setIsLoading(false);
          setInputText("");
        } else {
          throw new Error("Unexpected response type");
        }
      };

      // Start polling
      await pollVideo();
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  // Clean up the object URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center p-12 pt-8 relative">
      {/* Gallery Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => setIsGalleryOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-lg
                     hover:bg-[#252525] transition-colors duration-200
                     border border-[#333333]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          Gallery
        </button>
      </div>

      {/* Background Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setShowBackground(!showBackground)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-lg
                     hover:bg-[#252525] transition-colors duration-200
                     border border-[#333333]"
        >
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${
              showBackground
                ? "fill-white stroke-white"
                : "fill-none stroke-gray-400"
            }`}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2 12h3m14 0h3M12 2v3m0 14v3"
            />
          </svg>
          Background
        </button>
      </div>

      {/* Left Background Videos */}
      {showBackground && (
        <div className="fixed left-4 top-4 h-full w-[350px] overflow-hidden hidden lg:block">
          <div className="relative h-full">
            {leftVideoIndices.map((videoIndex, index) => (
              <div
                key={`left-${videoIndex}-${index}`}
                className="absolute w-full h-[200px] opacity-30 hover:opacity-80 transition-opacity duration-300"
                style={{ top: `${index * 33}vh` }}
              >
                <video
                  src={galleryItems[videoIndex].videoUrl}
                  className="w-full h-full object-cover rounded-r-lg"
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => handleVideoEnd("left", index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Middle Background Videos */}
      {showBackground && (
        <div className="fixed left-1/2 -translate-x-1/2 top-8 h-full w-[350px] overflow-hidden pointer-events-none z-0">
          <div className="relative h-full">
            {middleVideoIndices.map((videoIndex, index) => (
              <div
                key={`middle-${videoIndex}-${index}`}
                className="absolute w-full h-[200px] opacity-20 transition-opacity duration-300"
                style={{ top: `${index * 33}vh` }}
              >
                <video
                  src={galleryItems[videoIndex].videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => handleVideoEnd("middle", index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right Background Videos */}
      {showBackground && (
        <div className="fixed right-4 top-8 h-full w-[350px] overflow-hidden hidden lg:block">
          <div className="relative h-full">
            {rightVideoIndices.map((videoIndex, index) => (
              <div
                key={`right-${videoIndex}-${index}`}
                className="absolute w-full h-[200px] opacity-30 hover:opacity-80 transition-opacity duration-300"
                style={{ top: `${index * 33}vh` }}
              >
                <video
                  src={galleryItems[videoIndex].videoUrl}
                  className="w-full h-full object-cover rounded-l-lg"
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => handleVideoEnd("right", index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          onClick={() => setIsGalleryOpen(false)}
        >
          <div
            className="bg-[#1A1A1A] w-full max-w-6xl max-h-[90vh] rounded-xl p-8 mx-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Animation Gallery
              </h2>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Gallery Carousel */}
            <div className="relative overflow-x-auto">
              <div className="flex gap-6 pb-6 snap-x snap-mandatory overflow-x-auto">
                {galleryItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex-none w-[500px] snap-start bg-[#252525] rounded-lg overflow-hidden"
                  >
                    <div className="aspect-video bg-[#333333]">
                      {/* Video placeholder */}
                      <video
                        src={item.videoUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-3">Manit</h1>
        <p
          className="text-xl bg-clip-text text-transparent
                      bg-[linear-gradient(45deg,#4ecdc4_-30%,transparent_80%),linear-gradient(-45deg,#ff6b6b_20%,#a06cd5,#45b7d1_60%,#4ecdc4)]"
        >
          Create 3B1B Manim visualizations with just natural language
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Powered by DeepSeek and Gemini-2.0 Flash Experimental
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative w-full min-h-[150px]">
            <div
              className="relative w-full min-h-[150px] bg-[#1A1A1A] rounded-xl
                            border-2 border-transparent p-[1px]
                            focus-within:bg-gradient-to-br focus-within:from-[#ff6b6b] focus-within:via-[#4ecdc4] focus-within:to-[#a06cd5]
                            focus-within:opacity-100 opacity-85
                            transition-all duration-200"
            >
              <div className="absolute inset-[1px] bg-[#1A1A1A] rounded-xl">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Describe the concept you want to see..."
                  disabled={isLoading}
                  className="w-full h-full p-4 bg-transparent text-white 
                           focus:outline-none resize-none placeholder:text-gray-400 
                           disabled:opacity-50"
                  style={{ maxHeight: "calc(100% - 60px)" }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 h-[60px] bg-[#1A1A1A] 
                          flex items-center justify-between px-3 rounded-b-xl"
                >
                  {/* Control Options */}
                  <div className="flex items-center gap-4">
                    {/* +Gemini Switch */}
                    <div className="flex items-center gap-2">
                      <div className="relative group flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={useGemini}
                            onChange={(e) => setUseGemini(e.target.checked)}
                          />
                          <div
                            className="w-11 h-6 bg-[#333333] peer-focus:outline-none peer-focus:ring-2 
                                        peer-focus:ring-cyan-500 rounded-full peer 
                                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                        after:bg-white after:rounded-full after:h-5 after:w-5 
                                        after:transition-all peer-checked:bg-[#60A5FA]"
                          ></div>
                        </label>

                        {/* Tooltip */}
                        <div
                          className="absolute bottom-full left-0 mb-2 w-48 opacity-0 group-hover:opacity-100 
                                      transition-opacity duration-200 pointer-events-none z-50"
                        >
                          <div className="bg-[#2A2A2A] text-gray-200 text-xs p-2 rounded-lg shadow-lg">
                            {/* Better animation but slower rendering */}
                            Uses Gemini-2.0 Flash Experimental to evaluate video
                            and improve animation
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">+Gemini</span>
                    </div>

                    {/* Render Quality Dropdown */}
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <select
                          value={renderQuality}
                          onChange={(e) => setRenderQuality(e.target.value)}
                          className="bg-[#333333] text-gray-400 text-sm rounded-lg px-2 py-1.5
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500
                                    border border-[#444444]"
                        >
                          <option value="480p">480p</option>
                          <option value="720p">720p</option>
                          <option value="1080p">1080p</option>
                        </select>

                        {/* Tooltip */}
                        <div
                          className="absolute bottom-full left-0 mb-2 w-48 opacity-0 group-hover:opacity-100 
                                      transition-opacity duration-200 pointer-events-none z-50"
                        >
                          <div className="bg-[#2A2A2A] text-gray-200 text-xs p-2 rounded-lg shadow-lg">
                            Higher quality but slower rendering
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">
                        Render Quality
                      </span>
                    </div>

                    {/* Model Selector Dropdown */}
                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <select
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="bg-[#333333] text-gray-400 text-sm rounded-lg px-2 py-1.5
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500
                                    border border-[#444444]"
                        >
                          <option value="deepseek-v3">DeepSeek-V3</option>
                          <option value="deepseek-r1">DeepSeek-R1</option>
                        </select>

                        {/* Tooltip */}
                        <div
                          className="absolute bottom-full left-0 mb-2 w-48 opacity-0 group-hover:opacity-100 
                                      transition-opacity duration-200 pointer-events-none z-50"
                        >
                          <div className="bg-[#2A2A2A] text-gray-200 text-xs p-2 rounded-lg shadow-lg">
                            Choose between different model versions
                          </div>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">Model</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="relative group px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90
                             focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center gap-2
                             bg-[#60A5FA]"
                  >
                    {isLoading ? <>Processing...</> : "Generate ✨"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="mt-4 w-full max-w-2xl">
          <div
            className="w-full aspect-video bg-[#1A1A1A] rounded-xl animate-pulse 
                          border border-[#333333] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-400">This might take a minute...</p>
              <span
                className="w-8 h-8 border-4 border-[#8B5CF6] border-t-transparent 
                            rounded-full animate-spin"
              />

              <p className="text-gray-400 transition-opacity duration-300">
                {loadingMessages[loadingMessageIndex]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      {error ? (
        <div className="mt-4 w-full max-w-2xl p-4 bg-[#1A1A1A] rounded-xl border border-red-500">
          <div className="flex items-center gap-2 text-red-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Failed to render animation. Please try again.</p>
          </div>
        </div>
      ) : (
        videoUrl && (
          <div className="mt-4 w-full max-w-2xl relative z-10">
            <div className="bg-black rounded-xl p-1">
              <video
                src={videoUrl}
                controls
                className="w-full rounded-xl border border-white"
                autoPlay
              />
            </div>
          </div>
        )
      )}

      {/* Footer */}
      <div className="absolute bottom-6 text-gray-400 text-sm">
        Built by{" "}
        <a
          href="https://kevinbzhu.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 no-underline border-b border-gray-400 hover:text-white hover:border-white transition-all duration-200"
        >
          Kevin Zhu
        </a>
      </div>
    </main>
  );
}
