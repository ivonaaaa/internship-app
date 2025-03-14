import { useFetchQuestions } from '../../api/useFetchQuestions';
import { Button, Typography } from '@mui/material';
import { QuestionCard } from '../../components/InterviewBuilder/QuestionCard';

const InterviewBuilderPage = () => {
  const { data: questions, isLoading, error } = useFetchQuestions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading questions.</div>;

  return (
    <div>
      <Typography sx={{ mt: '30px', ml: '20px', fontSize: '2rem' }}>
        Interview Builder
      </Typography>
      <Typography
        sx={{ mb: '10px', ml: '20px', fontSize: '1.4rem', color: 'gray' }}
      >
        Current questions:
      </Typography>
      <Button
        variant="contained"
        style={{ marginLeft: '30px', borderRadius: '20px' }}
      >
        Add Question
      </Button>{' '}
      <Button
        variant="contained"
        style={{ marginLeft: '10px', borderRadius: '20px' }}
      >
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
