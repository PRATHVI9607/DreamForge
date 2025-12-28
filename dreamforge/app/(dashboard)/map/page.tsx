"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const stations = [
    { id: 'intern', x: 100, y: 500, label: 'Junior Dev', type: 'tech' },
    { id: 'mid', x: 300, y: 400, label: 'Mid-Level', type: 'tech' },
    { id: 'senior', x: 500, y: 300, label: 'Senior Eng', type: 'tech' },
    { id: 'lead', x: 700, y: 300, label: 'Tech Lead', type: 'tech' },
    { id: 'principal', x: 900, y: 200, label: 'Principal', type: 'tech' },
    { id: 'architect', x: 1100, y: 100, label: 'Architect', type: 'tech' },

    { id: 'manager', x: 500, y: 500, label: 'Eng Manager', type: 'mgmt' },
    { id: 'director', x: 700, y: 600, label: 'Director', type: 'mgmt' },
    { id: 'vp', x: 900, y: 600, label: 'VP of Eng', type: 'mgmt' },
];

const connections = [
    { from: 'intern', to: 'mid', color: '#0ea5e9' }, // Sky
    { from: 'mid', to: 'senior', color: '#0ea5e9' },
    { from: 'senior', to: 'lead', color: '#0ea5e9' },
    { from: 'lead', to: 'principal', color: '#0ea5e9' },
    { from: 'principal', to: 'architect', color: '#0ea5e9' },

    // Management Track switch
    { from: 'mid', to: 'manager', color: '#a8a29e', dashed: true },
    { from: 'senior', to: 'manager', color: '#a8a29e', dashed: true },

    { from: 'manager', to: 'director', color: '#6366f1' }, // Indigo
    { from: 'director', to: 'vp', color: '#6366f1' },
];

export default function CareerMapPage() {
    const [selectedStation, setSelectedStation] = useState<string | null>(null);

    return (
        <div className="h-full w-full p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Career Metro Map</h1>
                    <p className="text-slate-500 mt-1">Navigate your professional journey. Switch lines to explore new paths.</p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-sky-500" />
                        <span>Technical Track</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500" />
                        <span>Management Track</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[700px] bg-white rounded-3xl border border-border shadow-sm relative overflow-hidden cursor-move">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

                <svg className="w-full h-full view-box">
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Connections */}
                    {connections.map((conn, i) => {
                        const start = stations.find(s => s.id === conn.from)!;
                        const end = stations.find(s => s.id === conn.to)!;
                        return (
                            <motion.line
                                key={i}
                                x1={start.x} y1={start.y}
                                x2={end.x} y2={end.y}
                                stroke={conn.color}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={conn.dashed ? "12 12" : "none"}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, delay: 0.2 }}
                                className="drop-shadow-sm"
                            />
                        );
                    })}

                    {/* Stations */}
                    {stations.map((station, i) => (
                        <g
                            key={station.id}
                            onClick={() => setSelectedStation(station.id)}
                            className="cursor-pointer group"
                        >
                            <motion.circle
                                cx={station.x} cy={station.y} r="16"
                                fill="white"
                                stroke={station.type === 'tech' ? '#0ea5e9' : '#6366f1'}
                                strokeWidth="5"
                                initial={{ scale: 0 }}
                                animate={{ scale: selectedStation === station.id ? 1.2 : 1 }}
                                transition={{ type: 'spring', delay: 1 + (i * 0.1) }}
                                className="group-hover:fill-slate-50 transition-colors"
                            />
                            {/* Inner Dot */}
                            {selectedStation === station.id && (
                                <motion.circle
                                    layoutId="selected-dot"
                                    cx={station.x} cy={station.y} r="8"
                                    fill={station.type === 'tech' ? '#0ea5e9' : '#6366f1'}
                                />
                            )}

                            <text x={station.x} y={station.y + 40} textAnchor="middle" className="text-xs font-bold fill-slate-500 uppercase tracking-widest pointer-events-none select-none group-hover:fill-slate-900 transition-colors">
                                {station.label}
                            </text>
                        </g>
                    ))}

                    {/* You Are Here (Animated) */}
                    <g transform="translate(300, 400)"> {/* Positioned at Mid-Level */}
                        <motion.circle
                            r="30"
                            fill={stations[1].type === 'tech' ? '#0ea5e9' : '#6366f1'}
                            opacity="0.2"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <circle r="6" fill="white" />
                        <circle r="4" fill={stations[1].type === 'tech' ? '#0ea5e9' : '#6366f1'} />

                        <foreignObject x="-40" y="-50" width="80" height="30">
                            <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md text-center font-bold shadow-lg">
                                YOU
                            </div>
                        </foreignObject>
                    </g>
                </svg>

                {/* Info Panel Overlay */}
                {selectedStation && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute top-6 right-6 w-80 bg-white/90 backdrop-blur-md border border-border shadow-xl rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {stations.find(s => s.id === selectedStation)?.label}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Typical Salary: $120k - $160k
                        </p>
                        <div className="space-y-3">
                            <div className="text-xs font-semibold text-slate-400 uppercase">Required Skills</div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-sky-50 text-sky-600 rounded-md text-xs font-bold">React</span>
                                <span className="px-2 py-1 bg-sky-50 text-sky-600 rounded-md text-xs font-bold">System Design</span>
                                <span className="px-2 py-1 bg-sky-50 text-sky-600 rounded-md text-xs font-bold">Mentorship</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                            Set as Target
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
