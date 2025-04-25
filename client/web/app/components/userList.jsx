// components/UserList.jsx

import React from 'react';
import UserCard from './UserCard';
import { AlertTriangle } from 'lucide-react';

const UserList = ({ users, loading, onDelete, onToggleBan }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-purple-600/20 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-800 rounded mb-3"></div>
          <div className="h-3 w-24 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-300 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No users found</h3>
        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onDelete={onDelete} 
          onToggleBan={onToggleBan}
        />
      ))}
    </div>
  );
};

export default UserList;
