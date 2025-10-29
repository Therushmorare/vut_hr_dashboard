"use client"

import React from 'react';
import { XCircle, CheckCircle, Calendar } from 'lucide-react';
import { ApproveModal, RejectModal } from './ConfirmationModal';

const JobDetailModal = ({ job, onClose, onApprove, onReject }) => {
  if (!job) return null;

  const PRIORITY_COLORS = {
    high: { bg: 'bg-red-100', text: 'text-red-600' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    low: { bg: 'bg-blue-100', text: 'text-blue-600' }
  };

  const priority = job.priority?.toLowerCase() || 'medium';
  const priorityColors = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;

  const [showApproveModal, setShowApproveModal] = React.useState(false);
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState('');

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    await onApprove(job.id);
    setShowApproveModal(false);
    onClose();
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (rejectionReason.trim()) {
      await onReject(job.id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
      onClose();
    }
  };

  const cancelApprove = () => {
    setShowApproveModal(false);
  };

  const cancelReject = () => {
    setShowRejectModal(false);
    setRejectionReason('');
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors.bg} ${priorityColors.text}`}>
                  {priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>{job.department}</span>
                <span>•</span>
                <span>{job.type}</span>
                <span>•</span>
                <span>{job.seniorityLevel}</span>
                <span>•</span>
                <span>{job.locationType === 'remote' ? 'Remote' : 
                      job.locationType === 'hybrid' ? `Hybrid - ${job.city}` : 
                      job.city}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Submission Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Submitted by {job.submittedBy}</p>
                  <p className="text-sm text-blue-700 mt-1">
                    {new Date(job.submittedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <Calendar size={24} className="text-blue-600" />
              </div>
            </div>

            {/* Salary */}
            {job.salaryRange?.min && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Salary Range</h3>
                <p className="text-gray-700">
                  {job.salaryRange.currency} {parseInt(job.salaryRange.min).toLocaleString()} - {parseInt(job.salaryRange.max).toLocaleString()} per year
                </p>
              </div>
            )}

            {/* Description */}
            {job.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
                <div className="text-gray-700 whitespace-pre-line">{job.responsibilities}</div>
              </div>
            )}

            {/* Skills */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.preferredSkills && job.preferredSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Preferred Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.preferredSkills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {job.education && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Education & Experience</h3>
                <div className="text-gray-700 whitespace-pre-line">{job.education}</div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits & Perks</h3>
                <div className="text-gray-700 whitespace-pre-line">{job.benefits}</div>
              </div>
            )}

            {/* Custom Questions */}
            {job.customQuestions && job.customQuestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Application Questions</h3>
                <div className="space-y-3">
                  {job.customQuestions.map((question, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-gray-900">{question.question}</p>
                        {question.required && <span className="text-red-500 text-sm">Required</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Type: {question.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex space-x-3">
            <button
              onClick={handleApprove}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex items-center"
            >
              <CheckCircle size={16} className="mr-2" />
              Approve Job
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
            >
              <XCircle size={16} className="mr-2" />
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Approve Job Post?</h3>
            <p className="text-gray-600 text-center mb-6">
              This job posting will be published and visible to candidates immediately after approval.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={cancelApprove}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white bg-opacity-30 z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <XCircle size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Reject Job Post</h3>
            <p className="text-gray-600 text-center mb-6">
              Please provide a reason for rejecting this job posting. This will be sent to the submitter.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                placeholder="e.g., Salary range is outside budget guidelines, missing required information, duplicate position..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelReject}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Reject Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobDetailModal;