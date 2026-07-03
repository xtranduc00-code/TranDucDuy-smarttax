import { PeopleListPage } from './PeopleListPage';
import { useStudentStore } from '../store/studentStore';
import { canDeleteStudent } from '../services/validation';

export default function StudentsPage() {
  return (
    <PeopleListPage
      title="Học sinh"
      entityLabel="học sinh"
      useStore={useStudentStore}
      checkDelete={canDeleteStudent}
      searchPlaceholder="Tìm học sinh theo tên..."
    />
  );
}
