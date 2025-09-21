import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

import { Header } from './components/Header';
import { Quiz } from './components/Quiz';
import { useLocation } from './hooks/useLocation';
import { generateQuizForDisaster, generateSafetyInfo } from './services/geminiService';
import { INITIAL_DISASTER_MODULES, ADMIN_DASHBOARD_DATA, PoliceIcon, AmbulanceIcon, FireIcon, ReliefCenterIcon, BADGES, StarIcon, STATIC_MODULE_INFO } from './constants';
import type { Role, UserLocation, DisasterModule, QuizQuestion, Notification, ClassData, SafetyInfoCard, StudentData, StudentProfile, Difficulty, Badge, EmergencyContact, ModuleStatus } from './types';

// =================================================================================
// AUTHENTICATION VIEW COMPONENTS
// =================================================================================
const InitialAuthView: React.FC<{ onSetView: (view: 'login' | 'signup' | 'adminLogin') => void }> = ({ onSetView }) => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="text-center p-10 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-lg mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-white">Welcome to ResQverse</h1>
      <p className="text-slate-400 mb-8">Your interactive guide to emergency preparedness. Login to continue or sign up to begin your journey.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => onSetView('login')} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
          Login
        </button>
        <button onClick={() => onSetView('signup')} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
          Sign Up
        </button>
      </div>
       <button onClick={() => onSetView('adminLogin')} className="w-full mt-4 text-slate-400 hover:text-white text-sm">
          Continue as Administrator
        </button>
    </div>
  </div>
);

const StudentSignUpView: React.FC<{ onSignUp: (details: Omit<StudentData, 'emergencyContacts'>) => void; onBack: () => void; error?: string }> = ({ onSignUp, onBack, error }) => {
    const [formData, setFormData] = useState({ name: '', age: '', className: '', section: '', email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignUp(formData);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <form onSubmit={handleSubmit} className="text-left p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-lg mx-auto w-full relative">
                <button type="button" onClick={onBack} className="absolute top-4 left-4 text-slate-400 hover:text-white">&larr; Back</button>
                <h1 className="text-3xl font-bold mb-2 text-white text-center">Create Account</h1>
                <p className="text-slate-400 mb-6 text-center">Please enter your information to get started.</p>
                
                {error && <p className="text-red-400 text-center mb-4 bg-red-900/50 p-3 rounded-lg">{error}</p>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-slate-300 mb-2 font-semibold">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                    </div>
                    <div>
                        <label className="block text-slate-300 mb-2 font-semibold">Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-slate-300 mb-2 font-semibold">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                 <div className="mb-4">
                    <label className="block text-slate-300 mb-2 font-semibold">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-slate-300 mb-2 font-semibold">Class</label>
                        <input type="text" name="className" value={formData.className} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g., Geology 101" required />
                    </div>
                    <div>
                        <label className="block text-slate-300 mb-2 font-semibold">Section</label>
                        <input type="text" name="section" value={formData.section} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g., A" required />
                    </div>
                </div>

                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

const StudentLoginView: React.FC<{ onLogin: (creds: {email: string, password: string}) => void; onBack: () => void; error?: string }> = ({ onLogin, onBack, error }) => {
    const [creds, setCreds] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(creds);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <form onSubmit={handleSubmit} className="text-left p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-md mx-auto w-full relative">
                <button type="button" onClick={onBack} className="absolute top-4 left-4 text-slate-400 hover:text-white">&larr; Back</button>
                <h1 className="text-3xl font-bold mb-2 text-white text-center">Login</h1>
                <p className="text-slate-400 mb-6 text-center">Welcome back! Please login to your account.</p>
                
                {error && <p className="text-red-400 text-center mb-4 bg-red-900/50 p-3 rounded-lg">{error}</p>}
                
                <div className="mb-4">
                    <label className="block text-slate-300 mb-2 font-semibold">Email Address</label>
                    <input type="email" name="email" value={creds.email} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                 <div className="mb-6">
                    <label className="block text-slate-300 mb-2 font-semibold">Password</label>
                    <input type="password" name="password" value={creds.password} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                    Login
                </button>
            </form>
        </div>
    );
};

const AdminLoginView: React.FC<{ onLogin: (creds: {email: string, password: string}) => void; onBack: () => void; error?: string }> = ({ onLogin, onBack, error }) => {
    const [creds, setCreds] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(creds);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <form onSubmit={handleSubmit} className="text-left p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-md mx-auto w-full relative">
                <button type="button" onClick={onBack} className="absolute top-4 left-4 text-slate-400 hover:text-white">&larr; Back</button>
                <h1 className="text-3xl font-bold mb-2 text-white text-center">Administrator Login</h1>
                <p className="text-slate-400 mb-6 text-center">Please enter your credentials to access the dashboard.</p>
                
                {error && <p className="text-red-400 text-center mb-4 bg-red-900/50 p-3 rounded-lg">{error}</p>}
                
                <div className="mb-4">
                    <label className="block text-slate-300 mb-2 font-semibold">Admin Email</label>
                    <input type="email" name="email" value={creds.email} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                 <div className="mb-6">
                    <label className="block text-slate-300 mb-2 font-semibold">Admin Password</label>
                    <input type="password" name="password" value={creds.password} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                    Access Dashboard
                </button>
            </form>
        </div>
    );
};


// =================================================================================
// LOCATION PROMPT COMPONENT
// =================================================================================
const LocationPrompt: React.FC<{ onRequest: () => void, loading: boolean, error: string | null }> = ({ onRequest, loading, error }) => (
    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative text-center mb-8">
        <strong className="font-bold">Location Required!</strong>
        <span className="block sm:inline ml-2">Unlock regional drills by sharing your location.</span>
        <button onClick={onRequest} disabled={loading} className="mt-2 sm:mt-0 sm:ml-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Getting Location...' : 'Allow Access'}
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
);


// =================================================================================
// EMERGENCY FAB COMPONENT
// =================================================================================
const EmergencyFAB: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const emergencyActions = [
        { name: 'Police', icon: PoliceIcon, href: 'tel:100' },
        { name: 'Ambulance', icon: AmbulanceIcon, href: 'tel:102' },
        { name: 'Fire Dept.', icon: FireIcon, href: 'tel:101' },
        { name: 'Relief Center', icon: ReliefCenterIcon, href: 'tel:108' }, // Placeholder number
    ];

    return (
        <div className="fixed bottom-8 right-8 z-40">
            <div className="relative flex flex-col items-center gap-3">
                {/* Action buttons */}
                <div 
                    className={`flex flex-col items-center gap-3 transition-all duration-300 ease-in-out ${
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                >
                    {emergencyActions.map((action) => (
                        <a 
                            key={action.name}
                            href={action.href}
                            className="group relative flex items-center justify-center w-14 h-14 bg-slate-700 rounded-full text-white shadow-lg hover:bg-slate-600 transition-colors"
                            aria-label={action.name}
                        >
                            <action.icon className="h-7 w-7" />
                            <div className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 text-sm text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                                {action.name}
                            </div>
                        </a>
                    ))}
                </div>

                {/* Main FAB button */}
                <button
                    id="tutorial-fab"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-transform transform hover:scale-110"
                    aria-expanded={isOpen}
                    aria-label="Toggle Emergency Contacts"
                >
                    <div className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    </div>
                </button>
            </div>
        </div>
    );
};

// =================================================================================
// DIFFICULTY SELECTION MODAL
// =================================================================================
interface DifficultySelectionModalProps {
  isOpen: boolean;
  moduleName: string;
  onSelect: (difficulty: Difficulty) => void;
  onClose: () => void;
}
const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({ isOpen, moduleName, onSelect, onClose }) => {
    if (!isOpen) return null;

    const difficulties: { level: Difficulty; color: string; description: string }[] = [
        { level: 'Easy', color: 'bg-green-600 hover:bg-green-500', description: 'Basic concepts and straightforward scenarios.' },
        { level: 'Medium', color: 'bg-yellow-600 hover:bg-yellow-500', description: 'More complex situations with nuanced choices.' },
        { level: 'Hard', color: 'bg-red-600 hover:bg-red-500', description: 'Challenging scenarios requiring critical thinking.' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in-fast">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full m-4 border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Select Difficulty</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                </div>
                <p className="text-slate-400 mb-6">Choose a difficulty level for the <span className="font-bold text-cyan-400">{moduleName}</span> quiz.</p>
                <div className="space-y-4">
                    {difficulties.map(({ level, color, description }) => (
                        <button
                            key={level}
                            onClick={() => onSelect(level)}
                            className={`w-full text-left p-4 rounded-lg transition-transform transform hover:scale-105 ${color}`}
                        >
                            <h3 className="font-bold text-lg text-white">{level}</h3>
                            <p className="text-sm text-white/80">{description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// =================================================================================
// BADGE DISPLAY COMPONENT
// =================================================================================
const BadgeDisplay: React.FC<{ earnedBadgeIds: string[], disasterModules: DisasterModule[] }> = ({ earnedBadgeIds, disasterModules }) => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Badge Collection</h3>
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {BADGES.map(badge => {
                    const isEarned = earnedBadgeIds.includes(badge.id);
                    const BadgeIconComponent = badge.icon;
                    return (
                        <div key={badge.id} className="group relative flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${isEarned ? 'bg-yellow-500/20' : 'bg-slate-700'}`}>
                                <BadgeIconComponent className={`h-8 w-8 transition-all duration-300 ${isEarned ? 'text-yellow-400' : 'text-slate-500 grayscale'}`} />
                            </div>
                            <p className={`mt-2 text-xs font-semibold transition-colors ${isEarned ? 'text-white' : 'text-slate-500'}`}>{badge.name}</p>
                            
                            <div className="absolute bottom-full mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                                <p className="font-bold">{badge.name}</p>
                                <p>{badge.description}</p>
                                {!isEarned && <p className="mt-1 text-red-400 font-bold">[LOCKED]</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// =================================================================================
// PERSONAL DASHBOARD COMPONENT
// =================================================================================
interface PersonalDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onEditProfileClick: () => void;
  studentProfile: StudentProfile;
  disasterModules: DisasterModule[];
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ isOpen, onClose, onEditProfileClick, studentProfile, disasterModules }) => {
    const { completedDifficulties, details } = studentProfile;
    const totalDifficulties = disasterModules.length * 3;
    const completedDifficultiesCount = Object.values(completedDifficulties).reduce((sum, difficulties) => sum + difficulties.length, 0);
    const progressPercentage = totalDifficulties > 0 ? (completedDifficultiesCount / totalDifficulties) * 100 : 0;
    
    const totalQuestionsPerModule = 5;
    const maxStarsPerQuestion = 3;
    const totalPossibleStars = disasterModules.length * 3 * totalQuestionsPerModule * maxStarsPerQuestion;
    const totalEarnedStars = Object.values(studentProfile.moduleStars || {}).reduce((total, module) => {
        return total + Object.values(module).reduce((moduleTotal, stars) => moduleTotal + (stars || 0), 0);
    }, 0);
    const starsPercentage = totalPossibleStars > 0 ? (totalEarnedStars / totalPossibleStars) * 100 : 0;

    return (
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
            <div className={`relative h-full w-full max-w-md bg-slate-800 shadow-2xl ml-auto flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center space-x-4">
                            {details.profilePictureUrl ? (
                                <img src={details.profilePictureUrl} alt={details.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-700" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-cyan-600 flex items-center justify-center font-bold text-white text-3xl border-4 border-slate-700">
                                    {details.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">{details.name}</h2>
                                <p className="text-slate-400">{details.email}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                </div>

                <div className="overflow-y-auto px-6 space-y-6 flex-grow">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                                <StarIcon className="w-6 h-6 text-yellow-400" />
                                <span>Total Stars Earned</span>
                            </h3>
                            <span className="font-semibold text-yellow-400">{totalEarnedStars} / {totalPossibleStars}</span>
                        </div>
                        <p className="text-slate-400 mb-4 text-sm">Stars are awarded for speed and accuracy. Collect them all!</p>
                        <div className="w-full bg-slate-700 rounded-full h-4">
                            <div className="bg-yellow-500 h-4 rounded-full transition-all duration-500" style={{ width: `${starsPercentage}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-white">Your Progress</h3>
                            <span className="font-semibold text-cyan-400">{completedDifficultiesCount} / {totalDifficulties} Drills Completed</span>
                        </div>
                        <p className="text-slate-400 mb-4 text-sm">Complete all drills to become fully prepared.</p>
                        <div className="w-full bg-slate-700 rounded-full h-4">
                            <div className="bg-cyan-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                    <BadgeDisplay earnedBadgeIds={studentProfile.earnedBadges} disasterModules={disasterModules}/>
                </div>
                 <div className="p-6 mt-auto">
                    <button onClick={onEditProfileClick} className="w-full text-center bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

// =================================================================================
// EDIT PROFILE MODAL COMPONENT
// =================================================================================
interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedDetails: Partial<StudentData>, passwordData: { current: string, new: string }) => Promise<string | null>;
    studentProfile: StudentProfile;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave, studentProfile }) => {
    const [formData, setFormData] = useState(studentProfile.details);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    // State for managing emergency contacts UI
    const [contacts, setContacts] = useState<EmergencyContact[]>(studentProfile.details.emergencyContacts || []);
    const [newContact, setNewContact] = useState({ name: '', phone: '' });

    useEffect(() => {
        setFormData(studentProfile.details);
        setContacts(studentProfile.details.emergencyContacts || []);
    }, [studentProfile]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleNewContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewContact({ ...newContact, [e.target.name]: e.target.value });
    };

    const handleAddContact = () => {
        if (newContact.name && newContact.phone) {
            setContacts([...contacts, newContact]);
            setNewContact({ name: '', phone: '' });
        }
    };

    const handleRemoveContact = (index: number) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (passwords.new !== passwords.confirm) {
            setError("New passwords do not match.");
            return;
        }

        setIsSaving(true);
        const updatedDetailsWithContacts = { ...formData, emergencyContacts: contacts };
        const saveError = await onSave(updatedDetailsWithContacts, { current: passwords.current, new: passwords.new });
        setIsSaving(false);

        if (saveError) {
            setError(saveError);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in-fast">
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full m-4 border border-slate-700 flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                        <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    {error && <p className="text-red-400 text-center mb-4 bg-red-900/50 p-3 rounded-lg">{error}</p>}
                    
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Personal Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* ... personal details fields ... */}
                             <div>
                                <label className="block text-slate-300 mb-2 font-semibold text-sm">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                            </div>
                             <div>
                                <label className="block text-slate-300 mb-2 font-semibold text-sm">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                            </div>
                             <div className="sm:col-span-2">
                                <label className="block text-slate-300 mb-2 font-semibold text-sm">Profile Picture URL</label>
                                <input type="url" name="profilePictureUrl" value={formData.profilePictureUrl || ''} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="https://example.com/image.png" />
                            </div>
                             <div>
                                <label className="block text-slate-300 mb-2 font-semibold text-sm">Class</label>
                                <input type="text" name="className" value={formData.className} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                            </div>
                            <div>
                                <label className="block text-slate-300 mb-2 font-semibold text-sm">Section</label>
                                <input type="text" name="section" value={formData.section} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-700 pt-6">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Emergency Contacts</h3>
                        <div className="space-y-2 mb-4">
                            {contacts.map((contact, index) => (
                                <div key={index} className="flex items-center justify-between bg-slate-700 p-2 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-white">{contact.name}</p>
                                        <p className="text-sm text-slate-400">{contact.phone}</p>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveContact(index)} className="text-red-400 hover:text-red-300 font-bold">Remove</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-end gap-2">
                            <input type="text" name="name" value={newContact.name} onChange={handleNewContactChange} placeholder="Contact Name" className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <input type="tel" name="phone" value={newContact.phone} onChange={handleNewContactChange} placeholder="Phone Number" className="flex-grow bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                            <button type="button" onClick={handleAddContact} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2.5 px-4 rounded-lg">Add</button>
                        </div>
                    </div>
                    
                    <div className="border-t border-slate-700 pt-6">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Change Password</h3>
                        <div className="space-y-4">
                             {/* ... password fields ... */}
                              <div>
                                <label className="block text-slate-300 mb-2 font-semibold text-sm">Current Password</label>
                                <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Required to change password" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 mb-2 font-semibold text-sm">New Password</label>
                                    <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                                <div>
                                    <label className="block text-slate-300 mb-2 font-semibold text-sm">Confirm New Password</label>
                                    <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-700 bg-slate-800/50">
                    <button type="submit" disabled={isSaving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// =================================================================================
// PROGRESS CIRCLE COMPONENT
// =================================================================================
const ProgressCircle: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 50 50">
                <circle
                    className="text-slate-700"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="25"
                    cy="25"
                />
                <circle
                    className="text-cyan-500 transition-all duration-500"
                    strokeWidth="5"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="25"
                    cy="25"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                {`${Math.round(percentage)}%`}
            </span>
        </div>
    );
};


// =================================================================================
// SOS BUTTON & MODAL
// =================================================================================
const SOSButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        id="tutorial-sos-button"
        onClick={onClick}
        className="fixed bottom-8 left-8 z-40 w-16 h-16 bg-red-600 rounded-full flex flex-col items-center justify-center text-white shadow-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-transform transform hover:scale-110"
        aria-label="Send SOS Alert"
    >
        <span className="font-bold text-xl">SOS</span>
    </button>
);

const SOSConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; }> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in-fast">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full m-4 border border-red-700">
                <h2 className="text-2xl font-bold text-red-400 mb-4 text-center">Confirm SOS Alert</h2>
                <p className="text-slate-300 mb-6 text-center">
                    This will immediately send an emergency message with your current location to your saved contacts.
                    Are you sure you want to proceed?
                </p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Yes, Send Alert
                    </button>
                </div>
            </div>
        </div>
    );
};

