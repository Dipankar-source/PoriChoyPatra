import React from 'react';

export const IsometricBg = ({ className = "" }) => {
    return (
        <div className={`absolute inset-0 pt-7 w-full h-[436px] dark:bg-transparent bg-transparent flex items-center justify-center overflow-hidden -z-10 pointer-events-none transition-colors duration-300 ${className}`}>
            <svg
                className="h-auto opacity-50 w-full max-w-[556px] touch-manipulation overflow-visible select-none transition-colors duration-300"
                viewBox="0 0 556 354"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <pattern id="ncdai-face-pattern-exact" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2" className="stroke-gray-200 dark:stroke-[#292828] transition-colors duration-300" strokeWidth="1" />
                    </pattern>
                    <g id="ncdai-face-fill-exact">
                        <path d="M388.48 32.58L277.63 96.58L388.48 160.58L499.33 96.58L554.76 128.58L388.48 224.58L166.78 96.58L333.05 0.58L388.48 32.58Z" />
                        <path d="M554.76 64.58L499.33 96.58L388.48 32.58L443.90 0.58L554.76 64.58Z" />
                    </g>
                    <linearGradient id="char-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                    <style>
                        {`
                        @keyframes flow {
                            from { stroke-dashoffset: 2650; }
                            to { stroke-dashoffset: 0; }
                        }
                        .laser-line path {
                            animation: flow 6s linear infinite;
                        }
                        @keyframes flow-char {
                            from { stroke-dashoffset: 1; }
                            to { stroke-dashoffset: 0; }
                        }
                        .char-laser-line {
                            animation: flow-char 10s linear infinite;
                        }
                        `}
                    </style>
                </defs>

                <g className="stroke-black/20 dark:stroke-white/20 transition-colors duration-300" strokeWidth="1" strokeDasharray="4 2">
                    <path d="M-477.55 756.57L1254.51 -243.41" />
                    <path d="M977.37 788.58L-754.67 -211.42" />
                    <path d="M1143.65 692.58L-588.39 -307.42" />
                </g>

                {/* Animated Blue Light Beams */}
                <g className="stroke-blue-500/30 dark:stroke-blue-400/30 laser-line" strokeWidth="2" strokeDasharray="150 2500" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.8))' }}>
                    <path d="M-477.55 756.57L1254.51 -243.41" style={{ animationDelay: '0s' }} />
                    <path d="M977.37 788.58L-754.67 -211.42" style={{ animationDelay: '0s' }} />
                    <path d="M1143.65 692.58L-588.39 -307.42" style={{ animationDelay: '1.8s' }} />
                </g>

                <g className="bg-[#FFFFFF] dark:bg-[#09090B] transition-colors duration-300" fillRule="evenodd" clipRule="evenodd">
                    <path d="M388.48 224.58L166.78 96.58V128.58L388.48 256.58L554.76 160.58V128.58L388.48 224.58Z" />
                    <path d="M388.48 32.58L277.63 96.58V128.58L388.48 64.58L499.33 128.58L554.75 96.58V64.58L499.33 96.58L388.48 32.58Z" />
                </g>

                <use href="#ncdai-face-fill-exact" className="fill-[#f8fafc] dark:fill-[#09090a] transition-colors duration-300" />
                <use href="#ncdai-face-fill-exact" fill="url(#ncdai-face-pattern-exact)" />

                <path
                    className="stroke-gray-300 dark:stroke-[#2a2a2e] transition-colors duration-300"
                    strokeWidth="1"
                    d="M499.33 96.58 L554.76 128.58 V160.58 L388.48 256.58 L166.78 128.58 V96.58 L333.05 0.58 L499.33 96.58M166.78 96.58 L388.48 224.58 L554.76 128.58M527.04 112.58 L554.76 96.58 V64.58 L443.90 0.58 L277.63 96.58 L388.48 160.58 L554.76 64.58M305.34 112.58 L388.48 64.58 L471.62 112.58M388.48 224.58 V256.58M388.48 32.58 V64.58"
                />

                {/* Character Outline Light Beam */}
                <path
                    className="char-laser-line"
                    stroke="url(#char-gradient)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="0.05 1.05"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.8))' }}
                    d="M499.33 96.58 L554.76 128.58 V160.58 L388.48 256.58 L166.78 128.58 V96.58 L333.05 0.58 L499.33 96.58M166.78 96.58 L388.48 224.58 L554.76 128.58M527.04 112.58 L554.76 96.58 V64.58 L443.90 0.58 L277.63 96.58 L388.48 160.58 L554.76 64.58M305.34 112.58 L388.48 64.58 L471.62 112.58M388.48 224.58 V256.58M388.48 32.58 V64.58"
                />
            </svg>
        </div>
    );
};

export default IsometricBg;