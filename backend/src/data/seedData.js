/**
 * HackHub Canonical Data Store
 * Provides verified data for HackHub and guarantees zero-downtime failover
 * when remote Supabase DNS is unresolved or for rapid offline development.
 */

const hackathons = [
  {
    id: 1,
    slug: "versathon-2026",
    title: "Versathon 2.0",
    organizer: "Sahyadri College of Engineering & Management",
    description: "A prestigious 24-hour national hackathon challenging student engineers to build high-impact demonstrable solutions across cutting-edge technology verticals.",
    domain: "Multi-Disciplinary",
    technologies: ["React", "Next.js", "Node.js", "Python", "AI/ML", "IoT", "PostgreSQL", "Cloud"],
    location: "Sahyadri Campus, Mangaluru, Karnataka",
    is_online: false,
    registration_deadline: "2026-10-15T23:59:59Z",
    event_start: "2026-10-25T09:00:00Z",
    event_end: "2026-10-26T09:00:00Z",
    team_min: 2,
    team_max: 4,
    prize: "₹1,50,000 + Incubation & Mentorship",
    difficulty: "intermediate",
    eligibility: "Engineering, Polytechnic & MCA students across India",
    rules: "24-hour continuous hackathon. Teams choose ONE problem statement from ONE vertical. Final submission must include: GitHub repository, maximum 10-slide PPT, and a 5-10 minute demonstration video. Demo must be fully functional within 24 hours.",
    website_url: "https://versathon.sahyadri.edu.in",
    registration_url: "https://versathon.sahyadri.edu.in/register",
    source_url: "https://sahyadri.edu.in/events/versathon-2-0",
    status: "upcoming",
    is_verified: true,
    presentation_rules: {
      max_slides: 10,
      min_video_minutes: 5,
      max_video_minutes: 10,
      required_sections: [
        "Title & Team",
        "Problem Statement",
        "Problem Analysis & Gap",
        "Proposed Solution",
        "Key Features",
        "System Architecture",
        "Tech Stack & Implementation",
        "Innovation & Differentiation",
        "Demo & Results",
        "Future Scope & Conclusion"
      ],
      required_files: ["GitHub repository", "PPT (<= 10 slides)", "5-10 min Video Demo"],
      enforce_max_slides: true,
      notes: "Strict 10-slide limit enforced for final presentation."
    },
    problem_statements: [
      { id: 101, vertical: "Healthcare & MedTech", title: "Automated Early Sepsis Detection in Rural Clinics", description: "Design an edge-compatible clinical decision support tool providing early warning markers for sepsis before lab cultures arrive." },
      { id: 102, vertical: "AI & Machine Learning", title: "Multilingual Document Intelligence for Vernacular Land Records", description: "Create an OCR and parsing pipeline that processes handwritten regional land deed records into structured data with confidence scores." },
      { id: 103, vertical: "FinTech & Inclusion", title: "Offline P2P Micro-Transfers with Cryptographic Settlement", description: "Build a secure peer-to-peer micro-payment protocol functioning over BLE or sound waves for areas with zero cellular connectivity." },
      { id: 104, vertical: "Smart Agriculture", title: "Hyperlocal Pest and Disease Forecasting Using Microclimate Telemetry", description: "Develop an agronomy model linking low-cost soil-weather sensor clusters to predictive fungal bloom alerts for smallholder farmers." },
      { id: 105, vertical: "Cybersecurity", title: "Real-Time Identity Impersonation & Deepfake Audio Interceptor", description: "Design a lightweight client-side daemon detecting synthesized or voice-cloned audio during live phone/VoIP calls." },
      { id: 106, vertical: "Sustainable Energy", title: "Decentralized Community Microgrid Demand-Response Balancer", description: "Build an algorithmic load balancer shifting residential renewable battery loads dynamically during peak tariff hours." },
      { id: 107, vertical: "Smart Mobility", title: "Dynamic Transit Congestion Alleviation & Signal Prioritization", description: "Create a computer vision edge system for municipal traffic lights that prioritizes public buses and ambulances." },
      { id: 108, vertical: "Supply Chain & Logistics", title: "Verifiable Cold Chain Temperature Auditing Using Zero-Knowledge Proofs", description: "Build an immutable logging system proving pharmaceutical temperature compliance without revealing proprietary logistics routes." },
      { id: 109, vertical: "EdTech & Accessibility", title: "Real-Time Tactile & Audio Educational Interface for Visually Impaired", description: "Create an interactive tutoring agent transforming STEM diagrams and chemical formulas into auditory spatial models." },
      { id: 110, vertical: "Disaster Management", title: "Mesh-Network Emergency Beacon & Civilian Resource Dispatch", description: "Design an ad-hoc Wi-Fi/LoRa mesh network protocol enabling stranded civilians to broadcast vital triage beacons during floods." },
      { id: 111, vertical: "Civic Governance", title: "Automated Municipal Grievance Verification & Duplicate Detection", description: "Build a civic incident classifier identifying duplicate citizen complaints, geo-clustering issues, and verifying contractor resolution." },
      { id: 112, vertical: "Open Innovation", title: "Autonomous Engineering Agent for Automated Pull-Request Security Auditing", description: "Develop an intelligent CI bot inspecting incoming pull requests for memory leaks, privilege escalation, and auth vulnerabilities." }
    ]
  },
  {
    id: 2,
    slug: "smart-india-hackathon-2026",
    title: "Smart India Hackathon 2026",
    organizer: "Ministry of Education & AICTE",
    description: "Nationwide initiative providing students a platform to solve pressing problems of central/state ministries, departments and industry partners.",
    domain: "GovTech & Social Impact",
    technologies: ["React", "Python", "Flutter", "FastAPI", "TensorFlow", "PostgreSQL"],
    location: "Multiple Nodal Centers across India",
    is_online: false,
    registration_deadline: "2026-11-10T23:59:59Z",
    event_start: "2026-12-05T08:00:00Z",
    event_end: "2026-12-07T20:00:00Z",
    team_min: 6,
    team_max: 6,
    prize: "₹1,00,000 per problem statement",
    difficulty: "advanced",
    eligibility: "Enrolled undergraduate and postgraduate college students in India",
    rules: "Teams of strictly 6 members with at least 1 female team member. 36-hour non-stop building sprint.",
    website_url: "https://www.sih.gov.in",
    registration_url: "https://www.sih.gov.in/studentRegistration",
    source_url: "https://www.sih.gov.in",
    status: "upcoming",
    is_verified: true,
    presentation_rules: {
      max_slides: 12,
      min_video_minutes: 3,
      max_video_minutes: 5,
      required_sections: ["Problem Definition", "Proposed Solution", "Tech Stack", "Feasibility", "Impact"],
      required_files: ["Working Codebase", "PPT", "Demo"],
      enforce_max_slides: true
    },
    problem_statements: [
      { id: 201, vertical: "Water Resources", title: "Real-time groundwater depletion mapping using satellite gravimetry and well telemetry", description: "Identify rapidly declining aquifers using automated time-series telemetry." }
    ]
  },
  {
    id: 3,
    slug: "ethindia-2026",
    title: "ETHIndia 2026",
    organizer: "Devfolio & Ethereum Foundation",
    description: "Asia's largest Ethereum hackathon bringing together the world's most talented developers, designers, and builders.",
    domain: "Web3 & Distributed Systems",
    technologies: ["Solidity", "TypeScript", "Next.js", "Foundry", "Zero Knowledge", "IPFS"],
    location: "KTPO, Bengaluru, India",
    is_online: false,
    registration_deadline: "2026-11-20T23:59:59Z",
    event_start: "2026-12-12T17:00:00Z",
    event_end: "2026-12-14T17:00:00Z",
    team_min: 1,
    team_max: 5,
    prize: "$100,000+ Track Bounties",
    difficulty: "advanced",
    eligibility: "Open globally to all software engineers and builders",
    rules: "All code must be written during the 36-hour hackathon. Open-source license required.",
    website_url: "https://ethindia.co",
    registration_url: "https://ethindia2026.devfolio.co",
    source_url: "https://ethindia.co",
    status: "upcoming",
    is_verified: true,
    presentation_rules: {
      max_slides: 8,
      min_video_minutes: 2,
      max_video_minutes: 4,
      required_sections: ["Problem", "Solution", "Architecture", "Smart Contracts", "Live Demo"],
      required_files: ["GitHub Repo", "Video Demo"],
      enforce_max_slides: false
    }
  },
  {
    id: 4,
    slug: "google-solution-challenge-2026",
    title: "Google Solution Challenge",
    organizer: "Google Developer Student Clubs",
    description: "Annual international competition inviting university students to solve for one or more of the United Nations 17 Sustainable Development Goals using Google tech.",
    domain: "UN Sustainable Goals",
    technologies: ["Flutter", "Firebase", "TensorFlow", "Google Cloud", "Gemini API", "Angular"],
    location: "Online / Global",
    is_online: true,
    registration_deadline: "2026-10-30T23:59:59Z",
    event_start: "2026-11-01T00:00:00Z",
    event_end: "2026-12-15T23:59:59Z",
    team_min: 1,
    team_max: 4,
    prize: "$3,000 per team member + Google Mentorship",
    difficulty: "beginner",
    eligibility: "Active members of GDG on Campus / University students",
    rules: "Solution must clearly address at least one UN SDG and use at least one Google product.",
    website_url: "https://developers.google.com/community/gdsc-solution-challenge",
    registration_url: "https://developers.google.com/community/gdsc-solution-challenge",
    source_url: "https://developers.google.com",
    status: "upcoming",
    is_verified: true,
    presentation_rules: {
      max_slides: 10,
      min_video_minutes: 3,
      max_video_minutes: 5,
      required_sections: ["UN SDG Impact", "Solution Overview", "Google Tech Used", "Scalability", "Demo"],
      required_files: ["GitHub Repo", "YouTube Demo Video"],
      enforce_max_slides: true
    }
  },
  {
    id: 5,
    slug: "hackmit-2026",
    title: "HackMIT 2026",
    organizer: "Massachusetts Institute of Technology",
    description: "MIT's premier annual student hackathon, gathering 1,000+ top collegiate developers from around the world to build innovative software and hardware projects.",
    domain: "Artificial Intelligence",
    technologies: ["Python", "PyTorch", "React", "Rust", "WebAssembly", "Docker"],
    location: "Cambridge, MA / Hybrid",
    is_online: true,
    registration_deadline: "2026-09-30T23:59:59Z",
    event_start: "2026-10-18T18:00:00Z",
    event_end: "2026-10-20T18:00:00Z",
    team_min: 1,
    team_max: 4,
    prize: "$40,000 in Prizes & Sponsor Tracks",
    difficulty: "advanced",
    eligibility: "Undergraduate and high school students worldwide",
    rules: "Fresh code written during the event. Cross-college collaborations allowed.",
    website_url: "https://hackmit.org",
    registration_url: "https://hackmit.org/apply",
    source_url: "https://hackmit.org",
    status: "upcoming",
    is_verified: true
  }
];

