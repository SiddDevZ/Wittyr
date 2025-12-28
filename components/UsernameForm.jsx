"use client";

import React, { useState } from 'react';
import { ConfettiButton } from "@/components/confetti-button";
import { toast } from 'sonner';
import config from '../config.json';

export default function UsernameForm({ onSubmitComplete }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendToAPI = async (username) => {
    try {
      const response = await fetch(`${config.url}/api/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `API request failed with status ${response.status}`;

        if (response.status === 404 && errorMessage.includes('User not found')) {
          throw new Error('USER_NOT_FOUND');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && !isLoading) {
      setIsLoading(true);
      
      const loadingTimeout = setTimeout(() => {
        onSubmitComplete?.();
      }, 2500);
      
      try {
        const apiResponse = await sendToAPI(username.trim());

        if (apiResponse.success) {
          setTimeout(() => {
            if (apiResponse.redirect) {
              window.location.href = `/roast?user=${encodeURIComponent(apiResponse.username)}`;
            } else {
              window.location.href = `/roast?user=${encodeURIComponent(username.trim())}`;
            }
          }, 100);

          setTimeout(() => {
            setUsername('');
            setIsLoading(false);
            window.dispatchEvent(new CustomEvent('resetHomepage'));
          }, 1000);
        } else {
          clearTimeout(loadingTimeout);
          toast.error(apiResponse.message || 'An unknown error occurred.');
          setIsLoading(false);
          window.dispatchEvent(new CustomEvent('roastError'));
        }
        
      } catch (error) {
        clearTimeout(loadingTimeout);
        console.error('Error during process:', error);

        if (error.message === 'USER_NOT_FOUND') {
          toast.error('User not found. Please try with a different username.');
        } else {
          toast.error(error.message || 'An unknown error occurred. Please try again.');
        }
        
        setIsLoading(false);
        window.dispatchEvent(new CustomEvent('roastError'));
      }
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:px-1.5 sm:py-1.5 sm:bg-white sm:rounded-2xl sm:border-2 sm:border-gray-200 sm:shadow-lg sm:shadow-gray-100/50 transition-all duration-300 sm:hover:shadow-xl sm:hover:shadow-gray-100/80 sm:focus-within:shadow-xl sm:focus-within:border-gray-300 sm:focus-within:ring-4 sm:focus-within:ring-gray-100/50">
          <div className="flex-1 relative flex py-3 sm:py-0 items-center h-12 sm:h-auto bg-white sm:bg-transparent rounded-xl sm:rounded-xl border-2 sm:border-0 border-gray-200 sm:border-transparent px-1 sm:px-0">
            <span className="absolute left-4 text-gray-400 font-space font-medium select-none text-lg">
              u/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Reddit username"
              disabled={isLoading}
              className="w-full h-full bg-transparent outline-none text-lg font-outfit font-medium text-gray-900 placeholder-gray-400 pl-10 pr-4 rounded-xl"
            />
          </div>
          <ConfettiButton
            type="submit"
            disabled={!username.trim() || isLoading}
            className="h-12 sm:h-auto cursor-pointer px-8 py-3 sm:py-[0.685rem] rounded-xl bg-[#202224] text-white font-space font-medium text-base transition-all duration-200 hover:bg-black disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px] shadow-md sm:shadow-none"
            variant="default"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                <span>Preparing...</span>
              </>
            ) : (
              <>
                Get Roasted
              </>
            )}
          </ConfettiButton>
        </div>
      </form>
    </div>
  );
}