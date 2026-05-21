from django.contrib.auth import authenticate, get_user_model, login, logout
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from info.models import (
    Assign,
    AssignTime,
    Attendance,
    AttendanceClass,
    AttendanceTotal,
    Course,
    DAYS_OF_WEEK,
    MarksClass,
    StudentCourse,
    Teacher,
    test_name,
    time_slots,
)

User = get_user_model()


def _user_payload(user):
    data = {
        'username': user.username,
        'is_superuser': user.is_superuser,
        'role': None,
        'display_name': user.username,
    }
    if user.is_student:
        s = user.student
        data.update({
            'role': 'student',
            'display_name': s.name,
            'usn': s.USN,
            'class_id': s.class_id_id,
        })
    elif user.is_teacher:
        t = user.teacher
        data.update({
            'role': 'teacher',
            'display_name': t.name,
            'teacher_id': t.id,
        })
    elif user.is_superuser:
        data['role'] = 'admin'
    return data


def _require_student(user):
    if not user.is_student:
        return None, Response({'detail': 'Student access only'}, status=status.HTTP_403_FORBIDDEN)
    return user.student, None


def _require_teacher(user):
    if not user.is_teacher:
        return None, Response({'detail': 'Teacher access only'}, status=status.HTTP_403_FORBIDDEN)
    return user.teacher, None


def _serialize_course(course):
    return {
        'id': course.id,
        'name': course.name,
        'shortname': course.shortname,
        'dept_id': course.dept_id,
        'dept_name': course.dept.name,
    }


def _assignment_schedule(assign):
    return [
        {'id': slot.id, 'day': slot.day, 'period': slot.period}
        for slot in AssignTime.objects.filter(assign=assign).order_by('day', 'period')
    ]


def _serialize_assignment(assign, include_schedule=False):
    data = {
        'id': assign.id,
        'class_id': assign.class_id_id,
        'class_name': str(assign.class_id),
        'course': _serialize_course(assign.course),
        'teacher_id': assign.teacher_id,
        'teacher_name': assign.teacher.name,
    }
    if include_schedule:
        data['schedule'] = _assignment_schedule(assign)
    return data


def _attendance_row(a):
    return {
        'course_id': a.course_id,
        'course_name': a.course.name,
        'attended': a.att_class,
        'total': a.total_class,
        'percentage': a.attendance,
        'classes_to_attend': a.classes_to_attend,
    }


def _build_timetable_matrix(class_id=None, teacher_id=None):
    if teacher_id:
        asst = AssignTime.objects.filter(assign__teacher_id=teacher_id).select_related(
            'assign__course', 'assign__class_id'
        )
    else:
        asst = AssignTime.objects.filter(assign__class_id=class_id).select_related('assign__course')
    asst_map = {(a.day, a.period): a for a in asst}
    rows = []
    for day_label, _ in DAYS_OF_WEEK:
        row = {'day': day_label, 'slots': []}
        t = 0
        for j in range(12):
            if j == 0:
                row['slots'].append({'type': 'label', 'value': day_label})
                continue
            if j in (4, 8):
                row['slots'].append({'type': 'break', 'value': 'Break'})
                continue
            period = time_slots[t][0]
            t += 1
            entry = asst_map.get((day_label, period))
            if entry:
                if teacher_id:
                    row['slots'].append({
                        'type': 'class',
                        'course': str(entry.assign.course),
                        'class_name': str(entry.assign.class_id),
                        'assign_time_id': entry.id,
                    })
                else:
                    row['slots'].append({
                        'type': 'class',
                        'value': entry.assign.course_id,
                        'course_name': entry.assign.course.name,
                    })
            else:
                row['slots'].append({'type': 'empty', 'value': ''})
        rows.append(row)
    return rows


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(_user_payload(request.user))


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'detail': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        return Response(_user_payload(user))


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'detail': 'Logged out'})


class StudentAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stud, err = _require_student(request.user)
        if err:
            return err
        ass_list = Assign.objects.filter(class_id_id=stud.class_id)
        att_list = []
        for ass in ass_list:
            try:
                a = AttendanceTotal.objects.get(student=stud, course=ass.course)
            except AttendanceTotal.DoesNotExist:
                a = AttendanceTotal(student=stud, course=ass.course)
                a.save()
            att_list.append(a)
        return Response([_attendance_row(a) for a in att_list])


class StudentAttendanceDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        stud, err = _require_student(request.user)
        if err:
            return err
        cr = get_object_or_404(Course, id=course_id)
        att_list = Attendance.objects.filter(course=cr, student=stud).order_by('date')
        return Response({
            'course_id': cr.id,
            'course_name': cr.name,
            'records': [
                {'date': a.date.isoformat(), 'present': bool(a.status)}
                for a in att_list
            ],
        })


class StudentMarksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stud, err = _require_student(request.user)
        if err:
            return err
        ass_list = Assign.objects.filter(class_id_id=stud.class_id)
        rows = []
        for ass in ass_list:
            try:
                sc = StudentCourse.objects.get(student=stud, course=ass.course)
            except StudentCourse.DoesNotExist:
                sc = StudentCourse(student=stud, course=ass.course)
                sc.save()
                for name, _ in test_name:
                    sc.marks_set.create(name=name)
            marks = {m.name: m.marks1 for m in sc.marks_set.all()}
            rows.append({
                'course_id': sc.course_id,
                'course_name': sc.course.name,
                'marks': marks,
            })
        return Response(rows)


class StudentTimetableView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stud, err = _require_student(request.user)
        if err:
            return err
        return Response({'rows': _build_timetable_matrix(class_id=stud.class_id_id)})


class StudentProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stud, err = _require_student(request.user)
        if err:
            return err
        cl = stud.class_id
        assigns = Assign.objects.filter(class_id=cl).select_related('course', 'teacher')
        return Response({
            'usn': stud.USN,
            'name': stud.name,
            'sex': stud.sex,
            'dob': stud.DOB.isoformat(),
            'username': request.user.username,
            'email': request.user.email or '',
            'class': {
                'id': cl.id,
                'name': str(cl),
                'section': cl.section,
                'semester': cl.sem,
                'dept_id': cl.dept_id,
                'dept_name': cl.dept.name,
            },
            'enrolled_courses': assigns.count(),
            'assignments': assigns.count(),
        })


class StudentCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stud, err = _require_student(request.user)
        if err:
            return err
        assigns = Assign.objects.filter(class_id=stud.class_id).select_related(
            'course__dept', 'teacher'
        )
        seen = set()
        courses = []
        for ass in assigns:
            if ass.course_id in seen:
                continue
            seen.add(ass.course_id)
            courses.append({
                **_serialize_course(ass.course),
                'teacher_name': ass.teacher.name,
                'teacher_id': ass.teacher_id,
                'assignment_id': ass.id,
            })
        return Response({'courses': courses})


class StudentAssignmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stud, err = _require_student(request.user)
        if err:
            return err
        assigns = Assign.objects.filter(class_id=stud.class_id).select_related(
            'course__dept', 'teacher', 'class_id'
        )
        return Response({
            'assignments': [_serialize_assignment(a, include_schedule=True) for a in assigns],
        })


class TeacherProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        assigns = Assign.objects.filter(teacher=teacher).select_related('course', 'class_id')
        course_ids = assigns.values_list('course_id', flat=True).distinct()
        return Response({
            'id': teacher.id,
            'name': teacher.name,
            'sex': teacher.sex,
            'dob': teacher.DOB.isoformat(),
            'username': request.user.username,
            'email': request.user.email or '',
            'dept_id': teacher.dept_id,
            'dept_name': teacher.dept.name,
            'classes_count': assigns.values('class_id').distinct().count(),
            'courses_count': len(set(course_ids)),
            'assignments_count': assigns.count(),
        })


class TeacherCoursesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        assigns = Assign.objects.filter(teacher=teacher).select_related('course__dept', 'class_id')
        seen = set()
        courses = []
        for ass in assigns:
            if ass.course_id in seen:
                continue
            seen.add(ass.course_id)
            classes = [
                str(a.class_id)
                for a in Assign.objects.filter(teacher=teacher, course_id=ass.course_id)
            ]
            courses.append({
                **_serialize_course(ass.course),
                'classes': classes,
            })
        return Response({'courses': courses})


