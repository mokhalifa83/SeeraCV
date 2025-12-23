import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EducationStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const EducationStep = ({ data, updateData }: EducationStepProps) => {
  const education = data.education || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const addEducation = () => {
    updateData("education", [
      ...education,
      {
        institution: "",
        degree: "",
        field: "",
        graduationDate: "",
        gpa: "",
        gpaScale: "4",
        location: "",
      },
    ]);
    setExpandedIndex(education.length);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    updateData("education", updated);
  };

  const removeEducation = (index: number) => {
    const updated = education.filter((_: any, i: number) => i !== index);
    updateData("education", updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          أضف مؤهلاتك التعليمية بالترتيب من الأحدث إلى الأقدم.
        </p>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">لم تضف أي مؤهل تعليمي بعد</p>
          <Button onClick={addEducation} className="gradient-primary">
            <Plus className="ml-2 h-4 w-4" />
            أضف مؤهل تعليمي
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu: any, index: number) => (
            <Card key={index} className="p-4">
              <div
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full text-right cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {edu.degree || "الدرجة العلمية"} - {edu.field || "التخصص"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution || "اسم الجامعة"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEducation(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {expandedIndex === index && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>اسم الجامعة/المعهد *</Label>
                    <Input
                      placeholder="مثال: جامعة الملك سعود"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>الدرجة العلمية *</Label>
                      <Select
                        value={edu.degree}
                        onValueChange={(value) => updateEducation(index, "degree", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الدرجة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ثانوية عامة">ثانوية عامة</SelectItem>
                          <SelectItem value="دبلوم">دبلوم</SelectItem>
                          <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                          <SelectItem value="ماجستير">ماجستير</SelectItem>
                          <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                          <SelectItem value="شهادة مهنية">شهادة مهنية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>التخصص/المجال *</Label>
                      <Input
                        placeholder="مثال: هندسة الحاسب الآلي"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, "field", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>تاريخ التخرج *</Label>
                      <Input
                        type="month"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(index, "graduationDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>المدينة والدولة</Label>
                      <Input
                        placeholder="مثال: الرياض، السعودية"
                        value={edu.location}
                        onChange={(e) => updateEducation(index, "location", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>المعدل التراكمي (اختياري)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="3.75"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                        className="col-span-2"
                      />
                      <Select
                        value={edu.gpaScale}
                        onValueChange={(value) => updateEducation(index, "gpaScale", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">من 4.0</SelectItem>
                          <SelectItem value="5">من 5.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}

          <Button onClick={addEducation} variant="outline" className="w-full">
            <Plus className="ml-2 h-4 w-4" />
            أضف مؤهل تعليمي آخر
          </Button>
        </div>
      )}
    </div>
  );
};

export default EducationStep;