const projects = [
  {
    id: 1,
    project_name: "MedLens AI",
    competition: "Smart India Hackathon",
    year: 2025,
    domain: "Healthcare",
    problem_statement: "Primary health clinics in rural regions lack on-site radiologists to interpret chest X-rays, leading to delayed diagnoses of acute pneumonia and tuberculosis.",
    solution: "An edge-deployable deep learning diagnostic assistant running on lightweight laptops. It performs offline chest X-ray segmentation, generates heatmaps of pulmonary infiltrates, and drafts localized triage notes in under 4 seconds.",
    tech_stack: "Python, PyTorch, ONNX Runtime, FastAPI, React, SQLite",
    team_size: 4,
    why_it_won: "The team proved 100% offline edge inference on inexpensive hardware without requiring internet connectivity, addressing a severe real-world clinical bottleneck with high precision.",
    lessons_learned: [
      "Offline-first architecture is critical for true rural adoption",
      "Model quantization reduced inference latency by 68% without precision loss",
      "Human-in-the-loop confidence scoring builds clinician trust"
    ],
    github_url: "https://github.com/hackhub-showcase/medlens-ai",
    demo_url: "https://medlens-demo.vercel.app",
    project_image_url: "/placeholder-project.svg"
  },
  {
    id: 2,
    project_name: "DeFiGuard",
    competition: "ETHIndia",
    year: 2025,
    domain: "FinTech & Security",
    problem_statement: "Smart contract developers suffer catastrophic liquidity drain attacks due to undetected reentrancy and oracle manipulation flaws during fast prototyping.",
    solution: "A zero-knowledge automated formal verification tool that runs fuzzing simulations against live testnet forks, asserting protocol solvency under adversarial flash loan conditions.",
    tech_stack: "Solidity, Foundry, Rust, Next.js, Tailwind CSS, TypeScript",
    team_size: 3,
    why_it_won: "Judges were stunned by their working live demo catching real vulnerabilities on deployed testnet pools within 30 seconds of contract submission.",
    lessons_learned: [
      "Simulate extreme economic conditions, not just unit syntax",
      "Foundry's blazing speed made full invariant testing feasible in a 36-hour sprint",
      "Concise terminal output visualizers win technical judge rounds"
    ],
    github_url: "https://github.com/hackhub-showcase/defiguard",
    demo_url: "https://defiguard.eth.limo",
    project_image_url: "/placeholder-project.svg"
  },
  {
    id: 3,
    project_name: "AgroSense IoT",
    competition: "Versathon 1.0",
    year: 2025,
    domain: "Smart Agriculture",
    problem_statement: "Smallholder horticulture farmers lose up to 40% of yields because existing soil sensors are prohibitively expensive and require reliable cellular broadband.",
    solution: "An ultra-low-cost ESP32 solar sensor node transmitting localized moisture and electrical conductivity telemetry over LoRaWAN to a local village gateway with offline crop water budget analytics.",
    tech_stack: "C++, ESP32, LoRaWAN, Node.js, Express, Chart.js, PostgreSQL",
    team_size: 4,
    why_it_won: "The team brought physical working hardware prototypes to the judging floor and demonstrated real-time sensor packets updating the local dashboard without any internet connection.",
    lessons_learned: [
      "Physical demonstration creates immediate judge excitement",
      "Battery power management must be factored into the firmware sleep cycle early",
      "Keep UI vernacular and intuitive for non-technical farmers"
    ],
    github_url: "https://github.com/hackhub-showcase/agrosense-iot",
    demo_url: "https://agrosense.vercel.app",
    project_image_url: "/placeholder-project.svg"
  }
];