class TeacherAssignmentCatalogView(APIView):
    """Full assignment list with weekly schedule slots."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        assigns = Assign.objects.filter(teacher=teacher).select_related(
            'course__dept', 'class_id', 'teacher'
        )
        return Response({
            'assignments': [_serialize_assignment(a, include_schedule=True) for a in assigns],
        })


class CoursesCatalogView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.select_related('dept').order_by('dept__name', 'id')
        if request.user.is_student:
            stud = request.user.student
            course_ids = Assign.objects.filter(class_id=stud.class_id).values_list(
                'course_id', flat=True
            )
            courses = courses.filter(id__in=course_ids)
        elif request.user.is_teacher:
            course_ids = Assign.objects.filter(teacher=request.user.teacher).values_list(
                'course_id', flat=True
            )
            courses = courses.filter(id__in=course_ids)
        return Response({
            'courses': [_serialize_course(c) for c in courses],
        })


class TeacherAssignmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        choice = int(request.query_params.get('choice', 1))
        assigns = Assign.objects.filter(teacher=teacher).select_related('class_id', 'course')
        return Response({
            'choice': choice,
            'assignments': [
                {
                    'id': a.id,
                    'class_name': str(a.class_id),
                    'course_name': str(a.course),
                    'course_id': a.course_id,
                }
                for a in assigns
            ],
        })


class TeacherClassDatesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assign_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        ass = get_object_or_404(Assign, id=assign_id, teacher=teacher)
        now = timezone.now()
        att_list = ass.attendanceclass_set.filter(date__lte=now).order_by('-date')
        return Response({
            'assign_id': ass.id,
            'class_name': str(ass.class_id),
            'course_name': str(ass.course),
            'sessions': [
                {
                    'id': ac.id,
                    'date': ac.date.isoformat(),
                    'status': ac.status,
                    'status_label': {0: 'Pending', 1: 'Submitted', 2: 'Cancelled'}.get(ac.status, 'Unknown'),
                }
                for ac in att_list
            ],
        })


class TeacherStudentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assign_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        ass = get_object_or_404(Assign, id=assign_id, teacher=teacher)
        att_list = []
        for stud in ass.class_id.student_set.all():
            try:
                a = AttendanceTotal.objects.get(student=stud, course=ass.course)
            except AttendanceTotal.DoesNotExist:
                a = AttendanceTotal(student=stud, course=ass.course)
                a.save()
            att_list.append({
                'usn': stud.USN,
                'name': stud.name,
                **_attendance_row(a),
            })
        return Response({
            'assign_id': ass.id,
            'course_name': str(ass.course),
            'students': att_list,
        })


class TeacherAttendanceSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        assc = get_object_or_404(AttendanceClass, id=session_id, assign__teacher=teacher)
        ass = assc.assign
        students = []
        for s in ass.class_id.student_set.all():
            try:
                a = Attendance.objects.get(
                    course=ass.course, student=s, date=assc.date, attendanceclass=assc
                )
                present = bool(a.status)
            except Attendance.DoesNotExist:
                present = True
            students.append({'usn': s.USN, 'name': s.name, 'present': present})
        return Response({
            'session_id': assc.id,
            'assign_id': ass.id,
            'date': assc.date.isoformat(),
            'status': assc.status,
            'course_name': str(ass.course),
            'class_name': str(ass.class_id),
            'students': students,
        })

    def post(self, request, session_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        assc = get_object_or_404(AttendanceClass, id=session_id, assign__teacher=teacher)
        ass = assc.assign
        cr = ass.course
        cl = ass.class_id
        attendance_map = request.data.get('attendance', {})
        for s in cl.student_set.all():
            status_val = attendance_map.get(s.USN, 'present')
            status_bool = 'True' if status_val in ('present', True, 'true', '1', 1) else 'False'
            if assc.status == 1:
                try:
                    a = Attendance.objects.get(
                        course=cr, student=s, date=assc.date, attendanceclass=assc
                    )
                    a.status = status_bool
                    a.save()
                except Attendance.DoesNotExist:
                    Attendance.objects.create(
                        course=cr,
                        student=s,
                        status=status_bool,
                        date=assc.date,
                        attendanceclass=assc,
                    )
            else:
                Attendance.objects.create(
                    course=cr,
                    student=s,
                    status=status_bool,
                    date=assc.date,
                    attendanceclass=assc,
                )
                assc.status = 1
                assc.save()
        return Response({'detail': 'Attendance saved'})


class TeacherCancelSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        assc = get_object_or_404(AttendanceClass, id=session_id, assign__teacher=teacher)
        assc.status = 2
        assc.save()
        return Response({'assign_id': assc.assign_id})


class TeacherExtraClassView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, assign_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        ass = get_object_or_404(Assign, id=assign_id, teacher=teacher)
        date_str = request.data.get('date')
        attendance_map = request.data.get('attendance', {})
        if not date_str:
            return Response({'detail': 'date is required'}, status=status.HTTP_400_BAD_REQUEST)
        assc = ass.attendanceclass_set.create(status=1, date=date_str)
        cr = ass.course
        for s in ass.class_id.student_set.all():
            status_val = attendance_map.get(s.USN, 'present')
            status_bool = 'True' if status_val in ('present', True, 'true', '1', 1) else 'False'
            Attendance.objects.create(
                course=cr,
                student=s,
                status=status_bool,
                date=date_str,
                attendanceclass=assc,
            )
        return Response({'detail': 'Extra class recorded'})


class TeacherMarksTestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assign_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        ass = get_object_or_404(Assign, id=assign_id, teacher=teacher)
        m_list = MarksClass.objects.filter(assign=ass)
        return Response({
            'assign_id': ass.id,
            'tests': [
                {
                    'id': m.id,
                    'name': m.name,
                    'status': m.status,
                    'total_marks': m.total_marks,
                }
                for m in m_list
            ],
        })


class TeacherMarksEntryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, marks_class_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        mc = get_object_or_404(MarksClass, id=marks_class_id, assign__teacher=teacher)
        ass = mc.assign
        students = []
        for s in ass.class_id.student_set.all():
            sc = StudentCourse.objects.get(course=ass.course, student=s)
            m = sc.marks_set.get(name=mc.name)
            students.append({'usn': s.USN, 'name': s.name, 'marks': m.marks1})
        return Response({
            'marks_class_id': mc.id,
            'test_name': mc.name,
            'total_marks': mc.total_marks,
            'status': mc.status,
            'assign_id': ass.id,
            'students': students,
        })

    def post(self, request, marks_class_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        mc = get_object_or_404(MarksClass, id=marks_class_id, assign__teacher=teacher)
        ass = mc.assign
        cr = ass.course
        marks_map = request.data.get('marks', {})
        for s in ass.class_id.student_set.all():
            mark = marks_map.get(s.USN, 0)
            sc = StudentCourse.objects.get(course=cr, student=s)
            m = sc.marks_set.get(name=mc.name)
            m.marks1 = int(mark)
            m.save()
        mc.status = True
        mc.save()
        return Response({'detail': 'Marks saved', 'assign_id': ass.id})


class TeacherStudentMarksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assign_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        ass = get_object_or_404(Assign, id=assign_id, teacher=teacher)
        sc_list = StudentCourse.objects.filter(
            student__in=ass.class_id.student_set.all(), course=ass.course
        ).select_related('student')
        rows = []
        for sc in sc_list:
            marks = {m.name: m.marks1 for m in sc.marks_set.all()}
            rows.append({
                'usn': sc.student.USN,
                'name': sc.student.name,
                'cie': sc.get_cie(),
                'attendance': sc.get_attendance(),
                'marks': marks,
            })
        return Response({'assign_id': ass.id, 'students': rows})


class TeacherReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assign_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        ass = get_object_or_404(Assign, id=assign_id, teacher=teacher)
        sc_list = []
        for stud in ass.class_id.student_set.all():
            sc = StudentCourse.objects.get(student=stud, course=ass.course)
            sc_list.append({
                'usn': stud.USN,
                'name': stud.name,
                'cie': sc.get_cie(),
                'attendance': sc.get_attendance(),
            })
        return Response({
            'assign_id': ass.id,
            'class_name': str(ass.class_id),
            'course_name': str(ass.course),
            'students': sc_list,
        })


class TeacherTimetableView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        return Response({'rows': _build_timetable_matrix(teacher_id=teacher.id)})


class TeacherFreeTeachersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assign_time_id):
        teacher, err = _require_teacher(request.user)
        if err:
            return err
        asst = get_object_or_404(AssignTime, id=assign_time_id, assign__teacher=teacher)
        ft_list = []
        t_list = Teacher.objects.filter(assign__class_id__id=asst.assign.class_id_id)
        for t in t_list:
            at_list = AssignTime.objects.filter(assign__teacher=t)
            busy = any(at.period == asst.period and at.day == asst.day for at in at_list)
            if not busy:
                ft_list.append({'id': t.id, 'name': t.name})
        return Response({
            'period': asst.period,
            'day': asst.day,
            'class_name': str(asst.assign.class_id),
            'teachers': ft_list,
        })
