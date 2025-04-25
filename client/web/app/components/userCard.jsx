// components/UserCard.jsx

import React, { useState } from 'react';
import { Trash2, Ban, User as UserIcon } from 'lucide-react';

const UserCard = ({ user, onDelete, onToggleBan }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete(user.id);
      }, 500);
    }
  };

  const getUserTypeColor = (type) => {
    switch(type) {
      case 'student':
        return 'bg-purple-500/20 text-purple-300';
      case 'instructor':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div 
      className={`bg-gray-950 rounded-lg shadow p-4 transition-all duration-300 ${
        user.banned ? 'border-l-4 border-red-500' : ''
      } ${isDeleting ? 'opacity-50 scale-95' : 'hover:shadow-lg transform hover:-translate-y-1'}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="mr-3 bg-gray-900 rounded-full p-2">
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(user.type)}`}>
              {user.type}
            </span>
            {user.banned && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                Banned
              </span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 self-end sm:self-center">
          <button
            onClick={() => onToggleBan(user.id)}
            className={`rounded-md p-2 transition-colors duration-200 ${
              user.banned 
                ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
            }`}
            title={user.banned ? 'Unban user' : 'Ban user'}
          >
            <Ban className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-md p-2 transition-colors duration-200"
            title="Delete user"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
