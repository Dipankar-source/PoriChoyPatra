import React from "react";
import { useTheme } from "@/context/ThemeContext";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION, MATRICES & PROJECTION
// ─────────────────────────────────────────────────────────────────────────────
const COS30 = Math.cos(Math.PI / 6); // ≈ 0.866
const SIN30 = Math.sin(Math.PI / 6); // = 0.5

function project(x, y, z) {
    return {
        cx: (x - y) * COS30,
        cy: (x + y) * SIN30 - z,
    };
}

function pts(origin, coords) {
    return coords
        .map(([x, y, z]) => {
            const p = project(x, y, z);
            return `${origin.x + p.cx},${origin.y + p.cy}`;
        })
        .join(" ");
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCURATE ISOMETRIC HATCH COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function IsometricHatch({ id, points, type = "top", spacing = 5, color }) {
    // Select precise structural angles matching isometric vanishing lines
    const angle = type === "top" ? -30 : type === "left" ? 30 : 90;

    return (
        <>
            <defs>
                <pattern id={`hatch-${id}`} width={spacing} height="100" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
                    <line x1="0" y1="0" x2="0" y2="100" stroke={color} strokeWidth="0.5" />
                </pattern>
            </defs>
            <polygon points={points} fill={`url(#hatch-${id})`} />
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPREHENSIVE ISOMETRIC BLOCK (SLAB) WITH FIXED FACE PROJECTIONS
// ─────────────────────────────────────────────────────────────────────────────
function IsoBlock({ origin, x = 0, y = 0, z = 0, w, d, h, id, topHatch = true, sideHatch = true, sw = "0.8", colors }) {
    const t = pts(origin, [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]);
    const l = pts(origin, [[x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h]]);
    const r = pts(origin, [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]);

    return (
        <g>
            {/* Structural Fills */}
            <polygon points={t} fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth={sw} />
            <polygon points={l} fill={colors.BG} stroke={colors.STROKE_DIM} strokeWidth="0.6" />
            <polygon points={r} fill={colors.BG} stroke={colors.STROKE_DIM} strokeWidth="0.6" />

            {/* Precision Micro-Hatching */}
            {topHatch && <IsometricHatch id={`t-${id}`} points={t} type="top" spacing={4} color={colors.HATCH} />}
            {sideHatch && <IsometricHatch id={`l-${id}`} points={l} type="left" spacing={4} color={colors.HATCH} />}
            {sideHatch && <IsometricHatch id={`r-${id}`} points={r} type="right" spacing={4} color={colors.HATCH} />}
        </g>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRECISION GEM ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────
function PrecisionGem({ origin, x, y, z, r, h, strokeColor, colors }) {
    const pTop = pts(origin, [[x, y, z + h]]);
    const pBot = pts(origin, [[x, y, z]]);

    const pMid1 = pts(origin, [[x + r, y, z + h / 2]]);
    const pMid2 = pts(origin, [[x, y + r, z + h / 2]]);
    const pMid3 = pts(origin, [[x - r, y, z + h / 2]]);
    const pMid4 = pts(origin, [[x, y - r, z + h / 2]]);

    const facets = [
        `${pTop} ${pMid1} ${pMid2}`,
        `${pTop} ${pMid2} ${pMid3}`,
        `${pTop} ${pMid3} ${pMid4}`,
        `${pTop} ${pMid4} ${pMid1}`,
        `${pBot} ${pMid1} ${pMid2}`,
        `${pBot} ${pMid2} ${pMid3}`,
        `${pBot} ${pMid3} ${pMid4}`,
        `${pBot} ${pMid4} ${pMid1}`
    ];

    return (
        <g>
            {facets.map((points, index) => (
                <polygon
                    key={index}
                    points={points}
                    fill={colors.BG}
                    stroke={index < 4 ? (strokeColor || colors.STROKE_MAIN) : colors.STROKE_DIM}
                    strokeWidth="0.5"
                />
            ))}
        </g>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DESIGN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function BlogHeader() {
    const { isDark } = useTheme();

    const colors = {
        BG: isDark ? "#080808" : "#ffffff",
        STROKE_MAIN: isDark ? "#ffffff" : "#000000",
        STROKE_DIM: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
        STROKE_FAINT: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
        HATCH: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    };

    const width = 960;
    const height = 540;

    const centerNode = { x: 480, y: 275 };
    const leftNode = { x: 220, y: 225 };
    const bottomNode = { x: 335, y: 415 };
    const rightNode = { x: 745, y: 375 };
    const topNode = { x: 775, y: 185 };

    return (
        <div className={`min-h-[100px] flex flex-col items-center justify-center overflow-hidden font-mono px-4 w-full max-w-4xl mx-auto transition-colors duration-500 ${isDark ? "bg-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" : "bg-transparent shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]"}`}>

            <div
                className="w-full max-w-[900px] relative mt-2 mb-2 flex justify-center items-center select-none"
            >
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto block overflow-visible max-h-[350px]">

                    {/* Wireframe Axis Grid Lines */}
                    <g opacity="0.8">
                        <line x1={leftNode.x} y1={leftNode.y} x2={centerNode.x} y2={centerNode.y} stroke={colors.STROKE_FAINT} strokeDasharray="4 4" strokeWidth="0.8" />
                        <line x1={bottomNode.x} y1={bottomNode.y} x2={centerNode.x} y2={centerNode.y} stroke={colors.STROKE_FAINT} strokeDasharray="4 4" strokeWidth="0.8" />
                        <line x1={rightNode.x} y1={rightNode.y} x2={centerNode.x} y2={centerNode.y} stroke={colors.STROKE_FAINT} strokeDasharray="4 4" strokeWidth="0.8" />
                        <line x1={topNode.x} y1={topNode.y} x2={centerNode.x} y2={centerNode.y} stroke={colors.STROKE_FAINT} strokeDasharray="4 4" strokeWidth="0.8" />
                        <line x1="40" y1={centerNode.y} x2={width - 40} y2={centerNode.y} stroke={colors.STROKE_FAINT} strokeWidth="0.5" strokeDasharray="12 12" />
                        <line x1={centerNode.x} y1="35" x2={centerNode.x} y2={height - 35} stroke={colors.STROKE_FAINT} strokeWidth="0.5" strokeDasharray="12 12" />
                    </g>

                    {/* ══════════════════════════════════════════════
                     ISLAND 1 (LEFT): LITERARY POSTS (BOOKS)
                    ══════════════════════════════════════════════ */}
                    <g id="literary-station">
                        <IsoBlock origin={leftNode} w={135} d={85} h={18} id="base-l" colors={colors} />

                        {/* Standing Volume 1 */}
                        <IsoBlock origin={leftNode} x={30} y={15} z={18} w={16} d={45} h={60} id="bk1" topHatch={true} colors={colors} />
                        {/* Standing Volume 2 */}
                        <IsoBlock origin={leftNode} x={52} y={15} z={18} w={18} d={45} h={66} id="bk2" topHatch={true} colors={colors} />

                        {/* Spine Detail Ridges */}
                        {[28, 38, 48, 58, 68].map((vH) => (
                            <React.Fragment key={vH}>
                                <line x1={pts(leftNode, [[30, 15, vH]]).split(',')[0]} y1={pts(leftNode, [[30, 15, vH]]).split(',')[1]} x2={pts(leftNode, [[46, 15, vH]]).split(',')[0]} y2={pts(leftNode, [[46, 15, vH]]).split(',')[1]} stroke={colors.STROKE_MAIN} strokeWidth="0.7" />
                                <line x1={pts(leftNode, [[52, 15, vH + 2]]).split(',')[0]} y1={pts(leftNode, [[52, 15, vH + 2]]).split(',')[1]} x2={pts(leftNode, [[70, 15, vH + 2]]).split(',')[0]} y2={pts(leftNode, [[70, 15, vH + 2]]).split(',')[1]} stroke={colors.STROKE_MAIN} strokeWidth="0.7" />
                            </React.Fragment>
                        ))}

                        {/* Open Article Journal */}
                        <IsoBlock origin={leftNode} x={25} y={70} z={18} w={70} d={45} h={6} id="open-bk-base" topHatch={true} colors={colors} />

                        {/* Dynamic Engineered Pages Mapping */}
                        {[21, 23, 25].map((zOffset, idx) => (
                            <g key={idx} opacity={1 - idx * 0.25}>
                                <path d={`M ${pts(leftNode, [[60, 70, zOffset]])} Q ${pts(leftNode, [[42, 66, zOffset + 6]])} ${pts(leftNode, [[25, 72, zOffset]])}`} fill="none" stroke={colors.STROKE_MAIN} strokeWidth="0.8" />
                                <path d={`M ${pts(leftNode, [[60, 115, zOffset]])} Q ${pts(leftNode, [[42, 111, zOffset + 6]])} ${pts(leftNode, [[25, 117, zOffset]])}`} fill="none" stroke={colors.STROKE_MAIN} strokeWidth="0.8" />
                                <path d={`M ${pts(leftNode, [[60, 70, zOffset]])} Q ${pts(leftNode, [[78, 66, zOffset + 6]])} ${pts(leftNode, [[95, 72, zOffset]])}`} fill="none" stroke={colors.STROKE_MAIN} strokeWidth="0.8" />
                                <path d={`M ${pts(leftNode, [[60, 115, zOffset]])} Q ${pts(leftNode, [[78, 111, zOffset + 6]])} ${pts(leftNode, [[95, 117, zOffset]])}`} fill="none" stroke={colors.STROKE_MAIN} strokeWidth="0.8" />
                            </g>
                        ))}
                        {/* Spine center crease line */}
                        <line x1={pts(leftNode, [[60, 70, 25]]).split(',')[0]} y1={pts(leftNode, [[60, 70, 25]]).split(',')[1]} x2={pts(leftNode, [[60, 115, 25]]).split(',')[0]} y2={pts(leftNode, [[60, 115, 25]]).split(',')[1]} stroke={colors.STROKE_MAIN} strokeWidth="1" />

                        <PrecisionGem origin={leftNode} x={115} y={25} z={18} r={7} h={15} strokeColor="#4cd3ff" colors={colors} />
                        <PrecisionGem origin={leftNode} x={15} y={15} z={18} r={5} h={11} strokeColor={colors.STROKE_MAIN} colors={colors} />
                    </g>

                    {/* ══════════════════════════════════════════════
                     ISLAND 2 (BOTTOM): ORIGINAL COMPOSITION (INK)
                    ══════════════════════════════════════════════ */}
                    <g id="composition-station">
                        <IsoBlock origin={bottomNode} w={95} d={95} h={14} id="base-b" colors={colors} />

                        {/* Glass Ink Reservoir */}
                        <IsoBlock origin={bottomNode} x={32} y={32} z={14} w={32} d={32} h={22} id="ink-jar" topHatch={true} colors={colors} />

                        {/* Micro-Hatched fluid filling line indicator */}
                        <polygon points={pts(bottomNode, [[32, 32, 26], [64, 32, 26], [64, 64, 26], [32, 64, 26]])} fill="none" stroke={colors.STROKE_DIM} strokeWidth="0.5" />
                        <IsometricHatch id="ink-fluid" points={pts(bottomNode, [[32, 32, 26], [64, 32, 26], [64, 64, 26], [32, 64, 26]])} type="top" spacing={2.5} color={colors.STROKE_DIM} />

                        {/* Bottle Collar Rim */}
                        <polygon points={pts(bottomNode, [[42, 42, 36], [54, 42, 36], [54, 54, 36], [42, 54, 36]])} fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth="0.8" />

                        {/* Script Quill Geometry */}
                        <path d={`M ${pts(bottomNode, [[48, 48, 38]])} Q ${pts(bottomNode, [[32, 36, 75]])} ${pts(bottomNode, [[18, 22, 96]])}`} fill="none" stroke={colors.STROKE_MAIN} strokeWidth="1.5" />
                        <path d={`M ${pts(bottomNode, [[18, 22, 96]])} Q ${pts(bottomNode, [[32, 36, 78]])} ${pts(bottomNode, [[44, 44, 54]])} L ${pts(bottomNode, [[48, 48, 38]])}`} fill={colors.BG} stroke={colors.STROKE_DIM} strokeWidth="0.6" />

                        {/* Feather Hatch Veins */}
                        {[60, 68, 76, 84, 92].map((fH, idx) => (
                            <line
                                key={idx}
                                x1={pts(bottomNode, [[24 + idx * 3, 26 + idx * 3, fH]]).split(',')[0]}
                                y1={pts(bottomNode, [[24 + idx * 3, 26 + idx * 3, fH]]).split(',')[1]}
                                x2={pts(bottomNode, [[20 + idx * 2, 20 + idx * 2, fH + 4]]).split(',')[0]}
                                y2={pts(bottomNode, [[20 + idx * 2, 20 + idx * 2, fH + 4]]).split(',')[1]}
                                stroke={colors.STROKE_DIM} strokeWidth="0.5"
                            />
                        ))}

                        <PrecisionGem origin={bottomNode} x={15} y={75} z={14} r={6} h={16} strokeColor={colors.STROKE_MAIN} colors={colors} />
                        <PrecisionGem origin={bottomNode} x={80} y={20} z={14} r={5} h={10} strokeColor="#ffdf6d" colors={colors} />
                    </g>

                    {/* ══════════════════════════════════════════════
                     ISLAND 3 (CENTER): CORE ENGINE (TYPEWRITER)
                    ══════════════════════════════════════════════ */}
                    <g id="engine-station">
                        <IsoBlock origin={centerNode} w={175} d={145} h={22} id="base-c" colors={colors} />
                        <polygon points={pts(centerNode, [[12, 12, 22], [163, 12, 22], [163, 133, 22], [12, 133, 22]])} fill="none" stroke={colors.STROKE_MAIN} strokeWidth="0.5" />

                        {/* Typewriter Body Shell */}
                        <IsoBlock origin={centerNode} x={36} y={32} z={22} w={102} d={80} h={26} id="tw-body" topHatch={true} sideHatch={true} sw="1" colors={colors} />

                        {/* Sloped Keybed interface */}
                        <polygon points={pts(centerNode, [[36, 72, 48], [138, 72, 48], [138, 112, 32], [36, 112, 32]])} fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth="0.8" />
                        <polygon points={pts(centerNode, [[36, 112, 22], [138, 112, 22], [138, 112, 32], [36, 112, 32]])} fill={colors.BG} stroke={colors.STROKE_DIM} strokeWidth="0.6" />

                        {/* Matrix Micro Key Strips */}
                        <line x1={pts(centerNode, [[46, 82, 44]]).split(',')[0]} y1={pts(centerNode, [[46, 82, 44]]).split(',')[1]} x2={pts(centerNode, [[128, 82, 44]]).split(',')[0]} y2={pts(centerNode, [[128, 82, 44]]).split(',')[1]} stroke={colors.STROKE_MAIN} strokeWidth="2.2" strokeDasharray="3 4" />
                        <line x1={pts(centerNode, [[44, 94, 39]]).split(',')[0]} y1={pts(centerNode, [[44, 94, 39]]).split(',')[1]} x2={pts(centerNode, [[130, 94, 39]]).split(',')[0]} y2={pts(centerNode, [[130, 94, 39]]).split(',')[1]} stroke={colors.STROKE_MAIN} strokeWidth="2.2" strokeDasharray="3 4" />
                        <line x1={pts(centerNode, [[42, 106, 34]]).split(',')[0]} y1={pts(centerNode, [[42, 106, 34]]).split(',')[1]} x2={pts(centerNode, [[132, 106, 34]]).split(',')[0]} y2={pts(centerNode, [[132, 106, 34]]).split(',')[1]} stroke={colors.STROKE_MAIN} strokeWidth="2.2" strokeDasharray="4 4" />

                        {/* Cylinder Feed Roller mechanism */}
                        <IsoBlock origin={centerNode} x={42} y={36} z={48} w={90} d={14} h={14} id="tw-roller" topHatch={true} sideHatch={true} colors={colors} />

                        {/* Emerging Manuscript draft */}
                        <polygon points={pts(centerNode, [[52, 38, 62], [122, 38, 62], [122, 14, 96], [52, 14, 96]])} fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth="1" />
                        <line x1={pts(centerNode, [[60, 24, 84]]).split(',')[0]} y1={pts(centerNode, [[60, 24, 84]]).split(',')[1]} x2={pts(centerNode, [[114, 24, 84]]).split(',')[0]} y2={pts(centerNode, [[114, 24, 84]]).split(',')[1]} stroke={colors.STROKE_DIM} strokeWidth="0.8" />
                        <line x1={pts(centerNode, [[60, 30, 74]]).split(',')[0]} y1={pts(centerNode, [[60, 30, 74]]).split(',')[1]} x2={pts(centerNode, [[104, 30, 74]]).split(',')[0]} y2={pts(centerNode, [[104, 30, 74]]).split(',')[1]} stroke={colors.STROKE_DIM} strokeWidth="0.8" />

                        <PrecisionGem origin={centerNode} x={148} y={22} z={22} r={7} h={18} strokeColor="#ff6b6b" colors={colors} />
                        <PrecisionGem origin={centerNode} x={22} y={135} z={22} r={5} h={12} strokeColor="#51cf66" colors={colors} />
                        <PrecisionGem origin={centerNode} x={152} y={120} z={22} r={4} h={9} strokeColor={colors.STROKE_MAIN} colors={colors} />
                    </g>

                    {/* ══════════════════════════════════════════════
                     ISLAND 4 (RIGHT): PRODUCTION PLATFORM (TABLET)
                    ══════════════════════════════════════════════ */}
                    <g id="production-station">
                        <IsoBlock origin={rightNode} w={115} d={115} h={10} id="base-r" colors={colors} />

                        {/* Hardware Glass Frame */}
                        <polygon points={pts(rightNode, [[18, 18, 10], [98, 18, 10], [98, 98, 10], [18, 98, 10]])} fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth="0.8" />
                        <polygon points={pts(rightNode, [[24, 24, 10], [92, 24, 10], [92, 92, 10], [24, 92, 10]])} fill={colors.BG} stroke={colors.STROKE_DIM} strokeWidth="0.5" />

                        {/* Interactive UI Action Element */}
                        <polygon points={pts(rightNode, [[38, 42, 10], [78, 42, 10], [78, 72, 10], [38, 72, 10]])} fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth="0.8" />
                        <line x1={pts(rightNode, [[46, 57, 10]]).split(',')[0]} y1={pts(rightNode, [[46, 57, 10]]).split(',')[1]} x2={pts(rightNode, [[70, 57, 10]]).split(',')[0]} y2={pts(rightNode, [[70, 57, 10]]).split(',')[1]} stroke={colors.STROKE_MAIN} strokeWidth="1.2" />

                        <PrecisionGem origin={rightNode} x={12} y={102} z={10} r={5} h={12} strokeColor={colors.STROKE_MAIN} colors={colors} />
                        <PrecisionGem origin={rightNode} x={102} y={12} z={10} r={6} h={14} strokeColor="#cc5de8" colors={colors} />
                    </g>

                    {/* ══════════════════════════════════════════════
                     ISLAND 5 (TOP): APEX ASCENT (GEOMETRIC NIB)
                    ══════════════════════════════════════════════ */}
                    <g id="apex-station">
                        <IsoBlock origin={topNode} w={55} d={55} h={36} id="base-t" colors={colors} />

                        {/* 3D Fountain Pen Assembly */}
                        <polygon points={pts(topNode, [[27, 27, 110], [42, 12, 80], [27, 27, 60]])} fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth="1" />
                        <polygon points={pts(topNode, [[27, 27, 110], [12, 42, 80], [27, 27, 60]])} fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth="1" />

                        {/* Structural Rear Facets for Clean Isometric Volumetric View */}
                        <polygon points={pts(topNode, [[42, 12, 80], [42, 42, 70], [27, 27, 60]])} fill={colors.BG} stroke={colors.STROKE_DIM} strokeWidth="0.6" />
                        <polygon points={pts(topNode, [[12, 42, 80], [42, 42, 70], [27, 27, 60]])} fill={colors.BG} stroke={colors.STROKE_DIM} strokeWidth="0.6" />

                        {/* Fine Line Details & Breather Hole */}
                        <line
                            x1={pts(topNode, [[27, 27, 60]]).split(',')[0]} y1={pts(topNode, [[27, 27, 60]]).split(',')[1]}
                            x2={pts(topNode, [[27, 27, 100]]).split(',')[0]} y2={pts(topNode, [[27, 27, 100]]).split(',')[1]}
                            stroke={colors.STROKE_MAIN} strokeWidth="0.8"
                        />
                        <circle cx={pts(topNode, [[27, 27, 80]]).split(',')[0]} cy={pts(topNode, [[27, 27, 80]]).split(',')[1]} r="2.5" fill={colors.BG} stroke={colors.STROKE_MAIN} strokeWidth="0.7" />

                        <PrecisionGem origin={topNode} x={8} y={8} z={36} r={4} h={14} strokeColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} colors={colors} />
                        <PrecisionGem origin={topNode} x={46} y={46} z={36} r={4} h={14} strokeColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} colors={colors} />
                    </g>
                </svg>
            </div>
        </div>
    );
}