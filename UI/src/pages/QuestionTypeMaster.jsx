import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, CheckCircle, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { questionTypeService } from '../services';
import { useBreadcrumb } from '../context/BreadcrumbContext';

export default function QuestionTypeMaster() {
  const { userType } = useAuth();
  const { setBreadcrumb } = useBreadcrumb();
  
  const [questionTypes, setQuestionTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    questionTypeName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const parentPath = userType === 'admin' ? '/admin/dashboard' : '/coordinator/dashboard';
    setBreadcrumb([
      { label: 'Dashboard', path: parentPath, icon: 'Home' },
      { label: 'Question Types', path: '/admin/question-types', icon: 'Layers' }
    ]);
    fetchQuestionTypes();
  }, [userType]);

  const fetchQuestionTypes = async () => {
    try {
      setLoading(true);
      const data = await questionTypeService.getAllQuestionTypes();
      setQuestionTypes(data || []);
    } catch (err) {
      setError('Failed to fetch question types');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.questionTypeName.trim()) {
      setError('Question type name is required.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await questionTypeService.createQuestionType(formData);
      setSuccess('Question type created successfully');
      setFormData({ questionTypeName: '' });
      setShowForm(false);
      fetchQuestionTypes();
    } catch (err) {
      setError(err.message || 'Error saving question type');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the question type "${name}"?`)) {
      try {
        setLoading(true);
        setError('');
        setSuccess('');
        
        await questionTypeService.deleteQuestionType(id);
        setSuccess('Question type deleted successfully');
        fetchQuestionTypes();
      } catch (err) {
        setError(err.message || 'Failed to delete question type');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ questionTypeName: '' });
    setShowForm(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Question Type Master</h1>
              <p className="text-gray-500 text-sm font-medium">Define question type tags for section setup (e.g. MCQ, SA, LA)</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Cancel' : 'Add Question Type'}
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <X className="w-5 h-5 bg-red-100 p-0.5 rounded-full" />
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle className="w-5 h-5 bg-green-100 p-0.5 rounded-full" />
            <p className="font-semibold text-sm">{success}</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 mb-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add New Question Type
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Question Type Code / Name *
                </label>
                <input
                  type="text"
                  value={formData.questionTypeName}
                  onChange={(e) => setFormData({ ...formData, questionTypeName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-semibold"
                  placeholder="e.g. MCQ, SA, LA, EXP, LIT"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 text-sm"
                >
                  {loading ? 'Saving...' : 'Save Question Type'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Grid */}
        {loading && !showForm ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-500 font-bold text-sm">Loading question types...</p>
          </div>
        ) : questionTypes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-16 text-center">
            <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Question Types Defined</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Create the master list of question types that examiners and configurations can utilize.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md"
            >
              Add First Question Type
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Question Types</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                {questionTypes.length} types
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {questionTypes.map((qt) => (
                <div
                  key={qt.questionTypeId}
                  className="flex justify-between items-center px-6 py-4 hover:bg-blue-50/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 font-black text-xs flex items-center justify-center">
                      #
                    </span>
                    <span className="font-bold text-gray-900 text-base">{qt.questionTypeName}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(qt.questionTypeId, qt.questionTypeName)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
