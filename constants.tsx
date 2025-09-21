import React from 'react';
import type { DisasterModule, ClassData, Badge, SafetyInfoCard } from './types';

export const FireIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 6 8 6 13C6 16.31 8.69 19 12 19S18 16.31 18 13C18 8 12 2 12 2ZM12 17C9.79 17 8 15.21 8 13C8 11.29 9.33 8.54 12 5.54C14.67 8.54 16 11.29 16 13C16 15.21 14.21 17 12 17Z" /></svg>
);

export const EarthquakeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M2 5L5 2L8 5L11 2L14 5L17 2L20 5L22 3V10L20 8L17 11L14 8L11 11L8 8L5 11L2 8V5ZM2 15L5 12L8 15L11 12L14 15L17 12L20 15L22 13V20L20 18L17 21L14 18L11 21L8 18L5 21L2 18V15Z" /></svg>
);

export const FloodIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" /></svg>
);

export const HurricaneIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20ZM15.01 15.01L12 12L8.99 15.01L12 18L15.01 15.01ZM15.01 8.99L12 12L8.99 8.99L12 6L15.01 8.99Z"/></svg>
);

export const PoliceIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

export const AmbulanceIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
    </svg>
);

export const ReliefCenterIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

export const BadgeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.333a1 1 0 001.732.667l.866-.5a1 1 0 011.268.5l.533.924a1 1 0 01-.268 1.366l-.866.5a1 1 0 000 1.334l.866.5a1 1 0 01.268 1.366l-.533.924a1 1 0 01-1.268.5l-.866-.5a1 1 0 00-1.732.667V17a1 1 0 01-2 0v-1.333a1 1 0 00-1.732-.667l-.866.5a1 1 0 01-1.268-.5l-.533-.924a1 1 0 01.268-1.366l.866-.5a1 1 0 000-1.334l-.866-.5a1 1 0 01-.268-1.366l.533.924a1 1 0 011.268-.5l.866.5a1 1 0 001.732.667V3a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);
export const StarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
export const ShieldIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5.066 11.954 11.954 0 0110 18.056a11.954 11.954 0 017.834-12.99A11.954 11.954 0 0110 1.944zM8.5 6a1.5 1.5 0 113 0v4.755a1.5 1.5 0 11-3 0V6z" clipRule="evenodd" />
    </svg>
);


export const INITIAL_DISASTER_MODULES: DisasterModule[] = [
  { id: 'fire-safety', name: 'Fire Safety', description: 'Learn how to prevent fires and what to do during a fire emergency.', icon: FireIcon, isLocationBased: false, status: 'Active' },
  { id: 'earthquake', name: 'Earthquake Prep', description: 'Drop, Cover, and Hold On! Master the basics of earthquake safety.', icon: EarthquakeIcon, isLocationBased: false, status: 'Active' },
  { id: 'flood', name: 'Flood Awareness', description: 'Understand flood risks and how to stay safe before, during, and after a flood.', icon: FloodIcon, isLocationBased: false, status: 'Active' },
  { id: 'hurricane-drill', name: 'Hurricane Drill', description: 'A special module for coastal regions to prepare for hurricane season.', icon: HurricaneIcon, isLocationBased: true, requiredRegion: 'coastal', status: 'Active' },
];

const HURRICANE_DRILL_INSTRUCTIONS: SafetyInfoCard[] = [
  {
    title: 'Drill Start: Initial Actions',
    points: [
      "You will receive a simulated 'HURRICANE WARNING' alert via campus notification systems.",
      "Immediately move indoors to your dorm room or a designated campus shelter.",
      "Secure your dorm room: close and lock windows, and draw the blinds.",
      "Move away from windows and exterior doors.",
    ],
  },
  {
    title: 'During the Drill: Key Steps',
    points: [
      "Tune into the campus emergency radio station or website for simulated updates.",
      "If instructed, move to a lower level or an interior room/hallway without windows.",
      "Practice the 'duck and cover' position if a 'TORNADO WARNING' is issued as part of the drill.",
      "Do not use elevators. Use stairs if you need to change floors.",
    ],
  },
  {
    title: 'Drill Conclusion: All Clear',
    points: [
      "Remain in your safe location until the official 'ALL CLEAR' message is broadcast.",
      "After the drill, discuss the process with your RA or instructor.",
      "Note any challenges or questions you had during the simulation.",
      "Familiarize yourself with the actual campus evacuation routes and shelter locations post-drill.",
    ],
  },
];

