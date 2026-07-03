import { PeopleListPage } from './PeopleListPage';
import { useTeacherStore } from '../store/teacherStore';
import { canDeleteTeacher } from '../services/validation';

export default function TeachersPage() {
  return (
    <PeopleListPage
      title="Giáo viên"
      entityLabel="giáo viên"
      useStore={useTeacherStore}
      checkDelete={canDeleteTeacher}
      searchPlaceholder="Tìm giáo viên theo tên..."
    />
  );
}
