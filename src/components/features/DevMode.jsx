"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
    Layers, CalendarDays, Smartphone, Globe,
    Zap, Database, Award, Activity, Cpu,
    Clock, MousePointerClick
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    commissionedProjects,
    schoolProjects,
    personalProjects,
    collaborationProjects,
    certificates
} from '@/data/portfolioData';

// Helper to parse dates
const parseDate = (dateStr) => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return new Date();
    return new Date(dateStr);
};

export default function DevMode() {

    // --- 1. Data Processing ---
    const {
        techData,
        allProjects,
        stats,
        androidStats,
        webStats,
        certStats,
        earliestDate,
        latestDate
    } = useMemo(() => {
        const _allProjects = [...commissionedProjects, ...schoolProjects, ...personalProjects, ...collaborationProjects];
        const allCerts = certificates || [];

        let androidProjects = [];
        let webProjects = [];
        const androidKeywords = new Set(['Java', 'Kotlin', 'XML', 'Jetpack Compose', 'Room DB', 'Android']);

        // 1. Flatten & Extract
        const projectRanges = _allProjects.map(p => {
            const firstDateStr = p.versions[0].date.split(' - ')[0];
            const lastDateStr = p.versions[p.versions.length - 1].date.split(' - ')[1] || firstDateStr;

            const start = parseDate(firstDateStr).getTime();
            const end = parseDate(lastDateStr).getTime();

            const latestTools = p.versions[p.versions.length - 1].tools;
            const isAndroid = latestTools.some(tool => androidKeywords.has(tool));
            if (isAndroid) androidProjects.push(p);
            else webProjects.push(p);

            return { ...p, startTime: start, endTime: end };
        });

        // 2. Tech Stats
        const globalTechCounts = {};
        _allProjects.forEach(p => p.versions.forEach(v => v.tools.forEach(t => globalTechCounts[t] = (globalTechCounts[t] || 0) + 1)));

        const processedTechData = Object.keys(globalTechCounts)
            .map(tool => ({ name: tool, count: globalTechCounts[tool] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        // 3. Dates
        const allStartDates = projectRanges.map(p => p.startTime);
        // Default to a reasonable start date if array is empty
        const minTime = allStartDates.length > 0 ? Math.min(...allStartDates) : new Date('2023-01-01').getTime();
        const maxTime = new Date().getTime();

        return {
            techData: processedTechData,
            allProjects: projectRanges,
            earliestDate: minTime,
            latestDate: maxTime,
            stats: {
                totalProjects: _allProjects.length,
                uniqueTech: Object.keys(globalTechCounts).length,
                yearsActive: new Date().getFullYear() - new Date(minTime).getFullYear() + 1
            },
            androidStats: {
                count: androidProjects.length,
                percent: _allProjects.length ? Math.round((androidProjects.length / _allProjects.length) * 100) : 0,
                topTool: "Kotlin" // Placeholder fallback
            },
            webStats: {
                count: webProjects.length,
                percent: _allProjects.length ? Math.round((webProjects.length / _allProjects.length) * 100) : 0,
                topTool: "React" // Placeholder fallback
            },
            certStats: {
                count: allCerts.length,
                topIssuer: "DataCamp" // Placeholder fallback
            }
        };
    }, []);

    return (
        <div className="container mx-auto space-y-8 p-4 md:p-0">

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight">Engineering Metrics</h2>
                    </div>
                    <p className="text-muted-foreground text-sm max-w-lg">
                        A data-driven view of my development history, stack preferences, and professional growth.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        System Online
                    </div>
                </div>
            </div>

            {/* --- KPI Cards --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Deployed Projects" value={stats.totalProjects} icon={Layers} trend="Production Ready" />
                <KPICard title="Total Certifications" value={certStats.count} icon={Award} trend="Continuous Learning" />
                <KPICard title="Tech Stack Size" value={stats.uniqueTech} icon={Cpu} trend="Tools & Libraries" />
                <KPICard title="Years Active" value={`${stats.yearsActive}+`} icon={CalendarDays} trend="Since 2023" />
            </div>

            <div className="grid gap-8 md:grid-cols-12">

                {/* --- Left Col: Focus & Timeline --- */}
                <div className="md:col-span-7 flex flex-col gap-6">
                    {/* Focus Distribution */}
                    <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold mb-5 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500" /> Development Focus
                        </h3>
                        <div className="space-y-6">
                            {/* Android Row */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="flex items-center gap-1.5"><Smartphone size={14}/> Android / Mobile</span>
                                    <span className="text-muted-foreground">{androidStats.count} Projects ({androidStats.percent}%)</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${androidStats.percent}%` }} />
                                </div>
                            </div>
                            {/* Web Row */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="flex items-center gap-1.5"><Globe size={14}/> Web / Full-Stack</span>
                                    <span className="text-muted-foreground">{webStats.count} Projects ({webStats.percent}%)</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${webStats.percent}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- INTERACTIVE TIMELINE SLIDER --- */}
                    <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm flex-1 flex flex-col min-h-[300px]">
                        <TimelineSlider
                            minDate={earliestDate}
                            maxDate={latestDate}
                            projects={allProjects}
                        />
                    </div>
                </div>

                {/* --- Right Col: Top Stack --- */}
                <div className="md:col-span-5">
                    <div className="rounded-xl border border-border bg-card/50 p-6 shadow-sm h-full">
                        <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                            <Database className="h-4 w-4 text-purple-500" /> Most Used Technologies
                        </h3>
                        <div className="h-[400px] w-full pr-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={techData} layout="vertical" barSize={24} margin={{ left: 0, right: 0 }}>
                                    <CartesianGrid horizontal={false} stroke="#444" opacity={0.1} />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={110}
                                        tick={{ fill: '#888', fontSize: 12, fontWeight: 500 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'var(--muted)', opacity: 0.1}} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                        {techData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} fillOpacity={0.7 + (index * -0.05)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- IMPROVED COMPONENT: Slidable Timeline ---
const TimelineSlider = ({ minDate, maxDate, projects }) => {
    const [sliderValue, setSliderValue] = useState(100);
    const [selectedDate, setSelectedDate] = useState(new Date(maxDate));

    // Generate Year Ticks for the visual track
    const yearTicks = useMemo(() => {
        const startYear = new Date(minDate).getFullYear();
        const endYear = new Date(maxDate).getFullYear();
        const years = [];
        for (let y = startYear; y <= endYear; y++) {
            years.push(y);
        }
        return years;
    }, [minDate, maxDate]);

    // Update Date when slider moves
    useEffect(() => {
        const totalDuration = maxDate - minDate;
        const currentOffset = (sliderValue / 100) * totalDuration;
        setSelectedDate(new Date(minDate + currentOffset));
    }, [sliderValue, minDate, maxDate]);

    // Format display
    const formattedMonth = selectedDate.toLocaleDateString('en-US', { month: 'short' });
    const formattedYear = selectedDate.getFullYear();

    // Filter active projects logic
    // We show projects that were active within the specific month selected
    const activeProjects = projects.filter(p => {
        const time = selectedDate.getTime();
        // A project is visible if the slider is between its start and end date
        // Added a buffer of 1 month (approx 2.6M ms) so projects don't disappear instantly
        const buffer = 2629800000;
        return time >= p.startTime && time <= (p.endTime + buffer);
    });

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" /> Project Time Travel
                </h3>
                <div className="flex items-center text-xs text-muted-foreground animate-pulse">
                    <MousePointerClick className="mr-1 h-3 w-3" />
                    Drag slider to explore history
                </div>
            </div>

            {/* --- THE SLIDER TRACK --- */}
            <div className="relative w-full h-12 mb-6 flex items-center select-none group">

                {/* Background Track */}
                <div className="absolute w-full h-2 bg-secondary rounded-full overflow-visible">
                    {/* Visual Ticks for Years */}
                    <div className="absolute inset-0 flex justify-between px-1">
                        {yearTicks.map((year, i) => (
                            <div key={year} className="h-4 w-[1px] bg-border mt-3 relative flex justify-center">
                                <span className="absolute top-4 text-[10px] text-muted-foreground font-medium">{year}</span>
                            </div>
                        ))}
                    </div>

                    {/* Progress Fill */}
                    <div
                        className="h-full bg-primary/80 rounded-full relative"
                        style={{ width: `${sliderValue}%` }}
                    />
                </div>

                {/* The Floating Thumb Handle */}
                <div
                    className="absolute h-6 w-6 bg-background border-2 border-primary rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] pointer-events-none z-10 flex items-center justify-center transition-all duration-75"
                    style={{ left: `calc(${sliderValue}% - 12px)` }}
                >
                    <div className="h-2 w-2 bg-primary rounded-full" />

                    {/* Floating Date Bubble Above Handle */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                        {formattedMonth} {formattedYear}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                    </div>
                </div>

                {/* Actual Invisible Input - High Z-Index for Easy Grabbing */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1" // Smooth sliding
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    aria-label="Time Slider"
                />
            </div>

            {/* --- RESULTS AREA --- */}
            <div className="flex-1 relative mt-2">
                <AnimatePresence mode="popLayout">
                    {activeProjects.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                            {activeProjects.map((project) => (
                                <motion.div
                                    key={project.title}
                                    layoutId={project.title}
                                    initial={{ opacity: 0, scale: 0.95, x: -10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-3 rounded-lg border border-border bg-card/80 backdrop-blur-sm flex items-center gap-3 shadow-sm hover:border-primary/30 transition-colors"
                                >
                                    {/* Icon / Avatar */}
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-secondary to-muted flex-shrink-0 flex items-center justify-center border border-white/5">
                                        <Layers size={18} className="text-foreground/70" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold truncate pr-2">{project.title}</h4>
                                            <span className="text-[10px] bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium border border-green-500/20">
                                                Active
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {/* Tech Badge */}
                                            {project.versions[0].tools.slice(0, 2).map(t => (
                                                <span key={t} className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-10 text-muted-foreground text-center border-2 border-dashed border-border/40 rounded-xl"
                        >
                            <CalendarDays className="h-10 w-10 mb-2 opacity-20" />
                            <p className="text-sm font-medium">No active projects</p>
                            <p className="text-xs opacity-70">Slide to explore development history</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- KPI Card Helper ---
const KPICard = ({ title, value, icon: Icon, trend }) => (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/50 transition-colors group">
        <div className="flex justify-between items-start">
            <div className="p-2 rounded-md bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon size={18} />
            </div>
        </div>
        <div className="mt-4">
            <h4 className="text-3xl font-bold tabular-nums tracking-tight">{value}</h4>
            <p className="text-sm font-medium text-muted-foreground mt-1">{title}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80">{trend}</span>
        </div>
    </div>
);

// --- Tooltip Helper ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <p className="font-semibold text-sm text-popover-foreground mb-1">{label}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                    Usage Count: <span className="font-mono text-foreground font-medium">{payload[0].value}</span>
                </div>
            </div>
        );
    }
    return null;
};