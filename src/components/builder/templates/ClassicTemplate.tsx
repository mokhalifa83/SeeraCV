import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface TemplateProps {
  data: any;
}

const ClassicTemplate = ({ data }: TemplateProps) => {
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
    <div className="bg-white text-black p-4 md:p-8 print:p-8 rounded-lg shadow-lg border border-gray-300 min-h-[600px]">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName}
            className="w-24 h-24 md:w-32 md:h-32 print:w-32 print:h-32 rounded-full mx-auto mb-4 object-cover border-2 border-gray-800"
          />
        )}
        <h1 className="text-4xl font-bold text-gray-800 mb-2 uppercase tracking-wide">
          {personalInfo.fullName || "الاسم الكامل"}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {personalInfo.jobTitle || "المسمى الوظيفي"}
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
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
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-2">
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
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-2">
            {personalInfo.nationality && (
              <span>الجنسية: {personalInfo.nationality}</span>
            )}
            {personalInfo.birthDate && (
              <span>تاريخ الميلاد: {personalInfo.birthDate}</span>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-400 pb-2 mb-3 uppercase">
            الملخص المهني
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-400 pb-2 mb-3 uppercase">
            الخبرات العملية
          </h2>
          {experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-4" style={{ pageBreakInside: 'avoid' }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{exp.position}</h3>
                  <p className="text-gray-600 italic">{exp.company}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{exp.startDate} - {exp.current ? "حتى الآن" : exp.endDate}</p>
                </div>
              </div>
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
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-400 pb-2 mb-3 uppercase">
            التعليم
          </h2>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-gray-800">{edu.degree} - {edu.field}</h3>
              <p className="text-gray-600 italic">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.graduationDate}</p>
              {edu.gpa && (
                <p className="text-sm text-gray-600">المعدل: {edu.gpa}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-400 pb-2 mb-3 uppercase">
            المهارات
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill: any, index: number) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-1">
                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                <span className="text-xs text-gray-500">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-400 pb-2 mb-3 uppercase">
            الشهادات
          </h2>
          {certificates.map((cert: any, index: number) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold">{cert.name}</h3>
              <p className="text-sm text-gray-600 italic">{cert.issuer}</p>
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

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
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
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getProficiencyColor(lang.proficiency)}`}
                >
                  {lang.name} - {lang.proficiency}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Hobbies */}
      {hobbies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 border-b border-gray-400 pb-2 mb-3 uppercase">
            الهوايات والاهتمامات
          </h2>
          <p className="text-gray-700 text-sm">
            {hobbies.filter((h: string) => h.trim()).join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
