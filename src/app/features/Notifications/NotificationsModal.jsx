"use client"

import React, { useState } from 'react';
import { X, Check, Trash2, Bell, BellOff, CheckCheck, Clock, Briefcase, FileText, Calendar, AlertCircle, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import JobDetailModal from './JobDetailsModal';

const NotificationsModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'job-approval',
      icon: AlertCircle,
      title: 'New Job Post Pending Approval',
      message: 'Senior Software Engineer position requires your approval',
      time: '2 minutes ago',
      isRead: false,
      priority: 'high',
      expanded: false,
      jobDetails: {
        title: 'Senior Software Engineer',
        department: 'Engineering',
        type: 'Full-time',
        seniorityLevel: 'Senior Level',
        location: 'Johannesburg',
        locationType: 'hybrid',
        city: 'Johannesburg',
        description: 'We are seeking an experienced Senior Software Engineer to join our growing engineering team. The ideal candidate will have a strong background in full-stack development and a passion for building scalable applications.',
        responsibilities: '• Lead software development projects\n• Collaborate with cross-functional teams\n• Mentor junior developers\n• Design and implement scalable solutions',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
        preferredSkills: ['Docker', 'Kubernetes', 'GraphQL'],
        education: '• Bachelor\'s degree in Computer Science or related field\n• 5+ years of software development experience\n• Strong problem-solving and analytical skills',
        benefits: '• Medical aid contribution\n• Flexible working hours\n• Professional development budget\n• Performance bonus',
        salaryRange: { min: '800000', max: '1200000', currency: 'ZAR' },
        submittedBy: 'Sarah Johnson',
        submittedDate: '2024-10-24',
        customQuestions: [
          { question: 'What is your experience with React?', type: 'long-text', required: true }
        ]
      }
    },
    {
      id: 2,
      type: 'application',
      icon: CheckCircle,
      title: 'Offer Accepted',
      message: 'John Doe has accepted the job offer for Software Engineer',
      time: '5 minutes ago',
      isRead: false,
      priority: 'high',
      expanded: false
    },
    {
      id: 3,
      type: 'interview',
      icon: Calendar,
      title: 'Interview Scheduled',
      message: 'Interview with Sarah Johnson scheduled for tomorrow at 10:00 AM',
      time: '1 hour ago',
      isRead: false,
      priority: 'medium',
      expanded: false
    },
    {
      id: 4,
      type: 'document',
      icon: FileText,
      title: 'Document Uploaded',
      message: 'Michael Brown uploaded employment contract',
      time: '2 hours ago',
      isRead: true,
      priority: 'low',
      expanded: false
    },
    {
      id: 5,
      type: 'system',
      icon: AlertCircle,
      title: 'System Update',
      message: 'HR system will undergo maintenance tonight at 11:00 PM',
      time: '3 hours ago',
      isRead: true,
      priority: 'medium',
      expanded: false
    },
    {
      id: 6,
      type: 'payroll',
      icon: Briefcase,
      title: 'Payroll Processing',
      message: 'Monthly payroll has been processed successfully',
      time: '1 day ago',
      isRead: true,
      priority: 'low',
      expanded: false
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedJobForApproval, setSelectedJobForApproval] = useState(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const toggleExpand = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, expanded: !notif.expanded } : notif
    ));
  };

  const handleJobApproval = (notificationId, approved) => {
  const notification = notifications.find(n => n.id === notificationId);
  if (notification && notification.jobDetails) {
    const action = approved ? 'approved' : 'rejected';
    showToast(`Job post "${notification.jobDetails.title}" has been ${action}`, approved);
    deleteNotification(notificationId);
  }
};

