import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Award, MapPin, ExternalLink, Github, Globe } from 'lucide-react';
import { PublicPortfolio } from '../types/portfolio';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PublicPortfolioPage = () => {
  const { published_url } = useParams<{ published_url: string }>();
  const [portfolio, setPortfolio] = useState<PublicPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const loadPortfolio = async () => {
      if (!published_url) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/public/${published_url}`);
        if (response.ok) {
          const data = await response.json();
          //console.log('Portfolio data:', data);
          setPortfolio(data);
        } else if (response.status === 404) {
          setError('Portfolio not found');
        } else {
          setError('Failed to load portfolio');
        }
      } catch {
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [published_url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Portfolio not found'}
          </h1>
          <p className="text-gray-600 mb-4">
            The portfolio you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // The API response has fields directly on the portfolio object, not nested under 'content'
  const {
    title,
    bio,
    experiences,
    projects,
    technical_skills,
    publications,
    theme,
    certificates,
    education,
    user_profile,
  } = portfolio;

  // Determine if we should use tab-based (classic) or scrolling (modern) layout
  const isClassicTheme = theme === 'classic';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {isClassicTheme ? (
        // Classic Theme: Tab-based Layout
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-1/3 xl:w-1/4 bg-gray-800 p-6 lg:min-h-screen">
            <div className="text-center mb-8">
              {/* Profile Image Placeholder */}
              <div className="w-32 h-32 bg-gray-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>

              <h1 className="text-2xl font-bold mb-2 text-white">
                {user_profile?.name || title || 'Portfolio'}
              </h1>

              {/* Contact Info Section */}
              <div className="space-y-3 mt-6 text-left">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">EMAIL</p>
                    <p className="text-sm">contact@portfolio.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">LOCATION</p>
                    <p className="text-sm">Location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-900">
            {/* Navigation */}
            <nav className="border-b border-gray-700 p-4 lg:p-6">
              <div className="flex flex-wrap gap-4 lg:gap-8 text-sm">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`transition-colors ${activeTab === 'about' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-300 hover:text-orange-500'}`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`transition-colors ${activeTab === 'skills' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-300 hover:text-orange-500'}`}
                >
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab('education')}
                  className={`transition-colors ${activeTab === 'education' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-300 hover:text-orange-500'}`}
                >
                  Education
                </button>
                <button
                  onClick={() => setActiveTab('certificates')}
                  className={`transition-colors ${activeTab === 'certificates' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-300 hover:text-orange-500'}`}
                >
                  Certificates
                </button>
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`transition-colors ${activeTab === 'experience' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-300 hover:text-orange-500'}`}
                >
                  Experience
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`transition-colors ${activeTab === 'projects' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-300 hover:text-orange-500'}`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setActiveTab('publications')}
                  className={`transition-colors ${activeTab === 'publications' ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-300 hover:text-orange-500'}`}
                >
                  Publications
                </button>
              </div>
            </nav>

            {/* Content Area */}
            <div className="p-4 lg:p-8">
              {/* About Tab */}
              {activeTab === 'about' && (
                <section>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white">
                    About
                    <div className="w-12 h-1 bg-orange-500 mt-2"></div>
                  </h2>
                  {bio && (
                    <div className="mb-8">
                      <p className="text-gray-300 text-base lg:text-lg leading-relaxed">{bio}</p>
                    </div>
                  )}
                </section>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && technical_skills && technical_skills.length > 0 && (
                <section>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white">
                    Skills
                    <div className="w-12 h-1 bg-orange-500 mt-2"></div>
                  </h2>

                  <div className="space-y-8">
                    {technical_skills &&
                      Object.entries(
                        technical_skills.reduce(
                          (acc, skill) => {
                            if (!acc[skill.category]) acc[skill.category] = [];
                            acc[skill.category].push(skill);
                            return acc;
                          },
                          {} as Record<string, typeof technical_skills>
                        )
                      ).map(([category, skills]) => (
                        <div key={category}>
                          <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-orange-500" />
                            <h3 className="text-xl font-semibold text-orange-300">{category}</h3>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {skills.map((skill) => (
                              <div
                                key={skill.id}
                                className="bg-gray-800 px-3 py-2 rounded-lg text-center border border-gray-700 hover:border-orange-500 transition-colors"
                              >
                                <span className="text-sm font-medium text-white">{skill.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Education Tab */}
              {activeTab === 'education' && (
                <section>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white">
                    Education
                    <div className="w-12 h-1 bg-orange-500 mt-2"></div>
                  </h2>
                  {education && education.length > 0 ? (
                    <div className="space-y-6">
                      {education.map((edu) => (
                        <div
                          key={edu.id}
                          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                              {edu.degree}
                            </h3>
                            <div className="text-sm text-gray-400">
                              {edu.start_date} - {edu.end_date}
                            </div>
                          </div>

                          <div className="text-lg mb-2 text-orange-300">{edu.institution}</div>

                          {edu.location && (
                            <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {edu.location}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                            {edu.gpa && <span>GPA: {edu.gpa}</span>}
                            {edu.honors && (
                              <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">
                                {edu.honors}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-300">
                      <p>No education information available.</p>
                    </div>
                  )}
                </section>
              )}

              {/* Certificates Tab */}
              {activeTab === 'certificates' && (
                <section>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white">
                    Certificates
                    <div className="w-12 h-1 bg-orange-500 mt-2"></div>
                  </h2>
                  {certificates && certificates.length > 0 ? (
                    <div className="space-y-6">
                      {certificates.map((cert) => (
                        <div
                          key={cert.id}
                          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                              {cert.title}
                            </h3>
                            <div className="text-sm text-gray-400">{cert.issued_date}</div>
                          </div>

                          <div className="text-lg mb-4 text-orange-300">{cert.issuer}</div>

                          {cert.link && (
                            <a
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1 transition-colors w-fit"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Certificate
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-300">
                      <p>No certificates available.</p>
                    </div>
                  )}
                </section>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && experiences && experiences.length > 0 && (
                <section>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white">
                    Experience
                    <div className="w-12 h-1 bg-orange-500 mt-2"></div>
                  </h2>

                  <div className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                          <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                            {exp.job_title}
                          </h3>
                          <div className="text-sm text-gray-400">
                            {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                          </div>
                        </div>

                        <div className="text-lg mb-2 text-orange-300">
                          {exp.company_url ? (
                            <a
                              href={exp.company_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              {exp.company}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            exp.company
                          )}
                        </div>

                        {exp.location && (
                          <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </p>
                        )}

                        {exp.description && (
                          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && projects && projects.length > 0 && (
                <section>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white">
                    Projects
                    <div className="w-12 h-1 bg-orange-500 mt-2"></div>
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                          {project.featured && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>

                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}

                        <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>

                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1 transition-colors"
                            >
                              <Globe className="h-4 w-4" />
                              Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1 transition-colors"
                            >
                              <Github className="h-4 w-4" />
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Publications Tab */}
              {activeTab === 'publications' && publications && publications.length > 0 && (
                <section>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-white">
                    Publications
                    <div className="w-12 h-1 bg-orange-500 mt-2"></div>
                  </h2>

                  <div className="space-y-4">
                    {publications.map((pub) => (
                      <div
                        key={pub.id}
                        className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-white">{pub.title}</h3>
                        <p className="text-gray-300 mb-3 leading-relaxed">{pub.description}</p>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <div className="text-sm text-gray-400 mb-4 sm:mb-0">
                            <p>Authors: {pub.authors ? pub.authors.join(', ') : 'Not specified'}</p>
                            <p>Date: {pub.date || 'Not specified'}</p>
                          </div>

                          {pub.link && (
                            <a
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1 transition-colors w-fit"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Read Publication
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Modern Theme: Scrolling Layout
        <div>
          {/* Header Section */}
          <div className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4 text-white">
                {user_profile?.name || title || 'Portfolio'}
              </h1>
              {bio && <p className="text-lg mb-6 max-w-2xl mx-auto text-purple-100">{bio}</p>}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
            {/* Skills Section */}
            {technical_skills && technical_skills.length > 0 && (
              <section id="skills" className="pt-16">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">Skills</h2>

                <div className="space-y-8">
                  {technical_skills &&
                    Object.entries(
                      technical_skills.reduce(
                        (acc, skill) => {
                          if (!acc[skill.category]) acc[skill.category] = [];
                          acc[skill.category].push(skill);
                          return acc;
                        },
                        {} as Record<string, typeof technical_skills>
                      )
                    ).map(([category, skills]) => (
                      <div key={category} className="bg-gray-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 text-purple-400">{category}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {skills.map((skill) => (
                            <div
                              key={skill.id}
                              className="bg-gradient-to-r from-purple-500 to-blue-500 px-3 py-2 rounded-lg text-center"
                            >
                              <span className="text-sm font-medium text-white">{skill.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {education && education.length > 0 && (
              <section id="education" className="pt-16">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">Education</h2>

                <div className="space-y-6">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                          {edu.degree}
                        </h3>
                        <div className="text-sm text-gray-400">
                          {edu.start_date} - {edu.end_date}
                        </div>
                      </div>

                      <div className="text-lg mb-2 text-blue-400">{edu.institution}</div>

                      {edu.location && (
                        <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {edu.location}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                        {edu.honors && (
                          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded text-xs">
                            {edu.honors}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certificates Section */}
            {certificates && certificates.length > 0 && (
              <section id="certificates" className="pt-16">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">Certificates</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-gray-800 rounded-lg p-6 border-l-4 border-green-500"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                          {cert.title}
                        </h3>
                        <div className="text-sm text-gray-400">{cert.issued_date}</div>
                      </div>

                      <div className="text-lg mb-4 text-green-400">{cert.issuer}</div>

                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1 transition-colors w-fit"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Certificate
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Section */}
            {experiences && experiences.length > 0 && (
              <section id="experience" className="pt-16">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">Experience</h2>

                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                        <h3 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                          {exp.job_title}
                        </h3>
                        <div className="text-sm text-gray-400">
                          {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                        </div>
                      </div>

                      <div className="text-lg mb-2 text-purple-400">
                        {exp.company_url ? (
                          <a
                            href={exp.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
                            {exp.company}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          exp.company
                        )}
                      </div>

                      {exp.location && (
                        <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </p>
                      )}

                      {exp.description && (
                        <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {projects && projects.length > 0 && (
              <section id="projects" className="pt-16">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">Projects</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-800 rounded-lg p-6 hover:transform hover:scale-105 transition-transform"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                        {project.featured && (
                          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>

                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}

                      <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>

                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="bg-purple-600 text-white px-2 py-1 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1 transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1 transition-colors"
                          >
                            <Github className="h-4 w-4" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Publications Section */}
            {publications && publications.length > 0 && (
              <section id="publications" className="pt-16">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">Publications</h2>

                <div className="space-y-6">
                  {publications.map((pub) => (
                    <div
                      key={pub.id}
                      className="bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500"
                    >
                      <h3 className="text-xl font-semibold mb-2 text-white">{pub.title}</h3>
                      <p className="text-gray-300 mb-3 leading-relaxed">{pub.description}</p>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="text-sm text-gray-400 mb-4 sm:mb-0">
                          <p>Authors: {pub.authors ? pub.authors.join(', ') : 'Not specified'}</p>
                          <p>Date: {pub.date || 'Not specified'}</p>
                        </div>

                        {pub.link && (
                          <a
                            href={pub.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-1 transition-colors w-fit"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Read Publication
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 border-t border-gray-700 bg-gray-900">
        <p>
          © {new Date().getFullYear()} {user_profile?.name || title || 'Portfolio'}. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};
