"use client";

import { FaTimes, FaExternalLinkAlt, FaGithub, FaAward, FaBuilding, FaCalendarAlt } from 'react-icons/fa';
import { getProjectType } from '@/data/cityConfig';

export function ProjectModal({ project, isNight, onClose }) {
    if (!project) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
        >
            <div
                className={`
                    relative w-full max-w-lg rounded-2xl shadow-2xl p-6 border backdrop-blur-xl animate-in fade-in zoom-in duration-300 
                    ${isNight ? "bg-slate-900/95 border-slate-700 text-white" : "bg-white/95 border-slate-200 text-slate-800"}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-500/20 rounded-full transition-colors"
                    aria-label="Close modal"
                >
                    <FaTimes />
                </button>

                <div className="mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${isNight ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {getProjectType(project)}
                    </span>
                    <h2 id="project-modal-title" className="text-2xl font-bold mt-2 leading-tight">
                        {project.title}
                    </h2>
                </div>

                {project.bgImage && (
                    <div className="h-40 w-full rounded-xl bg-slate-200 mb-4 overflow-hidden shadow-inner">
                        <img
                            src={project.bgImage}
                            alt={`${project.title} preview`}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                            loading="lazy"
                        />
                    </div>
                )}

                <p className="text-sm opacity-90 mb-6 leading-relaxed">
                    {project.description}
                </p>

                <div className="flex gap-3">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-[1.02]"
                        >
                            <FaExternalLinkAlt /> Live Demo
                        </a>
                    )}
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 flex items-center justify-center gap-2 border py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:scale-[1.02] ${isNight ? 'border-slate-600 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}
                        >
                            <FaGithub /> Code
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export function CertificateModal({ cert, isNight, onClose }) {
    if (!cert) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
        >
            <div
                className={`
                    relative w-full max-w-md rounded-2xl shadow-2xl p-6 border backdrop-blur-xl animate-in fade-in zoom-in duration-300 
                    ${isNight ? "bg-slate-900/95 border-amber-500/30 text-white" : "bg-white/95 border-amber-200 text-slate-800"}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-500/20 rounded-full transition-colors"
                    aria-label="Close modal"
                >
                    <FaTimes />
                </button>

                <div className="flex items-start gap-4 mb-6">
                    <div className={`p-4 rounded-full shadow-inner ${isNight ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                        <FaAward size={32} />
                    </div>
                    <div>
                        <h2 id="cert-modal-title" className="text-xl font-bold leading-tight">
                            {cert.title}
                        </h2>
                        <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${isNight ? 'text-amber-400' : 'text-amber-600'}`}>
                            Verified Certificate
                        </p>
                    </div>
                </div>

                <div className="space-y-4 mb-6 text-sm opacity-90 bg-gray-500/5 p-4 rounded-xl">
                    {cert.issuer && (
                        <div className="flex items-center gap-3">
                            <FaBuilding className="opacity-50 text-lg" aria-hidden="true" />
                            <span>Issued by: <strong>{cert.issuer}</strong></span>
                        </div>
                    )}
                    {cert.date && (
                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="opacity-50 text-lg" aria-hidden="true" />
                            <span>Date: {cert.date}</span>
                        </div>
                    )}
                </div>

                {cert.link && (
                    <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02]"
                    >
                        <FaExternalLinkAlt /> View Credential
                    </a>
                )}
            </div>
        </div>
    );
}
