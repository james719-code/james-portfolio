"use client";

import { Component } from 'react';

export default class WebGLErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error, errorInfo) {
        console.error('3D Scene Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-2xl p-8">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                            3D View Unavailable
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Your browser or device doesn't support WebGL, which is required for the 3D experience.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            Try using a modern browser like Chrome, Firefox, or Edge, or switch to Dev Mode for a classic portfolio view.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
