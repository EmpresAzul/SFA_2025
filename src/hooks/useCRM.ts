
// Mock CRM hooks until tables are created
export const useCRMLeads = () => {
  return {
    data: [],
    isLoading: false,
    error: null,
  };
};

export const useCRMInteractions = (leadId?: string) => {
  return {
    data: [],
    isLoading: false,
    error: null,
  };
};

export const useCreateLead = () => {
  return {
    mutateAsync: async (leadData: any) => {
      console.log('Mock create lead:', leadData);
      return { id: 'mock-id', ...leadData };
    },
    isPending: false,
  };
};

export const useUpdateLead = () => {
  return {
    mutateAsync: async (data: any) => {
      console.log('Mock update lead:', data);
      return data;
    },
    isPending: false,
  };
};

export const useDeleteLead = () => {
  return {
    mutateAsync: async (leadId: string) => {
      console.log('Mock delete lead:', leadId);
    },
    isPending: false,
  };
};

export const useCreateInteraction = () => {
  return {
    mutateAsync: async (interactionData: any) => {
      console.log('Mock create interaction:', interactionData);
      return { id: 'mock-interaction-id', ...interactionData };
    },
    isPending: false,
  };
};

export const useDeleteInteraction = () => {
  return {
    mutateAsync: async (interactionId: string) => {
      console.log('Mock delete interaction:', interactionId);
    },
    isPending: false,
  };
};
