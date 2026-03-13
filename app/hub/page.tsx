"use client";
import React, { useState } from 'react';
import { Search, Filter, TrendingUp, FileText, DollarSign, Wallet, PiggyBank, CreditCard, Clock, ChevronRight, BookOpen, Target, Award, BarChart, ArrowLeft, Play, CheckCircle, Circle, Download, Share2 } from 'lucide-react';

// Types
interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  progress: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: string;
}

interface LessonContent {
  id: number;
  type: 'video' | 'text' | 'quiz';
  title: string;
  duration: string;
  completed: boolean;
  content?: string;
}

// Main App Component
export default function FinancialLiteracyApp() {
  const [currentPage, setCurrentPage] = useState<'hub' | 'all-lessons' | 'lesson-detail'>('hub');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);

  const allLessonsData: Lesson[] = [
    {
      id: 1,
      title: 'Investing Basics',
      description: 'Learn the fundamentals of stock market investing and build wealth',
      duration: '45 min',
      progress: 60,
      icon: TrendingUp,
      iconColor: '#10b981',
      iconBg: '#dcfce7',
      category: 'Investing',
      level: 'Beginner',
      rating: 4.8,
      students: '12.4k'
    },
    {
      id: 2,
      title: 'Taxes for Students',
      description: 'Understanding tax deductions, filing basics, and saving money',
      duration: '35 min',
      progress: 30,
      icon: FileText,
      iconColor: '#14b8a6',
      iconBg: '#ccfbf1',
      category: 'Tax Planning',
      level: 'Beginner',
      rating: 4.6,
      students: '8.2k'
    },
    {
      id: 3,
      title: 'Credit Scores & Loans',
      description: 'How credit scores work and getting your first loan approved',
      duration: '40 min',
      progress: 0,
      icon: CreditCard,
      iconColor: '#f59e0b',
      iconBg: '#fef3c7',
      category: 'Credit',
      level: 'Beginner',
      rating: 4.7,
      students: '10.1k'
    },
    {
      id: 4,
      title: 'Budgeting 101',
      description: 'Create and stick to a monthly budget that actually works',
      duration: '30 min',
      progress: 100,
      icon: Wallet,
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
      category: 'Budgeting',
      level: 'Beginner',
      rating: 4.9,
      students: '15.3k'
    },
    {
      id: 5,
      title: 'Emergency Funds',
      description: 'Building a financial safety net for unexpected expenses',
      duration: '25 min',
      progress: 0,
      icon: PiggyBank,
      iconColor: '#ec4899',
      iconBg: '#fce7f3',
      category: 'Savings',
      level: 'Beginner',
      rating: 4.8,
      students: '9.7k'
    },
    {
      id: 6,
      title: 'Side Hustles',
      description: 'Smart ways to earn extra income while studying or working',
      duration: '50 min',
      progress: 20,
      icon: DollarSign,
      iconColor: '#3b82f6',
      iconBg: '#dbeafe',
      category: 'Income',
      level: 'Intermediate',
      rating: 4.5,
      students: '11.2k'
    },
    {
      id: 7,
      title: 'Advanced Investing Strategies',
      description: 'Options trading, derivatives, and portfolio optimization',
      duration: '60 min',
      progress: 0,
      icon: BarChart,
      iconColor: '#10b981',
      iconBg: '#dcfce7',
      category: 'Investing',
      level: 'Advanced',
      rating: 4.9,
      students: '5.8k'
    },
    {
      id: 8,
      title: 'Retirement Planning',
      description: 'Start planning for retirement early with smart strategies',
      duration: '45 min',
      progress: 0,
      icon: Target,
      iconColor: '#14b8a6',
      iconBg: '#ccfbf1',
      category: 'Savings',
      level: 'Intermediate',
      rating: 4.7,
      students: '7.9k'
    },
    {
      id: 9,
      title: 'Tax Optimization',
      description: 'Advanced tax strategies to minimize your tax burden legally',
      duration: '55 min',
      progress: 0,
      icon: FileText,
      iconColor: '#f59e0b',
      iconBg: '#fef3c7',
      category: 'Tax Planning',
      level: 'Advanced',
      rating: 4.6,
      students: '6.3k'
    },
    {
      id: 10,
      title: 'Real Estate Investing',
      description: 'Getting started with property investment and rental income',
      duration: '70 min',
      progress: 0,
      icon: TrendingUp,
      iconColor: '#8b5cf6',
      iconBg: '#ede9fe',
      category: 'Investing',
      level: 'Intermediate',
      rating: 4.8,
      students: '8.5k'
    },
    {
      id: 11,
      title: 'Cryptocurrency Basics',
      description: 'Understanding digital currencies and blockchain technology',
      duration: '40 min',
      progress: 0,
      icon: DollarSign,
      iconColor: '#ec4899',
      iconBg: '#fce7f3',
      category: 'Investing',
      level: 'Beginner',
      rating: 4.4,
      students: '13.1k'
    },
    {
      id: 12,
      title: 'Debt Management',
      description: 'Strategies to pay off debt and become financially free',
      duration: '35 min',
      progress: 0,
      icon: CreditCard,
      iconColor: '#3b82f6',
      iconBg: '#dbeafe',
      category: 'Credit',
      level: 'Intermediate',
      rating: 4.7,
      students: '9.4k'
    }
  ];

  const navigateToAllLessons = () => setCurrentPage('all-lessons');
  const navigateToHub = () => setCurrentPage('hub');
  const navigateToLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setCurrentPage('lesson-detail');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      {currentPage === 'hub' && (
        <HubPage 
          lessons={allLessonsData} 
          onNavigateToAllLessons={navigateToAllLessons}
          onNavigateToLesson={navigateToLesson}
        />
      )}
      {currentPage === 'all-lessons' && (
        <AllLessonsPage 
          lessons={allLessonsData}
          onNavigateToLesson={navigateToLesson}
          onNavigateBack={navigateToHub}
        />
      )}
      {currentPage === 'lesson-detail' && (
        <LessonDetailPage 
          lesson={allLessonsData.find(l => l.id === selectedLessonId)!}
          onNavigateBack={navigateToHub}
        />
      )}
    </>
  );
}

