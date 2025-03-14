import { useState } from 'react';
import {
  QuestionCategory,
  QuestionType,
} from '../../constants/interviewConstants';
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface QuestionCardProps {
  question: {
    id: number;
    question: string;
    category: QuestionCategory;
    type: QuestionType;
    disabled: boolean;
  };
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question.question);
  const [editedCategory, setEditedCategory] = useState<QuestionCategory>(
    question.category,
  );
  const [editedType, setEditedType] = useState<QuestionType>(question.type);
  const [isDisabled, setIsDisabled] = useState(question.disabled);

  return (
    <Box
      sx={{
        margin: '20px',
        padding: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transition: 'all 0.3s ease-in-out',
        backgroundColor: isEditing ? '#f9f9f9' : 'white',
        opacity: isDisabled ? 0.5 : 1,
      }}
    >
      {!isEditing ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" sx={{ color: 'black' }}>
            {question.question}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={question.category} />
            <Chip label={question.type} />

            {isDisabled && <Chip label="Disabled" color="error" />}
            <Button
              startIcon={isDisabled ? <LockOpenIcon /> : <LockIcon />}
              variant="outlined"
              color={isDisabled ? 'success' : 'error'}
              onClick={() => setIsDisabled(!isDisabled)}
            >
              {isDisabled ? 'Enable' : 'Disable'}
            </Button>

            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => setIsEditing(true)}
              disabled={isDisabled}
            >
              Edit
            </Button>

            <Button variant="outlined">Stats</Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Edit Question"
            variant="outlined"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={editedCategory}
              onChange={(e) =>
                setEditedCategory(e.target.value as QuestionCategory)
              }
            >
              {Object.values(QuestionCategory).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={editedType}
              onChange={(e) => setEditedType(e.target.value as QuestionType)}
            >
              {Object.values(QuestionType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={() => {
                console.log('Saved Question:', editedQuestion);
                setIsEditing(false);
              }}
            >
              Save
            </Button>
            <Button
              startIcon={<CancelIcon />}
              variant="outlined"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
