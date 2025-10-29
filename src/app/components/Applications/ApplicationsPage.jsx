"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, Loader, AlertCircle } from 'lucide-react';
import _ from 'lodash';
import ApplicationsFilter from './ApplicationsFilter';
import ApplicationsTable from './ApplicationsTable';
import ApplicationsPagination from './ApplicationsPagination';
import ApplicationModal from './ApplicationsModal';

const APPLICATIONS_PER_PAGE = 30;

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [totalApplications, setTotalApplications] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: '',
    department: '',
    position: '',
    status: '',
    type: '',
    experience: ''
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'appliedDate',
    direction: 'desc'
  });
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [exporting, setExporting] = useState(false);

  const generateSampleApplications = useCallback((page, limit, search = '', filterParams = {}, sortParams = {}) => {
    const names = [
      'Nombuso Simelane', 'Zandile Dlamini', 'Lebogang Malatjei', 'Avethandwa Mpembe', 
      'Thuba Sibisi', 'Sani Pasi', 'Amahle Nkomo', 'Sipho Radebe', 'Thandiwe Mthembu',
      'Mpho Kgosana', 'Keabetswe Molefe', 'Rethabile Motaung', 'Dineo Maseko'
    ];
    
    const departments = ['Engineering', 'Product', 'Design', 'Data & Analytics', 'Marketing', 'Sales', 'Finance', 'HR'];
    const positions = [
      'Software Engineer', 'Senior Software Engineer', 'Product Manager', 'UI/UX Designer',
      'Data Analyst', 'Marketing Specialist', 'Sales Representative', 'Financial Analyst',
      'DevOps Engineer', 'Quality Assurance', 'Business Analyst', 'Project Manager'
    ];
    const statuses = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
    const types = ['internal', 'external'];
    const sources = ['LinkedIn', 'Company Website', 'Indeed', 'Glassdoor', 'Internal Referral', 'Recruitment Agency'];

    //dataset for testing
    let allApplications = [];
    for (let i = 1; i <= 18000; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const experienceYears = Math.floor(Math.random() * 15) + 1;
      
      //dates within the last 90 days
      const appliedDate = new Date();
      appliedDate.setDate(appliedDate.getDate() - Math.floor(Math.random() * 90));
      
      allApplications.push({
        id: i,
        applicationId: `VUT-2025-${String(i).padStart(5, '0')}`,
        candidateName: `${name}`,
        email: `${name.toLowerCase().replace(' ', '.')}${i > 100 ? i : ''}@email.com`,
        phone: `+27 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`,
        department,
        position,
        appliedDate: appliedDate.toISOString().split('T')[0],
        status,
        type,
        experienceYears,
        salary: `R${(Math.floor(Math.random() * 800) + 400) * 1000}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22c55e&color=ffffff&size=128`,
        source,
        skills: ['React', 'Node.js', 'Python', 'SQL', 'AWS'].slice(0, Math.floor(Math.random() * 3) + 2),
        resumeUrl: `https://example.com/resume/${i}.pdf`,
        coverLetter: `Cover letter for ${name}. I am very interested in this position...`,
        notes: `Interview notes for ${name}. Strong technical background with ${experienceYears} years of experience.`
      });
    }

    let filteredApplications = allApplications;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredApplications = filteredApplications.filter(app => 
        app.candidateName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.position.toLowerCase().includes(searchLower) ||
        app.department.toLowerCase().includes(searchLower) ||
        app.applicationId.toLowerCase().includes(searchLower)
      );
    }

    if (filterParams.dateRange) {
      const now = new Date();
      const filterDate = new Date(now);
      
      switch (filterParams.dateRange) {
        case 'today':
          filteredApplications = filteredApplications.filter(app => 
            app.appliedDate === now.toISOString().split('T')[0]
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filteredApplications = filteredApplications.filter(app => 
            new Date(app.appliedDate) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filteredApplications = filteredApplications.filter(app => 
            new Date(app.appliedDate) >= filterDate
          );
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          filteredApplications = filteredApplications.filter(app => 
            new Date(app.appliedDate) >= filterDate
          );
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          filteredApplications = filteredApplications.filter(app => 
            new Date(app.appliedDate) >= filterDate
          );
          break;
      }
    }

    Object.keys(filterParams).forEach(key => {
      if (filterParams[key] && key !== 'dateRange') {
        if (key === 'experience') {
          filteredApplications = filteredApplications.filter(app => 
            app.experienceYears >= parseInt(filterParams[key])
          );
        } else {
          filteredApplications = filteredApplications.filter(app => 
            app[key]?.toLowerCase().includes(filterParams[key].toLowerCase())
          );
        }
      }
    });

    if (sortParams.key) {
      filteredApplications.sort((a, b) => {
        let aVal = a[sortParams.key];
        let bVal = b[sortParams.key];
        
        if (sortParams.key === 'appliedDate') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        if (aVal < bVal) return sortParams.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortParams.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

    return {
      applications: paginatedApplications,
      total: filteredApplications.length,
      page,
      totalPages: Math.ceil(filteredApplications.length / limit)
    };
  }, []);

  const fetchApplications = useCallback(async (page = 1, search = '', filterParams = {}, sortParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = generateSampleApplications(page, APPLICATIONS_PER_PAGE, search, filterParams, sortParams);

      setApplications(data.applications);
      setTotalApplications(data.total);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [generateSampleApplications]);

  const debouncedSearch = useCallback(
    _.debounce((query, currentFilters, currentSort) => {
      fetchApplications(1, query, currentFilters, currentSort);
    }, 500),
    [fetchApplications]
  );

  useEffect(() => {
    fetchApplications(1, searchQuery, filters, sortConfig);
  }, []);

  useEffect(() => {
    debouncedSearch(searchQuery, filters, sortConfig);
  }, [searchQuery, debouncedSearch]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchApplications(1, searchQuery, newFilters, sortConfig);
  };

  const handleClearFilters = () => {
    const clearedFilters = { 
      dateRange: '', 
      department: '', 
      position: '', 
      status: '', 
      type: '', 
      experience: '' 
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    setCurrentPage(1);
    fetchApplications(1, '', clearedFilters, sortConfig);
  };

  const handleSort = (key) => {
    const newSortConfig = {
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    };
    setSortConfig(newSortConfig);
    fetchApplications(currentPage, searchQuery, filters, newSortConfig);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchApplications(page, searchQuery, filters, sortConfig);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Application ID,Candidate Name,Email,Position,Department,Status,Applied Date\n"
        + applications.map(app => 
            `${app.applicationId},${app.candidateName},${app.email},${app.position},${app.department},${app.status},${app.appliedDate}`
          ).join("\n");
      
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `applications-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleApplicationAction = async (applicationId, action) => {
    setActionLoading(prev => ({ ...prev, [applicationId]: true }));

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (action === 'delete') {
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        setTotalApplications(prev => prev - 1);
      }
      
      console.log(`Application ${applicationId} ${action} completed`);
      
    } catch (err) {
      console.error(`Failed to ${action} application:`, err);
    } finally {
      setActionLoading(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  // view application
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">All Applications</h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
            View and manage all job applications - {totalApplications.toLocaleString()} total applications
          </p>
        </div>

        <div className="flex items-center space-x-3 ml-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg text-sm outline-none focus:border-green-700 focus:ring-4 focus:ring-green-100"
          />
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center space-x-2 px-4 py-3 bg-green-800 text-white rounded-lg hover:bg-green-100 hover:text-green-800 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            {exporting ? <Loader className="animate-spin" size={18} /> : <Download size={18} />}
            <span>{exporting ? 'Exporting...' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4 text-green-700" size={32} />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <AlertCircle className="text-red-600 mr-2" size={20} />
            <p className="text-red-700">Error loading applications: {error}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && (
        <ApplicationsFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          currentPage={currentPage}
          totalApplications={totalApplications}
        />
      )}

      {/* Applications Table */}
      {!loading && !error && (
        <>
          <ApplicationsTable
            applications={applications}
            sortConfig={sortConfig}
            onSort={handleSort}
            onApplicationAction={handleApplicationAction}
            onViewApplication={handleViewApplication}
            actionLoading={actionLoading}
            onClearFilters={handleClearFilters}
          />

          {/* Pagination */}
          <ApplicationsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setShowModal(false)}
          onAction={handleApplicationAction}
        />
      )}
    </div>
  );
};

export default ApplicationsPage;