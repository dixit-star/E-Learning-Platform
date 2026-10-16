// const SAMPLE_VIDEO =
//   "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

// const COURSES = [
//   {
//     id: "c1",

//     title: "React for Interfaces That Feel Alive",

//     instructor: "Maya Okonkwo",

//     category: "Web Development",

//     difficulty: "Intermediate",

//     duration: "3h 10m",

//     accent: "#B8860B",

//     rating: 4.8,

//     reviewCount: 214,

//     description:
//       "Build interactive UIs with components, state, and events. You'll leave knowing how React actually thinks, not just how to copy patterns.",

//     modules: [
//       {
//         id: "m1",

//         title: "Foundations",

//         lessons: [
//           {
//             id: "l1",
//             title: "Introduction of React js",
//             duration: "32:35",
//             video: "https://www.youtube.com/embed/4z9bvgTlxKw",
//           },

//           {
//             id: "l2",
//             title: "How to install React JS",
//             duration: "8:30",
//             video: "https://www.youtube.com/embed/iZrSzitoRZo",
//           },
//         ],
//       },

//       {
//         id: "m2",

//         title: "Interaction",

//         lessons: [
//           {
//             id: "l3",
//             title: "Class vs ClassName",
//             duration: "14:20",
//             video: "https://www.youtube.com/embed/PYMljVI2u_o",
//           },

//           {
//             id: "l4",
//             title: "UseState Hook",
//             duration: "19:36",
//             video:"https://www.youtube.com/embed/gDWn1kCnz3M",
//           },
//         ],
//       },
//     ],

//     quiz: [
//       {
//         id: "q1",
//         type: "mcq",
//         question:
//           "Which hook manages local state in a function component?",
//         options: [
//           "useEffect",
//           "useState",
//           "useRef",
//           "useMemo",
//         ],
//         answer: 1,
//       },

//       {
//         id: "q2",
//         type: "tf",
//         question:
//           "Props can be reassigned inside the child that receives them.",
//         options: ["True", "False"],
//         answer: 1,
//       },

//       {
//         id: "q3",
//         type: "fill",
//         question:
//           "The array method most often used to render a list in JSX is ____.",
//         answer: "map",
//       },
//     ],
//   },

//   // =========================================================
//   // COURSE 2
//   // =========================================================

//   {
//     id: "c2",

//     title: "Visual Design Systems, from Scratch",

//     instructor: "Priya Nair",

//     category: "Design",

//     difficulty: "Beginner",

//     duration: "2h 45m",

//     accent: "#1F7A6C",

//     rating: 4.9,

//     reviewCount: 156,

//     description:
//       "Type scales, color systems, and spacing rules that hold together. A practical path from blank canvas to a system you can defend in a review.",

//     modules: [
//       {
//         id: "m1",

//         title: "Type & Color",

//         lessons: [
//           {
//             id: "l1",
//             title: "Building a type scale",
//             duration: "10:20",
//             video: SAMPLE_VIDEO,
//           },

//           {
//             id: "l2",
//             title: "Choosing a palette",
//             duration: "9:05",
//             video: SAMPLE_VIDEO,
//           },
//         ],
//       },

//       {
//         id: "m2",

//         title: "Structure",

//         lessons: [
//           {
//             id: "l3",
//             title: "Spacing and rhythm",
//             duration: "8:30",
//             video: SAMPLE_VIDEO,
//           },

//           {
//             id: "l4",
//             title: "Component tokens",
//             duration: "12:15",
//             video: SAMPLE_VIDEO,
//           },
//         ],
//       },
//     ],

//     quiz: [
//       {
//         id: "q1",
//         type: "mcq",
//         question:
//           "A modular type scale is generated using which operation?",
//         options: [
//           "Addition",
//           "A fixed ratio",
//           "Random steps",
//           "Subtraction",
//         ],
//         answer: 1,
//       },

//       {
//         id: "q2",
//         type: "tf",
//         question:
//           "Design tokens should be hard-coded into every component separately.",
//         options: ["True", "False"],
//         answer: 1,
//       },

//       {
//         id: "q3",
//         type: "fill",
//         question:
//           "The consistent gap unit used across a layout is often called a spacing ____.",
//         answer: "scale",
//       },
//     ],
//   },

//   // =========================================================
//   // COURSE 3
//   // =========================================================

//   {
//     id: "c3",

//     title: "APIs and Databases for Real Apps",

//     instructor: "Daniel Osei",

//     category: "Backend",

//     difficulty: "Intermediate",

//     duration: "4h 05m",

//     accent: "#5B4E8C",

//     rating: 4.7,

//     reviewCount: 189,

//     description:
//       "Design REST endpoints, model data properly, and connect a database without guessing. Covers auth, validation, and the mistakes that bite later.",

//     modules: [
//       {
//         id: "m1",

//         title: "REST Basics",

//         lessons: [
//           {
//             id: "l1",
//             title: "Resources and routes",
//             duration: "9:50",
//             video: SAMPLE_VIDEO,
//           },

//           {
//             id: "l2",
//             title: "Status codes that matter",
//             duration: "6:40",
//             video: SAMPLE_VIDEO,
//           },
//         ],
//       },