// =================================================================================
// TUTORIAL WALKTHROUGH COMPONENT
// =================================================================================
interface TutorialWalkthroughProps {
    isOpen: boolean;
    onFinish: () => void;
}
const TutorialWalkthrough: React.FC<TutorialWalkthroughProps> = ({ isOpen, onFinish }) => {
    const [step, setStep] = useState(0);
    const [styles, setStyles] = useState<{ highlight: React.CSSProperties, popover: React.CSSProperties }>({
        highlight: {},
        popover: {},
    });

    const tutorialSteps = [
        {
            title: "Welcome to ResQverse!",
            content: "This app will help you prepare for emergencies. Let's take a quick tour of the key features.",
            targetId: null,
        },
        {
            title: "Preparedness Modules",
            content: "This is your main learning hub. Each card is a different disaster module. Click to learn or start a quiz.",
            targetId: 'tutorial-first-module',
            placement: 'bottom',
        },
        {
            title: "Track Your Progress",
            content: "Click your profile avatar to open a dashboard with your stats, earned badges, and total stars.",
            targetId: 'tutorial-profile-button',
            placement: 'left',
        },
        {
            title: "SOS Alert Button",
            content: "In a critical emergency, press this button. It sends a pre-written message with your location to your saved emergency contacts.",
            targetId: 'tutorial-sos-button',
            placement: 'top-left',
        },
        {
            title: "Quick Call Menu",
            content: "Press the '+' button to quickly call local emergency services like the police, ambulance, or fire department.",
            targetId: 'tutorial-fab',
            placement: 'top-right',
        },
        {
            title: "You're All Set!",
            content: "Now you're ready to explore. Complete modules, earn badges, and become a preparedness pro. Stay safe!",
            targetId: null,
        },
    ];

    const currentStep = tutorialSteps[step];
    const isLastStep = step === tutorialSteps.length - 1;

    const positionElements = useCallback(() => {
        if (!currentStep) return;

        if (!currentStep.targetId) {
            setStyles({
                highlight: { display: 'none' },
                popover: {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                },
            });
            return;
        }

        const targetElement = document.getElementById(currentStep.targetId);
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const padding = 10;
            const offset = 15;

            const newHighlightStyle: React.CSSProperties = {
                position: 'fixed',
                left: `${rect.left - padding}px`,
                top: `${rect.top - padding}px`,
                width: `${rect.width + padding * 2}px`,
                height: `${rect.height + padding * 2}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                borderRadius: '8px',
                transition: 'top 0.4s cubic-bezier(0.42, 0, 0.58, 1), left 0.4s cubic-bezier(0.42, 0, 0.58, 1), width 0.4s cubic-bezier(0.42, 0, 0.58, 1), height 0.4s cubic-bezier(0.42, 0, 0.58, 1)',
                zIndex: 999,
                pointerEvents: 'none',
            };

            const newPopoverStyle: React.CSSProperties = {
                position: 'fixed',
                zIndex: 1000,
                transition: 'top 0.4s cubic-bezier(0.42, 0, 0.58, 1), left 0.4s cubic-bezier(0.42, 0, 0.58, 1), transform 0.4s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s',
                opacity: 1,
            };

            switch (currentStep.placement) {
                case 'bottom':
                    newPopoverStyle.top = `${rect.bottom + offset}px`;
                    newPopoverStyle.left = `${rect.left + rect.width / 2}px`;
                    newPopoverStyle.transform = 'translateX(-50%)';
                    break;
                case 'left':
                    newPopoverStyle.top = `${rect.top + rect.height / 2}px`;
                    newPopoverStyle.left = `${rect.left - offset}px`;
                    newPopoverStyle.transform = 'translate(-100%, -50%)';
                    break;
                case 'top-left':
                    newPopoverStyle.top = `${rect.top - offset}px`;
                    newPopoverStyle.left = `${rect.left}px`;
                    newPopoverStyle.transform = 'translateY(-100%)';
                    break;
                case 'top-right':
                    newPopoverStyle.top = `${rect.top - offset}px`;
                    newPopoverStyle.left = `${rect.right}px`;
                    newPopoverStyle.transform = 'translate(-100%, -100%)';
                    break;
                default: // Fallback to bottom
                    newPopoverStyle.top = `${rect.bottom + offset}px`;
                    newPopoverStyle.left = `${rect.left + rect.width / 2}px`;
                    newPopoverStyle.transform = 'translateX(-50%)';
            }
            setStyles({ highlight: newHighlightStyle, popover: newPopoverStyle });
        }
    }, [currentStep]);
    
    useEffect(() => {
        if (isOpen && currentStep && currentStep.targetId) {
            const targetElement = document.getElementById(currentStep.targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const timer = setTimeout(positionElements, 400); 
                return () => clearTimeout(timer);
            }
        }
        positionElements();
    }, [step, isOpen, currentStep, positionElements]);
    
    useEffect(() => {
        if (!isOpen) return;
        const handleEvent = () => window.requestAnimationFrame(positionElements);
        window.addEventListener('scroll', handleEvent, true);
        window.addEventListener('resize', handleEvent);
        return () => {
            window.removeEventListener('scroll', handleEvent, true);
            window.removeEventListener('resize', handleEvent);
        };
    }, [isOpen, positionElements]);


    if (!isOpen) return null;

    if (!currentStep.targetId) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in-fast">
                <div style={styles.popover} className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full m-4 border border-slate-700 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">{currentStep.title}</h2>
                    <p className="text-slate-300 mb-8">{currentStep.content}</p>
                    <div className="flex justify-center">
                        <button 
                            onClick={() => isLastStep ? onFinish() : setStep(s => s + 1)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-8 rounded-lg transition-colors"
                        >
                            {isLastStep ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={styles.highlight}></div>
            <div style={styles.popover} className="bg-slate-800 rounded-lg shadow-2xl p-4 w-64 border border-slate-700">
                 <h3 className="text-lg font-bold text-white mb-2">{currentStep.title}</h3>
                 <p className="text-slate-300 text-sm mb-4">{currentStep.content}</p>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">{step + 1} / {tutorialSteps.length}</span>
                    <div>
                        <button 
                            onClick={() => setStep(s => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 mr-2"
                        >
                            Prev
                        </button>
                        <button 
                            onClick={() => {
                                setStyles(s => ({...s, popover: {...s.popover, opacity: 0}}));
                                setTimeout(() => isLastStep ? onFinish() : setStep(s => s + 1), 300);
                            }}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                            {isLastStep ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
// =================================================================================
// STUDENT VIEW COMPONENT
// =================================================================================
interface StudentViewProps {
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  onQuizComplete: (moduleId: string, score: number, difficulty: Difficulty, stars: number) => void;
  studentProfile: StudentProfile;
  onSendSOS: () => void;
  disasterModules: DisasterModule[];
}

const StudentView: React.FC<StudentViewProps> = ({ setNotifications, onQuizComplete, studentProfile, onSendSOS, disasterModules }) => {
  const { location, error, loading, requestLocation } = useLocation();
  const [activeModule, setActiveModule] = useState<DisasterModule | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizState, setQuizState] = useState<'idle' | 'loading' | 'active' | 'error'>('idle');
  const [quizError, setQuizError] = useState('');
  
  const [viewingModule, setViewingModule] = useState<DisasterModule | null>(null);
  const [safetyCards, setSafetyCards] = useState<SafetyInfoCard[]>([]);
  const [infoState, setInfoState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [infoError, setInfoError] = useState('');
  
  const [difficultySelection, setDifficultySelection] = useState<{ module: DisasterModule | null; isOpen: boolean }>({ module: null, isOpen: false });
  const [isSosConfirmOpen, setIsSosConfirmOpen] = useState(false);

  const { completedDifficulties } = studentProfile;

  const handleStartQuiz = useCallback(async (module: DisasterModule, difficulty: Difficulty) => {
    setActiveModule(module);
    setActiveDifficulty(difficulty);
    setQuizState('loading');
    setQuizError('');
    setDifficultySelection({ module: null, isOpen: false }); // Close modal
    try {
      const questions = await generateQuizForDisaster(module.name, difficulty);
      setQuizQuestions(questions);
      setQuizState('active');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setQuizError(errorMessage);
      setQuizState('error');
    }
  }, []);
  
  const handleQuizComplete = (score: number, stars: number) => {
      if (activeModule && activeDifficulty) {
          onQuizComplete(activeModule.id, score, activeDifficulty, stars);
      }
      setActiveModule(null);
      setQuizQuestions(null);
      setActiveDifficulty(null);
      setQuizState('idle');
      setViewingModule(null); // Return to module list
  }
  
  const handleViewInfo = useCallback(async (module: DisasterModule) => {
    setViewingModule(module);
    setInfoError('');

    // Check for pre-defined static content first for any module.
    const staticInfo = STATIC_MODULE_INFO[module.id];
    if (staticInfo) {
      setSafetyCards(staticInfo);
      setInfoState('idle'); // Content is ready, skip loading
      return;
    }

    // Fallback to dynamic generation if no static content is found.
    setInfoState('loading');
    try {
      const cards = await generateSafetyInfo(module.name, module.isLocationBased);
      setSafetyCards(cards);
      setInfoState('idle');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setInfoError(errorMessage);
      setInfoState('error');
    }
  }, []);

  const handleBackToModules = () => {
    setViewingModule(null);
    setSafetyCards([]);
    setInfoState('idle');
  };
  
  const openDifficultyModal = (module: DisasterModule) => {
      setDifficultySelection({ module, isOpen: true });
  };

  const handleConfirmSOS = () => {
    onSendSOS();
    setIsSosConfirmOpen(false);
  };


  useEffect(() => {
    if (location) {
        // Simulate a location-based notification
        const timeoutId = setTimeout(() => {
            const newNotification: Notification = {
                id: Date.now(),
                title: 'Urgent: Coastal Weather Alert',
                message: 'A severe weather system is approaching your area. Review hurricane preparedness modules.',
                timestamp: new Date().toLocaleTimeString(),
            };
            setNotifications(prev => [newNotification, ...prev]);
        }, 5000);
        return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, setNotifications]);


  if (quizState === 'active' && quizQuestions && activeModule) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Quiz 
          questions={quizQuestions} 
          disasterName={activeModule.name}
          onComplete={handleQuizComplete}
          onRetry={() => openDifficultyModal(activeModule)}
        />
      </div>
    );
  }

  if (quizState === 'loading' || quizState === 'error') {
      return (
          <div className="flex flex-col items-center justify-center text-center p-8 min-h-[60vh]">
              {quizState === 'loading' && (
                <>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                    <h2 className="text-2xl font-bold text-white">Generating Your Scenario...</h2>
                    <p className="text-slate-400">Gemini AI is creating a unique quiz for you. Please wait.</p>
                </>
              )}
              {quizState === 'error' && (
                  <div className="bg-red-900/50 border border-red-700 text-red-200 p-6 rounded-lg">
                      <h2 className="text-2xl font-bold mb-2">Quiz Generation Failed</h2>
                      <p className="mb-4">{quizError}</p>
                      <button onClick={() => setQuizState('idle')} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg">Back to Modules</button>
                  </div>
              )}
          </div>
      );
  }

  if (viewingModule) {
    // Re-order the rendering logic to prioritize loading/error states
    if (infoState === 'loading' || infoState === 'error') {
        return (
            <div className="container mx-auto p-4 md:p-8">
                <button onClick={handleBackToModules} className="flex items-center space-x-2 text-slate-300 hover:text-white mb-6 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Back to Modules</span>
                </button>
                {infoState === 'loading' && (
                    <div className="flex flex-col items-center justify-center text-center p-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                        <h2 className="text-2xl font-bold text-white">Fetching Safety Tips...</h2>
                        <p className="text-slate-400">Gemini AI is preparing flashcards for you.</p>
                    </div>
                )}
                {infoState === 'error' && (
                    <div className="bg-red-900/50 border border-red-700 text-red-200 p-6 rounded-lg text-center">
                        <h2 className="text-2xl font-bold mb-2">Failed to Load Info</h2>
                        <p className="mb-4">{infoError}</p>
                        <button onClick={() => handleViewInfo(viewingModule)} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg">Try Again</button>
                    </div>
                )}
            </div>
        )
    }

    return (
      <div className="container mx-auto p-4 md:p-8 animate-fade-in">
        <button onClick={handleBackToModules} className="flex items-center space-x-2 text-slate-300 hover:text-white mb-6 font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          <span>Back to Modules</span>
        </button>
  
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{viewingModule.name} Safety Info</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{viewingModule.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {safetyCards.map((card, index) => (
            <div key={index} className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <h3 className="font-bold text-lg text-cyan-400 mb-3">{card.title}</h3>
              <ul className="space-y-2 list-disc list-inside text-slate-300">
                {card.points.map((point, pIndex) => (
                  <li key={pIndex}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center">
           <button
              onClick={() => openDifficultyModal(viewingModule)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
           >
              Ready? Start the Quiz!
           </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
        <SOSConfirmationModal isOpen={isSosConfirmOpen} onClose={() => setIsSosConfirmOpen(false)} onConfirm={handleConfirmSOS} />
        <DifficultySelectionModal
            isOpen={difficultySelection.isOpen}
            moduleName={difficultySelection.module?.name || ''}
            onClose={() => setDifficultySelection({ module: null, isOpen: false })}
            onSelect={(difficulty) => {
                if (difficultySelection.module) {
                    handleStartQuiz(difficultySelection.module, difficulty);
                }
            }}
        />

        {!location && <LocationPrompt onRequest={requestLocation} loading={loading} error={error} />}
        
        <h2 className="text-3xl font-bold text-white mb-6">Preparedness Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasterModules.map((module, index) => {
                const isLocked = module.isLocationBased && (!location || module.requiredRegion !== 'coastal'); // Mock logic
                const moduleCompletedDifficulties = completedDifficulties[module.id] || [];
                const moduleProgress = (moduleCompletedDifficulties.length / 3) * 100;
                const isCompleted = moduleCompletedDifficulties.length === 3;
                const Icon = module.icon;
                return (
                    <div 
                        key={module.id} 
                        id={index === 0 ? 'tutorial-first-module' : undefined}
                        className={`bg-slate-800 rounded-2xl p-6 flex flex-col transition-all duration-300 border ${isCompleted ? 'border-green-500/50' : 'border-slate-700'} ${isLocked ? 'opacity-50' : 'hover:border-cyan-500 hover:shadow-cyan-500/10 hover:shadow-lg hover:-translate-y-1'}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className='flex items-center space-x-4'>
                              <div className="p-3 bg-slate-700 rounded-lg">
                                  <Icon className="h-8 w-8 text-cyan-400" />
                              </div>
                              <h3 className="text-xl font-bold text-white">{module.name}</h3>
                            </div>
                            {isCompleted ? (
                                <div className="text-xs font-bold text-green-400 bg-green-900/50 px-2 py-1 rounded-full">COMPLETED</div>
                            ) : (
                                <ProgressCircle percentage={moduleProgress} />
                            )}
                        </div>
                        <p className="text-slate-400 flex-grow mb-4">{module.description}</p>
                        <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
                           <button
                                onClick={() => handleViewInfo(module)}
                                disabled={isLocked}
                                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                           >
                                Learn More
                           </button>
                           <button 
                                onClick={() => openDifficultyModal(module)}
                                disabled={isLocked} 
                                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                           >
                               {isLocked && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002 2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>}
                               <span>{isLocked ? 'Region Locked' : 'Start Quiz'}</span>
                           </button>
                       </div>
                    </div>
                )
            })}
        </div>
        <SOSButton onClick={() => setIsSosConfirmOpen(true)} />
        <EmergencyFAB />
    </div>
  );
};


