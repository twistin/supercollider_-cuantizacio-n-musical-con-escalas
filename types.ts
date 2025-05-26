
export interface ScaleDefinition {
  id: string;
  name: string;
  degrees: number[]; // Semitone offsets from the root
}

export interface UGenDefinition {
  name: string;
  description: string;
  category: string;
}
    