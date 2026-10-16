import "./WhyChooseUs.css";

function WhyChooseUs() {
  const features = [
    {
      icon: "🎓",
      title: "Expert Instructors",
      description:
        "Learn from experienced instructors who focus on practical and easy-to-understand teaching.",
    },
    {
      icon: "💻",
      title: "Practical Learning",
      description:
        "Build your skills through real-world examples, projects, lessons, and quizzes.",
    },
    {
      icon: "📈",
      title: "Track Your Progress",
      description:
        "Keep track of completed lessons, quiz scores, and your overall course progress.",
    },
    {
      icon: "🏆",
      title: "Earn Certificates",
      description:
        "Complete your course and earn a certificate that you can showcase in your portfolio.",
    },
  ];

  return (
    <section className="why-section">

      {/* Header */}
      <div className="why-header">

        <span className="section-label">
          WHY CHOOSE US
        </span>

        <h2>
          Learn skills that actually
          <span> move you forward.</span>
        </h2>

        <p>
          Everything you need to learn, practice,
          and track your progress in one place.
        </p>

      </div>


      {/* Features */}
      <div className="why-grid">

        {features.map((feature, index) => (

          <div
            className="why-card"
            key={feature.title}
          >

            <div className="why-number">
              0{index + 1}
            </div>

            <div className="why-icon">
              {feature.icon}
            </div>

            <h3>
              {feature.title}
            </h3>

            <p>
              {feature.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default WhyChooseUs;