const FLOOD_AWARENESS_INSTRUCTIONS: SafetyInfoCard[] = [
    {
        title: 'Before a Flood',
        points: [
            "Identify campus evacuation routes and high ground locations.",
            "Assemble a go-bag: water, snacks, flashlight, first-aid, medications, essential documents.",
            "Stay informed by signing up for university emergency alerts and local weather apps.",
        ],
    },
    {
        title: 'During a Flood',
        points: [
            "Never walk or drive through floodwaters; \"turn around, don't drown!\" even shallow water can be dangerous.",
            "If instructed to evacuate, do so immediately and follow official routes.",
            "If trapped, seek the highest ground possible and wait for rescue. Do not enter attics unless there is an exit point.",
            "Avoid contact with floodwater which can be contaminated and hide hazards like downed power lines.",
        ],
    },
    {
        title: 'After a Flood',
        points: [
            "Do not return to flooded areas until authorities declare it safe.",
            "Be aware of structural damage, gas leaks, and electrical hazards; do not turn on utilities until they are checked.",
            "Document any damage with photos or videos for insurance purposes.",
            "Avoid tap water until you are certain it is safe to drink; boil water or use bottled water.",
        ],
    },
];

export const STATIC_MODULE_INFO: Record<string, SafetyInfoCard[]> = {
  'hurricane-drill': HURRICANE_DRILL_INSTRUCTIONS,
  'flood': FLOOD_AWARENESS_INSTRUCTIONS,
};

export const BADGES: Badge[] = [
    { id: 'first-step', name: 'First Responder', description: 'Complete your first module.', icon: BadgeIcon },
    { id: 'high-scorer', name: 'High Scorer', description: 'Achieve a score of 80% or higher on any quiz.', icon: StarIcon },
    { id: 'perfect-score', name: 'Perfectionist', description: 'Get a perfect 100% score on any quiz.', icon: StarIcon },
    { id: 'fire-certified', name: 'Fire Certified', description: 'Complete the Fire Safety module.', icon: FireIcon },
    { id: 'earthquake-expert', name: 'Earthquake Expert', description: 'Complete the Earthquake Prep module.', icon: EarthquakeIcon },
    { id: 'flood-ready', name: 'Flood Ready', description: 'Complete the Flood Awareness module.', icon: FloodIcon },
    { id: 'hurricane-hero', name: 'Hurricane Hero', description: 'Complete the Hurricane Drill module.', icon: HurricaneIcon },
    { id: 'preparedness-pro', name: 'Preparedness Pro', description: 'Complete all available modules.', icon: ShieldIcon },
];

export const ADMIN_DASHBOARD_DATA: ClassData[] = [
  { name: 'CSE A', preparednessScore: 85, moduleCompletion: 90, drillParticipation: 80 },
  { name: 'CSE B', preparednessScore: 78, moduleCompletion: 82, drillParticipation: 75 },
  { name: 'IT A', preparednessScore: 92, moduleCompletion: 95, drillParticipation: 90 },
  { name: 'IT B', preparednessScore: 68, moduleCompletion: 70, drillParticipation: 65 },
  { name: 'ECE A', preparednessScore: 75, moduleCompletion: 80, drillParticipation: 70 },
  { name: 'ECE B', preparednessScore: 88, moduleCompletion: 85, drillParticipation: 90 },
  { name: 'CSE DS', preparednessScore: 95, moduleCompletion: 100, drillParticipation: 92 },
];