//       {
//         id: "m2",

//         title: "Data & Auth",

//         lessons: [
//           {
//             id: "l3",
//             title: "Modeling relationships",
//             duration: "13:10",
//             video: SAMPLE_VIDEO,
//           },

//           {
//             id: "l4",
//             title: "JWT authentication",
//             duration: "11:30",
//             video: SAMPLE_VIDEO,
//           },
//         ],
//       },
//     ],

//     quiz: [
//       {
//         id: "q1",
//         type: "mcq",
//         question:
//           "Which status code means the resource was created?",
//         options: [
//           "200",
//           "201",
//           "301",
//           "404",
//         ],
//         answer: 1,
//       },

//       {
//         id: "q2",
//         type: "tf",
//         question:
//           "Passwords should be stored using reversible encryption.",
//         options: ["True", "False"],
//         answer: 1,
//       },

//       {
//         id: "q3",
//         type: "fill",
//         question:
//           "JWT stands for JSON Web ____.",
//         answer: "token",
//       },
//     ],
//   },

//   // =========================================================
//   // COURSE 4
//   // =========================================================

//   {
//     id: "c4",

//     title: "Data Analysis Without the Guesswork",

//     instructor: "Elena Vasquez",

//     category: "Data",

//     difficulty: "Beginner",

//     duration: "3h 30m",

//     accent: "#A44A3F",

//     rating: 4.6,

//     reviewCount: 98,

//     description:
//       "Clean, explore, and chart real datasets. Build the habit of asking what a number actually means before you present it.",

//     modules: [
//       {
//         id: "m1",

//         title: "Getting Clean Data",

//         lessons: [
//           {
//             id: "l1",
//             title: "Spotting bad data",
//             duration: "7:15",
//             video: SAMPLE_VIDEO,
//           },

//           {
//             id: "l2",
//             title: "Handling missing values",
//             duration: "9:00",
//             video: SAMPLE_VIDEO,
//           },
//         ],
//       },

//       {
//         id: "m2",

//         title: "Telling the Story",

//         lessons: [
//           {
//             id: "l3",
//             title: "Choosing the right chart",
//             duration: "8:45",
//             video: SAMPLE_VIDEO,
//           },

//           {
//             id: "l4",
//             title: "Avoiding misleading axes",
//             duration: "6:20",
//             video: SAMPLE_VIDEO,
//           },
//         ],
//       },
//     ],

//     quiz: [
//       {
//         id: "q1",
//         type: "mcq",
//         question:
//           "Which chart is best for showing change over time?",
//         options: [
//           "Pie chart",
//           "Line chart",
//           "Scatter plot",
//           "Donut chart",
//         ],
//         answer: 1,
//       },

//       {
//         id: "q2",
//         type: "tf",
//         question:
//           "Truncating a bar chart's y-axis never misleads readers.",
//         options: ["True", "False"],
//         answer: 1,
//       },

//       {
//         id: "q3",
//         type: "fill",
//         question:
//           "A value that sits far outside the rest of the data is called an ____.",
//         answer: "outlier",
//       },
//     ],
//   },

//   // =========================================================
//   // COURSE 5
//   // =========================================================

//   {
//     id: "c5",

//     title: "Positioning a Product People Remember",

//     instructor: "Tomás Ferreira",

//     category: "Marketing",

//     difficulty: "Beginner",

//     duration: "2h 15m",

//     accent: "#2C6E9E",

//     rating: 4.5,

//     reviewCount: 74,

//     description:
//       "Find the sentence that makes your product obvious. Positioning, messaging hierarchy, and how to test both before you commit.",

//     modules: [
//       {
//         id: "m1",

//         title: "Finding the Angle",

//         lessons: [
//           {
//             id: "l1",
//             title: "Who it's really for",
//             duration: "8:00",
//             video: SAMPLE_VIDEO,
//           },

//           {
//             id: "l2",
//             title: "What it replaces",
//             duration: "7:30",
//             video: SAMPLE_VIDEO,
//           },
//         ],
//       },

//       {
//         id: "m2",

//         title: "Saying It Well",

//         lessons: [
//           {
//             id: "l3",
//             title: "Messaging hierarchy",
//             duration: "9:10",
//             video: SAMPLE_VIDEO,
//           },

//           {
//             id: "l4",
//             title: "Testing a headline",
//             duration: "6:50",
//             video: SAMPLE_VIDEO,
//           },
//         ],
//       },
//     ],

//     quiz: [
//       {
//         id: "q1",
//         type: "mcq",
//         question:
//           "Positioning primarily answers which question?",
//         options: [
//           "What does it cost?",
//           "Who is it for and why does it matter?",
//           "What color is the logo?",
//           "How many features exist?",
//         ],
//         answer: 1,
//       },

//       {
//         id: "q2",
//         type: "tf",
//         question:
//           "A single headline should try to speak to every possible audience.",
//         options: ["True", "False"],
//         answer: 1,
//       },

//       {
//         id: "q3",
//         type: "fill",
//         question:
//           "The product or habit you're replacing in a customer's life is your ____.",
//         answer: "alternative",
//       },
//     ],
//   },
// ];

// export { COURSES };