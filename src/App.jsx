import React, { useState, useEffect } from 'react';
import "./App.css"

const YourComponent = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsPerPage, setProductsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the number of total pages based on products and products per page
  const numOfTotalPages = Math.ceil(products.length / productsPerPage);
  // Generate an array of page numbers
  const pages = [...Array(numOfTotalPages + 1).keys()].slice(1);

  // Calculate the index range of products to display on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Extract the products to display on the current page
  const visibleProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Fetch products from an API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/products?limit=100');

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
    }
    catch (error) {
      console.error('Error fetching products:', error);
    }
    finally {
      setLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Event handler for navigating to the previous page
  const prevPageHandler = () => {
    if(currentPage !== 1) setCurrentPage(currentPage - 1);
  }

  // Event handler for navigating to the next page
  const nextPageHandler = () => {
    if(currentPage !== numOfTotalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          {/* Dropdown to select the number of products per page */}
          <select name="noOfPages" id="noOfPages" onChange={(e) => setProductsPerPage(e.target.value)}>
            <option value="select">Products per page</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
          <h2>Pagination</h2>
          {/* List of products */}
          <ul className='products-list'>
            {visibleProducts.map(product => (
              <li key={product.id}>
                <div>
                  <img src={product.thumbnail} alt={product.title}></img>
                  <span>{product.title}</span>
                </div>
              </li>
            ))}
          </ul>
          {/* Pagination controls */}
          <div className='pagination'>
            <span onClick={prevPageHandler}>⬅️</span>
            <p>
              {pages.map((page) => (
                <span
                  className={`${currentPage === page ? "active" : ""}`}
                  key={page}
                  onClick={() => setCurrentPage(page)}>
                  {`${page} | `}
                </span>
              ))}
            </p>
            <span onClick={nextPageHandler}>➡️</span>
          </div>
        </>
      )}
    </div>
  );
};

export default YourComponent;
