export const commissionedProjects = [
    {
        title: "Echo-Nnect",
        description: "A sleek and intuitive note-taking application designed for quick capture and organization of thoughts and ideas.",
        bgImage: "/img/demo-echon.webp",
        logoImage: "/img/echon.webp",
        downloadUrl: "https://www.mediafire.com/file/o79ku8r65s8naby/echo-nnect.apk/file",
        versions: [
            {
                version: "V1",
                date: "Oct 2024 - Nov 2024",
                description: "Initial release with core note-taking and local storage functionalities.",
                tools: ["Room DB", "Java", "XML"]
            }
        ]
    },
    {
        title: "SalbaBida",
        description: "An emergency and weather application designed to provide data about the weather.",
        bgImage: "/img/demo-salbabida.webp",
        logoImage: "/img/salbabida.webp",
        downloadUrl: "https://www.mediafire.com/file/vlm1tshghcthnns/SalbaBida_Update.apk/file",
        versions: [
            {
                version: "V1",
                date: "Jan 2025 - Feb 2025",
                description: "Focused on integrating weather and map APIs for data.",
                tools: ["Java", "XML", "OpenStreetMap", "OpenWeather", "Firebase"]
            }
        ]
    },
    {
        title: "HGDG-GAD Website",
        description: "A digital compliance tool for HGDG-GAD Projects of DepEd.",
        bgImage: "/img/demo-hgdg.webp",
        logoImage: "/img/hgdg.webp",
        liveUrl: "https://hgdg-gad.netlify.app/",
        versions: [
            {
                version: "V1",
                date: "Jun 2025 - Jul 2025",
                description: "Developed the front-end and set up the Firebase backend for data management.",
                tools: ["HTML", "CSS", "JS", "Vite", "Firebase"]
            }
        ]
    }
];

export const schoolProjects = [
    {
        title: "CREST",
        description: "An educational app compiling research papers for students and teachers at Bonifacio D. Borebor Sr. High School.",
        bgImage: "/img/demo-crest.webp",
        logoImage: "/img/crest.webp",
        downloadUrl: "https://www.mediafire.com/file/ix4cj3buz3uo1zz/CREST_V2.apk/file",
        versions: [
            { version: "V1", date: "Sep 2022 - Jul 2023", description: "Initial Android build focused on PDF viewing, user authentication, and Firebase database.", tools: ["Java", "XML", "Firebase", "PDF Viewer"] },
            { version: "V2", date: "Jun 2025 - Jul 2025", description: "Planned UI/UX overhaul and performance improvements for a better user experience.", tools: ["Kotlin", "Jetpack Compose", "Firebase", "Appwrite", "Room DB"] }
        ]
    },
    {
        title: "Electronic Abstract System",
        description: "A digital repository of research abstract in Partido State Library.",
        bgImage: "/img/demo-easy.webp",
        liveUrl: "https://me17.42web.io/",
        isBlur: false,
        versions: [
            { version: "V1", date: "Jan 2025 - May 2025", description: "Core development of the web-based system for abstract searching.", tools: ["HTML", "CSS", "JS", "PHP", "MySQL"] }
        ]
    }
];

export const personalProjects = [
    {
        title: "SPECS Management System",
        description: "An organization management system designed for efficiency of the organization workflows.",
        bgImage: "/img/demo-specs.webp",
        logoImage: "/img/specs.webp",
        attribution: "Logo Source: SPECS Organization",
        liveUrl: "https://specs-cs.netlify.app/",
        githubUrl: "https://github.com/james719-code/SPECS-Organization-Management-System",
        versions: [
            { version: "V1", date: "Jun 2025 - Jul 2025", description: "Initial build with AppWrite backend for data and authentication.", tools: ["AppWrite", "HTML", "CSS", "JS", "Vite", "Chart.js"] },
            { version: "V1.1", date: "Jul 2025 - Aug 2025", description: "Redesigned UI and Refactored to use BootStrap", tools: ["AppWrite", "HTML", "SASS", "Bootstrap", "JS", "Vite", "Chart.js"] }
        ]
    },
    {
        title: "SIAS Schedule Organizer",
        description: "An organizer for student schedules extracted from the university's portal.",
        bgImage: "/img/demo-sias-converter.webp",
        isBlur: false,
        liveUrl: "https://sias-schedule-organizer.netlify.app/",
        versions: [
            { version: "V1", date: "Jan 2025 - Jan 2025", description: "Initial commit; used excel-based data extracted from PDF files via online converters.", tools: ["HTML", "CSS", "JS", "Excel API"] },
            { version: "V1.1", date: "Jun 2025 - Jul 2025", description: "Implemented PDF.js to directly parse PDF schedules, removing the need for manual file conversion.", tools: ["HTML", "CSS", "JS", "PDF.js"] }
        ]
    }
];

