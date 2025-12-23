import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CertificatesStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const CertificatesStep = ({ data, updateData }: CertificatesStepProps) => {
  const certificates = data.certificates || [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addCertificate = () => {
    updateData("certificates", [
      ...certificates,
      {
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        verificationUrl: "",
      },
    ]);
    setExpandedIndex(certificates.length);
  };

  const updateCertificate = (index: number, field: string, value: any) => {
    const updated = [...certificates];
    updated[index] = { ...updated[index], [field]: value };
    updateData("certificates", updated);
  };

  const removeCertificate = (index: number) => {
    const updated = certificates.filter((_: any, i: number) => i !== index);
    updateData("certificates", updated);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          أضف الشهادات المهنية والدورات التدريبية التي حصلت عليها (اختياري).
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">لم تضف أي شهادة أو دورة بعد</p>
          <Button onClick={addCertificate} variant="outline">
            <Plus className="ml-2 h-4 w-4" />
            أضف شهادة أو دورة
          </Button>
          <div className="mt-6">
            <Button variant="link" className="text-muted-foreground" onClick={() => {}}>
              تخطي هذه الخطوة
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert: any, index: number) => (
            <Card key={index} className="p-4">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full text-right"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {cert.name || "اسم الشهادة"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer || "الجهة المانحة"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCertificate(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </button>

              {expandedIndex === index && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>اسم الشهادة/الدورة *</Label>
                    <Input
                      placeholder="مثال: AWS Certified Solutions Architect"
                      value={cert.name}
                      onChange={(e) => updateCertificate(index, "name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>الجهة المانحة *</Label>
                    <Input
                      placeholder="مثال: Amazon Web Services"
                      value={cert.issuer}
                      onChange={(e) => updateCertificate(index, "issuer", e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>تاريخ الحصول عليها *</Label>
                      <Input
                        type="month"
                        value={cert.issueDate}
                        onChange={(e) => updateCertificate(index, "issueDate", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>تاريخ انتهاء الصلاحية</Label>
                      <Input
                        type="month"
                        value={cert.expiryDate}
                        onChange={(e) => updateCertificate(index, "expiryDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>رقم الشهادة (اختياري)</Label>
                    <Input
                      placeholder="مثال: ABC-12345-XYZ"
                      value={cert.credentialId}
                      onChange={(e) => updateCertificate(index, "credentialId", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>رابط التحقق (اختياري)</Label>
                    <Input
                      type="url"
                      placeholder="https://verify.example.com/certificate"
                      value={cert.verificationUrl}
                      onChange={(e) => updateCertificate(index, "verificationUrl", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}

          <Button onClick={addCertificate} variant="outline" className="w-full">
            <Plus className="ml-2 h-4 w-4" />
            أضف شهادة أو دورة أخرى
          </Button>
        </div>
      )}

      {/* Popular Certifications */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-medium text-primary mb-2">أمثلة على الشهادات الشائعة:</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>• شهادات جوجل المهنية (Google Career Certificates)</div>
          <div>• AWS, Azure, أو شهادات سحابية أخرى</div>
          <div>• PMP, PRINCE2 لإدارة المشاريع</div>
          <div>• CPA, CFA للمحاسبة والمالية</div>
          <div>• IELTS, TOEFL للغة الإنجليزية</div>
          <div>• دورات Coursera, Udemy, LinkedIn Learning</div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesStep;
