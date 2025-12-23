import { Crown, CheckCircle, Download, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const PlanBadge = () => {
  const {
    hasPaid,
    planType,
    loading,
    downloadsRemaining,
    aiRequestsRemaining,
    isExpired,
    expiresAt
  } = usePaymentStatus();

  if (loading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        جاري التحميل...
      </Badge>
    );
  }

  if (isExpired) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              انتهت الصلاحية
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-right">
            <p className="font-bold mb-1">انتهت صلاحية خطتك</p>
            <p className="text-sm text-muted-foreground">قم بشراء خطة جديدة للاستمرار</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!hasPaid) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline" className="text-muted-foreground">
              خطة مجانية
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-right">
            <p className="font-bold mb-1">الخطة المجانية</p>
            <p className="text-sm text-muted-foreground">قم بالترقية للحصول على ميزات إضافية</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const isProfessional = planType === 'professional';
  const formattedExpiry = expiresAt
    ? format(new Date(expiresAt), 'dd MMMM yyyy', { locale: ar })
    : null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            className={isProfessional
              ? "bg-gradient-to-r from-secondary to-accent text-white border-0"
              : "bg-primary text-primary-foreground"
            }
          >
            {isProfessional ? (
              <>
                <Crown className="h-3 w-3 ml-1" />
                احترافي
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 ml-1" />
                أساسي
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-right w-72">
          <p className="font-bold mb-3 flex items-center gap-1">
            {isProfessional ? (
              <>
                <Crown className="h-4 w-4 text-secondary" />
                الخطة الاحترافية
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-primary" />
                الخطة الأساسية
              </>
            )}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>التحميلات المتبقية:</span>
              </div>
              <span className={`font-bold ${downloadsRemaining === 0 ? 'text-destructive' : 'text-green-600'}`}>
                {downloadsRemaining} / {isProfessional ? 5 : 3}
              </span>
            </div>

            {isProfessional && (
              <div className="flex items-center justify-between text-secondary">
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>طلبات الذكاء الاصطناعي:</span>
                </div>
                <span className={`font-bold ${aiRequestsRemaining === 0 ? 'text-destructive' : ''}`}>
                  {aiRequestsRemaining} / 50
                </span>
              </div>
            )}

            {formattedExpiry && (
              <div className="flex items-center justify-between text-muted-foreground border-t pt-2 mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>تنتهي في:</span>
                </div>
                <span className="text-xs">{formattedExpiry}</span>
              </div>
            )}

            <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
              البيانات محفوظة لمدة {isProfessional ? '30 يوم' : '7 أيام'}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PlanBadge;