export const collaborationProjects = [
    {
        title: "Smart Treasurer",
        description: "A tool to help manage and track finances for organizations or groups.",
        bgImage: "/img/demo-smart-treasurer.webp",
        isBlur: false,
        liveUrl: "https://mggyslz.github.io/SmartTreasurer/",
        githubUrl: "https://github.com/mggyslz/SmartTreasurer",
        collaborators: [{ name: "mggyslz", url: "https://github.com/mggyslz" }],
        versions: [
            { version: "V1", date: "Jan 2025 - Jan 2025", description: "Initial commit with basic expense and income tracking.", tools: ["HTML", "CSS", "JS", "Excel"] },
            { version: "V1.01", date: "Apr 2025 - Jul 2025", description: "Added improvements in functions, including data visualization and reporting.", tools: ["HTML", "CSS", "JS", "Excel"] }
        ]
    },
    {
        title: "Grade Calculator",
        description: "A simple and intuitive tool for students to calculate their academic grades.",
        bgImage: "/img/demo-grade-calculator.webp",
        isBlur: false,
        liveUrl: "https://brixtine.github.io/Collaborative-Project/",
        githubUrl: "https://github.com/Brixtine/Collaborative-Project",
        collaborators: [{ name: "Kristine Marie Fuentebella", url: "https://github.com/Brixtine" }],
        versions: [
            { version: "V1", date: "Nov 2024 - Nov 2024", description: "Initial commit with core grade calculation logic.", tools: ["HTML", "CSS", "JS"] },
            { version: "V1.1", date: "Apr 2025 - Apr 2025", description: "Improved calculation functions and enhanced the user interface for a cleaner look.", tools: ["HTML", "CSS", "JS"] }
        ]
    }
];

export const certificates = [
    {
        title: "Understanding Artificial Intelligence",
        issuer: "DataCamp",
        date: "Sep 2025",
        image: "/img/understanding_ai_cert.webp",
        link: "https://www.datacamp.com/completed/statement-of-accomplishment/course/f2ebb066212bdce72ba1296affbfe1217dbd9154",
    },
    {
        title: "Data Manipulation with Pandas",
        issuer: "DataCamp",
        date: "Aug 2025",
        image: "/img/understanding_ai_cert.webp",
        link: "https://www.datacamp.com/completed/statement-of-accomplishment/course/d3872dcf6a4da44344b7cdfb8ce64908feca4d76",
    },
    {
        title: "Javascript Essentials 1",
        issuer: "Cisco Networking Academy",
        date: "Aug 2025",
        image: "/img/java_basic_certificate.webp",
        link: "https://www.credly.com/badges/2cbdf46a-66ac-45ab-bb31-c10e0d2d25a3/public_url",
    },
    {
        title: "Problem Solving (Basic)",
        issuer: "HackerRank",
        date: "Aug 2025",
        image: "/img/problem_solving_basic_certificate.webp",
        link: "https://www.hackerrank.com/certificates/e2732cc96d59",
    },
    {
        title: "SQL (Basic)",
        issuer: "HackerRank",
        date: "Aug 2025",
        image: "/img/sql_basic_certificate.webp",
        link: "https://www.hackerrank.com/certificates/1cf8dc1505e2",
    },
    {
        title: "Introduction to Python",
        issuer: "DataCamp",
        date: "Jul 2025",
        image: "/img/introduction_python.webp",
        link: "https://www.datacamp.com/completed/statement-of-accomplishment/course/79676d207183f1471c0f97f8522b3294e308e867",
    },
    {
        title: "Python Intermediate",
        issuer: "DataCamp",
        date: "Jul 2025",
        image: "/img/intermediate_python.webp",
        link: "https://www.datacamp.com/completed/statement-of-accomplishment/course/d23b079b75f68fee1ce2f732ba57500a48489b53",
    },
    {
        title: "Java (Basic)",
        issuer: "HackerRank",
        date: "Aug 2024",
        image: "/img/java_basic_certificate.webp",
        link: "https://www.hackerrank.com/certificates/330af457c1b6",
    }
];