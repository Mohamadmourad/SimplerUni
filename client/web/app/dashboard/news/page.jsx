"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const News = () => {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/news?page=${page}&limit=${itemsPerPage}`, {
        withCredentials: true
      });
      setNews(response.data.news);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
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
        "http://localhost:5000/news/createNews",
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
      fetchNews(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">News Management</h1>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 shadow-xl mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                ref={titleRef}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter news title"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                ref={contentRef}
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y"
                placeholder="Enter news content"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="mb-4">
                      <img src={preview} alt="Preview" className="mx-auto h-32 w-auto" />
                    </div>
                  ) : (
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-400">
                    <label htmlFor="image" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-purple-500 hover:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span className="px-3 py-2">Upload a file</span>
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
                    <p className="pl-1 pt-2">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-3 text-white font-medium rounded-lg ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"}`}
              >
                {loading ? "Adding News..." : "Add News"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">News List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