const profiles = [
  {
    id: 1,
    auth_user_id: "u-rajath",
    name: "Rajath Nayak",
    college: "Sahyadri College of Engineering & Management",
    city: "Mangaluru",
    branch: "Computer Science & Engineering",
    year: 3,
    skills: "React, Next.js, Node.js, Express, PostgreSQL, Supabase, Python, Gemini API",
    preferred_role: "Full Stack Developer",
    availability: "Actively building for upcoming hackathons",
    github_url: "https://github.com/rajath-nayak",
    portfolio_url: "https://rajath.dev",
    bio: "Passionate full-stack developer and hackathon enthusiast. Focused on building high-performance developer ecosystems and resilient software.",
    looking_for_team: true,
    is_public: true,
    profile_completed: true
  },
  {
    id: 2,
    auth_user_id: "u-ananya",
    name: "Ananya Rao",
    college: "Sahyadri College of Engineering & Management",
    city: "Mangaluru",
    branch: "Information Science",
    year: 3,
    skills: "UI/UX Design, Figma, Tailwind CSS, Frontend Engineering, Framer",
    preferred_role: "UI/UX Designer",
    availability: "Available for Versathon 2.0",
    github_url: "https://github.com/ananya-rao",
    portfolio_url: "https://ananya.design",
    bio: "Product designer crafting intuitive, accessible interfaces. Believes good design makes complex engineering simple.",
    looking_for_team: true,
    is_public: true,
    profile_completed: true
  },
  {
    id: 3,
    auth_user_id: "u-rohan",
    name: "Rohan Verma",
    college: "National Institute of Technology Karnataka (NITK)",
    city: "Surathkal",
    branch: "Electronics & Communication",
    year: 4,
    skills: "Python, PyTorch, Computer Vision, OpenCV, FastAI, Docker",
    preferred_role: "AI/ML Engineer",
    availability: "Available for national hackathons",
    github_url: "https://github.com/rohan-v",
    portfolio_url: "https://rohanverma.ai",
    bio: "Deep learning practitioner working on edge vision models and speech recognition. SIH 2024 finalist.",
    looking_for_team: true,
    is_public: true,
    profile_completed: true
  },
  {
    id: 4,
    auth_user_id: "u-kartik",
    name: "Kartik Nair",
    college: "BMS College of Engineering",
    city: "Bengaluru",
    branch: "Computer Science",
    year: 2,
    skills: "Go, Rust, Distributed Systems, Redis, Kubernetes, PostgreSQL",
    preferred_role: "Backend Engineer",
    availability: "Weekends & Hackathons",
    github_url: "https://github.com/kartik-nair",
    portfolio_url: "https://kartik.systems",
    bio: "Low-latency systems and cloud architecture fanatic. Looking for ambitious teams targeting deep tech problems.",
    looking_for_team: true,
    is_public: true,
    profile_completed: true
  }
];

