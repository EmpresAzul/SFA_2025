export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export interface SupportState {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  openaiApiKey: string;
  hasApiKey: boolean;
  isSettingUp: boolean;
}
