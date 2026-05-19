from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

from info.models import Class, Dept, Student, Teacher

User = get_user_model()


@login_required
def index(request):
    if request.user.is_teacher:
        return render(request, 'info/teacher/homepage.html')
    if request.user.is_student:
        return render(request, 'info/student/homepage.html')
    if request.user.is_superuser:
        return render(request, 'info/auth/admin_page.html')
    return render(request, 'info/auth/logout.html')


@login_required()
def add_teacher(request):
    if not request.user.is_superuser:
        return redirect("/")

    if request.method == 'POST':
        dept = get_object_or_404(Dept, id=request.POST['dept'])
        name = request.POST['full_name']
        id = request.POST['id'].lower()
        dob = request.POST['dob']
        sex = request.POST['sex']

        user = User.objects.create_user(
            username=name.split(" ")[0].lower() + '_' + id,
            password=name.split(" ")[0].lower() + '_' + dob.replace("-", "")[:4]
        )
        user.save()

        Teacher(
            user=user,
            id=id,
            dept=dept,
            name=name,
            sex=sex,
            DOB=dob
        ).save()
        return redirect('/')

    all_dept = Dept.objects.order_by('-id')
    return render(request, 'info/admin/add_teacher.html', {'all_dept': all_dept})


@login_required()
def add_student(request):
    if not request.user.is_superuser:
        return redirect("/")

    if request.method == 'POST':
        class_id = get_object_or_404(Class, id=request.POST['class'])
        name = request.POST['full_name']
        usn = request.POST['usn']
        dob = request.POST['dob']
        sex = request.POST['sex']

        user = User.objects.create_user(
            username=name.split(" ")[0].lower() + '_' + request.POST['usn'][-3:],
            password=name.split(" ")[0].lower() + '_' + dob.replace("-", "")[:4]
        )
        user.save()

        Student(
            user=user,
            USN=usn,
            class_id=class_id,
            name=name,
            sex=sex,
            DOB=dob
        ).save()
        return redirect('/')

    all_classes = Class.objects.order_by('-id')
    return render(request, 'info/admin/add_student.html', {'all_classes': all_classes})
