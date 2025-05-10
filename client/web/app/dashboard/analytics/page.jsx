"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function UniversityDataPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(process.env.NEXT_PUBLIC_END_POINT + "/university/universityStatistics" , { withCredentials: true });
        console.log("API response:", response.data);
        const requiredStats = {
          studentsCount: parseInt(response.data.studentsCount) || 0,
          instractorsCount: parseInt(response.data.instractorsCount) || 0,
          bannedAccountsCount: parseInt(response.data.bannedAccountsCount) || 0,
          messagesCount: parseInt(response.data.messagesCount) || 0,
        };
        
        const majorsData = Array.isArray(response.data.majorsMembersCount) 
          ? response.data.majorsMembersCount 
          : [];
        
        const campusesData = Array.isArray(response.data.campusesMembersCount) 
          ? response.data.campusesMembersCount 
          : [];
          
        const majorsMembersTotal = majorsData.length;
        const campusesMembersTotal = campusesData.length;
        
        setStats({
          ...requiredStats,
          majorsMembersCount: majorsMembersTotal,  
          campusesMembersCount: campusesMembersTotal,  
          majorsData,
          campusesData
        });
        
        console.log("Processed stats:", {
          ...requiredStats,
          majorsMembersCount: majorsMembersTotal,
          campusesMembersCount: campusesMembersTotal
        });
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const getUserDistributionData = () => {
    if (!stats) return null;
    
    return {
      labels: ['Students', 'Instructors', 'Banned Accounts'],
      datasets: [
        {
          label: 'User Distribution',
          data: [stats.studentsCount, stats.instractorsCount, stats.bannedAccountsCount],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getDetailedMembersData = () => {
    if (!stats || !stats.majorsData || !stats.campusesData) return null;
    
    const majorLabels = stats.majorsData.map(m => m.majorcount || 'Unknown');
    const majorCounts = stats.majorsData.map(m => parseInt(m.userscount) || 0);
    
    const campusLabels = stats.campusesData.map(c => c.capusname || 'Unknown');
    const campusCounts = stats.campusesData.map(c => parseInt(c.userscount) || 0);
    
    return {
      labels: [...majorLabels, ...campusLabels],
      datasets: [
        {
          label: 'Majors',
          data: [...majorCounts, ...Array(campusLabels.length).fill(0)],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Campuses',
          data: [...Array(majorLabels.length).fill(0), ...campusCounts],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        }
      ],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-800">
        <div className="flex-none p-3">
          <h1 className="text-2xl font-bold mb-6 text-white">University Statistics</h1>
          <p className="text-gray-300">Loading university statistics...</p>
        </div>
        
        <div className="flex-1 bg-gray-900 p-4 rounded-lg">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
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
          <h1 className="text-2xl font-bold mb-6 text-white">University Statistics</h1>
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
        <h1 className="text-2xl font-bold mb-6 text-white">University Statistics</h1>
        <p className="text-gray-300 mb-4">Overview of university data and metrics</p>
      </div>
      
      <div className="flex-1 bg-gray-900 p-4 rounded-lg overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-3">Statistics Overview</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="bg-gray-700 border-l-4 border-blue-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Students</p>
              <p className="text-3xl font-bold text-white">{stats?.studentsCount || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-l-4 border-yellow-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Instructors</p>
              <p className="text-3xl font-bold text-white">{stats?.instractorsCount || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-l-4 border-red-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Banned Accounts</p>
              <p className="text-3xl font-bold text-white">{stats?.bannedAccountsCount || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-l-4 border-purple-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Total Messages</p>
              <p className="text-3xl font-bold text-white">{stats?.messagesCount || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-l-4 border-green-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Majors Count</p>
              <p className="text-3xl font-bold text-white">{stats?.majorsMembersCount || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-700 border-l-4 border-indigo-500 shadow-sm border-0">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-300 mb-1">Campus Count</p>
              <p className="text-3xl font-bold text-white">{stats?.campusesMembersCount || 0}</p>
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
              value="detailed" 
              className="rounded text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:text-white"
            >
              Detailed Members
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-2">
            <Card className="bg-gray-700 border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-white">User Distribution</CardTitle>
                <CardDescription className="text-gray-300">
                  Breakdown of students, instructors and banned accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-4">
                <div className="w-full max-w-xl bg-gray-800 p-4 rounded-lg">
                  <Pie 
                    data={getUserDistributionData()} 
                    options={{ 
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: 'white'
                          }
                        },
                      }
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Majors Breakdown */}
              <Card className="bg-gray-700 border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">Majors Breakdown</CardTitle>
                  <CardDescription className="text-gray-300">
                    Detailed statistics for each major
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 overflow-y-auto max-h-80">
                  {stats?.majorsData && stats.majorsData.length > 0 ? (
                    <div className="space-y-3">
                      {stats.majorsData.map((major, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                          <span className="text-white">{major.majorname || 'Unknown Major'}</span>
                          <div className="flex items-center">
                            <span className="text-blue-400 font-bold">{parseInt(major.userscount) || 0}</span>
                            <span className="text-gray-400 ml-1">users</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">No major data available</div>
                  )}
                </CardContent>
              </Card>
              
              {/* Campuses Breakdown */}
              <Card className="bg-gray-700 border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white">Campuses Breakdown</CardTitle>
                  <CardDescription className="text-gray-300">
                    Detailed statistics for each campus
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 overflow-y-auto max-h-80">
                  {stats?.campusesData && stats.campusesData.length > 0 ? (
                    <div className="space-y-3">
                      {stats.campusesData.map((campus, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                          <span className="text-white">{campus.campusname || 'Unknown Campus'}</span>
                          <div className="flex items-center">
                            <span className="text-purple-400 font-bold">{parseInt(campus.userscount) || 0}</span>
                            <span className="text-gray-400 ml-1">users</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-8">No campus data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
