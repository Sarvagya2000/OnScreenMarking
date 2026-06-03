import apiCall from './api';

const questionTypeService = {
  getAllQuestionTypes: async () => {
    return apiCall('/QuestionType');
  },

  createQuestionType: async (data) => {
    return apiCall('/QuestionType', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  deleteQuestionType: async (id) => {
    return apiCall(`/QuestionType/${id}`, {
      method: 'DELETE'
    });
  }
};

export default questionTypeService;
