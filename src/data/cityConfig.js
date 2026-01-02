export const VILLAGE_COLORS = {
    day: {
        grass: "#86efac",
        path: "#d6d3d1",
        wood: "#92400e",
        leaves: "#15803d",
        text: "#0f172a",
        dome: "#bae6fd"
    },
    night: {
        grass: "#1e293b",
        path: "#334155",
        wood: "#475569",
        leaves: "#0f172a",
        text: "#e2e8f0",
        dome: "#4c1d95"
    }
};

export const TYPE_COLORS = {
    android: "#34d399",
    web: "#60a5fa",
    system: "#a78bfa",
    cert: "#fbbf24"
};

export const getProjectType = (project) => {
    if (!project) return "web";
    const tools = project.versions?.[0]?.tools?.join(" ").toLowerCase() || "";
    if (tools.includes("android") || tools.includes("kotlin")) return "android";
    if (tools.includes("react") || tools.includes("web") || tools.includes("next")) return "web";
    return "system";
};

export const SCENE_CONFIG = {
    projectRadius: 9,
    certRadius: 14,
    camera: {
        position: [30, 30, 30],
        zoomMobile: 12,
        zoomDesktop: 25
    },
    shadows: {
        mapSize: 1024
    },
    particles: {
        starsCount: 2000,
        fireflyCountMobile: 15,
        fireflyCountDesktop: 100,
        constellationStars: 50
    }
};
