// Subject Configuration with Sections, Questions, and Marks


// Helper function to get subject config
export const getSubjectConfig = (subjectKey) => {
  return subjectConfig[subjectKey.toLowerCase()] || null;
};

// Helper function to get all subjects
export const getAllSubjects = () => {
  return Object.keys(subjectConfig).map(key => ({
    key,
    name: subjectConfig[key].name,
    code: subjectConfig[key].code,
    totalMarks: subjectConfig[key].totalMarks,
  }));
};
