import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface TemplateProps {
  data: any;
}

const MinimalTemplate = ({ data }: TemplateProps) => {
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";
  const experiences = data.experiences || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];
  const projects = data.projects || [];
  const hobbies = data.hobbies || [];

  return (
    <div className="bg-white text-black p-5 md:p-10 print:p-10 rounded-lg min-h-[600px]">
      {/* Header - Minimalist Style */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl print:text-5xl font-light text-gray-900 mb-1">
          {personalInfo.fullName || "الاسم الكامل"}
        </h1>
        <p className="text-base md:text-lg print:text-lg text-gray-500 font-light mb-4">
          {personalInfo.jobTitle || "المسمى الوظيفي"}
        </p>

        <div className="flex flex-wrap gap-6 text-xs text-gray-500 font-light">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.city && <span>{personalInfo.city}{personalInfo.country && `, ${personalInfo.country}`}</span>}
        </div>

        {(personalInfo.linkedin || personalInfo.website) && (
          <div className="flex flex-wrap gap-6 text-xs text-gray-500 font-light mt-2">
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>{personalInfo.website}</span>
              </div>
            )}
          </div>
        )}

        {(personalInfo.nationality || personalInfo.birthDate) && (
          <div className="flex flex-wrap gap-6 text-xs text-gray-500 font-light mt-2">
            {personalInfo.nationality && <span>الجنسية: {personalInfo.nationality}</span>}
            {personalInfo.birthDate && <span>تاريخ الميلاد: {personalInfo.birthDate}</span>}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed font-light text-sm">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            الخبرات
          </h2>
          {experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-6" style={{ pageBreakInside: 'avoid' }}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-medium text-gray-900">{exp.position}</h3>
                <span className="text-xs text-gray-500 font-light">
                  {exp.startDate} - {exp.current ? "حتى الآن" : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 font-light">{exp.company}</p>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="mr-4 text-xs text-gray-600 space-y-1 font-light">
                  {exp.responsibilities.map((resp: string, idx: number) => (
                    resp && <li key={idx}>— {resp}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            التعليم
          </h2>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree} - {edu.field}</h3>
                  <p className="text-sm text-gray-600 font-light">{edu.institution}</p>
                  {edu.location && (
                    <p className="text-xs text-gray-500 font-light">{edu.location}</p>
                  )}
                  {edu.gpa && (
                    <p className="text-xs text-gray-500 font-light">المعدل: {edu.gpa} من {edu.gpaScale}</p>
                  )}
                </div>
                <span className="text-xs text-gray-500 font-light">{edu.graduationDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            المهارات
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 font-light">
            {skills.map((skill: any, index: number) => (
              <span key={index}>{skill.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            اللغات
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 font-light">
            {languages.map((lang: any, index: number) => (
              <span key={index}>{lang.name} ({lang.proficiency})</span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            المشاريع
          </h2>
          {projects.map((project: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-gray-900">{project.name}</h3>
              <p className="text-xs text-gray-600 font-light">{project.description}</p>
              {project.technologies && (
                <p className="text-xs text-gray-500 font-light mt-1">التقنيات: {project.technologies}</p>
              )}
              {project.date && (
                <p className="text-xs text-gray-500 font-light">تاريخ الإنجاز: {project.date}</p>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-900 hover:underline break-all"
                >
                  {project.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            الشهادات
          </h2>
          {certificates.map((cert: any, index: number) => (
            <div key={index} className="mb-3">
              <h3 className="text-sm font-medium text-gray-900">{cert.name}</h3>
              <p className="text-xs text-gray-600 font-light">{cert.issuer}</p>
              <div className="text-xs text-gray-500 font-light space-y-1">
                {cert.issueDate && <p>تاريخ الحصول: {cert.issueDate}</p>}
                {cert.expiryDate && <p>تاريخ الانتهاء: {cert.expiryDate}</p>}
                {cert.credentialId && <p>رقم الشهادة: {cert.credentialId}</p>}
                {cert.verificationUrl && (
                  <p>
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:underline break-all"
                    >
                      {cert.verificationUrl}
                    </a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hobbies */}
      {hobbies.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            الهوايات
          </h2>
          <p className="text-xs text-gray-600 font-light">
            {hobbies.filter((h: string) => h.trim()).join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
