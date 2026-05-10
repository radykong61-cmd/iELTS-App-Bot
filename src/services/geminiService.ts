import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackResult, Student } from "../types";
import { addMonths, addDays, addWeeks, format, isValid } from 'date-fns';
import { getRandomGeminiKey, getGeminiKeys } from './neuralEngine';

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallBand: { type: Type.NUMBER, description: "The overall band score (0-9)" },
    overallFeedback: { type: Type.STRING, description: "A summary of the feedback" },
    taskResponse: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING }
      },
      required: ["score", "feedback"]
    },
    coherenceCohesion: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING }
      },
      required: ["score", "feedback"]
    },
    lexicalResource: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING }
      },
      required: ["score", "feedback"]
    },
    grammaticalRangeAccuracy: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        feedback: { type: Type.STRING }
      },
      required: ["score", "feedback"]
    }
  },
  required: [
    "overallBand",
    "overallFeedback",
    "taskResponse",
    "coherenceCohesion",
    "lexicalResource",
    "grammaticalRangeAccuracy"
  ]
};

export async function evaluateEssayPart(
  type: 'introduction' | 'body' | 'conclusion' | 'full',
  content: string,
  prompt: string // The original IELTS prompt
): Promise<FeedbackResult> {
  // Use a random key from the pool
  const apiKey = getRandomGeminiKey();
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are an expert IELTS Writing Task 2 examiner. 
  Your goal is to evaluate a specific part of an essay (or the full essay) based on the official IELTS band descriptors.
  
  Type of evaluation: ${type}
  Original Prompt: "${prompt}"

  Provide a detailed evaluation in JSON format according to the schema.
  If evaluating only a PART (like introduction), adjust the score to reflect what a band score would be if the rest of the essay followed that quality.
  Focus on:
  - Task Response: How well the prompt is addressed.
  - Coherence and Cohesion: Logical flow and linking.
  - Lexical Resource: Range and accuracy of vocabulary.
  - Grammatical Range and Accuracy: Variety and correctness of structures.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: content,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA as any
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(response.text) as FeedbackResult;
  } catch (error) {
    console.error("Evaluation error:", error);
    throw error;
  }
}

// --- User's Additional Student Parser Logic ---

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const sanitizeValue = (val: any): string => {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.toLowerCase() === 'null') return '';
  return str;
};

const manualParse = (str: string, fmt: string): Date | null => {
    const clean = str.trim();
    const parts = clean.split(/[\/\-\.]/);
    if (parts.length !== 3) return null;
    
    let d, m, y;
    if (fmt === 'dd/MM/yyyy') {
        [d, m, y] = parts.map(Number);
    } else if (fmt === 'MM/dd/yyyy') {
        [m, d, y] = parts.map(Number);
    } else if (fmt === 'yyyy-MM-dd') {
        [y, m, d] = parts.map(Number);
    } else {
        return null;
    }
    
    if (y < 100) y += 2000;
    const date = new Date(y, m - 1, d);
    return isValid(date) ? date : null;
};

const normalizeDate = (dateStr: string): Date | null => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const clean = dateStr.trim();

    const match = clean.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
    if (match) {
        const d = parseInt(match[1], 10);
        const m = parseInt(match[2], 10) - 1;
        let y = parseInt(match[3], 10);
        if (y < 100) y += 2000;
        else if (y < 1000) y = 2000 + (y % 100);
        const date = new Date(y, m, d);
        return isValid(date) ? date : null;
    }

    const iso = new Date(clean);
    if (isValid(iso)) {
        if (iso.getFullYear() < 100) iso.setFullYear(2000 + iso.getFullYear());
        return iso;
    }

    const formats = ['dd/MM/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd'];
    for (const fmt of formats) {
        const d = manualParse(clean, fmt);
        if (d && isValid(d)) {
            if (d.getFullYear() < 100) d.setFullYear(2000 + d.getFullYear());
            return d;
        }
    }
    return null;
};

const calculateDeadline = (startDate: Date, durationStr: string): Date => {
    const normalized = durationStr.toLowerCase().trim();
    const amountMatch = normalized.match(/\d+/);
    const amount = amountMatch ? parseInt(amountMatch[0], 10) : 1;
    
    if (normalized.includes('day')) return addDays(startDate, amount);
    if (normalized.includes('week')) return addWeeks(startDate, amount);
    if (normalized.includes('year')) return addMonths(startDate, amount * 12);
    
    return addMonths(startDate, amount);
};

