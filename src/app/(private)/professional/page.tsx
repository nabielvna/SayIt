"use client";

import { Header } from "@/components/dynamic-header";
import Link from "next/link";
import { useState } from "react";
import {
  IconArrowLeft,
  IconSearch,
  IconCalendar,
  IconStar,
  IconFilter,
  IconClock,
  IconMapPin,
  IconUserHeart,
  IconBriefcase,
  IconCertificate,
  IconMessageCircle2
} from "@tabler/icons-react";

// Define types
interface Professional {
  id: string;
  name: string;
  title: string;
  specialization: string;
  rating: number;
  reviews: number;
  availability: string;
  image: string;
  location: string;
  experience: string;
  price: string;
  certifications: string[];
  languages: string[];
  nextAvailable: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DateOption {
  date: Date;
  display: string;
  dayName: string;
  dayNumber: number;
}

// Sample professional consultants data
const professionals: Professional[] = [
  {
    id: "prof-1",
    name: "Dr. Rahma Wijaya",
    title: "Clinical Psychologist",
    specialization: "Anxiety & Depression",
    rating: 4.9,
    reviews: 128,
    availability: "Available Today",
    image: "/professionals/rahma.jpg",
    location: "Jakarta, Indonesia",
    experience: "10+ years",
    price: "$80/session",
    certifications: ["Licensed Clinical Psychologist", "CBT Certified"],
    languages: ["English", "Indonesian"],
    nextAvailable: "Today, 4:30 PM"
  },
  {
    id: "prof-2",
    name: "Sarah Johnson, LMFT",
    title: "Marriage & Family Therapist",
    specialization: "Relationships & Couples Therapy",
    rating: 4.8,
    reviews: 97,
    availability: "Tomorrow",
    image: "/professionals/sarah.jpg",
    location: "Remote Only",
    experience: "8 years",
    price: "$95/session",
    certifications: ["Licensed Marriage & Family Therapist"],
    languages: ["English"],
    nextAvailable: "Tomorrow, 10:00 AM"
  },
  {
    id: "prof-3",
    name: "Dr. Michael Chen",
    title: "Psychiatrist",
    specialization: "Medication Management",
    rating: 4.7,
    reviews: 156,
    availability: "Available Today",
    image: "/professionals/michael.jpg",
    location: "Singapore",
    experience: "15 years",
    price: "$120/session",
    certifications: ["Board Certified Psychiatrist"],
    languages: ["English", "Mandarin"],
    nextAvailable: "Today, 5:15 PM"
  },
  {
    id: "prof-4",
    name: "Aisha Patel, LCSW",
    title: "Clinical Social Worker",
    specialization: "Trauma & PTSD",
    rating: 4.9,
    reviews: 84,
    availability: "Next Week",
    image: "/professionals/aisha.jpg",
    location: "Remote Only",
    experience: "12 years",
    price: "$85/session",
    certifications: ["Licensed Clinical Social Worker", "EMDR Certified"],
    languages: ["English", "Hindi"],
    nextAvailable: "Mon, Apr 28, 11:30 AM"
  },
  {
    id: "prof-5",
    name: "James Wilson, Ph.D.",
    title: "Organizational Psychologist",
    specialization: "Career Counseling",
    rating: 4.6,
    reviews: 72,
    availability: "Tomorrow",
    image: "/professionals/james.jpg",
    location: "Melbourne, Australia",
    experience: "9 years",
    price: "$90/session",
    certifications: ["Certified Career Coach", "Ph.D. Organizational Psychology"],
    languages: ["English"],
    nextAvailable: "Tomorrow, 3:00 PM"
  },
  {
    id: "prof-6",
    name: "Dr. Lisa Nguyen",
    title: "Child Psychologist",
    specialization: "Child Development & Behavior",
    rating: 4.8,
    reviews: 110,
    availability: "Available Today",
    image: "/professionals/lisa.jpg",
    location: "Hanoi, Vietnam",
    experience: "11 years",
    price: "$75/session",
    certifications: ["Child Psychology Specialist", "Play Therapy Certified"],
    languages: ["English", "Vietnamese"],
    nextAvailable: "Today, 6:00 PM"
  }
];

// Available times for the selected date (sample data)
const availableTimes: TimeSlot[] = [
  { time: "9:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "12:00 PM", available: false },
  { time: "1:30 PM", available: true },
  { time: "3:00 PM", available: true },
  { time: "4:30 PM", available: true },
  { time: "6:00 PM", available: false }
];

// Specialization filter options
const specializationOptions: string[] = [
  "All Specializations",
  "Anxiety & Depression",
  "Relationships & Couples Therapy",
  "Trauma & PTSD",
  "Medication Management",
  "Career Counseling",
  "Child Development & Behavior"
];

export default function ProfessionalPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("All Specializations");
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  
  // Filter professionals based on search query and specialization
  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = 
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prof.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialization = 
      specialization === "All Specializations" || 
      prof.specialization === specialization;
    
    return matchesSearch && matchesSpecialization;
  });

  // Generate dates for the next 7 days
  const getNextDays = (): DateOption[] => {
    const days: DateOption[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      
      days.push({
        date: date,
        display: `${day}, ${dayNum} ${month}`,
        dayName: day,
        dayNumber: dayNum
      });
    }
    
    return days;
  };
  
  const nextDays = getNextDays();

  // Handle professional selection
  const handleSelectProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowScheduleModal(true);
    setSelectedDate(nextDays[0]);
  };
  
  // Handle appointment scheduling
  const handleScheduleAppointment = () => {
    if (selectedDate && selectedTime) {
      setShowScheduleModal(false);
      setShowConfirmationModal(true);
    }
  };
  
  // Handle modal close
  const handleCloseModal = () => {
    setShowScheduleModal(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };
  
  // Handle confirmation
  const handleConfirmAppointment = () => {
    setShowConfirmationModal(false);
    // Here you would typically save the appointment to your backend
  };

  return (
    <div className="min-h-[calc(100vh-var(--header-height)-18px)]">
      <Header>
        Professional Consultation
      </Header>

      <main className="w-full max-w-6xl mx-auto px-6 py-8">
        {/* Header area */}
        <div className="flex flex-col space-y-4 mb-8">
          {/* Top row with back button and title */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-zinc-200 text-zinc-900 hover:text-zinc-600 transition-colors mr-4 shrink-0">
              <IconArrowLeft className="w-5 h-5" />
            </Link>
            
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 truncate">
                Talk to a Professional
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Schedule consultations with licensed experts
              </p>
            </div>
          </div>

          {/* Bottom row with search and filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IconSearch className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Search professionals by name or specialization..."
                className="w-full py-2.5 pl-10 pr-4 rounded-lg border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial w-full sm:w-auto">
                <div className="flex items-center">
                  <IconFilter className="w-4 h-4 text-zinc-500 absolute left-3" />
                  <select
                    className="appearance-none bg-white border border-zinc-200 pl-9 pr-8 py-2.5 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-zinc-800 w-full"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  >
                    {specializationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professionals listing */}
        {filteredProfessionals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-zinc-200 text-center">
            <IconUserHeart className="w-16 h-16 text-zinc-300 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-zinc-900">No professionals found</h3>
            <p className="text-sm text-zinc-500 max-w-md mb-4">
              {searchQuery || specialization !== "All Specializations" 
                ? "Try adjusting your search filters or try a different keyword" 
                : "There are currently no professionals available"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProfessionals.map((professional) => (
              <div 
                key={professional.id}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="p-5">
                  <div className="flex items-start">
                    {/* Profile image/avatar placeholder */}
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-emerald-200">
                        <IconUserHeart className="w-8 h-8" />
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-zinc-900">
                            {professional.name}
                          </h3>
                          <p className="text-sm text-zinc-600">
                            {professional.title}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-md">
                          <IconStar className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-medium">{professional.rating}</span>
                          <span className="text-xs text-zinc-500">({professional.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center text-xs text-zinc-600">
                        <div className="flex items-center mr-3">
                          <IconBriefcase className="w-3.5 h-3.5 mr-1" />
                          <span>{professional.experience}</span>
                        </div>
                        <div className="flex items-center">
                          <IconMapPin className="w-3.5 h-3.5 mr-1" />
                          <span>{professional.location}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {professional.specialization}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800">
                          {professional.price}
                        </span>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center text-xs text-emerald-700">
                          <IconClock className="w-3.5 h-3.5 mr-1" />
                          <span>Next: {professional.nextAvailable}</span>
                        </div>
                        
                        <button
                          onClick={() => handleSelectProfessional(professional)}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-medium transition-colors"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Schedule Modal */}
      {showScheduleModal && selectedProfessional && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900">
                  Schedule Appointment
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Professional summary */}
            <div className="p-6 border-b border-zinc-100">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-emerald-200">
                  <IconUserHeart className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{selectedProfessional.name}</h3>
                  <p className="text-sm text-zinc-600">{selectedProfessional.title} • {selectedProfessional.specialization}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-zinc-500 mb-1">
                    <IconCertificate className="w-4 h-4 mr-2" />
                    <span>Certifications</span>
                  </div>
                  <ul className="text-xs text-zinc-700">
                    {selectedProfessional.certifications.map((cert, idx) => (
                      <li key={idx} className="mb-0.5">{cert}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-zinc-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-zinc-500 mb-1">
                    <IconMessageCircle2 className="w-4 h-4 mr-2" />
                    <span>Languages</span>
                  </div>
                  <div className="text-xs text-zinc-700">
                    {selectedProfessional.languages.join(", ")}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Date selection */}
            <div className="p-6 border-b border-zinc-100">
              <h3 className="text-sm font-medium text-zinc-700 mb-3">
                Select Date
              </h3>
              <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                {nextDays.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`flex flex-col items-center justify-center min-w-[75px] py-3 px-2 rounded-lg border ${
                      selectedDate && selectedDate.date.toDateString() === day.date.toDateString()
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <span className="text-xs font-medium">{day.dayName}</span>
                    <span className="text-lg font-semibold mt-1">{day.dayNumber}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time selection */}
            <div className="p-6 border-b border-zinc-100">
              <h3 className="text-sm font-medium text-zinc-700 mb-3">
                Select Time
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableTimes.map((slot, idx) => (
                  <button
                    key={idx}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2 px-3 rounded-lg border text-sm ${
                      !slot.available
                        ? 'border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : selectedTime === slot.time
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Footer with actions */}
            <div className="p-6 flex items-center justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleAppointment}
                disabled={!selectedDate || !selectedTime}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                  !selectedDate || !selectedTime
                    ? 'bg-emerald-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmationModal && selectedProfessional && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <IconCalendar className="w-8 h-8" />
              </div>
              
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                Appointment Scheduled!
              </h2>
              
              <p className="text-zinc-600 mb-4">
                Your appointment with <span className="font-medium">{selectedProfessional.name}</span> has been successfully scheduled for <span className="font-medium">{selectedDate.display} at {selectedTime}</span>.
              </p>
              
              <div className="bg-emerald-50 rounded-lg p-4 text-left mb-6">
                <div className="flex items-start">
                  <IconUserHeart className="w-5 h-5 text-emerald-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">
                      {selectedProfessional.name}
                    </p>
                    <p className="text-xs text-emerald-700">
                      {selectedProfessional.title} • {selectedProfessional.specialization}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-emerald-700">
                      <IconCalendar className="w-3.5 h-3.5 mr-1" />
                      <span>{selectedDate.display}, {selectedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleConfirmAppointment}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm"
                >
                  Return to Dashboard
                </button>
                
                <Link
                  href="/professional/appointments"
                  className="flex-1 px-4 py-2.5 border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium rounded-lg text-sm text-center"
                >
                  View All Appointments
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}