import { SaveContent } from '@/types/cv';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Mail, Phone, MapPin, Calendar, Globe } from 'lucide-react';

interface CVPreviewProps {
  data: SaveContent;
  isLoading: boolean;
}

export const CVPreview = ({ data, isLoading }: CVPreviewProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  const groupSkillsByCategory = () => {
    return data.technical_skills.reduce(
      (acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
      },
      {} as Record<string, typeof data.technical_skills>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Recompiling CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-[8.5in] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-none font-sans"
      id="cv-preview"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2 tracking-wider text-white">
            {data.personalInfo?.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm mt-4 opacity-95 font-medium">
            {data.personalInfo?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="font-normal">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="font-normal">{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo?.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-normal">{data.personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Education Section */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300 uppercase tracking-wider">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{edu.degree}</h3>
                    <p className="text-slate-700 font-semibold text-base">{edu.institution}</p>
                    {edu.location && (
                      <p className="text-slate-600 text-sm font-medium italic">{edu.location}</p>
                    )}
                    <div className="flex gap-4 mt-2">
                      {edu.gpa && (
                        <span className="text-sm text-slate-700 font-semibold">GPA: {edu.gpa}</span>
                      )}
                      {edu.honors && (
                        <span className="text-sm text-slate-700 font-bold italic">
                          {edu.honors}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-slate-600 min-w-[120px] font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(edu.startDate)} -{' '}
                        {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300 uppercase tracking-wider">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-1">{exp.jobTitle}</h3>
                      <p className="text-slate-700 font-semibold text-base">{exp.company}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        {exp.location && (
                          <>
                            <MapPin className="h-3 w-3" />
                            <span className="font-medium italic">{exp.location}</span>
                          </>
                        )}
                        {exp.locationType && (
                          <span className="bg-slate-200 px-2 py-1 rounded text-xs font-semibold text-slate-700">
                            {exp.locationType}
                          </span>
                        )}
                        {exp.employmentType && (
                          <span className="bg-slate-200 px-2 py-1 rounded text-xs font-semibold text-slate-700">
                            {exp.employmentType}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-600 min-w-[120px] font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(exp.startDate)} -{' '}
                          {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {exp.description && (
                    <div
                      className="text-slate-700 mt-3 prose prose-sm max-w-none font-normal leading-relaxed [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>li]:mb-1 [&>li]:text-slate-700"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300 uppercase tracking-wider">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
                    {project.urls.length > 0 && (
                      <div className="flex gap-2">
                        {project.urls.map((url, index) => (
                          <a
                            key={index}
                            href={url.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-600 hover:text-slate-800 flex items-center gap-1 text-sm font-medium"
                          >
                            <Globe className="h-3 w-3" />
                            {url.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {project.description && (
                    <div
                      className="text-slate-700 prose prose-sm max-w-none mb-3 font-normal leading-relaxed [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&>li]:mb-1 [&>li]:text-slate-700"
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  )}

                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-sm text-slate-700 mr-2 font-semibold">
                        Technologies:
                      </span>
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs bg-slate-200 text-slate-800 px-2 py-1 rounded font-medium"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications Section */}
        {data.publications.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300 uppercase tracking-wider">
              Publications
            </h2>
            <div className="space-y-3">
              {data.publications.map((pub) => (
                <div key={pub.id}>
                  <h3 className="font-bold text-slate-800 text-base mb-1">{pub.title}</h3>
                  <p className="text-slate-700 italic font-medium">
                    {pub.journal}
                    {pub.year && <span className="font-bold ml-2">({pub.year})</span>}
                  </p>
                  {pub.urls.length > 0 && (
                    <div className="flex gap-3 mt-1">
                      {pub.urls.map((url, index) => (
                        <a
                          key={index}
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-800 flex items-center gap-1 text-sm font-medium"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {url.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {data.technical_skills.length > 0 && (
          <section>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300 uppercase tracking-wider">
              Technical Skills
            </h2>
            <div className="space-y-4">
              {Object.entries(groupSkillsByCategory()).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="font-bold text-slate-800 mb-2 text-base">{category}:</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((skill, index) => (
                      <span key={skill.id} className="text-slate-700 font-medium">
                        {skill.name}
                        {index < skills.length - 1 && (
                          <span className="mx-1 text-slate-500 font-bold">•</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
