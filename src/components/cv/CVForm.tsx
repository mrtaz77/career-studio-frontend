import { SaveContent } from '@/types/cv';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { EducationSection } from './sections/EducationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { PublicationSection } from './sections/PublicationSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';

interface CVFormProps {
  data: SaveContent;
  onChange: (data: Partial<SaveContent>) => void;
}

export const CVForm = ({ data, onChange }: CVFormProps) => {
  return (
    <div className="p-6 space-y-8 bg-gradient-to-b from-white to-blue-50/30 min-h-full">
      <div className="text-center mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Build Your Professional CV
          </h2>
          <p className="text-gray-600 mt-3 text-lg">
            Fill in your details to create a stunning resume
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <PersonalInfoSection
            data={data.personalInfo}
            onChange={(personalInfo) => onChange({ personalInfo })}
          />
        </div>

        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <EducationSection
            data={data.education}
            onChange={(education) => onChange({ education })}
          />
        </div>

        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <ExperienceSection
            data={data.experiences}
            onChange={(experiences) => onChange({ experiences })}
          />
        </div>

        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <PublicationSection
            data={data.publications}
            onChange={(publications) => onChange({ publications })}
          />
        </div>

        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <SkillsSection
            data={data.technical_skills}
            onChange={(technical_skills) => onChange({ technical_skills })}
          />
        </div>

        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <ProjectsSection data={data.projects} onChange={(projects) => onChange({ projects })} />
        </div>
      </div>
    </div>
  );
};
