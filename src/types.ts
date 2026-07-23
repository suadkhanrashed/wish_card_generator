export type BgType = 'cosmic' | 'neon' | 'blossom' | 'sunset' | 'midnight' | 'aurora' | 'glass';

export interface PageOption {
  id: string;
  text: string;
  targetPageId: string; // 'finish' for completion
}

export interface CardPage {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
  bgType: BgType;
  options: PageOption[];
}

export interface CardConfig {
  id: string;
  receiverName: string;
  senderName: string;
  startTime: string; // ISO
  endTime: string; // ISO
  visitLimit: number;
  tooEarlyMessage: string;
  tooLateMessage: string;
  noVisitsMessage: string;
  visitWarningMessage: string;
  requirePassword: boolean;
  password?: string;
  pages: CardPage[];
}
