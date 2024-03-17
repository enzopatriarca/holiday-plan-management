import React, { useEffect, useState,useCallback  } from 'react';
import { Link } from 'react-router-dom';
import { fetchHolidayPlans } from '../services/holidayPlanService';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import '../HollidayList.css';
import axios from 'axios';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

axios.defaults.withCredentials = true;

function SimpleModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function HolidayList() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const generatePDF = useCallback(() => {
    const doc = new jsPDF();
    const tableColumn = ["Title", "Description", "Start Date", "End Date", "Location", "Participants"];
    const tableRows = [];
  
    data.forEach(plan => {
      const participants = plan.participants.map(participant => participant.name).join(', ');
  
      const planData = [
        plan.title,
        plan.description,
        plan.start_date,
        plan.end_date,
        plan.location,
        participants 
      ];
      tableRows.push(planData);
    });
  
    
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Holiday Plans", 14, 15);
    doc.save("holiday_plans.pdf");
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await fetchHolidayPlans();
      setData(response.plans || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch holiday plans:", error);
      setError("Failed to fetch holiday plans. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = useCallback(async (holidayId) => {

    const isConfirmed = window.confirm('Are you sure you want to delete this holiday plan?');
  
    if (!isConfirmed) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://127.0.0.1:8000/api/holiday_plans/${holidayId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setSuccessMessage('Holiday plan deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchData(); 
    } catch (error) {
      console.error('Error deleting holiday plan:', error);
      setError('Failed to delete the holiday plan. Please try again.');
    }
  }, []);

  const columns = React.useMemo(() => [
    {
      Header: 'Title',
      accessor: 'title',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Start Date',
      accessor: 'start_date',
    },
    {
      Header: 'End Date',
      accessor: 'end_date',
    },
    {
      Header: 'Location',
      accessor: 'location',
    },
    {
      Header: 'Participants',
      accessor: 'participants',
      Cell: ({ value }) => (
        <button onClick={() => openModal(value)} className="table-button view-participants-btn">View Participants</button>
      ),
    },
    {
      Header: 'Actions',
      accessor: 'id',
      Cell: ({ value }) => (
        <>
          <button onClick={() => handleDelete(value)} className="table-button delete-btn">Delete</button>
          <Link to={`/update/${value}`} className="table-button update-btn link-button">Update</Link>
        </>
      ),
    },
  ], [handleDelete]);

  const openModal = (participants) => {
    setModalContent(participants.map(participant => (
      <div key={participant.id}>{participant.name}</div>
    )));
    setIsModalOpen(true);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
  } = useTable(
    { columns, data },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="List-holiday-container">
      <h1>List my Holiday Plan</h1>
      <button onClick={generatePDF} type='button' className="generate-pdf-button">Generate PDF</button>
      <div className="table-container">
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <p className="error">{error}</p>}
        <input className='search-bar'
          value={globalFilter || ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search plans..."
        />
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</button>
          <span>
            Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
          </span>
        </div>
        <SimpleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {modalContent}
        </SimpleModal>
      </div>
    </div>
  );
}

export default HolidayList;
