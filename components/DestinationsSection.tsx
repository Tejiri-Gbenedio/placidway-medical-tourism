"use client";

import { MapPin, MessageSquare } from "lucide-react";

interface DestinationsSectionProps {
  onSelectDestination?: (dest: string) => void;
}

const DESTINATIONS = [
  {
    country: "Mexico",
    cities: "Tijuana, Cancun, Los Algodones, Guadalajara",
    specialties: "Alternative Oncology (ITC), Dental Implants, Bariatrics, Plastic Surgery",
    savings: "65% - 75%",
    featured: "Top destination for North American patients seeking advanced therapies, top accreditations, and zero wait times.",
  },
  {
    country: "Turkey",
    cities: "Istanbul, Antalya, Izmir",
    specialties: "Hair Transplants, Cosmetic Surgery, Dental Veneers, Laser Eye Surgery",
    savings: "60% - 70%",
    featured: "Premier European hub for aesthetic transformations with all-inclusive hotel and transfer packages.",
  },
  {
    country: "Thailand",
    cities: "Bangkok, Phuket, Chiang Mai",
    specialties: "Integrative Wellness, Orthopedics, Cardiology, Executive Checkups",
    savings: "50% - 65%",
    featured: "World-renowned hospital hospitality with internationally JCI-accredited healthcare campuses.",
  },
  {
    country: "Costa Rica",
    cities: "San Jose, Escazu",
    specialties: "Full Mouth Dental Rehabilitation, Stem Cells, General Surgery",
    savings: "55% - 65%",
    featured: "Eco-recovery setting with board-certified physicians trained at leading US medical centers.",
  },
];

export function DestinationsSection({ onSelectDestination }: DestinationsSectionProps) {
  return (
    <section id="destinations" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold text-coral uppercase tracking-wider">
          Top Medical Travel Destinations
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1E2E48] tracking-tight">
          Where Patients Travel for High-Quality Care
        </h2>
        <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto leading-relaxed">
          Access internationally recognized clinics with certified standards, fluent English-speaking doctors, and dedicated recovery coordinators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DESTINATIONS.map((dest, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-surface border border-outline hover:border-coral-border shadow-soft flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xl text-[#1E2E48] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-coral shrink-0" />
                  <span>{dest.country}</span>
                </span>
                <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                  Save {dest.savings}
                </span>
              </div>

              <span className="text-xs text-ink-muted font-medium block">
                {dest.cities}
              </span>

              <p className="text-sm text-ink-muted mt-3 leading-relaxed">
                {dest.featured}
              </p>

              <div className="mt-4 pt-4 border-t border-outline text-xs text-[#1E2E48]">
                <strong className="block text-xs text-coral uppercase font-bold mb-1">
                  Top Procedures:
                </strong>
                <span className="line-clamp-2 leading-relaxed text-ink font-medium">
                  {dest.specialties}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
