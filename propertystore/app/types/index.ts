// Типы для форм заявок
export type RequestType = "consultation" | "viewing" | "callback";
export type PurposeType = "buy" | "sell" | "rent" | "other";
export type SourceType = "website" | "telegram" | "phone_call" | "instagram_ads";

// Интерфейсы для данных форм
export interface ConsultationFormData {
  name: string;
  phone: string;
  email?: string;
  purpose: PurposeType;
  message?: string;
}

export interface ViewingFormData {
  name: string;
  phone: string;
  email?: string;
  propertyId: string;
  preferredDate?: string;
  message?: string;
}
export interface ClientFormData {
  name: string;
  phone: string;
  email?: string;
  source: SourceType;
  notes?: string;
}