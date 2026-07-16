import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form className="relative w-full max-w-[400px] animate-fade-in" onSubmit={handleSubmit}>
      <svg 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input 
        type="text" 
        className="w-full pl-[48px] pr-5 py-3 bg-card border border-border rounded-full text-white font-sans text-base transition-all outline-none focus:border-accent focus:bg-white/5 focus:ring-4 focus:ring-accent/15" 
        placeholder="Search for a city..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
