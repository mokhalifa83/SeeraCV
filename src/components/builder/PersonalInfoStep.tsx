import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface PersonalInfoStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

const PersonalInfoStep = ({ data, updateData }: PersonalInfoStepProps) => {
  const personalInfo = data.personalInfo || {};

  const handleChange = (field: string, value: string) => {
    updateData("personalInfo", { ...personalInfo, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("photo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={personalInfo.photo} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {personalInfo.fullName?.charAt(0) || "صورة"}
          </AvatarFallback>
        </Avatar>
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Upload className="h-4 w-4" />
            <span>رفع صورة شخصية (اختياري)</span>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-base">الاسم الكامل *</Label>
        <Input
          id="fullName"
          placeholder="مثال: أحمد محمد العتيبي"
          value={personalInfo.fullName || ""}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className="text-lg"
        />
      </div>

      {/* Job Title */}
      <div className="space-y-2">
        <Label htmlFor="jobTitle" className="text-base">المسمى الوظيفي *</Label>
        <Input
          id="jobTitle"
          placeholder="مثال: مهندس برمجيات"
          value={personalInfo.jobTitle || ""}
          onChange={(e) => handleChange("jobTitle", e.target.value)}
          className="text-lg"
        />
      </div>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base">البريد الإلكتروني *</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={personalInfo.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base">رقم الهاتف *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+966 50 123 4567"
            value={personalInfo.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-base">المدينة *</Label>
          <Input
            id="city"
            placeholder="الرياض"
            value={personalInfo.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-base">الدولة *</Label>
          <Input
            id="country"
            placeholder="المملكة العربية السعودية"
            value={personalInfo.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
          />
        </div>
      </div>

      {/* Optional Links */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium text-muted-foreground">روابط إضافية (اختياري)</h3>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/yourprofile"
            value={personalInfo.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">الموقع الشخصي / المحفظة</Label>
          <Input
            id="website"
            placeholder="https://yourwebsite.com"
            value={personalInfo.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
          />
        </div>
      </div>

      {/* Additional Optional Info */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium text-muted-foreground">معلومات إضافية (اختياري)</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nationality">الجنسية</Label>
            <Input
              id="nationality"
              placeholder="سعودي"
              value={personalInfo.nationality || ""}
              onChange={(e) => handleChange("nationality", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">تاريخ الميلاد</Label>
            <Input
              id="birthDate"
              type="date"
              value={personalInfo.birthDate || ""}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