const showToast = (message, isSuccess) => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-[100] px-6 py-4 rounded-lg shadow-lg text-white ${isSuccess ? 'bg-green-600' : 'bg-red-600'} animate-fade-in`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('animate-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'job-approval': return 'text-orange-600 bg-orange-50';
      case 'application': return 'text-green-600 bg-green-50';
      case 'interview': return 'text-blue-600 bg-blue-50';
      case 'document': return 'text-purple-600 bg-purple-50';
      case 'system': return 'text-orange-600 bg-orange-50';
      case 'payroll': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="text-green-700" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === 'all' 
                    ? 'bg-green-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === 'unread' 
                    ? 'bg-green-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === 'read' 
                    ? 'bg-green-700 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                  title="Mark all as read"
                >
                  <CheckCheck size={18} className="text-gray-600 group-hover:text-green-700" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                  title="Clear all"
                >
                  <Trash2 size={18} className="text-gray-600 group-hover:text-red-600" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <BellOff size={48} className="mb-3" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const IconComponent = notification.icon;
                  const isJobApproval = notification.type === 'job-approval';
                  
                  return (
                    <div
                      key={notification.id}
                      className={`relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        isJobApproval 
                          ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-300 ring-2 ring-orange-200' 
                          : notification.isRead 
                            ? 'bg-white border-gray-200' 
                            : 'bg-green-50 border-green-200'
                      } ${!isJobApproval ? 'cursor-pointer' : ''}`}
                      onClick={() => !isJobApproval && toggleExpand(notification.id)}
                    >
                      {/* Special Badge for Job Approval */}
                      {isJobApproval && (
                        <div className="absolute -top-2 -right-2">
                          <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                            <Sparkles size={12} className="mr-1" />
                            ACTION REQUIRED
                          </div>
                        </div>
                      )}

                      {/* Unread Indicator */}
                      {!notification.isRead && !isJobApproval && (
                        <div className="absolute top-4 right-4">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${getIconColor(notification.type)} ${isJobApproval ? 'ring-2 ring-orange-400' : ''}`}>
                          <IconComponent size={20} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className={`font-semibold ${isJobApproval ? 'text-orange-900' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(notification.priority)} ml-2`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${isJobApproval ? 'text-orange-800' : 'text-gray-600'} ${notification.expanded ? '' : 'line-clamp-2'}`}>
                            {notification.message}
                          </p>
                          
                          {/* Job Approval Special Actions */}
                          {isJobApproval && (
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedJobForApproval(notification.jobDetails);
                                }}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center"
                              >
                                <FileText size={14} className="mr-2" />
                                View Job Details
                              </button>
                            </div>
                          )}

                          {/* Regular notification expanded content */}
                          {notification.expanded && !isJobApproval && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                              <p className="font-medium mb-2">Full Details:</p>
                              <p>{notification.message}</p>
                              <p className="mt-2 text-xs text-gray-500">
                                Click this notification again to collapse
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock size={12} className="mr-1" />
                              {notification.time}
                            </div>

                            {/* Action Buttons */}
                            {!isJobApproval && (
                              <div className="flex space-x-2">
                                {!notification.isRead && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="p-1.5 hover:bg-green-100 rounded transition-colors duration-200 group"
                                    title="Mark as read"
                                  >
                                    <Check size={14} className="text-gray-500 group-hover:text-green-700" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="p-1.5 hover:bg-red-100 rounded transition-colors duration-200 group"
                                  title="Delete"
                                >
                                  <Trash2 size={14} className="text-gray-500 group-hover:text-red-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJobForApproval && (
        <JobDetailModal
          job={selectedJobForApproval}
          onClose={() => setSelectedJobForApproval(null)}
          onApprove={() => {
            const notification = notifications.find(n => n.jobDetails === selectedJobForApproval);
            if (notification) {
              handleJobApproval(notification.id, true);
            }
          }}
          onReject={() => {
            const notification = notifications.find(n => n.jobDetails === selectedJobForApproval);
            if (notification) {
              handleJobApproval(notification.id, false);
            }
          }}
        />
      )}
    </>
  );
};

export default NotificationsModal;