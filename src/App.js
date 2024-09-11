import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const ITEMS_PER_PAGE = 10;
const DATA = Array(1000).fill(0).map((_, index) => `Item ${index + 1}`);

function App() {
  const [items, setItems] = useState(DATA.slice(0, ITEMS_PER_PAGE));
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(1); 

  const loadMoreItems = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    const nextPage = currentPage + 1;
    const start = startIndex + ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newItems = DATA.slice(start - 1, end); 
    if (newItems.length < ITEMS_PER_PAGE) {
      setHasMore(false);
    }
    setItems(prevItems => [...prevItems, ...newItems]);
    setCurrentPage(nextPage);
    setStartIndex(start); 
    setLoading(false);
  }, [currentPage, hasMore, ITEMS_PER_PAGE, DATA, startIndex]);

  useEffect(() => {
    const list = document.getElementById('infinite-scroll-list');
    const handleScroll = () => {
      if (list.scrollTop + list.clientHeight >= list.scrollHeight - 100) {
        loadMoreItems();
      }
    };
    list.addEventListener('scroll', handleScroll);
    return () => list.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems]);

  const handleBackToTop = () => {
    const list = document.getElementById('infinite-scroll-list');
    list.scrollTop = 0;
  };

  return (
    <div className="App">
      <h1>Infinite Scroll List</h1>
      <div
        id="infinite-scroll-list"
        className="scrollable-list"
        style={{
          height: 390,
          overflowY: 'auto',
          padding: 20,
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="list-item">
            {item}
          </div>
        ))}
        {loading && (
          <div className="loading-indicator">
            <span>Loading...</span>
          </div>
        )}
      </div>
      <button onClick={handleBackToTop} className="back-to-top-btn">
        Back to Top
      </button>
    </div>
  );
}

export default App;