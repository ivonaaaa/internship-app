import { InterviewQuestion, QuestionOption } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { api } from '.';
import { CreateQuestionDto } from '../../../api/src/interview-question/dto/createQuestion.dto';

type QuestionWithOptions = InterviewQuestion & {
  QuestionOption: QuestionOption[];
};

const fetchAllQuestions = async () => {
  return api.get<never, QuestionWithOptions[]>('/question');
};

const fetchQuestionOptions = async () => {
  return api.get<never, QuestionOption[]>('/question/options');
};

const createQuestion = async (questionData: CreateQuestionDto) => {
  return api.post<CreateQuestionDto, QuestionWithOptions>(
    '/question',
    questionData,
  );
};

const deleteQuestion = async (id: string) => {
  return api.delete<never, QuestionWithOptions>(`/question/${id}`);
};

export const useFetchQuestions = () => {
  return useQuery(['questions'], fetchAllQuestions);
};

export const useFetchQuestionOptions = () => {
  return useQuery(['question-options'], fetchQuestionOptions);
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation(createQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteQuestion, {
    onSuccess: () => {
      queryClient.invalidateQueries(['questions']);
    },
  });
};
