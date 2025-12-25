import { Card } from "@/components/ui/card";
import { FileText, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface TemplatePreviewProps {
  data: any;
}

const TemplatePreview = ({ data }: TemplatePreviewProps) => {
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
    <div className="bg-white text-black p-8 rounded-lg shadow-lg border-2 border-muted min-h-[600px] overflow-auto">
      {/* Header */}
      <div className="text-center border-b-4 border-primary pb-6 mb-6">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName || "الصورة الشخصية"}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary/20"
          />
        )}
        <h1 className="text-4xl font-bold text-primary mb-2">
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
              <span>{personalInfo.city}, {personalInfo.country}</span>
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
          <h2 className="text-xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">
            الملخص المهني
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">
            الخبرات العملية
          </h2>
          {experiences.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{exp.position || "المسمى الوظيفي"}</h3>
                  <p className="text-gray-600">{exp.company || "اسم الشركة"}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {exp.location && <p>{exp.location}</p>}
                  <p>
                    {exp.startDate || "من"} - {exp.current ? "حتى الآن" : exp.endDate || "إلى"}
                  </p>
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
          <h2 className="text-xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">
            التعليم
          </h2>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.degree || "الدرجة"} - {edu.field || "التخصص"}</h3>
                  <p className="text-gray-600 text-sm">{edu.institution || "الجامعة"}</p>
                  {edu.location && (
                    <p className="text-sm text-gray-500">{edu.location}</p>
                  )}
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">المعدل: {edu.gpa} من {edu.gpaScale}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{edu.graduationDate || "تاريخ التخرج"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">
            المهارات
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {skill.name} - {skill.level}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certificates */}
      {certificates.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">
            الشهادات والدورات
          </h2>
          {certificates.map((cert: any, index: number) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold">{cert.name}</h3>
              <p className="text-sm text-gray-600">{cert.issuer}</p>
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
          <h2 className="text-xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">
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
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getProficiencyColor(lang.proficiency)}`}
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
          <h2 className="text-xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">
            المشاريع
          </h2>
          {projects.map((project: any, index: number) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold">{project.name}</h3>
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
          <h2 className="text-xl font-bold text-primary border-b-2 border-primary/30 pb-2 mb-3">
            الهوايات والاهتمامات
          </h2>
          <p className="text-gray-700 text-sm">
            {hobbies.filter((h: string) => h.trim()).join(" • ")}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!personalInfo.fullName && !summary && experiences.length === 0 && education.length === 0 && skills.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">ابدأ بملء المعلومات لرؤية المعاينة</p>
        </div>
      )}
    </div>
  );
};

export default TemplatePreview;
