import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, setPage }) => {
  const pageNumbers = [];
  for (let i = Math.max(1, currentPage - 3); i <= Math.min(totalPages, currentPage + 3); i++) {
    pageNumbers.push(i);
  }


  return (
    <div className="pagination">
      <button
        onClick={() => setPage(1)}
        disabled={currentPage === 1}
      >
        &lt;&lt;
      </button>
      <button
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          className={currentPage === number ? 'active' : ''}
          onClick={() => setPage(number)}
        >
          {number}
        </button>
      ))}
      {currentPage + 3 < totalPages && (
        <p className='separator'>
          ....
        </p>
      )}
      {currentPage !== totalPages && (
        <button
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </button>
      )}
      <button
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
      <button
        onClick={() => setPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;
