import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PaymentDetails {
  id: string;
  plan_type: string;
  downloads_used: number;
  ai_requests_used: number;
  expires_at: string;
  created_at: string;
}

interface PaymentStatusResult {
  hasPaid: boolean;
  planType: string | null;
  payment: PaymentDetails | null;
  loading: boolean;
  downloadsRemaining: number;
  aiRequestsRemaining: number;
  isExpired: boolean;
  expiresAt: string | null;
  refetchPaymentStatus: () => Promise<void>;
  incrementDownloads: () => Promise<boolean>;
  incrementAiRequests: () => Promise<boolean>;
  forceDecrementAiRequests: () => void;
}

export const usePaymentStatus = (): PaymentStatusResult => {
  const queryClient = useQueryClient();

  // Query configuration
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['payment-status'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase.functions.invoke('check-payment-status');
      if (error) throw error;
      return data;
    },
    staleTime: 0, // Always fetch fresh data
  });

  // Extract data with defaults
  const hasPaid = data?.hasPaid || false;
  const planType = data?.planType || null;
  const payment = data?.payment || null;

  // Calculate Limits
  const getDownloadsLimit = () => {
    if (planType === 'professional') return 5;
    if (planType === 'basic') return 3;
    return 0;
  };

  const getAiRequestsLimit = () => {
    if (planType === 'professional') return 50;
    return 0;
  };

  const downloadsRemaining = payment
    ? Math.max(0, getDownloadsLimit() - (payment.downloads_used || 0))
    : 0;

  const aiRequestsRemaining = payment
    ? Math.max(0, getAiRequestsLimit() - (payment.ai_requests_used || 0))
    : 0;

  const isExpired = payment?.expires_at
    ? new Date(payment.expires_at) < new Date()
    : false;

  const expiresAt = payment?.expires_at || null;

  // Mutations
  const incrementDownloadsMutation = useMutation({
    mutationFn: async () => {
      if (!payment || downloadsRemaining <= 0) throw new Error("No downloads remaining");
      const { error } = await supabase.functions.invoke('update-usage', {
        body: { type: 'download' }
      });
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-status'] });
    },
  });

  const incrementAiRequestsMutation = useMutation({
    mutationFn: async () => {
      if (!payment || (planType === 'professional' && aiRequestsRemaining <= 0)) throw new Error("No AI requests remaining");
      const { error } = await supabase.functions.invoke('update-usage', {
        body: { type: 'ai_request' }
      });
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-status'] });
    },
  });

  const incrementDownloads = async (): Promise<boolean> => {
    try {
      await incrementDownloadsMutation.mutateAsync();
      return true;
    } catch (e: any) {
      console.error("incrementDownloads error:", e);
      // Re-throw with a clear message
      throw new Error(e.message || "فشل في تحديث رصيد التحميل");
    }
  };

  const incrementAiRequests = async (): Promise<boolean> => {
    try {
      await incrementAiRequestsMutation.mutateAsync();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const forceDecrementAiRequests = () => {
    queryClient.setQueryData(['payment-status'], (oldData: any) => {
      if (!oldData || !oldData.payment) return oldData;
      return {
        ...oldData,
        payment: {
          ...oldData.payment,
          ai_requests_used: (oldData.payment.ai_requests_used || 0) + 1
        }
      };
    });
  };

  const refetchPaymentStatus = async (): Promise<void> => {
    console.log('🔄 Refetching payment status...');
    await refetch();
    console.log('✅ Payment status refetched and updated');
  };

  return {
    hasPaid: hasPaid && !isExpired,
    planType,
    payment,
    loading: isLoading,
    downloadsRemaining,
    aiRequestsRemaining,
    isExpired,
    expiresAt,
    refetchPaymentStatus,
    incrementDownloads,
    incrementAiRequests,
    forceDecrementAiRequests
  };
};