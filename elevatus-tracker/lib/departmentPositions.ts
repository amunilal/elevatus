export interface DepartmentPosition {
  department: string;
  positions: string[];
}

export const DEPARTMENT_POSITIONS: DepartmentPosition[] = [
  {
    department: "iOS",
    positions: ["Intern", "Junior Developer", "Developer", "Senior Developer"]
  },
  {
    department: "Android", 
    positions: ["Intern", "Junior Developer", "Developer", "Senior Developer"]
  },
  {
    department: "Frontend",
    positions: ["Intern", "Junior Developer", "Developer", "Senior Developer", "Lead Developer"]
  },
  {
    department: "Backend",
    positions: ["Intern", "Junior Developer", "Developer", "Senior Developer", "Lead Developer", "Architect"]
  },
  {
    department: "DevOps",
    positions: ["Junior Engineer", "Engineer", "Senior Engineer", "Lead Engineer"]
  },
  {
    department: "QA",
    positions: ["Junior Tester", "Tester", "Senior Tester", "QA Lead"]
  },
  {
    department: "Design",
    positions: ["Junior Designer", "Designer", "Senior Designer", "Lead Designer"]
  },
  {
    department: "Product",
    positions: ["Product Analyst", "Product Manager", "Senior Product Manager"]
  },
  {
    department: "Human Resources",
    positions: ["HR Assistant", "HR Generalist", "HR Manager", "HR Director"]
  },
  {
    department: "Finance",
    positions: ["Accountant", "Financial Analyst", "Finance Manager", "CFO"]
  },
  {
    department: "Sales",
    positions: ["Sales Representative", "Senior Sales Rep", "Sales Manager", "Sales Director"]
  },
  {
    department: "Marketing",
    positions: ["Marketing Assistant", "Marketing Specialist", "Marketing Manager", "Marketing Director"]
  },
  {
    department: "Information Technology",
    positions: ["IT Support", "System Administrator", "IT Manager", "CTO"]
  },
  {
    department: "Operations",
    positions: ["Operations Assistant", "Operations Coordinator", "Operations Manager", "Operations Director"]
  },
  {
    department: "Customer Service",
    positions: ["Customer Support", "Senior Customer Support", "Customer Success Manager", "Support Team Lead"]
  }
];

/**
 * Get all available departments
 */
export const getDepartments = (): string[] => {
  return DEPARTMENT_POSITIONS.map(dp => dp.department);
};

/**
 * Get positions for a specific department
 */
export const getPositionsForDepartment = (department: string): string[] => {
  const dept = DEPARTMENT_POSITIONS.find(dp => dp.department === department);
  return dept?.positions || [];
};

/**
 * Validate if a department-position combination is valid
 */
export const isValidDepartmentPosition = (department: string, position: string): boolean => {
  const positions = getPositionsForDepartment(department);
  return positions.includes(position);
};

/**
 * Get all unique positions across all departments
 */
export const getAllPositions = (): string[] => {
  const allPositions = DEPARTMENT_POSITIONS.flatMap(dp => dp.positions);
  return [...new Set(allPositions)].sort();
};

/**
 * Find which departments have a specific position
 */
export const getDepartmentsForPosition = (position: string): string[] => {
  return DEPARTMENT_POSITIONS
    .filter(dp => dp.positions.includes(position))
    .map(dp => dp.department);
};