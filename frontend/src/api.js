function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const csrf = getCookie('csrftoken');
  if (csrf && options.method && options.method !== 'GET') {
    headers['X-CSRFToken'] = csrf;
  }
  const res = await fetch(`/api/web${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { detail: text };
  }
  if (!res.ok) {
    const err = new Error(data?.detail || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  me: () => request('/me/'),
  login: (username, password) =>
    request('/login/', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/logout/', { method: 'POST', body: '{}' }),
  studentAttendance: () => request('/student/attendance/'),
  studentAttendanceDetail: (courseId) => request(`/student/attendance/${courseId}/`),
  studentMarks: () => request('/student/marks/'),
  studentTimetable: () => request('/student/timetable/'),
  teacherAssignments: (choice) => request(`/teacher/assignments/?choice=${choice}`),
  teacherSessions: (assignId) => request(`/teacher/assignments/${assignId}/sessions/`),
  teacherStudents: (assignId) => request(`/teacher/assignments/${assignId}/students/`),
  teacherSession: (sessionId) => request(`/teacher/sessions/${sessionId}/`),
  saveAttendance: (sessionId, attendance) =>
    request(`/teacher/sessions/${sessionId}/`, {
      method: 'POST',
      body: JSON.stringify({ attendance }),
    }),
  cancelSession: (sessionId) =>
    request(`/teacher/sessions/${sessionId}/cancel/`, { method: 'POST', body: '{}' }),
  extraClass: (assignId, date, attendance) =>
    request(`/teacher/assignments/${assignId}/extra-class/`, {
      method: 'POST',
      body: JSON.stringify({ date, attendance }),
    }),
  teacherMarksTests: (assignId) => request(`/teacher/assignments/${assignId}/marks-tests/`),
  teacherMarksEntry: (marksClassId) => request(`/teacher/marks-tests/${marksClassId}/`),
  saveMarks: (marksClassId, marks) =>
    request(`/teacher/marks-tests/${marksClassId}/`, {
      method: 'POST',
      body: JSON.stringify({ marks }),
    }),
  teacherStudentMarks: (assignId) => request(`/teacher/assignments/${assignId}/student-marks/`),
  teacherReport: (assignId) => request(`/teacher/assignments/${assignId}/report/`),
  teacherTimetable: () => request('/teacher/timetable/'),
  freeTeachers: (assignTimeId) => request(`/teacher/free-teachers/${assignTimeId}/`),
};