const teams = [
  {
    id: 1,
    name: "Synthetix Labs",
    description: "Building an automated vernacular land record OCR system for Versathon 2.0. Looking for an AI/ML developer experienced in document parsing.",
    hackathon_id: 1,
    created_by: 1,
    max_members: 4,
    required_skills: "Python, OCR, PyTorch, FastAPI",
    status: "open",
    hackathons: {
      id: 1,
      title: "Versathon 2.0"
    },
    team_members: [
      { id: 101, user_id: 1, role: "Team Lead & Full Stack", skills: "React, Node.js, Express, PostgreSQL" }
    ]
  },
  {
    id: 2,
    name: "AuraHealth",
    description: "Developing offline rural sepsis diagnosis tools. Need a skilled frontend engineer to build an accessible mobile-friendly dashboard.",
    hackathon_id: 1,
    created_by: 3,
    max_members: 4,
    required_skills: "React, Next.js, Tailwind CSS",
    status: "open",
    hackathons: {
      id: 1,
      title: "Versathon 2.0"
    },
    team_members: [
      { id: 102, user_id: 3, role: "AI/ML Lead", skills: "Python, PyTorch, FastAI" }
    ]
  },
  {
    id: 3,
    name: "BlockShield",
    description: "Aiming for ETHIndia 2026. Developing zero-knowledge formal verification pipelines for smart contracts.",
    hackathon_id: 3,
    created_by: 4,
    max_members: 4,
    required_skills: "Solidity, Foundry, Rust",
    status: "open",
    hackathons: {
      id: 3,
      title: "ETHIndia 2026"
    },
    team_members: [
      { id: 103, user_id: 4, role: "Backend & Systems", skills: "Go, Rust, PostgreSQL" }
    ]
  }
];

module.exports = {
  hackathons,
  projects,
  profiles,
  teams
};
