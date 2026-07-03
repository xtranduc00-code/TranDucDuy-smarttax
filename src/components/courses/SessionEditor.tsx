import { useFieldArray, Controller, type Control } from 'react-hook-form';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateId } from '../../utils/id';
import type { CourseFormSchemaValues } from '../../utils/validationSchemas';

interface SessionEditorProps {
  control: Control<CourseFormSchemaValues>;
  readOnly?: boolean;
  rootError?: string;
}

export function SessionEditor({ control, readOnly = false, rootError }: SessionEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'sessions' });

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">Buổi học</Typography>

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Chưa có buổi học nào.
        </Typography>
      )}

      {fields.map((field, index) => (
        <Stack
          key={field.id}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { sm: 'flex-start' } }}
        >
          <Controller
            name={`sessions.${index}.title`}
            control={control}
            render={({ field: f, fieldState }) => (
              <TextField
                {...f}
                label="Tiêu đề"
                size="small"
                disabled={readOnly}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ flex: 2 }}
              />
            )}
          />
          <Controller
            name={`sessions.${index}.date`}
            control={control}
            render={({ field: f, fieldState }) => (
              <TextField
                {...f}
                type="date"
                label="Ngày học"
                size="small"
                disabled={readOnly}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ flex: 1 }}
              />
            )}
          />
          <Controller
            name={`sessions.${index}.startTime`}
            control={control}
            render={({ field: f, fieldState }) => (
              <TextField
                {...f}
                type="time"
                label="Giờ bắt đầu"
                size="small"
                disabled={readOnly}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ flex: 1 }}
              />
            )}
          />
          <Controller
            name={`sessions.${index}.endTime`}
            control={control}
            render={({ field: f, fieldState }) => (
              <TextField
                {...f}
                type="time"
                label="Giờ kết thúc"
                size="small"
                disabled={readOnly}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ flex: 1 }}
              />
            )}
          />
          {!readOnly && (
            <IconButton
              size="small"
              onClick={() => remove(index)}
              aria-label="Xóa buổi học"
              sx={{ mt: { sm: 0.5 } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      ))}

      {rootError && (
        <Typography variant="caption" color="error">
          {rootError}
        </Typography>
      )}

      {!readOnly && (
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => append({ id: generateId(), title: '', date: '', startTime: '', endTime: '' })}
          sx={{ alignSelf: 'flex-start' }}
        >
          Thêm buổi học
        </Button>
      )}
    </Stack>
  );
}
