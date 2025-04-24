"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/searchBar";
import UserList from "@/app/components/userList";
import { checkAuth } from "@/app/functions/checkAuth";
import axios from "axios";

const UsersManagement = () => {
  const router = useRouter();

  const [users, setUsers] = useState([
    { id: "1", name: "Alice Johnson", email: "alice@example.com", type: "admin", banned: false },
    { id: "2", name: "Bob Smith", email: "bob@example.com", type: "moderator", banned: true },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", type: "user", banned: false },
    { id: "4", name: "Dana White", email: "dana@example.com", type: "user", banned: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBannedOnly, setShowBannedOnly] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await checkAuth("usersManagementPage");
        if (result === false) router.push("/");
      } catch (e) {
        router.push("/");
      }
    };
    verify();
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const result = await axios.get(NEXT_PUBLIC_END_POINT + "/user/getAllUniversityUsers", {
        withCredentials: true,
      });
  
      const formattedUsers = result.data.map((user, index) => ({
        id: user.userid, 
        name: user.username,
        email: user.email,
        type: user.isstudent ? "student" : "instructor", 
        banned: user.isbanned ,
      }));
  
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/user/deleteUser/${id}`,
        { withCredentials: true }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };
  

  const handleToggleBan = async (id) => {
    const currentUser = users.find((user) => user.id === id);
    if (!currentUser) return;
  
    try {
      if (currentUser.banned) {
        await axios.put(
          NEXT_PUBLIC_END_POINT + "/user/unbanUser",
          { userid: id },
          { withCredentials: true }
        );
      } else {
        await axios.put(
          NEXT_PUBLIC_END_POINT + "/user/banUser",
          { userid: id },
          { withCredentials: true }
        );
      }
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, banned: !user.banned } : user
        )
      );
    } catch (error) {
      console.error("Failed to toggle ban status:", error);
    }
  };
  

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBan = showBannedOnly ? user.banned : true;
    return matchesSearch && matchesBan;
  });

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">User Management</h1>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              Manage and monitor user accounts
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-white">Users</h2>
            <p className="text-sm font-medium text-gray-400">
              {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
            </p>
          </div>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showBannedOnly={showBannedOnly}
            setShowBannedOnly={setShowBannedOnly}
          />
        </div>

        <UserList
          users={filteredUsers}
          loading={loading}
          onDelete={handleDeleteUser}
          onToggleBan={handleToggleBan}
        />
      </div>
    </div>
  );
};

export default UsersManagement;
