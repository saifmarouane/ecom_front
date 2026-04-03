import React, { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

export default function AdminTable({ columns, data, onEdit, onDelete, loading, emptyMessage }) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  if (loading) return <p className="products-status">Loading...</p>;

  if (data.length === 0) return <p className="products-status">{emptyMessage || "No data"}</p>;

  return (
    <div className="admin-table-wrapper">
      <div className="admin-table-container">
        <div className="admin-table">
          <div className="admin-thead">
            {columns.map((col) => (
              <div key={col.key} className={`admin-th admin-th-${col.key}`}>
                {col.label}
              </div>
            ))}
            <div className="admin-th admin-th-actions">Actions</div>
          </div>

          {paginatedData.map((item) => (
            <div className="admin-tr" key={item.id}>
              {columns.map((col) => (
                <div key={col.key} className={`admin-td admin-td-${col.key}`} data-label={col.label}>
                  {col.render ? col.render(item[col.key], item) : item[col.key] ?? "-"}
                </div>
              ))}
              <div className="admin-td admin-td-actions">
                <button
                  type="button"
                  className="btn ghost btn-sm"
                  onClick={() => onEdit(item)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className="btn ghost danger btn-sm"
                  onClick={() => onDelete(item.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="btn ghost btn-sm"
          >
            « First
          </button>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="btn ghost btn-sm"
          >
            ‹ Prev
          </button>

          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn ghost btn-sm"
          >
            Next ›
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="btn ghost btn-sm"
          >
            Last »
          </button>
        </div>
      )}
    </div>
  );
}
