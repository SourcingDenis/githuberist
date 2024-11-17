import React from 'react';
import { MapPin, Link as LinkIcon, Twitter, Users, Building, Code } from 'lucide-react';
import type { GitHubUser } from '../types/github';

interface UserProfileProps {
  user: GitHubUser;
  searchKeyword: string;
}

function highlightText(text: string, keyword: string) {
  if (!keyword.trim() || !text) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => 
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function UserProfile({ user, searchKeyword }: UserProfileProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <a
        href={user.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0"
      >
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-12 h-12 rounded-full hover:opacity-90 transition-opacity"
        />
      </a>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 truncate"
          >
            {user.name || user.login}
          </a>
          <span className="text-sm text-gray-500 truncate">@{user.login}</span>
        </div>

        {user.bio && (
          <p className="text-sm text-gray-700 mt-1">
            {highlightText(user.bio, searchKeyword)}
          </p>
        )}

        <div className="flex flex-wrap gap-3 mt-2 text-sm">
          {user.followers > 0 && (
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{formatNumber(user.followers)} followers · {formatNumber(user.following)} following</span>
            </div>
          )}

          {user.most_used_language && (
            <div className="flex items-center text-gray-600">
              <Code className="w-4 h-4 mr-1" />
              <span>{user.most_used_language}</span>
            </div>
          )}

          {user.location && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{highlightText(user.location, searchKeyword)}</span>
            </div>
          )}

          {user.company && (
            <div className="flex items-center text-gray-600">
              <Building className="w-4 h-4 mr-1" />
              <span>{highlightText(user.company, searchKeyword)}</span>
            </div>
          )}

          {user.blog && (
            <div className="flex items-center text-gray-600">
              <LinkIcon className="w-4 h-4 mr-1" />
              <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:underline">
                {highlightText(user.blog, searchKeyword)}
              </a>
            </div>
          )}

          {user.twitter_username && (
            <div className="flex items-center text-gray-600">
              <Twitter className="w-4 h-4 mr-1" />
              <a href={`https://twitter.com/${user.twitter_username}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-blue-600 hover:underline">
                @{user.twitter_username}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}