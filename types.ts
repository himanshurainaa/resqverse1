import React from 'react';

export type Role = 'student' | 'admin' | null;
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ModuleStatus = 'Active' | 'Inactive' | 'Under Maintenance';

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface StudentData {
  name: string;
  age: string;
  className: string;
  section: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  emergencyContacts: EmergencyContact[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface StudentProfile {
  details: StudentData;
  completedDifficulties: Record<string, Difficulty[]>;
  moduleScores: Record<string, Partial<Record<Difficulty, number>>>;
  moduleStars: Record<string, Partial<Record<Difficulty, number>>>;
  earnedBadges: string[];
  hasSeenTutorial: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  questionText: string;
  options: QuizOption[];
  explanation: string;
}

export interface DisasterModule {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isLocationBased: boolean;
  requiredRegion?: 'coastal' | 'fault-line';
  status: ModuleStatus;
}

export interface ClassData {
  name: string;
  preparednessScore: number;
  moduleCompletion: number;
  drillParticipation: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: string;
}

export interface SafetyInfoCard {
  title: string;
  points: string[];
}