// =================================================================================
// ADMIN VIEW COMPONENT
// =================================================================================
const PIE_CHART_COLORS = ['#06b6d4', '#f59e0b', '#ef4444'];
const MOCK_PIE_DATA = [
  { name: 'Completed', value: 400 },
  { name: 'In Progress', value: 300 },
  { name: 'Not Started', value: 300 },
];

interface AdminViewProps {
    classData: ClassData[];
    disasterModules: DisasterModule[];
    onModuleStatusChange: (moduleId: string, newStatus: ModuleStatus) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ classData, disasterModules, onModuleStatusChange }) => {
    
    const getStatusColor = (status: ModuleStatus) => {
        switch (status) {
            case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Inactive': return 'bg-slate-600/50 text-slate-400 border-slate-600/80';
            case 'Under Maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-slate-700';
        }
    };
    
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-3xl font-bold text-white mb-8">Administrator Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-xl font-bold mb-4">Class Preparedness Scores</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={classData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip cursor={{fill: 'rgba(100,116,139,0.2)'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }} />
                            <Legend />
                            <Bar dataKey="preparednessScore" fill="#06b6d4" name="Preparedness Score (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-xl font-bold mb-4">Overall Module Completion</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={MOCK_PIE_DATA}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`}
                            >
                                {MOCK_PIE_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="lg:col-span-3 bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-xl font-bold mb-4">Detailed Class Statistics</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-600 text-slate-400">
                                <tr>
                                    <th className="p-3">Class / Group</th>
                                    <th className="p-3">Preparedness Score</th>
                                    <th className="p-3">Module Completion</th>
                                    <th className="p-3">Drill Participation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classData.map((item: ClassData) => (
                                    <tr key={item.name} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="p-3 font-medium">{item.name}</td>
                                        <td className="p-3 text-cyan-400">{item.preparednessScore}%</td>
                                        <td className="p-3 text-green-400">{item.moduleCompletion}%</td>
                                        <td className="p-3 text-yellow-400">{item.drillParticipation}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="lg:col-span-3 bg-slate-800 p-6 rounded-2xl border border-slate-700">
                    <h3 className="text-xl font-bold mb-4">Module Management</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-600 text-slate-400">
                                <tr>
                                    <th className="p-3">Module Name</th>
                                    <th className="p-3">Current Status</th>
                                    <th className="p-3">Change Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {disasterModules.map((module: DisasterModule) => (
                                    <tr key={module.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                        <td className="p-3 font-medium">{module.name}</td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(module.status)}`}>
                                                {module.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                             <select 
                                                value={module.status} 
                                                onChange={(e) => onModuleStatusChange(module.id, e.target.value as ModuleStatus)}
                                                className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                             >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Under Maintenance">Under Maintenance</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


// =================================================================================
// MAIN APP COMPONENT
// =================================================================================
const App: React.FC = () => {
  const [role, setRole] = useState<Role>(null);
  const [authView, setAuthView] = useState<'initial' | 'login' | 'signup' | 'adminLogin' | null>(null);
  const [authError, setAuthError] = useState('');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [classData, setClassData] = useState<ClassData[]>(ADMIN_DASHBOARD_DATA);
  const [disasterModules, setDisasterModules] = useState<DisasterModule[]>(INITIAL_DISASTER_MODULES);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { location, requestLocation } = useLocation();
  
  const getUserDatabase = (): Record<string, StudentProfile> => {
      try {
        const db = localStorage.getItem('userDatabase');
        return db ? JSON.parse(db) : {};
      } catch (e) {
        return {};
      }
  };

  useEffect(() => {
    try {
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      if (currentUserEmail) {
          const userDatabase = getUserDatabase();
          const profile = userDatabase[currentUserEmail];
          if (profile) {
              setStudentProfile(profile);
              setRole('student');
          } else {
              setAuthView('initial');
          }
      } else {
        setAuthView('initial');
      }
    } catch (error) {
      console.error("Failed to parse student profile from local storage", error);
      localStorage.removeItem('currentUserEmail');
      setAuthView('initial');
    }
  }, []);

  const updateStudentProfileAndSave = (profileToUpdate: StudentProfile) => {
    setStudentProfile(profileToUpdate);
    const userDatabase = getUserDatabase();
    userDatabase[profileToUpdate.details.email] = profileToUpdate;
    localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
  };
  
  const handleSignUp = (details: Omit<StudentData, 'emergencyContacts'>) => {
    const userDatabase = getUserDatabase();
    if(userDatabase[details.email]) {
        setAuthError('An account with this email already exists.');
        return;
    }
    const newProfile: StudentProfile = {
      details: {
        ...details,
        emergencyContacts: [], // Initialize with empty contacts
      },
      completedDifficulties: {},
      moduleScores: {},
      moduleStars: {},
      earnedBadges: [],
      hasSeenTutorial: false,
    };
    updateStudentProfileAndSave(newProfile);
    localStorage.setItem('currentUserEmail', details.email);
    setRole('student');
    setAuthView(null);
    setIsTutorialOpen(true);
  };

  const handleLogin = (credentials: {email: string, password: string}) => {
    const userDatabase = getUserDatabase();
    const profile = userDatabase[credentials.email];
    if (profile && profile.details.password === credentials.password) {
        setStudentProfile(profile);
        localStorage.setItem('currentUserEmail', credentials.email);
        setRole('student');
        setAuthView(null);
        setAuthError('');
        if (!profile.hasSeenTutorial) {
            setIsTutorialOpen(true);
        }
    } else {
        setAuthError('Invalid email or password.');
    }
  };
  
  const handleAdminLogin = (credentials: {email: string, password: string}) => {
    // In a real application, this would be a secure API call.
    // For this simulation, we use hardcoded credentials.
    if (credentials.email === 'lilmeow@gmail.com' && credentials.password === 'lilmeow') {
        setRole('admin');
        setAuthView(null);
        setAuthError('');
    } else {
        setAuthError('Invalid admin credentials.');
    }
  };


  const handleLogout = () => {
    setRole(null);
    setStudentProfile(null);
    localStorage.removeItem('currentUserEmail');
    setAuthView('initial');
  };
  
  const handleProfileUpdate = async (updatedDetails: Partial<StudentData>, passwordData: { current: string; new: string; }): Promise<string | null> => {
    if (!studentProfile) return "No user is logged in.";

    if (passwordData.new || passwordData.current) {
        if (passwordData.current !== studentProfile.details.password) {
            return "Current password does not match.";
        }
        if (!passwordData.new) {
            return "New password cannot be empty.";
        }
    }

    const newDetails: StudentData = {
        ...studentProfile.details,
        ...updatedDetails,
    };
    
    if (passwordData.new) {
        newDetails.password = passwordData.new;
    }

    const newProfile: StudentProfile = {
        ...studentProfile,
        details: newDetails,
    };

    updateStudentProfileAndSave(newProfile);
    return null;
  };
  
  const handleFinishTutorial = () => {
    if (studentProfile) {
        const updatedProfile = { ...studentProfile, hasSeenTutorial: true };
        updateStudentProfileAndSave(updatedProfile);
    }
    setIsTutorialOpen(false);
  };

  const handleSendSOS = () => {
    if (!studentProfile || !studentProfile.details.emergencyContacts || studentProfile.details.emergencyContacts.length === 0) {
      alert("No emergency contacts found. Please add contacts in your profile settings first.");
      return;
    }

    if (!location) {
      alert("Could not get your location. Please ensure location services are enabled and try again.");
      requestLocation();
      return;
    }

    const contacts = studentProfile.details.emergencyContacts.map(c => c.phone).join(',');
    const message = `EMERGENCY! This is an SOS alert from ${studentProfile.details.name}. I am in need of immediate assistance. My current location is: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    
    const smsLink = `sms:${contacts}?body=${encodeURIComponent(message)}`;
    
    // This will attempt to open the user's default messaging app
    window.location.href = smsLink;
    alert("Your messaging app should now be open with a pre-filled SOS message. Please confirm and send.");
  };

  const checkAndAwardBadges = (profile: StudentProfile, moduleId: string, score: number): string[] => {
      const newlyEarned: string[] = [];
      const totalQuestions = 5; // Assuming 5 questions per quiz
      const percentage = (score / totalQuestions) * 100;
      const totalCompletedDifficulties = Object.values(profile.completedDifficulties).flat().length;

      const badgeChecks: Record<string, () => boolean> = {
        'first-step': () => totalCompletedDifficulties === 1,
        'high-scorer': () => percentage >= 80,
        'perfect-score': () => percentage === 100,
        'fire-certified': () => (profile.completedDifficulties['fire-safety']?.length ?? 0) === 3,
        'earthquake-expert': () => (profile.completedDifficulties['earthquake']?.length ?? 0) === 3,
        'flood-ready': () => (profile.completedDifficulties['flood']?.length ?? 0) === 3,
        'hurricane-hero': () => (profile.completedDifficulties['hurricane-drill']?.length ?? 0) === 3,
        'preparedness-pro': () => disasterModules.every(m => (profile.completedDifficulties[m.id]?.length ?? 0) === 3),
      };

      for (const badge of BADGES) {
        if (!profile.earnedBadges.includes(badge.id)) {
          if (badgeChecks[badge.id] && badgeChecks[badge.id]()) {
            newlyEarned.push(badge.id);
          }
        }
      }
      return newlyEarned;
  };
  
  const handleModuleStatusChange = (moduleId: string, newStatus: ModuleStatus) => {
    setDisasterModules(currentModules =>
        currentModules.map(module =>
            module.id === moduleId ? { ...module, status: newStatus } : module
        )
    );
  };

  const handleQuizComplete = (moduleId: string, score: number, difficulty: Difficulty, stars: number) => {
    if (!studentProfile) return;

    const currentDifficulties = studentProfile.completedDifficulties[moduleId] || [];
    const isNewCompletion = !currentDifficulties.includes(difficulty);
    const scorePercentage = Math.round((score / 5) * 100);

    let updatedProfile: StudentProfile = {
      ...studentProfile,
      completedDifficulties: {
        ...studentProfile.completedDifficulties,
        [moduleId]: isNewCompletion
          ? [...new Set([...currentDifficulties, difficulty])]
          : currentDifficulties,
      },
      moduleScores: {
        ...studentProfile.moduleScores,
        [moduleId]: {
          ...studentProfile.moduleScores[moduleId],
          [difficulty]: scorePercentage,
        },
      },
      moduleStars: {
        ...studentProfile.moduleStars,
        [moduleId]: {
          ...studentProfile.moduleStars?.[moduleId],
          [difficulty]: stars,
        },
      },
    };
    
    const newBadges = checkAndAwardBadges(updatedProfile, moduleId, score);
    if (newBadges.length > 0) {
        updatedProfile = {
            ...updatedProfile,
            earnedBadges: [...new Set([...updatedProfile.earnedBadges, ...newBadges])],
        };
    }

    updateStudentProfileAndSave(updatedProfile);
    
    if (isNewCompletion) {
        // For simulation, assume student is in 'CSE A' and update admin stats
        const studentClassName = 'CSE A';
        setClassData(prevData =>
          prevData.map(classItem => {
            if (classItem.name === studentClassName) {
              const newParticipation = Math.min(100, classItem.drillParticipation + 2); // Smaller increment
              const newModuleCompletion = Math.min(100, classItem.moduleCompletion + 2);
              const newPreparednessScore = Math.round((newModuleCompletion + newParticipation) / 2);
              return { ...classItem, drillParticipation: newParticipation, moduleCompletion: newModuleCompletion, preparednessScore: newPreparednessScore };
            }
            return classItem;
          })
        );
    }
  };

  if (!role && authView) {
      const handleAuthViewChange = (view: 'login' | 'signup' | 'adminLogin') => {
        setAuthError('');
        setAuthView(view);
      };
      
      const handleBack = () => {
          setAuthError('');
          setAuthView('initial');
      };

      if (authView === 'login') return <StudentLoginView onLogin={handleLogin} onBack={handleBack} error={authError}/>;
      if (authView === 'signup') return <StudentSignUpView onSignUp={handleSignUp} onBack={handleBack} error={authError}/>;
      if (authView === 'adminLogin') return <AdminLoginView onLogin={handleAdminLogin} onBack={handleBack} error={authError} />;
      return <InitialAuthView onSetView={handleAuthViewChange} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header
        role={role}
        onLogout={handleLogout}
        notificationCount={notifications.length}
        studentProfile={studentProfile}
        onProfileClick={() => setIsDashboardOpen(true)}
      />
      <main>
        {role === 'student' && studentProfile && (
          <>
             <TutorialWalkthrough isOpen={isTutorialOpen} onFinish={handleFinishTutorial} />
            <PersonalDashboard 
              isOpen={isDashboardOpen} 
              onClose={() => setIsDashboardOpen(false)} 
              studentProfile={studentProfile} 
              disasterModules={disasterModules.filter(m => m.status === 'Active')}
              onEditProfileClick={() => {
                setIsDashboardOpen(false);
                setIsEditProfileOpen(true);
              }}
            />
             <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                studentProfile={studentProfile}
                onSave={handleProfileUpdate}
             />
            <StudentView
              setNotifications={setNotifications}
              onQuizComplete={handleQuizComplete}
              studentProfile={studentProfile}
              onSendSOS={handleSendSOS}
              disasterModules={disasterModules.filter(m => m.status === 'Active')}
            />
          </>
        )}
        {role === 'admin' && <AdminView classData={classData} disasterModules={disasterModules} onModuleStatusChange={handleModuleStatusChange}/>}
      </main>
    </div>
  );
};

export default App;
