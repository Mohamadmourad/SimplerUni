"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { checkAuth } from "@/app/functions/checkAuth";
import { useRouter } from "next/navigation";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const COLORS = {
  blue: 'rgba(79, 70, 229, 0.7)',
  yellow: 'rgba(245, 158, 11, 0.7)',
  red: 'rgba(239, 68, 68, 0.7)',
  purple: 'rgba(139, 92, 246, 0.7)',
  green: 'rgba(34, 197, 94, 0.7)',
  teal: 'rgba(14, 165, 233, 0.7)',
};

export default function SuperAdminStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          process.env.NEXT_PUBLIC_END_POINT + "/university/superAdminStatistics", 
          { withCredentials: true }
        );
        
        setStats(response.data);
        console.log("Statistics loaded:", response.data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    const verifyAccess = async () => {
      try {
        const result = await checkAuth("superAdmin");
        if (!result) router.push("/");
      } catch (e) {
        router.push("/");
      }
    };

    verifyAccess();
    fetchStatistics();
  }, [router]);

  const getUserDistributionData = () => {
    if (!stats) return { labels: [], datasets: [] };
    
    return {
      labels: ['Students', 'Instructors', 'Banned Accounts'],
      datasets: [
        {
          data: [stats.studentsCount, stats.instractorsCount, stats.bannedAccountsCount],
          backgroundColor: [COLORS.blue, COLORS.yellow, COLORS.red],
          borderColor: ['#4f46e5', '#f59e0b', '#ef4444'],
          borderWidth: 1,
        }
      ],
    };
  };

  const getTopUniversitiesData = () => {
    if (!stats?.topUniversities) return { labels: [], datasets: [] };
    
    return {
      labels: stats.topUniversities.map(univ => univ.universityName),
      datasets: [
        {
          label: 'Members',
          data: stats.topUniversities.map(univ => univ.memberCount),
          backgroundColor: COLORS.purple,
          borderColor: '#8b5cf6',
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-800">
        <div className="flex-none p-3">
          <h1 className="text-2xl font-bold mb-6 text-white">Platform Statistics</h1>
          <p className="text-gray-300">Loading statistics...</p>
        </div>
        
        <div className="flex-1 bg-gray-900 p-4 rounded-lg">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-gray-700 border-0 shadow-sm">
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-24 mb-2 bg-gray-600" />
                  <Skeleton className="h-8 w-16 bg-gray-600" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-800">
        <div className="flex-none p-3">
          <h1 className="text-2xl font-bold mb-6 text-white">Platform Statistics</h1>
        </div>
        
        <div className="flex-1 bg-gray-900 p-4 rounded-lg">
          <div className="bg-gray-700 text-white p-4 rounded-lg">
            <h2 className="font-bold mb-2">Error Loading Statistics</h2>
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-800">
      <div className="flex-none p-3">
        <h1 className="text-2xl font-bold mb-6 text-white">Platform Statistics</h1>
        <p className="text-gray-300 mb-4">Overview of all universities and users on the platform</p>
      </div>
      
      <div className="flex-1 bg-gray-900 p-4 rounded-lg overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-3">Global Statistics</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gray-700 border-l-4 border-blue-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-white">{stats?.studentsCount.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-l-4 border-yellow-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Total Instructors</p>
              <p className="text-3xl font-bold text-white">{stats?.instractorsCount.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-l-4 border-red-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Banned Accounts</p>
              <p className="text-3xl font-bold text-white">{stats?.bannedAccountsCount.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-l-4 border-purple-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Total Messages</p>
              <p className="text-3xl font-bold text-white">{stats?.messagesCount.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4 bg-gray-800 p-1 rounded-md">
            <TabsTrigger 
              value="users" 
              className="rounded text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:text-white"
            >
              User Distribution
            </TabsTrigger>
            <TabsTrigger 
              value="top" 
              className="rounded text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:text-white"
            >
              Top Universities
            </TabsTrigger>
            <TabsTrigger 
              value="all" 
              className="rounded text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:text-white"
            >
              All Universities
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-2">
            <Card className="bg-gray-700 border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">User Distribution</CardTitle>
                <CardDescription className="text-gray-300">
                  Breakdown of students, instructors and banned accounts across all universities
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-4">
                <div className="w-full max-w-xl bg-gray-800 p-4 rounded-lg">
                  <div className="h-80 flex items-center justify-center">
                    <Pie 
                      data={getUserDistributionData()} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              color: 'white',
                              font: {
                                size: 12
                              }
                            }
                          },
                          tooltip: {
                            backgroundColor: '#1f2937',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#374151',
                            borderWidth: 1,
                            callbacks: {
                              label: function(context) {
                                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                                const value = context.raw;
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value} (${percentage}%)`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="top" className="mt-2">
            <Card className="bg-gray-700 border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">Top 5 Universities</CardTitle>
                <CardDescription className="text-gray-300">
                  Universities with the most members
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full h-80 bg-gray-800 p-4 rounded-lg">
                  <Bar 
                    data={getTopUniversitiesData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: '#1f2937',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: '#374151',
                          borderWidth: 1,
                          callbacks: {
                            label: function(context) {
                              return `Members: ${context.raw.toLocaleString()}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          ticks: {
                            color: 'white',
                            font: {
                              size: 11
                            },
                            maxRotation: 45,
                            minRotation: 45
                          },
                          grid: {
                            display: false
                          }
                        },
                        y: {
                          ticks: {
                            color: 'white',
                            font: {
                              size: 12
                            },
                            beginAtZero: true
                          },
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="mt-2">
            <Card className="bg-gray-700 border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">All Universities</CardTitle>
                <CardDescription className="text-gray-300">
                  Complete list of universities and their member counts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full bg-gray-800 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          University
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Members
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {stats?.allUniversitiesWithCount?.map((university, index) => (
                        <tr key={index} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {university.universityName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-purple-400">
                            {university.memberCount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      {!stats?.allUniversitiesWithCount?.length && (
                        <tr>
                          <td colSpan="2" className="px-6 py-4 text-center text-gray-400">
                            No universities found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