export const parseStudentData = async (inputText: string, imageFile?: File, mode: 'Hall' | 'Finance' | 'Attendance' | 'DailyTask' | 'Penalty' | 'PenaltyHall' = 'Hall'): Promise<Partial<Student>[] | null> => {
  const parts: any[] = [];
  if (imageFile) parts.push(await fileToGenerativePart(imageFile));
  if (inputText) parts.push({ text: `Context: ${inputText}` });

  let prompt = '';
  if (mode === 'Hall') {
      prompt = `Extract Hall Study records: Name (name), Fee (schoolFee), Teacher (teachers), Level (level), Behavior (behavior), Schedule (schedule), Time (time), Time 2 (time2), Subject (subject), Start Date (startDate), Assistant (assistant), Duration (duration).`;
  } else if (mode === 'Finance') {
      prompt = `Extract Finance records: ID (displayId), Name (name), Fee (schoolFee), Level (level), Start Date (startDate), Teachers (teachers), Monthly Payments (paymentList), Duration (duration).`;
  } else if (mode === 'DailyTask') {
      prompt = `Extract Teacher Daily Task assignments: Teacher Name (name), Level (level), Shift (shift).`;
  } else if (mode === 'Penalty' || mode === 'PenaltyHall') {
      prompt = `Extract Late/Absence log records: Name (name), Teachers (teachers), Assistant (assistant), Level (level), Log 1 Type (penaltyType1), Log 1 Date (penaltyDate1)...`;
  } else {
      prompt = `Extract Attendance list: Full Name (name).`;
  }
  
  prompt += `\nResponse must be a JSON array of objects.`;

  const availableKeys = getGeminiKeys();
  if (availableKeys.length === 0) return null;
  
  const ai = new GoogleGenAI({ apiKey: getRandomGeminiKey() });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              schoolFee: { type: Type.STRING },
              displayId: { type: Type.STRING },
              behavior: { type: Type.STRING }, 
              level: { type: Type.STRING },
              teachers: { type: Type.STRING },
              startDate: { type: Type.STRING },
              time: { type: Type.STRING },
              time2: { type: Type.STRING },
              subject: { type: Type.STRING },
              schedule: { type: Type.STRING },
              assistant: { type: Type.STRING },
              duration: { type: Type.STRING },
              shift: { type: Type.STRING },
              penaltyType1: { type: Type.STRING },
              penaltyDate1: { type: Type.STRING },
              penaltyType2: { type: Type.STRING },
              penaltyDate2: { type: Type.STRING },
              penaltyType3: { type: Type.STRING },
              penaltyDate3: { type: Type.STRING },
              penaltyComments: { type: Type.STRING },
              paymentList: { 
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { period: { type: Type.STRING }, status: { type: Type.STRING } }
                }
              },
            }
          }
        } as any
      }
    });

    const text = response.text;
    if (!text) return null;
    const rawData = JSON.parse(text);

    return rawData.map((item: any) => {
        const payments: Record<string, string> = {};
        if (item.paymentList) item.paymentList.forEach((p: any) => payments[p.period] = sanitizeValue(p.status));
        const { paymentList, ...studentData } = item;
        const sanitizedData: any = {};
        Object.keys(studentData).forEach(k => sanitizedData[k] = sanitizeValue(studentData[k]));

        if (sanitizedData.startDate) {
            const dateObj = normalizeDate(sanitizedData.startDate);
            if (dateObj) {
                sanitizedData.startDate = format(dateObj, 'dd/MM/yy');
                const durationText = sanitizedData.duration || '1 month';
                const deadlineDate = calculateDeadline(dateObj, durationText);
                sanitizedData.deadline = format(deadlineDate, 'dd/MM/yy');
            }
        }

        // Normalize penalty dates
        for (let i = 1; i <= 7; i++) {
            const dateKey = `penaltyDate${i}`;
            if (sanitizedData[dateKey]) {
                const pDate = normalizeDate(sanitizedData[dateKey]);
                if (pDate) sanitizedData[dateKey] = format(pDate, 'dd/MM/yy');
            }
        }

        return { ...sanitizedData, payments };
    });
  } catch (error) {
    console.error("GenAI Error:", error);
    return null;
  }
};
