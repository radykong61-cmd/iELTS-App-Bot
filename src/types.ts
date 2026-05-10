export type BandScore = number;

export interface BandExplanation {
  band: BandScore;
  description: string;
  criteria: {
    taskResponse: string;
    coherenceCohesion: string;
    lexicalResource: string;
    grammaticalRangeAccuracy: string;
  };
}

export interface SampleEssay {
  id: string;
  title: string;
  prompt: string;
  essay: string;
  band: BandScore;
  feedback: string;
}

export interface CommonError {
  category: string;
  error: string;
  correction: string;
  explanation: string;
  bandImpact: string;
}

export interface FeedbackResult {
  overallBand: BandScore;
  overallFeedback: string;
  taskResponse: { score: BandScore; feedback: string };
  coherenceCohesion: { score: BandScore; feedback: string };
  lexicalResource: { score: BandScore; feedback: string };
  grammaticalRangeAccuracy: { score: BandScore; feedback: string };
}

export interface Student {
  name: string;
  schoolFee?: string;
  displayId?: string;
  behavior?: string;
  level?: string;
  teachers?: string;
  startDate?: string;
  deadline?: string;
  time?: string;
  time2?: string;
  subject?: string;
  schedule?: string;
  assistant?: string;
  duration?: string;
  shift?: string;
  penaltyType1?: string;
  penaltyDate1?: string;
  penaltyType2?: string;
  penaltyDate2?: string;
  penaltyType3?: string;
  penaltyDate3?: string;
  penaltyComments?: string;
  payments?: Record<string, string>;
}
