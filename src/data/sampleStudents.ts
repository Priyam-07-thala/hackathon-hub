import { predictRisk, generateRecommendations as generateMLRecommendations, type RiskLevel } from '@/lib/mlPredictor';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  class: string;
  email: string;
  attendance: number;
  avgMarks: number;
  assignmentCompletion: number;
  behaviorScore: number;
  riskLevel: RiskLevel;
  riskProbability: number;
  trend: 'improving' | 'stable' | 'declining';
  subjects: SubjectScore[];
  recommendations: string[];
  lastUpdated: string;
}

export interface SubjectScore {
  subject: string;
  score: number;
  maxScore: number;
  trend: 'up' | 'down' | 'stable';
}

// ML-based risk prediction using the trained model
export function calculateRiskLevel(
  attendance: number,
  avgMarks: number,
  assignmentCompletion: number,
  behaviorScore: number
): { level: RiskLevel; probability: number } {
  const result = predictRisk({
    attendance,
    avgMarks,
    assignmentCompletion,
    behaviorScore,
  });
  
  return { 
    level: result.riskLevel, 
    probability: result.riskProbability 
  };
}

export function generateRecommendations(student: Student): string[] {
  return generateMLRecommendations(
    {
      attendance: student.attendance,
      avgMarks: student.avgMarks,
      assignmentCompletion: student.assignmentCompletion,
      behaviorScore: student.behaviorScore,
    },
    student.riskLevel
  );
}

