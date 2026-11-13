export const config = {
  university: {
    name: "Vellore Institute of Technology",
    short: "VIT",
    tagline: "A place to learn, a chance to grow",
    logoText: "VIT",
  },

  contact: {
    email: "ugadmission@vit.ac.in",
    phone: "+91-416-2243091",
    address: "VIT, Vellore – 632 014, Tamil Nadu, India",
  },

  social: [
    { name: "Facebook", short: "f", url: "https://www.facebook.com/vituniversity/" },
    { name: "Instagram", short: "ig", url: "https://www.instagram.com/vellore_vit/" },
    { name: "X", short: "X", url: "https://x.com/VIT_univ" },
    { name: "YouTube", short: "YT", url: "https://www.youtube.com/@vituniversityvellore" },
    { name: "LinkedIn", short: "in", url: "https://www.linkedin.com/school/vellore-institute-of-technology/" },
  ],

  logins: {
    student: { title: "Student Login", url: "https://vtop.vit.ac.in/vtop/open/page" },
    faculty: { title: "Faculty Login", url: "https://vtop.vit.ac.in/vtop/open/page" },
  },

  search: {
    url: "https://vit.ac.in/search?q=",
    placeholder: "Search programmes, notices, pages…",
  },

  nav: [
    { title: "Home", url: "#home" },
    {
      title: "About",
      children: [
        { title: "Overview", url: "https://vit.ac.in/about-vit" },
        { title: "Vision & Mission", url: "https://vit.ac.in/about/vision-mission" },
        { title: "Leadership", url: "https://vit.ac.in/about/leadership" },
        { title: "Infrastructure", url: "https://vit.ac.in/about/infrastructure" },
        { title: "Rankings", url: "https://vit.ac.in/about/rankings" },
        { title: "Campus Tour", url: "https://campustour.vit.ac.in/" },
      ],
    },
    {
      title: "Academics",
      children: [
        { title: "Schools", url: "https://vit.ac.in/academics/schools" },
        { title: "Programmes", url: "https://vit.ac.in/admissions/programmes-offered" },
        { title: "Library", url: "https://vit.ac.in/academics/library" },
        { title: "Academic Regulations", url: "https://vit.ac.in/academics" },
      ],
    },
    {
      title: "Admissions",
      children: [
        { title: "Overview", url: "https://vit.ac.in/admissions/overview" },
        { title: "Undergraduate (VITEEE)", url: "https://viteee.vit.ac.in/" },
        { title: "Postgraduate", url: "https://vit.ac.in/admissions/pg" },
        { title: "Research (VITREE)", url: "https://vit.ac.in/admissions/research" },
        { title: "International / NRI", url: "https://vit.ac.in/admissions/international" },
        { title: "Apply Now 2027", url: "https://vit.ac.in/applications-open-2027-28" },
      ],
    },
    {
      title: "Placements",
      children: [
        { title: "Overview", url: "https://vit.ac.in/placements" },
        { title: "Placement Process", url: "https://vit.ac.in/placement-process" },
        { title: "CDC", url: "https://vit.ac.in/cdc" },
      ],
    },
    {
      title: "Research",
      children: [
        { title: "Overview", url: "https://vit.ac.in/research" },
        { title: "Centres", url: "https://vit.ac.in/research/centres" },
        { title: "Publications", url: "https://vit.ac.in/research" },
      ],
    },
    {
      title: "Campus Life",
      children: [
        { title: "Overview", url: "https://vit.ac.in/campus-life" },
        { title: "Hostels", url: "https://vit.ac.in/campus-life/hostels" },
        { title: "Sports", url: "https://vit.ac.in/campus-life/sports" },
        { title: "Fests", url: "https://vit.ac.in/campus-life" },
        { title: "Student Welfare", url: "https://vit.ac.in/campus-life" },
      ],
    },
    { title: "AI Agent", url: "agent.html" },
  ],

  hero: {
    title: "Vellore Institute of Technology",
    subtitle: "A place to learn, a chance to grow",
    image: "https://vit.ac.in/wp-content/uploads/2023/08/infra_image1.webp",
    imageLink: "https://campustour.vit.ac.in/",
    buttons: [
      { title: "Explore Campus", url: "https://campustour.vit.ac.in/" },
      { title: "Admissions 2027", url: "https://viteee.vit.ac.in/" },
    ],
    watchVideo: {
      title: "Watch Campus Tour",
      url: "https://www.youtube.com/watch?v=0Q7h6s8oZ1c",
    },
  },

  campuses: [
    { name: "VIT Vellore", url: "https://vit.ac.in/" },
    { name: "VIT Chennai", url: "https://chennai.vit.ac.in/" },
    { name: "VIT Bhopal", url: "https://vitbhopal.ac.in/" },
    { name: "VIT-AP", url: "https://vitap.ac.in/" },
    { name: "VIT Bengaluru", url: "https://vitbangalore.ac.in/" },
  ],

  announcements: {
    ug: {
      label: "Undergraduate Admission",
      icon: "cap",
      items: [
        { title: "VITEEE 2027 – Apply Now", url: "https://viteee.vit.ac.in/" },
        { title: "B.Tech NRI / Foreign 2027", url: "https://admissions.vit.ac.in/" },
      ],
    },
    pg: {
      label: "Postgraduate Admission",
      icon: "cap",
      items: [
        { title: "MBA 2027 – Apply Now", url: "https://admissions.vit.ac.in/mba-2027-application/login" },
        { title: "M.Tech / MCA / M.Sc", url: "https://vit.ac.in/admissions/pg" },
      ],
    },
    research: {
      label: "Research",
      icon: "flask",
      items: [
        { title: "VITREE 2027 (Ph.D.) – January Session", url: "https://admissions.vit.ac.in/phdapplication/login" },
      ],
    },
    others: {
      label: "Important",
      icon: "shield",
      items: [
        { title: "Beware of Fake Websites", url: "https://vit.ac.in/" },
        { title: "Certificate Verification", url: "https://web.vit.ac.in/CertificateVerification/login" },
        { title: "Scholarships", url: "https://vit.ac.in/scholarship" },
      ],
    },
  },

  latestLinks: [
    { title: "VITEEE 2027 – Apply Now", url: "https://viteee.vit.ac.in/" },
    { title: "MBA 2027 Application Live", url: "https://admissions.vit.ac.in/mba-2027-application/login" },
    { title: "Programmes Offered", url: "https://vit.ac.in/admissions/programmes-offered" },
    { title: "Campus Tour", url: "https://campustour.vit.ac.in/" },
    { title: "Placements", url: "https://vit.ac.in/placements" },
  ],

  newsViewAll: "https://vit.ac.in/news",
  news: [
    { day: "12", month: "Nov", title: "VITEEE 2027 Applications Open", url: "https://viteee.vit.ac.in/", isNew: true },
    { day: "10", month: "Nov", title: "MBA 2027 Online Application Live", url: "https://admissions.vit.ac.in/mba-2027-application/login", isNew: true },
    { day: "08", month: "Nov", title: "VITREE 2027 January Session Announced", url: "https://vit.ac.in/admissions/research" },
    { day: "05", month: "Nov", title: "41st Annual Convocation 2026 – Photos & Videos", url: "https://vit.ac.in/" },
  ],

  banners: [
    {
      title: "Shape Your Future at VIT",
      text: "Join one of India’s leading private universities. World-class infrastructure, strong placements and research culture.",
      button: "Apply Now",
      url: "https://viteee.vit.ac.in/",
      image: "https://vit.ac.in/wp-content/uploads/2024/01/scholarship-header-image-scaled.webp",
    },
    {
      title: "Scholarships & Financial Aid",
      text: "Merit and need-based scholarships for deserving students across programmes.",
      button: "Know More",
      url: "https://vit.ac.in/scholarship",
      image: "https://vit.ac.in/wp-content/uploads/2024/01/header-2.webp",
    },
  ],

  quickAccess: [
    { title: "Student Portal", icon: "grid", url: "https://vtop.vit.ac.in/vtop/open/page" },
    { title: "Results", icon: "chart", url: "https://vit.ac.in/" },
    { title: "Time Table", icon: "cal", url: "https://vit.ac.in/" },
    { title: "Examination", icon: "pen", url: "https://vit.ac.in/" },
    { title: "Scholarship", icon: "award", url: "https://vit.ac.in/scholarship" },
    { title: "Downloads", icon: "download", url: "https://vit.ac.in/" },
  ],

  campusLife: {
    viewAll: { title: "View Gallery", url: "https://vit.ac.in/campus-amenities-photos" },
    images: [
      { title: "Student Life", image: "https://vit.ac.in/wp-content/uploads/2024/01/slider-1-2048x1152.webp", url: "https://vit.ac.in/campus-life" },
      { title: "Cultural Events", image: "https://vit.ac.in/wp-content/uploads/2024/01/header-2.webp", url: "https://vit.ac.in/campus-life" },
      { title: "Campus Views", image: "https://vit.ac.in/wp-content/uploads/2023/08/infra_image1.webp", url: "https://campustour.vit.ac.in/" },
      { title: "Academic Blocks", image: "https://vit.ac.in/wp-content/uploads/2024/01/scholarship-header-image-scaled.webp", url: "https://vit.ac.in/about/infrastructure" },
    ],
  },

  stats: [
    {
      title: "Rankings & Recognition",
      items: [
        { label: "NAAC Grade", value: "A++" },
        { label: "NIRF Engineering", value: "Top Ranked" },
        { label: "QS Subject Rankings", value: "Global" },
        { label: "Institution of Eminence", value: "Recognised" },
      ],
    },
    {
      title: "Placements",
      items: [
        { label: "Recruiters", value: "800+" },
        { label: "Dream & Super Dream", value: "Strong" },
        { label: "Highest Package", value: "Competitive" },
        { label: "Internships", value: "Industry Linked" },
      ],
    },
    {
      title: "Campus & Research",
      items: [
        { label: "Campuses", value: "5" },
        { label: "Research Centres", value: "20+" },
        { label: "International Partners", value: "300+" },
        { label: "Eco-friendly Campus", value: "Yes" },
      ],
    },
  ],

  events: [
    { day: "15", month: "Nov", title: "VITEEE 2027 Awareness Session", place: "Online / Campus", url: "https://viteee.vit.ac.in/" },
    { day: "20", month: "Nov", title: "Campus Open House", place: "Vellore Campus", url: "https://campustour.vit.ac.in/" },
    { day: "25", month: "Nov", title: "Research Symposium", place: "Academic Block", url: "https://vit.ac.in/research" },
  ],
  eventsAll: { title: "View All Events", url: "https://vit.ac.in/events" },

  inFocus: [
    { title: "Infrastructure", image: "https://vit.ac.in/wp-content/uploads/2023/08/infra_image1.webp", url: "https://vit.ac.in/about/infrastructure" },
    { title: "Student Life", image: "https://vit.ac.in/wp-content/uploads/2024/01/slider-1-2048x1152.webp", url: "https://vit.ac.in/campus-life" },
    { title: "Research Culture", image: "https://vit.ac.in/wp-content/uploads/2024/01/scholarship-header-image-scaled.webp", url: "https://vit.ac.in/research" },
    { title: "Cultural Fest", image: "https://vit.ac.in/wp-content/uploads/2024/01/header-2.webp", url: "https://vit.ac.in/campus-life" },
  ],
  focusAll: { title: "View All", url: "https://vit.ac.in/" },

  explore: [
    { title: "Photo Gallery", image: "https://vit.ac.in/wp-content/uploads/2024/01/slider-1-2048x1152.webp", url: "https://vit.ac.in/campus-amenities-photos" },
    { title: "Campus Tour", image: "https://vit.ac.in/wp-content/uploads/2023/08/infra_image1.webp", url: "https://campustour.vit.ac.in/" },
    { title: "Video Gallery", image: "https://vit.ac.in/wp-content/uploads/2024/01/header-2.webp", url: "https://www.youtube.com/@vituniversityvellore" },
    { title: "Hostels", image: "https://vit.ac.in/wp-content/uploads/2024/01/scholarship-header-image-scaled.webp", url: "https://vit.ac.in/campus-life/hostels" },
  ],

  admissions: {
    title: "Admissions 2027",
    text: "Undergraduate, postgraduate, integrated and research programmes across Vellore, Chennai, Bhopal, AP and Bengaluru campuses.",
    image: "https://vit.ac.in/wp-content/uploads/2024/01/scholarship-header-image-scaled.webp",
    links: [
      { title: "Undergraduate", url: "https://viteee.vit.ac.in/" },
      { title: "Postgraduate", url: "https://vit.ac.in/admissions/pg" },
      { title: "Research", url: "https://vit.ac.in/admissions/research" },
    ],
    more: { title: "Explore All Programmes", url: "https://vit.ac.in/admissions/programmes-offered" },
  },

  enquiry: {
    title: "Keep Me Updated",
    button: "Send Message",
    apiUrl: "/api/enquiry",
    success: "Thank you! We will contact you soon.",
    error: "Something went wrong. Please try again or email ugadmission@vit.ac.in",
  },

  programmes: [
    "B.Tech - Computer Science and Engineering",
    "B.Tech - Computer Science and Engineering (AI & ML)",
    "B.Tech - Computer Science and Engineering (Data Science)",
    "B.Tech - Electronics and Communication Engineering",
    "B.Tech - Mechanical Engineering",
    "B.Tech - Biotechnology",
    "B.Tech - Civil Engineering",
    "B.Des. Industrial Design",
    "B.Arch",
    "BBA",
    "BCA",
    "M.Tech. Computer Science and Engineering",
    "M.Tech. VLSI Design",
    "MBA",
    "MCA",
    "M.Sc. Data Science",
    "Ph.D. (Full Time / Part Time)",
  ],

  fake: {
    title: "Beware of Fake Websites & Agents",
    text: "VIT never authorises agents for admissions. Use only official websites (vit.ac.in and campus domains). Never share OTP, passwords or pay personal UPI/bank accounts for seats.",
    link: { title: "Official Safety Information", url: "https://vit.ac.in/" },
  },

  footer: {
    columns: [
      {
        title: "Quick Links",
        links: [
          { title: "Admissions", url: "https://vit.ac.in/admissions/overview" },
          { title: "Programmes", url: "https://vit.ac.in/admissions/programmes-offered" },
          { title: "Placements", url: "https://vit.ac.in/placements" },
          { title: "Research", url: "https://vit.ac.in/research" },
          { title: "Campus Tour", url: "https://campustour.vit.ac.in/" },
        ],
      },
      {
        title: "Student Resources",
        links: [
          { title: "Student Login (VTOP)", url: "https://vtop.vit.ac.in/vtop/open/page" },
          { title: "Library", url: "https://vit.ac.in/academics/library" },
          { title: "Hostels", url: "https://vit.ac.in/campus-life/hostels" },
          { title: "Scholarships", url: "https://vit.ac.in/scholarship" },
        ],
      },
      {
        title: "About VIT",
        links: [
          { title: "About Us", url: "https://vit.ac.in/about-vit" },
          { title: "Infrastructure", url: "https://vit.ac.in/about/infrastructure" },
          { title: "Rankings", url: "https://vit.ac.in/about/rankings" },
          { title: "Contact", url: "https://vit.ac.in/contactus" },
        ],
      },
    ],
    privacy: { title: "Privacy Policy", url: "https://vit.ac.in/privacy-policy" },
    terms: { title: "Terms of Use", url: "https://vit.ac.in/" },
    copyright: "Copyright © {year} Vellore Institute of Technology. All rights reserved.",
  },

  ai: {
    enabled: true,
    name: "VIT Assistant",
    welcome: "Hi! I can help with admissions, programmes, campuses and placements. Ask me anything.",
    apiUrl: "/api/gemini",
    suggestions: ["How to apply for VITEEE?", "Campuses", "Placements", "Scholarships"],
    fallback: "Please check the official Announcements or contact ugadmission@vit.ac.in for the latest information.",
  },

  labels: {
    latestLinks: "Latest Links",
    announcements: "Announcements",
    campus: "Campuses",
    ourCampuses: "Our Campuses",
    latestNews: "Latest News",
    quickAccess: "Quick Access",
    campusLife: "Campus Life",
  },

  auth: {
    storage: { token: "vit_token", user: "vit_user" },
    pages: {
      home: "index.html",
      login: "login.html",
      signup: "signup.html",
      forgot: "forgot.html",
      agent: "agent.html",
    },
    api: {
      login: "/api/auth/login",
      loginVerify: "/api/auth/login/verify",
      signup: "/api/auth/signup",
      forgot: "/api/auth/forgot",
      reset: "/api/auth/reset",
      otpSend: "/api/otp/send",
      otpVerify: "/api/otp/verify",
      formSubmit: "/api/forms/submit",
    },
    otp: { length: 6, resendSeconds: 45 },
    backgrounds: [
      "https://vit.ac.in/wp-content/uploads/2023/08/infra_image1.webp",
      "https://vit.ac.in/wp-content/uploads/2024/01/slider-1-2048x1152.webp",
      "https://vit.ac.in/wp-content/uploads/2024/01/header-2.webp",
    ],
  },

  agent: {
    profileKey: "vit_agent_profile",
    welcome: "Hi! I can fill admission, scholarship, hostel and certificate forms for you, or answer your questions.",
    fields: {
      name: { label: "Full name", question: "What is your full name?", type: "text", minLength: 3 },
      email: { label: "Email", question: "Your email address?", type: "email", pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" },
      phone: { label: "Mobile", question: "Your 10-digit mobile number?", type: "tel", normalize: "phone", pattern: "^[6-9]\\d{9}$" },
      dob: { label: "Date of birth", question: "Your date of birth?", type: "date" },
      gender: { label: "Gender", question: "Gender?", type: "text", options: ["Female", "Male", "Other"] },
      state: { label: "State", question: "Which state do you live in?", type: "text", minLength: 2 },
      programme: { label: "Programme", question: "Which programme are you interested in?", type: "text", suggest: true },
      marks: { label: "12th %", question: "Your 12th percentage?", type: "number", min: 0, max: 100 },
      parent: { label: "Parent / guardian", question: "Parent or guardian's name?", type: "text", minLength: 3 },
      income: { label: "Family income (₹/yr)", question: "Annual family income in ₹?", type: "number", min: 0 },
      address: { label: "Address", question: "Your full address?", type: "text", minLength: 8 },
      regno: { label: "Registration no.", question: "Your registration / application number?", type: "text", minLength: 3 },
    },
    forms: {
      admission: { title: "Admission enquiry", fields: ["name", "email", "phone", "dob", "state", "programme", "marks"] },
      scholarship: { title: "Scholarship application", fields: ["name", "email", "phone", "dob", "parent", "income", "marks"] },
      hostel: { title: "Hostel request", fields: ["name", "email", "phone", "gender", "parent", "address"] },
      certificate: { title: "Certificate verification", fields: ["name", "email", "phone", "regno"] },
    },
  },
};
