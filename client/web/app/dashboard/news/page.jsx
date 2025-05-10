"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Image as ImageIcon, Trash2, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkAuth } from "@/app/functions/checkAuth";
import { useRouter } from "next/navigation";

const News = () => {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchNews();
    const verify = async () => {
             try{
              const result = await checkAuth("newsPage");
              result == false ? router.push("/") : null;
            }
              catch(e){router.push("/")}
            };
            verify();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/news/getAllNews", {
        withCredentials: true
      });
      setNews(response.data); 
      console.log(news);
    } catch (err) {
      toast.error("Failed to fetch news");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const title = titleRef.current.value;
    const content = contentRef.current.value;
    const imageBase64 = preview;

    if (!title || !content || !imageBase64) {
      toast.error("Please fill all fields.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        process.env.NEXT_PUBLIC_END_POINT + "/news/createNews",
        {
          title,
          content,
          imageBase64
        },
        {
          withCredentials: true,
        }
      );

      toast.success("News added successfully!");
      titleRef.current.value = "";
      contentRef.current.value = "";
      setPreview("");
      fetchNews(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_END_POINT}/news/deleteNews/${id}`, {
        withCredentials: true,
      });
      toast.success("News deleted successfully!");
      fetchNews(); 
    } catch (err) {
      toast.error("Failed to delete news");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">News Management</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form section */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-4 md:p-6 shadow-xl sticky top-4">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-purple-500" /> Add New Post
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    ref={titleRef}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter news title"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    ref={contentRef}
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                    placeholder="Enter news content"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Image
                  </label>
                  <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-600 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {preview ? (
                        <div className="mb-3">
                          <img src={preview} alt="Preview" className="mx-auto h-32 w-auto rounded-md" />
                        </div>
                      ) : (
                        <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                      )}
                      <div className="flex flex-col sm:flex-row justify-center text-sm text-gray-400">
                        <label htmlFor="image" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-purple-500 hover:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 px-3 py-1.5 mb-2 sm:mb-0 sm:mr-2">
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={imageRef}
                            className="sr-only"
                          />
                        </label>
                        <p className="pt-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2.5 text-white font-medium rounded-lg flex items-center justify-center ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"}`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding News...
                      </>
                    ) : (
                      "Publish News"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* News list section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-4 md:p-6 shadow-xl h-full">
              <h2 className="text-xl font-semibold text-white mb-6">Published News</h2>
              
              {news.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <ImageIcon className="h-16 w-16 text-gray-500 mb-4" />
                  <p className="text-gray-400 text-lg">No news published yet.</p>
                  <p className="text-gray-500 mt-2">Create your first news post using the form.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.map((item) => (
                    <div key={item.newsid} className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="aspect-w-16 aspect-h-9 relative">
                        <img
                          src={item.imageurl}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-white mb-2 flex-1 line-clamp-1">{item.title}</h3>
                          <button
                            onClick={() => handleDelete(item.newsid)}
                            className="ml-2 p-1.5 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/30 transition-colors flex-shrink-0"
                            title="Delete news"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-3">{item.content}</p>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                          <p className="text-gray-500 text-xs">
                            Published: {new Date(item.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