export const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    rollNo: 'CS2024001',
    class: '10-A',
    email: 'arjun.s@school.edu',
    attendance: 92,
    avgMarks: 85,
    assignmentCompletion: 95,
    behaviorScore: 9,
    riskLevel: 'Low',
    riskProbability: 12,
    trend: 'stable',
    subjects: [
      { subject: 'Mathematics', score: 88, maxScore: 100, trend: 'up' },
      { subject: 'Science', score: 82, maxScore: 100, trend: 'stable' },
      { subject: 'English', score: 79, maxScore: 100, trend: 'up' },
      { subject: 'History', score: 91, maxScore: 100, trend: 'stable' },
    ],
    recommendations: ['Keep up the excellent work!', 'Consider helping peers who may be struggling'],
    lastUpdated: '2024-12-14',
  },
  {
    id: '2',
    name: 'Priya Patel',
    rollNo: 'CS2024002',
    class: '10-A',
    email: 'priya.p@school.edu',
    attendance: 68,
    avgMarks: 55,
    assignmentCompletion: 60,
    behaviorScore: 7,
    riskLevel: 'High',
    riskProbability: 72,
    trend: 'declining',
    subjects: [
      { subject: 'Mathematics', score: 45, maxScore: 100, trend: 'down' },
      { subject: 'Science', score: 58, maxScore: 100, trend: 'down' },
      { subject: 'English', score: 65, maxScore: 100, trend: 'stable' },
      { subject: 'History', score: 52, maxScore: 100, trend: 'down' },
    ],
    recommendations: [
      'Improve attendance - aim for at least 85% attendance rate',
      'Schedule extra tutoring sessions for weak subjects',
      'Create a study schedule to complete assignments on time',
    ],
    lastUpdated: '2024-12-14',
  },
  {
    id: '3',
    name: 'Rahul Kumar',
    rollNo: 'CS2024003',
    class: '10-A',
    email: 'rahul.k@school.edu',
    attendance: 78,
    avgMarks: 68,
    assignmentCompletion: 75,
    behaviorScore: 6,
    riskLevel: 'Medium',
    riskProbability: 45,
    trend: 'stable',
    subjects: [
      { subject: 'Mathematics', score: 70, maxScore: 100, trend: 'stable' },
      { subject: 'Science', score: 65, maxScore: 100, trend: 'up' },
      { subject: 'English', score: 72, maxScore: 100, trend: 'stable' },
      { subject: 'History', score: 65, maxScore: 100, trend: 'down' },
    ],
    recommendations: [
      'Focus on problem areas through targeted study',
      'Create a study schedule to complete assignments on time',
    ],
    lastUpdated: '2024-12-14',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    rollNo: 'CS2024004',
    class: '10-B',
    email: 'sneha.r@school.edu',
    attendance: 95,
    avgMarks: 92,
    assignmentCompletion: 100,
    behaviorScore: 10,
    riskLevel: 'Low',
    riskProbability: 5,
    trend: 'improving',
    subjects: [
      { subject: 'Mathematics', score: 95, maxScore: 100, trend: 'up' },
      { subject: 'Science', score: 90, maxScore: 100, trend: 'up' },
      { subject: 'English', score: 88, maxScore: 100, trend: 'stable' },
      { subject: 'History', score: 95, maxScore: 100, trend: 'up' },
    ],
    recommendations: ['Keep up the excellent work!', 'Consider helping peers who may be struggling'],
    lastUpdated: '2024-12-14',
  },
  {
    id: '5',
    name: 'Amit Singh',
    rollNo: 'CS2024005',
    class: '10-B',
    email: 'amit.s@school.edu',
    attendance: 55,
    avgMarks: 42,
    assignmentCompletion: 40,
    behaviorScore: 4,
    riskLevel: 'High',
    riskProbability: 85,
    trend: 'declining',
    subjects: [
      { subject: 'Mathematics', score: 38, maxScore: 100, trend: 'down' },
      { subject: 'Science', score: 45, maxScore: 100, trend: 'down' },
      { subject: 'English', score: 50, maxScore: 100, trend: 'down' },
      { subject: 'History', score: 35, maxScore: 100, trend: 'down' },
    ],
    recommendations: [
      'Improve attendance - aim for at least 85% attendance rate',
      'Schedule extra tutoring sessions for weak subjects',
      'Create a study schedule to complete assignments on time',
      'Schedule counseling session to discuss challenges',
    ],
    lastUpdated: '2024-12-14',
  },
  {
    id: '6',
    name: 'Kavya Nair',
    rollNo: 'CS2024006',
    class: '10-B',
    email: 'kavya.n@school.edu',
    attendance: 85,
    avgMarks: 78,
    assignmentCompletion: 88,
    behaviorScore: 8,
    riskLevel: 'Low',
    riskProbability: 22,
    trend: 'improving',
    subjects: [
      { subject: 'Mathematics', score: 80, maxScore: 100, trend: 'up' },
      { subject: 'Science', score: 75, maxScore: 100, trend: 'up' },
      { subject: 'English', score: 82, maxScore: 100, trend: 'stable' },
      { subject: 'History', score: 75, maxScore: 100, trend: 'up' },
    ],
    recommendations: ['Keep up the excellent work!'],
    lastUpdated: '2024-12-14',
  },
  {
    id: '7',
    name: 'Vikram Joshi',
    rollNo: 'CS2024007',
    class: '10-A',
    email: 'vikram.j@school.edu',
    attendance: 72,
    avgMarks: 58,
    assignmentCompletion: 65,
    behaviorScore: 5,
    riskLevel: 'Medium',
    riskProbability: 55,
    trend: 'declining',
    subjects: [
      { subject: 'Mathematics', score: 55, maxScore: 100, trend: 'down' },
      { subject: 'Science', score: 60, maxScore: 100, trend: 'stable' },
      { subject: 'English', score: 62, maxScore: 100, trend: 'down' },
      { subject: 'History', score: 55, maxScore: 100, trend: 'down' },
    ],
    recommendations: [
      'Focus on problem areas through targeted study',
      'Create a study schedule to complete assignments on time',
      'Schedule counseling session to discuss challenges',
    ],
    lastUpdated: '2024-12-14',
  },
  {
    id: '8',
    name: 'Ananya Gupta',
    rollNo: 'CS2024008',
    class: '10-A',
    email: 'ananya.g@school.edu',
    attendance: 88,
    avgMarks: 75,
    assignmentCompletion: 82,
    behaviorScore: 8,
    riskLevel: 'Low',
    riskProbability: 25,
    trend: 'stable',
    subjects: [
      { subject: 'Mathematics', score: 72, maxScore: 100, trend: 'stable' },
      { subject: 'Science', score: 78, maxScore: 100, trend: 'up' },
      { subject: 'English', score: 80, maxScore: 100, trend: 'stable' },
      { subject: 'History', score: 70, maxScore: 100, trend: 'stable' },
    ],
    recommendations: ['Keep up the excellent work!'],
    lastUpdated: '2024-12-14',
  },
  {
    id: '9',
    name: 'Rohan Mehta',
    rollNo: 'CS2024009',
    class: '10-B',
    email: 'rohan.m@school.edu',
    attendance: 65,
    avgMarks: 48,
    assignmentCompletion: 55,
    behaviorScore: 5,
    riskLevel: 'High',
    riskProbability: 68,
    trend: 'declining',
    subjects: [
      { subject: 'Mathematics', score: 42, maxScore: 100, trend: 'down' },
      { subject: 'Science', score: 50, maxScore: 100, trend: 'down' },
      { subject: 'English', score: 55, maxScore: 100, trend: 'stable' },
      { subject: 'History', score: 45, maxScore: 100, trend: 'down' },
    ],
    recommendations: [
      'Improve attendance - aim for at least 85% attendance rate',
      'Schedule extra tutoring sessions for weak subjects',
      'Create a study schedule to complete assignments on time',
    ],
    lastUpdated: '2024-12-14',
  },
  {
    id: '10',
    name: 'Ishita Banerjee',
    rollNo: 'CS2024010',
    class: '10-B',
    email: 'ishita.b@school.edu',
    attendance: 90,
    avgMarks: 88,
    assignmentCompletion: 92,
    behaviorScore: 9,
    riskLevel: 'Low',
    riskProbability: 10,
    trend: 'improving',
    subjects: [
      { subject: 'Mathematics', score: 90, maxScore: 100, trend: 'up' },
      { subject: 'Science', score: 85, maxScore: 100, trend: 'up' },
      { subject: 'English', score: 92, maxScore: 100, trend: 'stable' },
      { subject: 'History', score: 85, maxScore: 100, trend: 'up' },
    ],
    recommendations: ['Keep up the excellent work!', 'Consider helping peers who may be struggling'],
    lastUpdated: '2024-12-14',
  },
];

export const classPerformanceTrend = [
  { month: 'Aug', avgScore: 72, attendance: 85, atRiskCount: 4 },
  { month: 'Sep', avgScore: 70, attendance: 82, atRiskCount: 5 },
  { month: 'Oct', avgScore: 68, attendance: 80, atRiskCount: 5 },
  { month: 'Nov', avgScore: 71, attendance: 78, atRiskCount: 4 },
  { month: 'Dec', avgScore: 69, attendance: 79, atRiskCount: 4 },
];
