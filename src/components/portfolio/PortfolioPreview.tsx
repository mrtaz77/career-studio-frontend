import { Portfolio } from '@/types/portfolio';

interface PortfolioPreviewProps {
  portfolio: Portfolio;
  template: string;
  theme: string;
  className?: string;
}

// Import template components (to be created)
const TamimTemplate = ({ portfolio, theme }: { portfolio: Portfolio; theme: string }) => (
  <div className="min-h-screen bg-white">
    <div className="max-w-4xl mx-auto p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gray-200 overflow-hidden">
          {portfolio.content.personalInfo.avatar ? (
            <img
              src={portfolio.content.personalInfo.avatar}
              alt={portfolio.content.personalInfo.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {portfolio.content.personalInfo.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {portfolio.content.personalInfo.name}
        </h1>
        <p className="text-xl text-gray-600 mb-4">{portfolio.content.personalInfo.title}</p>
        <p className="text-gray-700 max-w-2xl mx-auto">{portfolio.content.personalInfo.summary}</p>
      </div>

      {/* Experience Section */}
      {portfolio.content.experiences.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
          <div className="space-y-6">
            {portfolio.content.experiences.map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                <p className="text-blue-600 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {portfolio.content.projects.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.content.projects.map((project, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {portfolio.content.skills.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(
              portfolio.content.skills.reduce(
                (acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill);
                  return acc;
                },
                {} as Record<string, typeof portfolio.content.skills>
              )
            ).map(([category, skills]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-700">{skill.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const MahirTemplate = ({ portfolio, theme }: { portfolio: Portfolio; theme: string }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-6xl mx-auto">
      {/* Sidebar */}
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/3 bg-gray-900 text-white p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-700 overflow-hidden">
              {portfolio.content.personalInfo.avatar ? (
                <img
                  src={portfolio.content.personalInfo.avatar}
                  alt={portfolio.content.personalInfo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xl font-bold">
                  {portfolio.content.personalInfo.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">{portfolio.content.personalInfo.name}</h1>
            <p className="text-gray-300">{portfolio.content.personalInfo.title}</p>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Contact</h2>
            <div className="space-y-2 text-sm">
              <p>{portfolio.content.personalInfo.email}</p>
              <p>{portfolio.content.personalInfo.phone}</p>
              <p>{portfolio.content.personalInfo.address}</p>
            </div>
          </div>

          {/* Skills */}
          {portfolio.content.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              <div className="space-y-3">
                {portfolio.content.skills.slice(0, 10).map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span className="text-gray-400">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width:
                            skill.level === 'expert'
                              ? '90%'
                              : skill.level === 'advanced'
                                ? '75%'
                                : skill.level === 'intermediate'
                                  ? '60%'
                                  : '40%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:w-2/3 p-8">
          {/* About */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Me</h2>
            <p className="text-gray-700 leading-relaxed">
              {portfolio.content.personalInfo.summary}
            </p>
          </div>

          {/* Experience */}
          {portfolio.content.experiences.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
              <div className="space-y-6">
                {portfolio.content.experiences.map((exp, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {portfolio.content.projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
              <div className="space-y-6">
                {portfolio.content.projects.map((project, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const MushtariTemplate = ({ portfolio, theme }: { portfolio: Portfolio; theme: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="max-w-4xl mx-auto p-8">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden flex-shrink-0">
            {portfolio.content.personalInfo.avatar ? (
              <img
                src={portfolio.content.personalInfo.avatar}
                alt={portfolio.content.personalInfo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                {portfolio.content.personalInfo.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {portfolio.content.personalInfo.name}
            </h1>
            <p className="text-xl text-blue-600 mb-4">{portfolio.content.personalInfo.title}</p>
            <p className="text-gray-700">{portfolio.content.personalInfo.summary}</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Experience */}
          {portfolio.content.experiences.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
              <div className="space-y-6">
                {portfolio.content.experiences.map((exp, index) => (
                  <div key={index} className="relative pl-6 border-l-2 border-blue-200">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full" />
                    <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {portfolio.content.projects.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h2>
              <div className="grid gap-6">
                {portfolio.content.projects.map((project, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-700 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Live Demo →
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Code →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skills */}
          {portfolio.content.skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
              <div className="space-y-4">
                {Object.entries(
                  portfolio.content.skills.reduce(
                    (acc, skill) => {
                      if (!acc[skill.category]) acc[skill.category] = [];
                      acc[skill.category].push(skill);
                      return acc;
                    },
                    {} as Record<string, typeof portfolio.content.skills>
                  )
                ).map(([category, skills]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {portfolio.content.education.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
              <div className="space-y-4">
                {portfolio.content.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-blue-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export const PortfolioPreview = ({
  portfolio,
  template,
  theme,
  className = '',
}: PortfolioPreviewProps) => {
  const renderTemplate = () => {
    switch (template) {
      case 'tamim':
        return <TamimTemplate portfolio={portfolio} theme={theme} />;
      case 'mahir':
        return <MahirTemplate portfolio={portfolio} theme={theme} />;
      case 'mushtari':
        return <MushtariTemplate portfolio={portfolio} theme={theme} />;
      default:
        return <TamimTemplate portfolio={portfolio} theme={theme} />;
    }
  };

  return <div className={`portfolio-preview ${className}`}>{renderTemplate()}</div>;
};
