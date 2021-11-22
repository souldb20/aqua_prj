import json

from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from aqua_app.models import PH


class PHView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(PHView, self).dispatch(request, *args, **kwargs)

    # GET 요청을 처리하기 위해서 get 함수를 재정의
    def get(self, request, *args, **kwargs):

        # DHT.objects.all()의 결과는 QuerySet 타입이다.
        # 아래 코드는 QuerySet 타입을 json 타입으로 변경하고
        # json 객체를 직렬화 한 것이다.
        phs = serializers.serialize("json", PH.objects.all())
        print(phs)
        return JsonResponse(phs, # 직렬화한 json 객체
                            safe=False, # 첫번째 파라미터의 타입이 딕셔너리가 아닐경우
                            json_dumps_params={'ensure_ascii': False}, # 한글지원
                            status=200)

    # POST 요청을 처리하기 위해서 post 함수를 재정의
    def post(self, request, *args, **kwargs):
        if request.META['CONTENT_TYPE'] == 'application/json':
            req = json.loads(request.body)
            print('ph: ' + str(req['density']) + '\n')

            ph = PH(density=req['density'])
            ph.save()

            data = {
                'message': 'success'
            }
            return JsonResponse(data, status=200)

        data = {
            'message': 'failed'
        }
        return JsonResponse(data, status=404)


def aqua(request):
    return render(
        request,
        'aqua_app/index.html'
    )