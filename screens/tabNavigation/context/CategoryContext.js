// contexts/CategoryContext.js
import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [stickySelectedCategory, setStickySelectedCategory] = useState('All');
  const [stickySelectedIndex, setStickySelectedIndex] = useState(0);

  const updateMainCategory = (category, index) => {
    setSelectedCategory(category);
    setSelectedIndex(index);
  };

  const updateStickyCategory = (category, index) => {
    setStickySelectedCategory(category);
    setStickySelectedIndex(index);
  };

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        selectedIndex,
        stickySelectedCategory,
        stickySelectedIndex,
        updateMainCategory,
        updateStickyCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);