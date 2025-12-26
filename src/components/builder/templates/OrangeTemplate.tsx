import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface TemplateProps {
  data: any;
}

const OrangeTemplate = ({ data }: TemplateProps) => {
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || "";
  const experiences = data.experiences || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];
  const projects = data.projects || [];
  const hobbies = data.hobbies || [];

  const getSkillWidth = (level: string) => {
    switch (level) {
      case "خبير": return "100%";
      case "متقدم": return "80%";
      case "متوسط": return "60%";
      case "مبتدئ": return "40%";
      default: return "60%";
    }
  };

  return (
    <div id="cv-orange-template" className="bg-white text-black" dir="rtl">
      {/* Two Column Layout - Responsive */}
      <div className="flex flex-col md:flex-row print:flex-row">
        {/* Sidebar - Dark - Right side for RTL, Full width on mobile */}
        <div className="w-full md:w-[35%] print:w-[35%] bg-[#1a1a1a] text-white p-6 print:p-5" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
          {/* Profile Photo */}
          {personalInfo.photo ? (
            <div className="relative mb-6">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#f5a623]">
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#f5a623] bg-gray-700 mb-6 flex items-center justify-center">
              <span className="text-4xl text-gray-500">👤</span>
            </div>
          )}

          {/* Name and Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {personalInfo.fullName || "الاسم الكامل"}
            </h1>
            <p className="text-[#f5a623] text-sm">
              {personalInfo.jobTitle || "المسمى الوظيفي"}
            </p>
          </div>

          {/* Contact Details */}
          <div className="mb-6">
            <h2 className="text-[#f5a623] font-bold text-sm border-b border-[#f5a623] pb-2 mb-3">
              تفاصيل التواصل
            </h2>
            <div className="space-y-2 text-sm">
              {personalInfo.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#f5a623] flex-shrink-0" />
                  <span>{personalInfo.city}{personalInfo.country && `, ${personalInfo.country}`}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#f5a623] flex-shrink-0" />
                  <span className="break-all text-xs">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#f5a623] flex-shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-[#f5a623] flex-shrink-0" />
                  <span className="break-all text-xs">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[#f5a623] flex-shrink-0" />
                  <span className="break-all text-xs">{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Nationality and Birth Date */}
          {(personalInfo.nationality || personalInfo.birthDate) && (
            <div className="mb-6 text-sm space-y-1">
              {personalInfo.nationality && (
                <p>الجنسية: {personalInfo.nationality}</p>
              )}
              {personalInfo.birthDate && (
                <p>تاريخ الميلاد: {personalInfo.birthDate}</p>
              )}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[#f5a623] font-bold text-sm border-b border-[#f5a623] pb-2 mb-3">
                المهارات
              </h2>
              <div className="space-y-3">
                {skills.map((skill: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#f5a623] rounded-full"
                        style={{ width: getSkillWidth(skill.level), printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[#f5a623] font-bold text-sm border-b border-[#f5a623] pb-2 mb-3">
                اللغات
              </h2>
              <div className="space-y-2 text-sm">
                {languages.map((lang: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{lang.name}</span>
                    <span className="text-[#f5a623]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {hobbies.length > 0 && (
            <div>
              <h2 className="text-[#f5a623] font-bold text-sm border-b border-[#f5a623] pb-2 mb-3">
                الاهتمامات
              </h2>
              <div className="flex flex-wrap gap-2">
                {hobbies.filter((h: string) => h.trim()).map((hobby: string, index: number) => (
                  <span key={index} className="text-xs bg-gray-800 px-2 py-1 rounded" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Full width on mobile, Left side for RTL on desktop */}
        <div className="w-full md:w-[65%] print:w-[65%] p-6 print:p-5 bg-white">
          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#f5a623] rounded-full flex items-center justify-center flex-shrink-0" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                  <span className="text-white text-sm">📋</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-[#f5a623] pb-1 flex-1">
                  نبذة مختصرة
                </h2>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#f5a623] rounded-full flex items-center justify-center flex-shrink-0" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                  <span className="text-white text-sm">🎓</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-[#f5a623] pb-1 flex-1">
                  التعليم
                </h2>
              </div>
              {education.map((edu: any, index: number) => (
                <div key={index} className="mb-4 pr-4 border-r-2 border-[#f5a623]" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', pageBreakInside: 'avoid' }}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-gray-800">{edu.degree}</h3>
                    <span className="text-sm text-[#f5a623]">{edu.graduationDate}</span>
                  </div>
                  <p className="text-sm text-gray-600">{edu.field}</p>
                  <p className="text-sm text-gray-500">{edu.institution}</p>
                  {edu.location && (
                    <p className="text-sm text-gray-500">{edu.location}</p>
                  )}
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">المعدل: {edu.gpa} من {edu.gpaScale}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#f5a623] rounded-full flex items-center justify-center flex-shrink-0" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                  <span className="text-white text-sm">💼</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-[#f5a623] pb-1 flex-1">
                  الخبرة
                </h2>
              </div>
              {experiences.map((exp: any, index: number) => (
                <div key={index} className="mb-5 pr-4 border-r-2 border-[#f5a623]" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', pageBreakInside: 'avoid' }}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-gray-800">{exp.position}</h3>
                    <span className="text-sm text-[#f5a623]">
                      {exp.startDate} - {exp.current ? "حتى الآن" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-700 space-y-1">
                      {exp.responsibilities.map((resp: string, idx: number) => (
                        resp && <li key={idx}>• {resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#f5a623] rounded-full flex items-center justify-center flex-shrink-0" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                  <span className="text-white text-sm">🚀</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-[#f5a623] pb-1 flex-1">
                  المشاريع
                </h2>
              </div>
              {projects.map((project: any, index: number) => (
                <div key={index} className="mb-4 pr-4 border-r-2 border-[#f5a623]" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', pageBreakInside: 'avoid' }}>
                  <h3 className="font-bold text-sm text-gray-800">{project.name}</h3>
                  <p className="text-sm text-gray-700">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm text-[#f5a623] mt-1">التقنيات: {project.technologies}</p>
                  )}
                  {project.date && (
                    <p className="text-sm text-gray-500">تاريخ الإنجاز: {project.date}</p>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
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
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#f5a623] rounded-full flex items-center justify-center flex-shrink-0" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                  <span className="text-white text-sm">📜</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 border-b-2 border-[#f5a623] pb-1 flex-1">
                  الشهادات
                </h2>
              </div>
              {certificates.map((cert: any, index: number) => (
                <div key={index} className="mb-3 pr-4 border-r-2 border-[#f5a623]" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', pageBreakInside: 'avoid' }}>
                  <h3 className="font-bold text-sm text-gray-800">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <div className="text-sm text-gray-500">
                    {cert.issueDate && <span>تاريخ الحصول: {cert.issueDate}</span>}
                    {cert.expiryDate && <span> • انتهاء: {cert.expiryDate}</span>}
                  </div>
                  {cert.credentialId && (
                    <p className="text-sm text-gray-500">رقم الشهادة: {cert.credentialId}</p>
                  )}
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {cert.verificationUrl}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrangeTemplate;