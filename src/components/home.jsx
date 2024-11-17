import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Toaster, toast } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './style.css';

const MyComponent = () => {
  const [rows, setRows] = useState([{ التاريخ: '', نوع_البلاغ: '', رقم_البلاغ: '', اسم_المشروع: '', الكود: '', ماتم: '', ذكرماتم: '', ملاحظات: '', isEditable: true }]);

  const projectsName = ['Government Fiscal Management Information System','Government Payment System', 'Payroll', 'Hyperion', 'Cash Collection', 'GOV-POS', 'Billing Management System', 'مشروع التحصيل الإلكتروني للمصروفات الجامعية', 'Bitumen', 'Cash -Out', 'Fleet Management System - Digital Coupons (Cooperation Petroleum)', 'Fleet Management System - Digital Coupons (Misr Petroleum)', 'Fuel Subsidy Management System', 'Liquefied Petroleum Gas', 'Ministry of Planning', 'Takaful and Karama', 'Farmer Subsidy System', 'Go Green', 'Core Taxation', 'Tax Appeal Core System', 'Case Management & Power BI', 'E-Declaration', 'E-Invoice - Employees', 'E-Receipt', 'Corporate Payment Services', 'Electricity Collection', 'Water Collection', 'Natural Gas Collection', 'Tourism App', 'PPO Traffic', 'ATM Network', 'PPO Family', 'PPO Criminal', 'Fertilizer Distribution and Management System', 'Supplier Pay Governance Service', 'E-Receipt (E-Tax)', 'E-Receipt (Delta)', 'Taxi Sharm', 'Cash Collection - Central Lab', 'Cash Collection - NOSI', 'Khales POS Acceptance', 'Network Endpoints Enrollment to SD-WAN Technology', 'Egypt Make', 'ABE POS Acceptance', 'حوكمة إجراءات صرف حوافز اللجان المشتركة', 'خدمات مصر', 'Automotive Industry Development Program of Egypt', 'Count Big', 'Disabilities', 'Speech to Text', 'Seeds Disruption Management System', 'Private Education Digital Collection', 'Time Off Requests', 'Time Entries'];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('data');
    if (savedData) {
      setRows(JSON.parse(savedData));
    }
  }, []);

  // Function to handle adding a new row
  const addRow = () => {
    setRows([...rows, { التاريخ: '', نوع_البلاغ: '', رقم_البلاغ: '', اسم_المشروع: '', الكود: '', ماتم: '', ذكرماتم: '', ملاحظات: '', isEditable: true }]);
    toast.success('New row added!', { icon: '👍' });
  };

  // Function to handle input change
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];

    if (name === "رقم_البلاغ") {
      // Ensure رقم البلاغ starts with "WO-"
      if (!value.startsWith("WO-")) {
        updatedRows[index][name] = "WO-" + value;
      } else {
        updatedRows[index][name] = value;
      }
    } else {
      updatedRows[index][name] = value;
    }

    // Update 'ماتم' based on 'نوع_البلاغ'
    if (name === "نوع_البلاغ") {
      updatedRows[index].ماتم = getMaatamValue(value);
    }

    setRows(updatedRows);
    localStorage.setItem('data', JSON.stringify(updatedRows));
  };


  // Helper function to get 'ماتم' value based on 'نوع_البلاغ'
  const getMaatamValue = (type) => {
    switch (type) {
      case 'WO':
        return 'زيارة دورية';
      case 'INC':
        return 'زيارة بلاغ';
      case 'VR':
        return '';
      default:
        return '';
    }
  };

  // Function to toggle row edit mode
  const toggleEditRow = (index) => {
    const updatedRows = [...rows];
    updatedRows[index].isEditable = !updatedRows[index].isEditable;
    setRows(updatedRows);
  };

  // Function to delete a specific row
  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    localStorage.setItem('data', JSON.stringify(updatedRows));
    toast.success('Row deleted!', { icon: '🗑️' });
  };

  // Function to delete all rows
  const deleteAllRows = () => {
    setRows([]);
    localStorage.removeItem('data');
    toast.success('All rows deleted!', { icon: '🗑️' });
  };

  // Function to download the data in Excel format
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'data.xlsx');
    toast.success('Excel file downloaded!', { icon: '📥' });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaprK0RNpwEPIU20cAbHP0Vl750Tu4wz24GQ&s"} alt="Logo" className="logo" style={{ width: '150px', marginBottom: '30px', borderRadius: '100%' }} />
        <h2 style={{ marginBottom: '30px', fontFamily: "Sofia, cursive", color: '#ffffff' }}>Status weekly visits</h2>
      </div>
      <div className='table-responsive'>

      <table className="table table-bordered">
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th style={{ width: '1rem' }}>التاريخ</th>
            <th style={{ width: '3.5rem' }}>نوع البلاغ</th>
            <th style={{ width: '5.5rem' }}>رقم البلاغ</th>
            <th style={{ width: '7rem' }}>اسم المشروع</th>
            <th style={{ width: '5rem' }}>الكود</th>
            <th style={{ width: '5.05rem' }}>ماتم</th>
            <th style={{ width: '10rem' }}>ذكرماتم</th>
            <th style={{ width: '8rem' }}>ملاحظات</th>
            <th style={{ width: '8rem' }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={{ textAlign: 'center' }} >
                <input
                style={{ width: '8rem' }}
                  type="date"
                  name="التاريخ"
                  value={row.التاريخ}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                  readOnly={!row.isEditable}
                />
              </td>
              <td style={{ width:"4.5rem" }}>
                <select
                  name="نوع_البلاغ"
                  value={row.نوع_البلاغ}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-select w-100"
                  disabled={!row.isEditable}
                >
                  <option value="">اختر</option>
                  <option value="WO">WO</option>
                  <option value="INC">INC</option>
                  <option value="VR">VR</option>
                </select>
              </td>
              <td>
                <input
                style={{ width:"6.5rem" }}
                  type="text"
                  name="رقم_البلاغ"
                  value={row.رقم_البلاغ}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                  readOnly={!row.isEditable}
                />
              </td>
              <td>
                <select
                  name="اسم_المشروع"
                  value={row.اسم_المشروع}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                  disabled={!row.isEditable}
                  
                >
                  <option value="">اختر</option>
                  {projectsName.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  name="الكود"
                  value={row.الكود}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                  readOnly={!row.isEditable}
                />
              </td>
              <td className='text-truncate p-1'style={{ width:"5.5rem" }}>
                <input
                  type="text"
                  name="ماتم"
                  value={row.ماتم}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                  readOnly
                />
              </td>
              <td>
                <input
                  type="text"
                  name="ذكرماتم"
                  value={row.ذكرماتم}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                  readOnly={!row.isEditable}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="ملاحظات"
                  value={row.ملاحظات}
                  onChange={(e) => handleInputChange(index, e)}
                  className="form-control"
                  readOnly={!row.isEditable}
                />
              </td>
              <td>
                <button
                  onClick={() => toggleEditRow(index)}
                  className="btn  btn-sm"
                  style={{ margin: '5px', backgroundColor: 'teal', color: 'white' }}
                >
                  <i className={`fa ${row.isEditable ? 'fa-save' : 'fa-edit'}`}></i> {row.isEditable ? 'Save' : 'Edit'}
                </button>
                <button
                  onClick={() => deleteRow(index)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="fa fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <button onClick={addRow} className="btn btn-primary" style={{ margin: '10px' }}>
        <i className="fa fa-plus"></i> Add Row
      </button>
      <button onClick={deleteAllRows} className="btn btn-danger m-2">
        <i className="fa fa-trash"></i> Delete All
      </button>
      <button onClick={downloadExcel} className="btn btn-success m-2">
        <i className="fa fa-file-excel-o"></i> Download Excel
      </button>
      <Toaster />
    </div>
  );
};

export default MyComponent;