// Hub Page Component
function HubPage({ 
  lessons, 
  onNavigateToAllLessons,
  onNavigateToLesson 
}: { 
  lessons: Lesson[];
  onNavigateToAllLessons: () => void;
  onNavigateToLesson: (id: number) => void;
}) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const continueLearning = lessons.filter(l => l.progress > 0 && l.progress < 100).slice(0, 3);

  const LessonCard = ({ lesson, compact = false }: { lesson: Lesson; compact?: boolean }) => {
    const Icon = lesson.icon;
    const isHovered = hoveredCard === lesson.id;

    return (
      <div
        onMouseEnter={() => setHoveredCard(lesson.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => onNavigateToLesson(lesson.id)}
        className="bg-white rounded-2xl p-7 cursor-pointer transition-all duration-200 hover:shadow-2xl shadow-md border border-gray-100 hover:border-emerald-200 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-16 -mt-16"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200 group-hover:shadow-md"
              style={{ backgroundColor: lesson.iconBg }}
            >
              <Icon className="w-8 h-8" style={{ color: lesson.iconColor }} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              {lesson.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2.5 leading-tight group-hover:text-emerald-600 transition-colors duration-200">
            {lesson.title}
          </h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2">
            {lesson.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{lesson.duration}</span>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-gray-400 transition-all duration-200 ${
                isHovered ? 'translate-x-1 text-emerald-500' : ''
              }`}
            />
          </div>

          {compact && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600">Progress</span>
                <span className="text-emerald-600">{lesson.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${lesson.progress}%`,
                    background: `linear-gradient(90deg, ${lesson.iconColor}, ${lesson.iconColor}dd)`
                  }}
                />
              </div>
            </div>
          )}

          {!compact && (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${lesson.progress}%`,
                    background: `linear-gradient(90deg, ${lesson.iconColor}, ${lesson.iconColor}dd)`
                  }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-600 min-w-[45px] text-right">
                {lesson.progress}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
                  Financial Literacy Hub
                </h1>
              </div>
              <p className="text-lg text-gray-600 font-medium ml-15">
                Build your financial knowledge with expert-curated lessons
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Lessons</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{continueLearning.length}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(lessons.reduce((acc, l) => acc + l.progress, 0) / lessons.length)}%
                  </p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {continueLearning.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Continue Learning</h2>
              <button 
                onClick={onNavigateToAllLessons}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-emerald-50"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueLearning.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} compact={true} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">All Lessons</h2>
            <button 
              onClick={onNavigateToAllLessons}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse All Categories
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.slice(0, 6).map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// All Lessons Page Component
function AllLessonsPage({ 
  lessons,
  onNavigateToLesson,
  onNavigateBack
}: { 
  lessons: Lesson[];
  onNavigateToLesson: (id: number) => void;
  onNavigateBack: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const categories = ['All', 'Investing', 'Tax Planning', 'Credit', 'Budgeting', 'Savings', 'Income'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || lesson.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const LessonCard = ({ lesson }: { lesson: Lesson }) => {
    const Icon = lesson.icon;
    const isHovered = hoveredCard === lesson.id;

    return (
      <div
        onMouseEnter={() => setHoveredCard(lesson.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => onNavigateToLesson(lesson.id)}
        className="bg-white rounded-2xl p-7 cursor-pointer transition-all duration-200 hover:shadow-2xl shadow-md border border-gray-100 hover:border-emerald-200 group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-16 -mt-16"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-5">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200 group-hover:shadow-md"
              style={{ backgroundColor: lesson.iconBg }}
            >
              <Icon className="w-8 h-8" style={{ color: lesson.iconColor }} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                {lesson.category}
              </span>
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                {lesson.level}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2.5 leading-tight group-hover:text-emerald-600 transition-colors duration-200">
            {lesson.title}
          </h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed line-clamp-2">
            {lesson.description}
          </p>

          <div className="flex items-center justify-between mb-5 text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{lesson.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{lesson.rating}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-medium">{lesson.students} students</span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${lesson.progress}%`,
                  background: `linear-gradient(90deg, ${lesson.iconColor}, ${lesson.iconColor}dd)`
                }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-600 min-w-[45px] text-right">
              {lesson.progress}%
            </span>
          </div>

          <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg flex items-center justify-center gap-2 group-hover:shadow-xl">
            {lesson.progress > 0 ? 'Continue Learning' : 'Start Lesson'}
            <ChevronRight className={`w-5 h-5 transition-all duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 pt-24 pb-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Hub
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
              All Lessons
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-medium ml-15">
            Explore our complete library of financial education courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Lessons</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categories</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{lessons.filter(l => l.progress > 0).length}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{lessons.filter(l => l.progress === 100).length}</p>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition font-semibold text-gray-700"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition font-semibold text-gray-700"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedLevel !== 'All' && (
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Level: {selectedLevel}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="text-gray-600 hover:text-emerald-600 px-3 py-1 text-sm font-semibold underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600 font-semibold">
            Showing <span className="text-emerald-600">{filteredLessons.length}</span> of <span className="text-emerald-600">{lessons.length}</span> lessons
          </p>
        </div>

        {filteredLessons.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All');
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Lesson Detail Page Component
function LessonDetailPage({ 
  lesson,
  onNavigateBack
}: { 
  lesson: Lesson;
  onNavigateBack: () => void;
}) {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([0]);

  const sections: LessonContent[] = [
    {
      id: 1,
      type: 'video',
      title: 'Introduction to Investing',
      duration: '5 min',
      completed: true,
      content: 'Learn what investing is and why it matters for your financial future.'
    },
    {
      id: 2,
      type: 'text',
      title: 'Types of Investments',
      duration: '8 min',
      completed: true,
      content: 'Explore different investment vehicles: stocks, bonds, mutual funds, and ETFs.'
    },
    {
      id: 3,
      type: 'video',
      title: 'Risk vs. Return',
      duration: '6 min',
      completed: false,
      content: 'Understanding the relationship between investment risk and potential returns.'
    },
    {
      id: 4,
      type: 'text',
      title: 'Diversification Strategy',
      duration: '7 min',
      completed: false,
      content: 'Learn how to spread your investments to minimize risk.'
    },
    {
      id: 5,
      type: 'quiz',
      title: 'Knowledge Check',
      duration: '5 min',
      completed: false,
      content: 'Test your understanding of investing basics.'
    },
    {
      id: 6,
      type: 'video',
      title: 'Getting Started',
      duration: '10 min',
      completed: false,
      content: 'Step-by-step guide to making your first investment.'
    }
  ];

  const markComplete = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const currentContent = sections[currentSection];
  const progressPercentage = (completedSections.length / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 pt-20 pb-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onNavigateBack}
          className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-semibold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lessons
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    {lesson.category}
                  </span>
                  <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">
                    {lesson.title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {lesson.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold">{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold">{lesson.level}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold">{lesson.rating} ★ ({lesson.students} students)</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                  <span className="text-sm font-bold text-emerald-600">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {currentContent.type === 'video' ? (
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto hover:bg-emerald-600 transition cursor-pointer shadow-2xl">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <p className="text-white font-semibold text-lg">Play Video</p>
                  </div>
                </div>
              ) : currentContent.type === 'text' ? (
                <div className="p-8">
                  <div className="prose max-w-none">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentContent.title}</h2>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">{currentContent.content}</p>
                    
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-6">
                      <h3 className="font-bold text-emerald-900 mb-2">Key Takeaway</h3>
                      <p className="text-emerald-800">Understanding different investment types helps you make informed decisions about where to put your money.</p>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">Main Investment Types:</h3>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Stocks:</strong>
                          <span className="text-gray-700"> Ownership shares in companies that can grow in value over time</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Bonds:</strong>
                          <span className="text-gray-700"> Loans to companies or governments that pay regular interest</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">Mutual Funds:</strong>
                          <span className="text-gray-700"> Professionally managed pools of various investments</span>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                        <div>
                          <strong className="text-gray-900">ETFs:</strong>
                          <span className="text-gray-700"> Exchange-traded funds that track market indices</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Knowledge Check</h2>
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 cursor-pointer transition">
                      <p className="font-semibold text-gray-900">What is the main benefit of diversification?</p>
                    </div>
                    <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 cursor-pointer transition">
                      <p className="font-semibold text-gray-900">Which investment type typically offers the highest potential returns?</p>
                    </div>
                    <div className="p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 cursor-pointer transition">
                      <p className="font-semibold text-gray-900">What does ETF stand for?</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button 
                  onClick={() => currentSection > 0 && setCurrentSection(currentSection - 1)}
                  disabled={currentSection === 0}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  onClick={markComplete}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition shadow-lg flex items-center gap-2"
                >
                  {currentSection === sections.length - 1 ? 'Complete Lesson' : 'Mark Complete & Continue'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lesson Content</h3>
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    onClick={() => setCurrentSection(index)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      currentSection === index
                        ? 'bg-emerald-50 border-2 border-emerald-500'
                        : 'border-2 border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {completedSections.includes(index) ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm mb-1 ${
                          currentSection === index ? 'text-emerald-700' : 'text-gray-900'
                        }`}>
                          {section.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {section.type === 'video' && <Play className="w-3 h-3" />}
                          {section.type === 'text' && <BookOpen className="w-3 h-3" />}
                          {section.type === 'quiz' && <Award className="w-3 h-3" />}
                          <span>{section.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Resources
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}