from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from info.api import serializers as api_serializers
from info.models import (
    Assign,
    AssignTime,
    AttendanceTotal,
    Student,
    StudentCourse,
)

User = get_user_model()


class DetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            us = Token.objects.filter(user=request.user)
            if us:
                user = User.objects.filter(auth_token=us[0]).first()
                details = Student.objects.get(user=user)
                serializer = api_serializers.DetailSerializer(
                    details, context={'request': request})
                return Response({'data': serializer.data}, status=status.HTTP_200_OK)
            return Response({'message': 'User not authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class AttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            token = Token.objects.filter(user=request.user).first()
            if token:
                user = User.objects.get(auth_token=token)
                stud = Student.objects.get(user=user)
                ass_list = Assign.objects.filter(class_id_id=stud.class_id)
                att_list = []
                for ass in ass_list:
                    try:
                        a = AttendanceTotal.objects.get(student=stud, course=ass.course)
                    except AttendanceTotal.DoesNotExist:
                        a = AttendanceTotal(student=stud, course=ass.course)
                        a.save()
                    att_list.append(a)
                serializer = api_serializers.AttendanceSerializer(
                    att_list, many=True, context={'request': request})
                return Response({'user_attendance': serializer.data}, status=status.HTTP_200_OK)
            return Response({'message': 'User not authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class MarksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            token = Token.objects.filter(user=request.user).first()
            if token:
                user = User.objects.get(auth_token=token)
                stud = Student.objects.get(user=user)
                ass_list = Assign.objects.filter(class_id_id=stud.class_id)
                sc_list = []
                for ass in ass_list:
                    sc = StudentCourse.objects.get(student=stud, course=ass.course)
                    sc_list.append(sc)
                sc_total = {}
                for sc in sc_list:
                    for m in sc.marks_set.all():
                        sc_total[m.studentcourse.course.name] = m.marks1
                return Response({'user_marks': sc_total}, status=status.HTTP_200_OK)
            return Response({'message': 'User not authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class TimetableView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            token = Token.objects.filter(user=request.user).first()
            if token:
                user = User.objects.get(auth_token=token)
                stud = Student.objects.get(user=user)
                asst = AssignTime.objects.filter(assign__class_id=stud.class_id)
                serializer = api_serializers.TimeTableSerializer(
                    asst, many=True, context={'request': request})
                return Response({'user_timetable': serializer.data}, status=status.HTTP_200_OK)
            return Response({'message': 'User not authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
