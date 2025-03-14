import { Box, Typography, Chip, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface QuestionCardProps {
  question: {
    id: number;
    text: string;
    category: string;
    type: string;
    disabled: boolean;
  };
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <Box
      sx={{
        padding: 2,
        marginBottom: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1">{question.text}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip label={question.category} color="primary" />
        <Chip label={question.type} color="secondary" />
        {question.disabled && <Chip label="Disabled" color="error" />}
        <Button startIcon={<EditIcon />} variant="outlined">
          Edit
        </Button>
      </Box>
    </Box>
  );
};
