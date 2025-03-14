import { useFetchQuestions } from '../../api/useFetchQuestions';
import { Button } from '@mui/material';
import { QuestionCard } from '../../components/InterviewBuilder/QuestionCard';

const InterviewBuilderPage = () => {
  const { data: questions, isLoading, error } = useFetchQuestions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading questions.</div>;

  return (
    <div>
      <h1>Interview Builder</h1>
      <h3>Current questions</h3>
      <Button variant="contained">Add Question</Button>{' '}
      <Button variant="contained" style={{ marginLeft: '10px' }}>
        Save Changes
      </Button>
      <div>
        {questions?.map((question: any) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default InterviewBuilderPage;
