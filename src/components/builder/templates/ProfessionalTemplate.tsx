import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface TemplateProps {
  data: any;
}

const ProfessionalTemplate = ({ data }: TemplateProps) => {
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
    <div className="bg-white text-black rounded-lg min-h-[600px]">
      {/* Header with gradient - Responsive Layout */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8 rounded-t-lg print:rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-6 items-center md:items-start">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow-lg mx-auto md:mx-0"
            />
          )}
          <div className="text-center md:text-right">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {personalInfo.fullName || "الاسم الكامل"}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-3">
              {personalInfo.jobTitle || "المسمى الوظيفي"}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-xs md:text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{personalInfo.city}{personalInfo.country && `, ${personalInfo.country}`}</span>
                </div>
              )}
            </div>
            {(personalInfo.linkedin || personalInfo.website) && (
              <div className="flex flex-wrap items-center justify-start gap-4 text-sm mt-2">
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-1">
                    <Linkedin className="h-4 w-4" />
                    <span className="text-xs">{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span className="text-xs">{personalInfo.website}</span>
                  </div>
                )}
              </div>
            )}
            {(personalInfo.nationality || personalInfo.birthDate) && (
              <div className="flex flex-wrap items-center justify-start gap-4 text-xs mt-2 opacity-90">
                {personalInfo.nationality && <span>الجنسية: {personalInfo.nationality}</span>}
                {personalInfo.birthDate && <span>تاريخ الميلاد: {personalInfo.birthDate}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              الملخص المهني
            </h2>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              الخبرات العملية
            </h2>
            {experiences.map((exp: any, index: number) => (
              <div key={index} className="mb-4 pr-4 border-r-4 border-blue-200" style={{ pageBreakInside: 'avoid' }}>
                <h3 className="font-bold text-lg text-gray-800">{exp.position}</h3>
                <p className="text-blue-600 font-medium">{exp.company}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {exp.startDate} - {exp.current ? "حتى الآن" : exp.endDate}
                </p>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="mr-5 text-sm text-gray-700 space-y-1">
                    {exp.responsibilities.map((resp: string, idx: number) => (
                      resp && <li key={idx}>• {resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              التعليم
            </h2>
            {education.map((edu: any, index: number) => (
              <div key={index} className="mb-3 pr-4 border-r-4 border-blue-200" style={{ pageBreakInside: 'avoid' }}>
                <h3 className="font-bold text-gray-800">{edu.degree} - {edu.field}</h3>
                <p className="text-blue-600">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.graduationDate}</p>
                {edu.gpa && (
                  <p className="text-sm text-gray-600">المعدل: {edu.gpa} من {edu.gpaScale}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              المهارات
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: any, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              الشهادات
            </h2>
            {certificates.map((cert: any, index: number) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-gray-800">{cert.name}</h3>
                <p className="text-sm text-blue-600">{cert.issuer}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  {cert.issueDate && <p>تاريخ الحصول: {cert.issueDate}</p>}
                  {cert.expiryDate && <p>تاريخ الانتهاء: {cert.expiryDate}</p>}
                  {cert.credentialId && <p>رقم الشهادة: {cert.credentialId}</p>}
                  {cert.verificationUrl && (
                    <p>
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
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

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              اللغات
            </h2>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang: any, index: number) => {
                const getProficiencyColor = (prof: string) => {
                  if (prof.includes("الأم")) return "bg-green-100 text-green-700 border-green-300";
                  if (prof === "ممتاز") return "bg-blue-100 text-blue-700 border-blue-300";
                  if (prof.includes("جيد جدًا")) return "bg-purple-100 text-purple-700 border-purple-300";
                  if (prof === "جيد") return "bg-orange-100 text-orange-700 border-orange-300";
                  return "bg-gray-100 text-gray-700 border-gray-300";
                };

                return (
                  <span
                    key={index}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${getProficiencyColor(lang.proficiency)}`}
                  >
                    {lang.name} - {lang.proficiency}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              المشاريع
            </h2>
            {projects.map((project: any, index: number) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-700">{project.description}</p>
                {project.technologies && (
                  <p className="text-sm text-gray-600 mt-1">التقنيات: {project.technologies}</p>
                )}
                <div className="text-sm text-gray-500 mt-1 space-y-1">
                  {project.date && <p>تاريخ الإنجاز: {project.date}</p>}
                  {project.link && (
                    <p>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {project.link}
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600"></div>
              الهوايات والاهتمامات
            </h2>
            <p className="text-gray-700 text-sm">
              {hobbies.filter((h: string) => h.trim()).join(" • ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
