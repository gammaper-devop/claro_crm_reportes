export interface Option {
  optionNumber: string;
  option: string;
}
export interface SecurityQuestionResponse {
  questionNumber: string;
  question: string;
  answer: string;
  listOption: Option[];
}

export class SecurityQuestionService {
  questionNumber: string;
  question: string;
  answer: string;
  optionNumber: string;
  option: string;
}

export class SecurityQuestion {
  questionNumber: string;
  question: string;
  answer: string;
  listOption: Option[];

  constructor(securityQuestion: SecurityQuestionResponse) {
    if (securityQuestion) {
      this.questionNumber = securityQuestion.questionNumber
        ? securityQuestion.questionNumber
        : '';
      this.question = securityQuestion.question
        ? securityQuestion.question
        : '';
      this.answer = securityQuestion.answer ? securityQuestion.answer : '';
      this.listOption = securityQuestion.listOption
        ? securityQuestion.listOption
        : [];
    }
  }
}
