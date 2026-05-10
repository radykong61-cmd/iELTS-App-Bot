import { BandExplanation, CommonError, SampleEssay } from './types';

export const BAND_EXPLANATIONS: BandExplanation[] = [
  {
    band: 9,
    description: "Expert user: has fully operational command of the language.",
    criteria: {
      taskResponse: "Fully addresses all parts of the task; presents a fully developed position.",
      coherenceCohesion: "Uses cohesion in such a way that it attracts no attention; skilfully manages paragraphing.",
      lexicalResource: "Uses a wide range of vocabulary with very natural and sophisticated control; rare minor errors only as 'slips'.",
      grammaticalRangeAccuracy: "Uses a wide range of structures with full flexibility and accuracy; rare minor errors only as 'slips'."
    }
  },
  {
    band: 8,
    description: "Very good user: has fully operational command of the language with only occasional unsystematic inaccuracies.",
    criteria: {
      taskResponse: "Sufficiently addresses all parts of the task; presents a well-developed response.",
      coherenceCohesion: "Sequences information and ideas logically; manages all aspects of cohesion well.",
      lexicalResource: "Uses a wide range of vocabulary fluently and flexibly to convey precise meanings.",
      grammaticalRangeAccuracy: "Uses a wide range of structures; majority of sentences are error-free."
    }
  },
  {
    band: 7,
    description: "Good user: has operational command of the language, though with occasional inaccuracies and misunderstandings.",
    criteria: {
      taskResponse: "Addresses all parts of the task; presents a clear position throughout.",
      coherenceCohesion: "Logically organises information and ideas; there is clear progression throughout.",
      lexicalResource: "Uses a sufficient range of vocabulary to allow some flexibility and precision.",
      grammaticalRangeAccuracy: "Uses a variety of complex structures; has good control of grammar and punctuation."
    }
  },
  {
    band: 6,
    description: "Competent user: generally has effective command of the language despite some inaccuracies.",
    criteria: {
      taskResponse: "Addresses all parts of the task although some parts may be more fully covered than others.",
      coherenceCohesion: "Arranges information and ideas coherently and there is a clear overall progression.",
      lexicalResource: "Uses an adequate range of vocabulary for the task; attempts to use less common vocabulary.",
      grammaticalRangeAccuracy: "Uses a mix of simple and complex sentence forms; makes some errors in grammar but these rarely reduce communication."
    }
  }
];

export const COMMON_ERRORS: CommonError[] = [
  {
    category: "Grammar",
    error: "Subject-Verb Agreement Errors",
    correction: "Ensure the verb matches the subject in number (singular vs plural). For example, 'The criteria is' should be 'The criteria are'.",
    explanation: "Incorrect subject-verb agreement is a major indicator of grammatical control. It often happens with complex subjects or distance between subject and verb.",
    bandImpact: "Frequent errors in subject-verb agreement will typically limit the Grammatical Range and Accuracy score to Band 5 or 6, as they indicate a lack of control over basic structures."
  },
  {
    category: "Lexical Resource",
    error: "Overusing 'Memorized' or 'Cliché' Phrases",
    correction: "Avoid phrases like 'In a nutshell', 'Every coin has two sides', or 'In the modern era' unless they fit perfectly. Use more precise descriptors instead.",
    explanation: "Examiners are trained to spot 'template' language. Using these clichés makes your writing seem less authentic and limits your ability to show precise meaning.",
    bandImpact: "Heavy reliance on memorized phrases can prevent a Lexical Resource score from moving above Band 6, as it doesn't demonstrate a 'natural' use of vocabulary."
  },
  {
    category: "Structure",
    error: "Improper Use of Cohesive Devices (Linking Words)",
    correction: "Don't start every sentence with a linking word like 'Moreover' or 'Furthermore'. Use internal cohesion and varying sentence structures to link ideas.",
    explanation: "Mechanical use of cohesive devices is a common mistake. Cohesion should be felt through the logical flow of ideas, not just a list of transitions.",
    bandImpact: "Overuse or mechanical use of cohesive devices is explicitly mentioned in the Band 6 descriptor for Coherence and Cohesion. Band 7 and above requires 'skilful' and 'unobtrusive' cohesion."
  },
  {
    category: "Task Response",
    error: "Over-generalizing or Using Sweeping Statements",
    correction: "Avoid words like 'all', 'every', and 'always' when making claims. Use hedging language like 'tend to', 'it is often argued that', or 'for many individuals'.",
    explanation: "Academic writing requires nuance. Claiming that 'all children love video games' is an over-generalization that weakens your argument's credibility.",
    bandImpact: "Over-generalizations can limit the Task Response score to Band 6, as the position may be clear but not fully 'developed' or sufficiently nuanced for higher bands."
  },
  {
    category: "Grammar",
    error: "Punctuation Inaccuracy (Specifically Comma Splices)",
    correction: "Avoid joining two independent clauses with only a comma. Use a semi-colon, a coordinating conjunction, or separate them into two sentences.",
    explanation: "Comma splices are a common high-level error. For example: 'Technology is useful, it helps people stay connected.' (Incorrect)",
    bandImpact: "Systematic punctuation errors like comma splices will generally keep the Grammatical Range and Accuracy score at Band 6, even if the vocabulary is sophisticated."
  },
  {
    category: "Task Response",
    error: "Off-topic or Partially Addressed Prompts",
    correction: "Always underline the 'keywords' in the prompt and ensure every part of your essay directly relates back to them.",
    explanation: "Failing to address a specific part of the prompt (e.g., ignoring 'disadvantages' in a 'pros and cons' prompt) is the fastest way to lose marks.",
    bandImpact: "Addressing only parts of the task can lead to a Task Response score as low as Band 5, regardless of the quality of the English used."
  }
];

export const SAMPLE_ESSAYS: SampleEssay[] = [
  {
    id: "1",
    title: "Technology and Social Isolation",
    prompt: "Some people believe that the increasing use of technology in our daily lives is making us more isolated. To what extent do you agree or disagree?",
    essay: "In the modern era, technology has become an inseparable part of human existence... [Full sample essay text here]",
    band: 8,
    feedback: "This essay presents a very clear position and uses high-level vocabulary such as 'inseparable', 'dichotomy', and 'unprecedented connectivity'..."
  }
];
