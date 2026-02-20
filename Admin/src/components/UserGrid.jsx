import React, { useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./custom-aggrid.css";

import {
  FaFilePdf,
  FaFileExcel,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaPrint, // added
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import AddButton from "./buttons/AddButton";

ModuleRegistry.registerModules([AllCommunityModule]);

const UserGrid = ({ columns, data = [], addButton, onAdd, addButtonLabel = "Add" }) => {
  const gridRef = useRef();
  const [fullData, setFullData] = useState([]);
  const [rowData, setRowData] = useState([]); // data currently sent to grid (one page)
  const [pageSize, setPageSize] = useState(10);
  const [globalSearch, setGlobalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // load full data and reset to first page when incoming prop changes
    setFullData(Array.isArray(data) ? data : []);
    setCurrentPage(1);
  }, [data]);

  // --- Utility
  const sanitize = (val) => {
    if (val === undefined || val === null) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  };

  // detect select-like columns (valueOptions or common select cell editors)
  const selectFields = new Set(
    (columns || [])
      .filter(
        (c) =>
          c?.valueOptions ||
          c?.cellEditor === "agSelectCellEditor" ||
          c?.cellEditor === "agRichSelectCellEditor" ||
          c?.type === "select"
      )
      .map((c) => c.field)
  );

  // map columns by field and build searchable set (default: searchable=true)
  const columnsByField = new Map((columns || []).map((c) => [c.field, c]));
  const searchableFields = new Set(
    (columns || []).filter((c) => c.searchable !== false).map((c) => c.field)
  );

  // --- Apply filtering + pagination (client-side)
  const applyPaginationAndFilter = () => {
    const q = (globalSearch || "").toString().trim().toLowerCase();

    let filtered = fullData;
    if (q) {
      filtered = fullData.filter((row) =>
        // only search fields that are marked searchable and not select fields (minimize search scope)
        Object.entries(row || {}).some(([k, v]) => {
          if (!searchableFields.has(k)) return false;
          if (selectFields.has(k)) return false;
          return sanitize(v).toLowerCase().includes(q);
        })
      );
    }

    const total = Math.max(1, Math.ceil(filtered.length / pageSize || 1));
    // if currentPage is out of bounds, clamp it and re-run (by state change)
    if (currentPage > total) {
      setTotalPages(total);
      setCurrentPage(total);
      return;
    }

    setTotalPages(total);
    const start = (currentPage - 1) * pageSize;
    const pageRows = filtered.slice(start, start + pageSize);
    setRowData(pageRows);
  };

  // keep display in sync whenever relevant state changes
  useEffect(() => {
    applyPaginationAndFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullData, pageSize, currentPage, globalSearch]);

  // --- Grid Ready
  const onGridReady = (params) => {
    gridRef.current = params;
    // params.api.paginationSetPageSize(pageSize);
    // updatePaginationState();

    // Listen to internal changes as backup
    // params.api.addEventListener("paginationChanged", updatePaginationState);
  };

  // --- Search
  const onGlobalSearch = (value) => {
    setGlobalSearch(value);
    // reset to first page when searching
    setCurrentPage(1);
  };

  // --- Export Excel
  const exportExcel = async () => {
    const selected = gridRef.current?.api?.getSelectedRows() || [];
    const exportData = selected.length ? selected : fullData;
    try {
      Swal.fire({
        title: "Exporting to Excel...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      // small delay so the loader can render on very fast operations
      await new Promise((r) => setTimeout(r, 50));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, "data_export.xlsx");

      Swal.close();
      Swal.fire({ icon: "success", title: "Excel exported", timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.close();
      Swal.fire({ icon: "error", title: "Export failed", text: err?.message || String(err) });
    }
  };

  // --- Export PDF
  const exportPDF = async () => {
    const res = await Swal.fire({
      title: "Select PDF orientation",
      input: "radio",
      inputOptions: {
        portrait: "Portrait",
        landscape: "Landscape",
      },
      inputValue: "landscape",
      showCancelButton: true,
      confirmButtonText: "Generate",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!res.isConfirmed) return;
    const orientation = res.value || "landscape";
    const selected = gridRef.current?.api?.getSelectedRows() || [];
    const exportData =
      selected.length > 0 ? selected : Array.isArray(fullData) ? fullData : [];

    try {
      Swal.fire({
        title: "Generating PDF...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      // small delay so the loader can render before heavy processing
      await new Promise((r) => setTimeout(r, 50));

      let headers = [];
      const body = [];

      if (columns?.length) {
        headers = columns.map((c) => c.headerName || c.field || "");
        exportData.forEach((row) => {
          body.push(columns.map((c) => sanitize(row?.[c.field])));
        });
      } else if (exportData.length) {
        const keys = Object.keys(exportData[0]);
        headers = keys;
        exportData.forEach((row) => body.push(keys.map((k) => sanitize(row?.[k]))));
      }

      if (!body.length) body.push(headers.map(() => ""));
      const doc = new jsPDF({ orientation });
      autoTable(doc, {
        head: [headers],
        body,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
        headStyles: { fillColor: [68, 90, 100], textColor: 255, halign: "center" },
        startY: 20,
        margin: { left: 10, right: 10 },
      });
      doc.save(`data_export_${orientation}.pdf`);

      Swal.close();
      Swal.fire({ icon: "success", title: "PDF generated", timer: 1400, showConfirmButton: false });
    } catch (err) {
      Swal.close();
      Swal.fire({ icon: "error", title: "PDF export failed", text: err?.message || String(err) });
    }
  };

  // --- Print (new)
  const printData = async () => {
    const selected = gridRef.current?.api?.getSelectedRows() || [];
    const exportData = selected.length ? selected : fullData;
    try {
      Swal.fire({
        title: "Preparing print...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
      });
      await new Promise((r) => setTimeout(r, 50));

      // determine columns/keys
      const keys = columns?.length ? columns.map((c) => c.field) : exportData.length ? Object.keys(exportData[0]) : [];
      const headers = columns?.length ? columns.map((c) => c.headerName || c.field) : keys;

      // build rows html
      const rowsHtml = exportData
        .map(
          (row) =>
            "<tr>" +
            keys
              .map(
                (k) =>
                  `<td style="padding:8px;border:1px solid #ddd;vertical-align:top">${sanitize(row?.[k])}</td>`
              )
              .join("") +
            "</tr>"
        )
        .join("");

      const tableHtml = `<table style="border-collapse:collapse;width:100%;font-family:Arial,Helvetica,sans-serif;font-size:12px"><thead><tr>${headers
        .map((h) => `<th style="padding:8px;border:1px solid #ddd;background:#f5f5f5;text-align:left">${h}</th>`)
        .join("")}</tr></thead><tbody>${rowsHtml}</tbody></table>`;

      const w = window.open("", "_blank");
      if (!w) throw new Error("Popup blocked by the browser");
      w.document.write(`<html><head><title>Print</title></head><body>${tableHtml}</body></html>`);
      w.document.close();

      // give the new window a moment to render
      await new Promise((r) => setTimeout(r, 200));
      w.focus();
      w.print();
      // optionally close window after print: w.close();

      Swal.close();
      Swal.fire({ icon: "success", title: "Print dialog opened", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.close();
      Swal.fire({ icon: "error", title: "Print failed", text: err?.message || String(err) });
    }
  };

  // --- Columns
  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
      pinned: "left",
      filter: false,
      floatingFilter: false,
      sortable: false,
      tooltipValueGetter: () => "",
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      },
    },
    ...columns.map((col) => {
      const isSelect = selectFields.has(col.field);

      // respect explicit layout hints passed from caller (Announcement)
      const colWidth = col.width !== undefined ? col.width : undefined;
      const colFlex = col.flex !== undefined ? col.flex : isSelect ? 0 : 1;
      const colMinWidth = col.minWidth !== undefined ? col.minWidth : isSelect ? 80 : 80;
      // new: optional maxWidth support (set only when provided)
      const colMaxWidth = col.maxWidth !== undefined ? col.maxWidth : undefined;

      // respect per-column filterable flag (default: true)
      let filterSetting;
      let floatingFilterSetting;
      let floatingFilterComponentParams = undefined;
      if (col.filterable === false) {
        filterSetting = false;
        floatingFilterSetting = false;
      } else if (isSelect) {
        filterSetting = false;
        floatingFilterSetting = false;
      } else {
        filterSetting = "agTextColumnFilter";
        floatingFilterSetting = true;
        floatingFilterComponentParams = { suppressFilterButton: true };
      }

      return {
        ...col,
        // disable filter & floating filter for select columns or when filterable=false
        filter: filterSetting,
        floatingFilter: floatingFilterSetting,
        floatingFilterComponentParams,
        // use provided layout hints or fallback
        flex: colWidth === undefined ? colFlex : undefined,
        width: colWidth,
        minWidth: colMinWidth,
        // include maxWidth when passed from caller
        maxWidth: colMaxWidth,
        tooltipValueGetter: (params) => sanitize(params.data?.[col.field]),
        // if column already provided a custom cellRenderer keep it,
        // otherwise render a truncating div with title for full text on hover
        ...(col.cellRenderer
          ? {}
          : {
              cellRenderer: (params) => {
                const v = sanitize(params.value);
                return <div className="truncate-cell" title={v}>{v}</div>;
              },
            }),
        cellStyle: {
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      };
    }),
  ];

  // helper: return array of items to render in center pagination (numbers or '...')
  const getVisiblePages = () => {
    const total = totalPages || 1;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    // always show first two
    pages.push(1);
    pages.push(2);
    if (currentPage > 4 && currentPage < total - 2) {
      pages.push("...");
      pages.push(currentPage);
      pages.push("...");
    } else if (currentPage <= 4) {
      pages.push(3);
      pages.push(4);
      pages.push("...");
    } else {
      // near the end
      pages.push("...");
      pages.push(total - 3);
      pages.push(total - 2);
    }
    pages.push(total);
    // dedupe while preserving order (keeps ellipses)
    const seen = new Set();
    return pages.filter((p) => {
      if (seen.has(p)) return false;
      seen.add(p);
      return true;
    });
  };

  return (
    <div className=" py-4  rounded-xl shadow-smm">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
        <div>
          {/* render add button passed from parent, or a compact default when onAdd provided */}
          {addButton ? (
            addButton
          ) : onAdd ? (

              <AddButton
                label={addButtonLabel}
                onClick={onAdd}
              />
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 border px-3 py-1.5 rounded-md shadow-sm">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search all columns..."
              className="outline-none text-sm w-64"
              value={globalSearch}
              onChange={(e) => onGlobalSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            {/* <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 py-2 bg-[#445a64] text-white rounded-md hover:bg-[#2f3d44]"
            >
              <FaFilePdf /> PDF
            </button>
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 px-3 py-2 bg-[#002c54] text-white rounded-md hover:bg-[#004680]"
            >
              <FaFileExcel /> Excel
            </button> */}
            {/* Print button (toolbar) */}
            {/* <button
              onClick={printData}
              className="flex items-center gap-2 px-3 py-2 bg-[#1f7a1f] text-white rounded-md hover:bg-[#166116]"
            >
              <FaPrint /> Print
            </button> */}
          </div>
          
        </div>
      </div>

      {/* Grid */}
      <div
        className="ag-theme-alpine"
        style={{
          height: "65vh",
          width: "100%",
          borderRadius: "10px",
          overflowY: "auto",
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowHeight={45}
          rowWidth={0}
          headerHeight={50}
          rowData={rowData} // now the paged data
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          enableBrowserTooltips={true}
          tooltipShowDelay={150}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          animateRows={true}
          rowBuffer={10}
          suppressRowTransform={true}
          defaultColDef={{
            flex: 1,
            minWidth: 0,
            sortable: true,
            filter: true,
            floatingFilter: true,
            resizable: true,
            cellStyle: {
              display: "flex",
              alignItems: "center", // ensure default cells are centered
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
            tooltipValueGetter: (params) => sanitize(params.value),
          }}
        />

      </div>

      {/* Footer*/}
      <div className="pagination-footer mt-4">
        <div className="footer-inner max-w-full mx-auto flex items-center justify-between">
          {/* Left: rows per page */}
          <div className="left-section flex items-center gap-3">
            <label className="text-sm ">Rows per page:</label>
            <select
              className="rows-select text-sm"
              value={pageSize}
              onChange={(e) => {
                const size = Number(e.target.value);
                setPageSize(size);
                setCurrentPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Center: circular pagination */}
          <div className="pagination-center flex items-center gap-3">
            <button
              className="circle-btn nav-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <FaChevronLeft />
            </button>

            {getVisiblePages().map((item, idx) =>
              item === "..." ? (
                <span key={`e-${idx}`} className="page-ellipsis">
                  &hellip;
                </span>
              ) : (
                <button
                  key={item}
                  className={`circle-btn page-number ${item === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(Number(item))}
                >
                  {item}
                </button>
              )
            )}

            <button
              className="circle-btn nav-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Right: export/print buttons */}
          <div className="right-section flex items-center gap-3">
            
             <button onClick={printData} className="export-btn export-print ">
              <FaPrint /> Print
            </button>
            {/* <button onClick={exportPDF} className="export-btn export-pdf">
              <FaFilePdf /> Export PDF
            </button> */}
            <button onClick={exportExcel} className="export-btn export-excel">
              <FaFileExcel /> Export Excel
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGrid;
