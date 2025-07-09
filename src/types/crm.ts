export interface CRMLead {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: 'prospeccao' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechamento' | 'perdido';
  value: number;
  probability: number;
  next_follow_up?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMInteraction {
  id: string;
  user_id: string;
  lead_id: string;
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'follow-up';
  description: string;
  outcome?: string;
  interaction_date: string;
  created_at: string;
}

export interface CRMLeadWithInteractions extends CRMLead {
  interactions?: CRMInteraction[];
}

export interface CreateLeadData {
  name: string;
  company: string;
  email: string;
  phone?: string;
  source?: string;
  value?: number;
  probability?: number;
  next_follow_up?: string;
  notes?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  status?: CRMLead['status'];
}

export interface CreateInteractionData {
  lead_id: string;
  type: CRMInteraction['type'];
  description: string;
  outcome?: string;
  interaction_date?: string;
} 