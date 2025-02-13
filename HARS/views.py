import json 
import ldap3

from datetime import datetime
import base64


from django.utils import timezone
from django.core.serializers import serialize

from django.db.utils import IntegrityError


from django.contrib.auth import get_user_model
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required

from django.contrib import messages

from django.shortcuts import get_object_or_404
from django.shortcuts import render, redirect

from django.http import HttpResponse
from django.http import JsonResponse
from django.http import FileResponse, Http404, HttpResponseForbidden

from .models import InstituteProfile
from .models import HPCProfile
from .models import Project
from .models import Report
from .models import AccountType
from .models import Rate
from .models import QuarterlyRate
from .models import Application
from .models import UserAccount
from .models import Topup
from .models import HARSDates
from .models import Mail
from .models import CoreHour

from .mail import Send_mail


def fetch_LDAP_details(username):
    LDAP_SERVER = '172.31.1.1'

    #Search configuration
    LDAP_SEARCH_BASE = "ou=People,dc=iitk,dc=ac,dc=in"
    LDAP_SEARCH_FILTER = "(uid=%s)"
    LDAP_SEARCH_SCOPE = ldap3.LEVEL
    LDAP_SEARCH_ATTRIBUTES = ['cn', 'iitkFileNumber', 'userType', 'department'] # , 


    server = ldap3.Server(LDAP_SERVER, get_info=None)
    connection = ldap3.Connection(server, auto_bind=True, raise_exceptions=False)

    if not connection.bind():
        raise "Unable to connect with LDAP server"

    #LDAP3 Get user details
    search_args = {
        'search_base'   : LDAP_SEARCH_BASE,
        'search_filter' : LDAP_SEARCH_FILTER % username,
        'search_scope'  : LDAP_SEARCH_SCOPE,
        'attributes'    : LDAP_SEARCH_ATTRIBUTES
    }

    if not connection.search(**search_args):
        raise "Unable to communicate with LDAP server"


    entry = connection.response[0]

    name = entry['attributes']['cn'][0]
    uid = entry['attributes']['iitkFileNumber'][0]
    userType = entry['attributes']['userType'][0]
    department = entry['attributes']['department'][0]

    return name, uid, userType, department


# Create your views here.
def signin(request):
    if request.method == "POST": 

        username = request.POST.get("username").lower().strip()
        password = request.POST.get('password')
        remember_me = request.POST.get('remember_me') == 'on'

        LDAP_SERVER = '172.31.1.1'
        LDAP_BIND_DN = "uid=%s,ou=People,dc=iitk,dc=ac,dc=in"

        #Search configuration
        LDAP_SEARCH_BASE = "ou=People,dc=iitk,dc=ac,dc=in"
        LDAP_SEARCH_FILTER = "(uid=%s)"
        LDAP_SEARCH_SCOPE = ldap3.LEVEL
        LDAP_SEARCH_ATTRIBUTES = ['cn', 'iitkFileNumber', 'userType', 'department'] # , 


        DN = LDAP_BIND_DN % (username)
        server = ldap3.Server(LDAP_SERVER, get_info=None)
        connection = ldap3.Connection(server, user=DN, password=password, raise_exceptions=False)

        if not connection.bind():
           messages.error(request, "Incorrect username or password.")

           return redirect('signin')
                
        try:
            # https://stackoverflow.com/a/16606463
            user = get_user_model().objects.get(username = username)
            login(request, user)

            #if not remember_me:
            #    request.session.set_expiry(0)
            #else:
            #    # Set the session to expire in 2 weeks
            #    request.session.set_expiry(1209600)

            return redirect('index') 

        except:
            #LDAP3 Get user details
            search_args = {
                'search_base'   : LDAP_SEARCH_BASE,
                'search_filter' : LDAP_SEARCH_FILTER % username,
                'search_scope'  : LDAP_SEARCH_SCOPE,
                'attributes'    : LDAP_SEARCH_ATTRIBUTES
            }

            if not connection.search(**search_args):
                return redirect('login')

            entry = connection.response[0]

            name = entry['attributes']['cn'][0]
            uid = entry['attributes']['iitkFileNumber'][0]
            userType = entry['attributes']['userType'][0]
            department = entry['attributes']['department'][0]

            request.session['register'] = True
            request.session['name'] = name
            request.session['uid'] = uid
            request.session['department'] = department
            request.session['username'] = username 

            return redirect('register') 

    else:
        return render(request, "HARS/login.html")

def signout(request):
        logout(request)
        return redirect('signin') 

def register(request):
    if request.method == "POST":

        user = get_user_model().objects.create_user(username = request.session["username"])

        ip = InstituteProfile(
            name = request.session["name"],
            id_no = request.session["uid"],
            department = request.session["department"],
            designation = request.POST["designation"],
            user = user,
            )

        ip.save()

        login(request, user)

        #if not remember_me:
        #    request.session.set_expiry(0)
        #else:
        #    # Set the session to expire in 2 weeks
        #    request.session.set_expiry(1209600)

        return redirect('index') 

    else:
        if 'register' in request.session:
            data = {
                'name': request.session["name"],
                'uid': request.session["uid"],
                'department': request.session["department"],
                'username': request.session["username"],
            }
            return render(request, "HARS/register.html", data)

        else:
            return redirect('signin')

@login_required
def name(request):
    ip = get_object_or_404(InstituteProfile, user=request.user)
    data = {
        "name": ip.name
    }

    return JsonResponse(data)

@login_required
def index(request):
    try:
        ip = InstituteProfile.objects.get(user=request.user)
    except:
        return redirect('signin')

    if ip.designation == 'F':
        return render(request, "HARS/guide.html")
    else:
        return render(request, "HARS/user.html")

@login_required
def institute_profile(request):
    ip = get_object_or_404(InstituteProfile, user=request.user)

    return JsonResponse({
            "Name": ip.name,
            "Department": ip.department,
            "ID_no": ip.id_no,
            "Username": ip.user.username,
            "Designation": InstituteProfile.Designation(ip.designation).label
        })

@login_required
def statistics(request):
    return JsonResponse({
            "Updated_on": "16/06/2024 08:14 AM",
            "Accounts": [
                {
                    "Title": "Param Sanganak - High Priority Access (Not Active)",
                    "Balance": [10,20,30],
                    "CPU": [100,200,300],
                    "GPU": [20, 30, 50],
                    "Home": [100, 200, 300],
                    "Scratch": [200, 500, 700]
                },
                {
                    "Title": "Param Sanganak - Regular Access (Active)",
                    "Balance": [10,20,30],
                    "CPU": [100,200,300],
                    "GPU": [20, 30, 50],
                    "Home": [100, 200, 300],
                    "Scratch": [200, 500, 700]
                },
                {
                    "Title": "HPC2013 - Regular Access (Active)",
                    "Balance": [10,20,30],
                    "CPU": [100,200,300],
                    "GPU": [20,30,50],
                    "Home": [100,200,300],
                    "Scratch": [200,500,700]
                }
            ]
            
        })

@login_required
def project(request):
    ip = get_object_or_404(InstituteProfile, user=request.user)
    pf_no = ip.id_no
    if len(pf_no) == 4:
        pf_no = '0' + pf_no

    projects = Project.objects.filter(pf_no=pf_no)
    list_of_projects = {
        'list': []
    }
    print(projects)
    for p in projects:
        list_of_projects['list'].append({
                'pf_no': p.pf_no,
                'pi_name': p.pi_name,
                'pi_type': p.pi_type,
                'project_name': p.project_name,
                'project_title': p.project_title,
                'project_type': p.project_type,
                'start_date': p.start_date.strftime("%d/%m/%y"),
                'end_date': p.end_date.strftime("%d/%m/%y"),
            })

    return JsonResponse(list_of_projects)

@login_required
def hpc_profile(request):
    if request.method == "POST":
        r = json.loads(request.body)

        ip = get_object_or_404(InstituteProfile, user=request.user)

        if "pi_username" in r:
            r["pi_username"] = r["pi_username"].lower().strip()
            pi_user = get_user_model().objects.filter(username=r["pi_username"]).last()
            if (pi_user):
                pi_ip = get_object_or_404(InstituteProfile, user=pi_user)

                if pi_ip.designation == "F":
                    pi_name = pi_ip.name
                else:
                    return HttpResponse("Please put the email of your Thesis Supervisor/Research Guide in the PI Email.", status=422)
                    
            else:
                name, uid, userType, department = fetch_LDAP_details(r["pi_username"])

                if userType == 'fc':
                    pi_user = get_user_model().objects.create_user(username=r["pi_username"])
                    pi_ip = InstituteProfile(
                        name=name,
                        id_no = uid,
                        department=department,
                        user=pi_user,
                        designation="F"
                        )
                    pi_ip.save()
                    pi_name = name

                else:
                    return HttpResponse("Please put the email of your Thesis Supervisor/Research Guide in the PI Email.", status=422)

        else:
            pi_ip = None    # For Guide there is no PI
            pi_name = None


        profile = HPCProfile(
            research_title = r["Research_Title"],
            domain = r["Domain"],
            sub_domain = r["Sub-Domain"],
            software = r["Software"],
            contact = r["Contact"],
            gender  = r["Gender"],
            institute_profile = ip,
            pi_profile = pi_ip
            )

        profile.save()

        
        return JsonResponse({
                "Research_Title": profile.research_title,
                "Domain": profile.domain,
                "Sub-Domain": profile.sub_domain,
                "Software": profile.software,
                "Contact": profile.contact,
                "Gender": HPCProfile.Gender(profile.gender).label,
                "PI": pi_name
            })
    else:

        ip = get_object_or_404(InstituteProfile, user=request.user)
        profile = get_object_or_404(HPCProfile, institute_profile=ip)

        if profile.pi_profile:
            pi_name = profile.pi_profile.name
        else:
            pi_name = None  # For Guide there is no PI

        return JsonResponse({
                "Research_Title": profile.research_title,
                "Domain": profile.domain,
                "Sub-Domain": profile.sub_domain,
                "Software": profile.software,
                "Contact": profile.contact,
                "Gender": HPCProfile.Gender(profile.gender).label,
                "PI": pi_name
            })

@login_required
def report(request):
    if request.method == "POST":
        r = json.loads(request.body)

        ip = get_object_or_404(InstituteProfile, user=request.user)
        profile = get_object_or_404(HPCProfile, institute_profile=ip)

        work_report = r["work_report"]
        if len(work_report[0]) > 0:
            header, encoded = work_report[2].split(',', 1)
            file_bytes = base64.b64decode(encoded)
            file_name = request.user.username+"-"+datetime.now().strftime('%Y-%m-%d')+"-"+work_report[0]
            with open("Uploads/Report/"+file_name, 'wb') as file:
                file.write(file_bytes)

            r = Report(
                report_file = file_name,
                hpc_profile = profile
                )

            r.save()
            
            return JsonResponse({
                    "submitted_at": r.submitted_at,
                    "report_file": r.report_file,
                })
        else:
            return JsonResponse({})

    else:

        data = {}

        try:
            ip = InstituteProfile.objects.get(user=request.user)
            profile = HPCProfile.objects.get(institute_profile=ip)
            latest_report = Report.objects.filter(hpc_profile=profile).order_by('submitted_at').last()

            data["submitted_on"] = latest_report.submitted_at.date().strftime("%d/%m/%y")
            data["report_file"] = latest_report.report_file

        except:
            data["submitted_at"] = None
            data["report_file"] = None

        return JsonResponse(data)

@login_required
def view_report(request):
    ip = InstituteProfile.objects.get(user=request.user)
    profile = HPCProfile.objects.get(institute_profile=ip)
    latest_report = Report.objects.filter(hpc_profile=profile).order_by('submitted_at').last()
    if (latest_report):
        try:
            return FileResponse(open(f"Uploads/Report/{latest_report.report_file}", 'rb'), content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        except FileNotFoundError:
            raise Http404()
    else:
        raise Http404()
   
@login_required
def charges(request, account_type_id):

    if account_type_id != "HPC2013-QA":
        at = AccountType.objects.get(type_id=account_type_id)
        rates = Rate.objects.get(account_type=at)
        
        data = {
            "cpu_per_core_hour": rates.cpu_per_core_hour,
            "gpu_per_node_hour": rates.gpu_per_node_hour,
            "cpu_unit_recharge": rates.cpu_unit_recharge,
            "gpu_unit_recharge": rates.gpu_unit_recharge,
            "last_core_hour": 0
        }

        corehour = CoreHour.objects.filter(username=request.user.username).last()

        if corehour:
            data["last_core_hour"] = corehour.core_hour

        return JsonResponse(data)
    else:
        ip = InstituteProfile.objects.get(user=request.user)
        Qrate = QuarterlyRate.objects.get(designation=ip.designation).rate
        data = {
            'rate': Qrate
        }

        return JsonResponse(data)

@login_required
def application(request, account_type_id):

    if account_type_id != "HPC2013-QA":  # ParamSanganak

        data = {"account_type": account_type_id}

        ip = InstituteProfile.objects.get(user=request.user)
        profile = get_object_or_404(HPCProfile, institute_profile=ip)
        at = AccountType.objects.get(type_id=account_type_id)
 
        if account_type_id == "PS-HPA":
            data["cpu_step"] = 1
            data["gpu_step"] = 1

            data['AccountType'] = {
                "name": at.name,
                "admin": at.admin,
                "default_cpu_core_hours": 0, # at.default_cpu_core_hours,
                "default_gpu_node_hours": 0 # at.default_gpu_node_hours
            }

        if account_type_id == "PS-RA":
            data["cpu_step"] = 20000
            data["gpu_step"] = 300

            data['AccountType'] = {
                "name": at.name,
                "admin": at.admin,
                "default_cpu_core_hours": at.default_cpu_core_hours,
                "default_gpu_node_hours": 0 # at.default_gpu_node_hours
            }



        rates = Rate.objects.get(account_type=at)
        data['Rates'] = {
            "cpu_per_core_hour": rates.cpu_per_core_hour,
            "gpu_per_node_hour": rates.gpu_per_node_hour,
            "cpu_unit_recharge": rates.cpu_unit_recharge,
            "gpu_unit_recharge": rates.gpu_unit_recharge
        }

        if request.method == "POST":
            r = json.loads(request.body)

            rate = Rate.objects.get(account_type=at)

            gpu_node_hour = int(r["gpu_node_hour"])
            if gpu_node_hour<0:
                gpu_node_hour = 0

            amount = rate.cpu_per_core_hour * int(r["cpu_core_hour"]) + rate.gpu_per_node_hour * gpu_node_hour

            renew_date = HARSDates.objects.get(parameter='renew_date').value
            latest_application = Application.objects.filter(hpc_profile=profile, account_type=at, request_at__gt=renew_date).order_by('request_at').last()


            if "pool_allocation" in r:
                pool_allocation = True

                if ip.designation != "F":
                    r["cpu_core_hour"] = 0
                    r["gpu_node_hour"] = 0
                    r["amount"] = 0

            else:
                pool_allocation = False


            if (amount == 0 and ip.designation == "F"):
                return HttpResponse("Total amount must be more than zero.", status=422)


            if "payment_mode" in r:
                payment_mode = r['payment_mode']
            elif pool_allocation:
                payment_mode = "Pool"
            else:
                payment_mode = "Project"



            if "project_no" in r:
                project_no = r["project_no"]
            else:
                project_no = None

            if "budget_head" in r:
                budget_head = r["budget_head"]
            else:
                budget_head = None

            if (not latest_application):
                new_application = Application(
                    pool_allocation = pool_allocation,
                    cpu_core_hours = int(r["cpu_core_hour"]),
                    gpu_node_hours = int(r["gpu_node_hour"]),
                    amount = amount,
                    payment_mode = payment_mode,
                    project_no = project_no,
                    budget_head = budget_head,
                    hpc_profile = profile,
                    account_type = at
                )

                if ip.designation == "F":
                    # Naive datetime
                    naive_dt = datetime.now()

                    # Make it timezone-aware
                    aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())
                    new_application.pi_time = aware_dt       

                new_application.save()

                if ip.designation == "F":
                    user_account = UserAccount(
                                application = new_application,
                                institute_profile = new_application.hpc_profile.institute_profile,
                                account_type = new_application.account_type,
                                is_active = True
                    )

                    user_account.save()

            else:
                return HttpResponse("Application already exists")

            data["Application"] = {
                "application_id": new_application.pk,
                "request_at": new_application.request_at.date().strftime("%d/%m/%y"),
                "pi_time": new_application.pi_time,
                "rnd_time": new_application.rnd_time,
                "admin_time": new_application.admin_time,
                "pool_allocation": new_application.pool_allocation,
                "cpu_core_hour":  new_application.cpu_core_hours,
                "gpu_node_hour":  new_application.gpu_node_hours,
                "amount": new_application.amount,
                "payment_mode": new_application.payment_mode,
                "project_no": new_application.project_no,
                "budget_head": new_application.budget_head,
            }

            return JsonResponse(data)

        else:
            renew_date = HARSDates.objects.get(parameter='renew_date').value
            latest_application = Application.objects.filter(hpc_profile=profile, account_type=at, request_at__gt=renew_date).order_by('request_at').last()
            if (latest_application):

                project_no = latest_application.project_no

                if (project_no is None):
                    project_no = "N/A"

                budget_head = latest_application.budget_head

                if (budget_head is None):
                    budget_head = "N/A"

                data["Application"] = {
                    "application_id": latest_application.pk,
                    "request_at": latest_application.request_at.date().strftime("%d/%m/%y"),
                    "pi_time": latest_application.pi_time,
                    "rnd_time": latest_application.rnd_time,
                    "admin_time": latest_application.admin_time,
                    "pool_allocation": latest_application.pool_allocation,
                    "cpu_core_hour":  latest_application.cpu_core_hours,
                    "gpu_node_hour":  latest_application.gpu_node_hours,
                    "amount": latest_application.amount,
                    "payment_mode": latest_application.payment_mode,
                    "project_no": project_no,
                    "budget_head": budget_head,
                }


            return JsonResponse(data)
    else:
        ip = InstituteProfile.objects.get(user=request.user)
        profile = get_object_or_404(HPCProfile, institute_profile=ip)
        at = AccountType.objects.get(type_id=account_type_id)
        rate = QuarterlyRate.objects.get(designation=ip.designation).rate

        data = {
            "account_type": "HPC2013-QA",
            "rate": rate
        }


        if request.method=="POST":
            r = json.loads(request.body)

            if "screenshot" in r:
                screenshot = r["screenshot"]
                header, encoded = screenshot[2].split(',', 1)
                file_bytes = base64.b64decode(encoded)
                with open("Uploads/"+request.user.username+"-"+datetime.now().strftime('%Y-%m-%d')+r["screenshot"][0], 'wb') as file:
                    file.write(file_bytes)


                application_id = r["application_id"]
                # Naive datetime
                naive_dt = datetime.now()

                # Make it timezone-aware
                aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())

                application = Application.objects.get(pk=application_id)
                application.screenshot = aware_dt
                application.save()

                return JsonResponse(data)


            duration = int(r["duration"])

            new_application = Application(
                    cpu_core_hours = 0,
                    gpu_node_hours = 0,
                    duration = duration,
                    amount = duration*rate,
                    payment_mode = r["payment_mode"],
                    hpc_profile = profile,
                    account_type = at
                )

            if ip.designation == "F":
                    # Naive datetime
                    naive_dt = datetime.now()

                    # Make it timezone-aware
                    aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())
                    new_application.pi_time = aware_dt

            if "project_no" in r:
                new_application.project_no = r["project_no"]
                new_application.budget_head = r["budget_head"]

            new_application.save()

            return JsonResponse(data)



        renew_date = str(HARSDates.objects.get(parameter='renew_date_QA').value)
        latest_application = Application.objects.filter(hpc_profile=profile, account_type=at, request_at__gt=renew_date).order_by('request_at').last()
        if (latest_application):
                data["Application"] = {
                    "application_id": latest_application.pk,
                    "request_at": latest_application.request_at.date().strftime("%d/%m/%y"),
                    "pi_time": latest_application.pi_time,
                    "rnd_time": latest_application.rnd_time,
                    "admin_time": latest_application.admin_time,
                    "cpu_core_hour":  latest_application.cpu_core_hours,
                    "gpu_node_hour":  latest_application.gpu_node_hours,
                    "duration":  latest_application.duration,
                    "amount": latest_application.amount,
                    "screenshot": latest_application.screenshot,
                    "payment_mode": latest_application.payment_mode,
                    "project_no": latest_application.project_no,
                    "budget_head": latest_application.budget_head,
                }
        return JsonResponse(data)

@login_required
def topup(request, resource, account_type_id):
    data = {}

    ip = InstituteProfile.objects.get(user=request.user)
    at = AccountType.objects.get(type_id=account_type_id)

    data = {
        "resource": resource,
        "account_type": account_type_id,
        "date": datetime.now().strftime('%d/%m/%Y'),
        "unit": {
            "cpu": "Core hours",
            "gpu": "Card hours"
        },
        "AccountType": {},
        "Rates": [],
        "Topup":[]
    }

    rates = Rate.objects.get(account_type=at)
    data['Rates'] = {
        "per_hour": {
            "cpu": rates.cpu_per_core_hour,
            "gpu": rates.gpu_per_node_hour,
        },
        "unit_recharge": {
            "cpu": rates.cpu_unit_recharge,
            "gpu": rates.gpu_unit_recharge
        }
    }

    data['AccountType'] = {
        "name": at.name,
        "admin": at.admin,
        "default_core_hours": {
            "cpu": at.default_cpu_core_hours,
            "gpu": at.default_gpu_node_hours
        },
        "default_amounts": {
            "cpu": at.default_cpu_core_hours * rates.cpu_per_core_hour,
            "gpu": at.default_gpu_node_hours * rates.gpu_per_node_hour
        }
    }



    renew_date = HARSDates.objects.get(parameter='renew_date').value
    default_user_account_expiry = HARSDates.objects.get(parameter='default_user_account_expiry').value

    user_account = UserAccount.objects.filter(institute_profile=ip, account_type=at, create_time__gt=renew_date).order_by('create_time').last()
    if not user_account and request.method == "POST":
        return HttpResponse("Please fill in the Application and PI Approval before applying for Topup.", status=422)

    if (user_account):
        if request.method == "POST":
            if user_account.application.pool_allocation == True and ip.designation != "F":
                return HttpResponse("Topups can not be applied for accounts with Pool Allocation.", status=422)

            r = json.loads(request.body)

            topup = Topup(
                resource=resource.upper(),
                hours=int(r["hours"]),
                units=int(r["hours"])*data["Rates"]["per_hour"][resource]/data['Rates']["unit_recharge"][resource],
                amount=int(r["hours"])*data["Rates"]["per_hour"][resource],
                user_account=user_account
            )


            if ip.designation == "F":
                topup.payment_mode=r["payment_mode"]

                # Naive datetime
                naive_dt = datetime.now()

                # Make it timezone-aware
                aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())
                topup.pi_time = aware_dt

                if "project_no" in r:
                    topup.project_no = r["project_no"]
                    topup.budget_head = r["budget_head"]


            topup.save()

            topup = Topup.objects.filter(user_account=user_account, resource=resource.upper(), request_at__gt=renew_date).order_by('request_at')

            for t in topup:
                data["Topup"].append({
                    'request_at': t.request_at.date().strftime("%d/%m/%Y"),
                    'pi_time': t.pi_time,
                    'rnd_time': t.rnd_time,
                    'admin_time': t.admin_time,
                    'resource': t.resource,
                    'hours': t.hours,
                    'units': t.units,
                    'amount': t.amount,
                    'payment_mode': t.payment_mode,
                    'project_no': t.project_no,
                    'budget_head': t.budget_head
                })

            return JsonResponse(data)

        else:
            topup = Topup.objects.filter(user_account=user_account, resource=resource.upper(), request_at__gt=renew_date).order_by('-request_at')

            for t in topup:
                data["Topup"].append({
                    'request_at': t.request_at.date().strftime("%d/%m/%Y"),
                    'pi_time': t.pi_time,
                    'rnd_time': t.rnd_time,
                    'admin_time': t.admin_time,
                    'resource': t.resource,
                    'hours': t.hours,
                    'units': t.units,
                    'amount': t.amount,
                    'payment_mode': t.payment_mode,
                    'project_no': t.project_no,
                    'budget_head': t.budget_head
                })

            return JsonResponse(data)


    data["user_account"] = "None"
    return JsonResponse(data)


@login_required
def group_members(request):
    ip = InstituteProfile.objects.get(user=request.user)

    student_profiles = HPCProfile.objects.filter(pi_profile=ip)

    data = {}

    for s in student_profiles:
        data[s.institute_profile.name] = {
            "username": s.institute_profile.user.username,
            "notifications": 0
        }

    return JsonResponse(data)

@login_required
def group_member_application(request, username, account_type_id):
    ip = InstituteProfile.objects.get(user=request.user)
    at = AccountType.objects.get(type_id=account_type_id)
    renew_date = HARSDates.objects.get(parameter='renew_date').value

    student_user = get_object_or_404(get_user_model(), username=username)
    student_ip = get_object_or_404(InstituteProfile, user=student_user)
    student_hpc_profile = get_object_or_404(HPCProfile, institute_profile=student_ip, pi_profile=ip)
    #student_application = get_object_or_404(Application, hpc_profile=student_hpc_profile, account_type=at, request_at__gt=renew_date).last()

    try:
        student_application = Application.objects.filter(hpc_profile=student_hpc_profile, account_type=at, request_at__gt=renew_date).last()
    except:
        raise Http404("No Application matches the given query.")

    data = {
            "account_type": account_type_id,
            "username": username
        }

    if account_type_id == "PS-HPA":
        data["cpu_step"] = 1
        data["gpu_step"] = 1

    if account_type_id == "PS-RA":
        data["cpu_step"] = 20000
        data["gpu_step"] = 300

    ip = InstituteProfile.objects.get(user=request.user)
    # profile = HPCProfile.objects.get(institute_profile=ip)
    at = AccountType.objects.get(type_id=account_type_id)
    data['AccountType'] = {
        "name": at.name,
        "admin": at.admin,
        "default_cpu_core_hours": at.default_cpu_core_hours,
        "default_gpu_node_hours": at.default_gpu_node_hours
    }



    rates = Rate.objects.get(account_type=at)
    data['Rates'] = {
        "cpu_per_core_hour": rates.cpu_per_core_hour,
        "gpu_per_node_hour": rates.gpu_per_node_hour,
        "cpu_unit_recharge": rates.cpu_unit_recharge,
        "gpu_unit_recharge": rates.gpu_unit_recharge
    }
    Qrate = QuarterlyRate.objects.get(designation=ip.designation).rate
    data['rate'] = Qrate


    if (student_application):
        if request.method == 'POST':
            r = json.loads(request.body)

            # Naive datetime
            naive_dt = datetime.now()

            # Make it timezone-aware
            aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())

            if "pool_allocation" in r:
                pool_allocation = True

                r["cpu_core_hour"] = 0
                r["gpu_node_hour"] = 0
                r["amount"] = 0

                payment_mode = "Pool"

            else:
                pool_allocation = False
                payment_mode = r["payment_mode"]


            if "project_no" in r:
                project_no = r["project_no"]
            else:
                project_no = None

            if "budget_head" in r:
                budget_head = r["budget_head"]
            else:
                budget_head = None
                

            student_application.pi_time        = aware_dt
            student_application.pool_allocation   = pool_allocation
            student_application.payment_mode   = payment_mode
            student_application.project_no     = project_no
            student_application.budget_head    = budget_head

            if "cpu_core_hour" in r:
                
                amount = int(r["cpu_core_hour"]) * rates.cpu_per_core_hour + int(r["gpu_node_hour"]) * rates.gpu_per_node_hour

                student_application.cpu_core_hours = r["cpu_core_hour"]
                student_application.gpu_node_hours = r["gpu_node_hour"]
                student_application.amount         = amount

                if amount == 0 and not pool_allocation:
                    return HttpResponse("Applications without Pool Allocation can not have zero amount.", status=422)


            elif "duration" in r:
                amount = int(r["duration"]) * Qrate

                student_application.duration = r["duration"]
                student_application.amount   = amount


            student_application.save()

            user_account = UserAccount(
                            application = student_application,
                            institute_profile = student_application.hpc_profile.institute_profile,
                            account_type = student_application.account_type,
                            is_active = True
                )

            user_account.save()
 

            data["Application"] = {
                "application_id": student_application.pk,
                "request_at": student_application.request_at.date().strftime("%d/%m/%y"),
                "pi_time": student_application.pi_time,
                "rnd_time": student_application.rnd_time,
                "admin_time": student_application.admin_time,
                "pool_allocation":  student_application.pool_allocation,
                "cpu_core_hour":  student_application.cpu_core_hours,
                "gpu_node_hour":  student_application.gpu_node_hours,
                "duration":  student_application.duration,
                "amount": student_application.amount,
                "payment_mode": student_application.payment_mode,
                "project_no": project_no,
                "budget_head": budget_head,
            }

            return JsonResponse(data)

        else:
            if not student_application.project_no:
                project_no = ""
            else:
                project_no = student_application.project_no

            if not student_application.budget_head:
                budget_head = ""
            else:
                budget_head = student_application.budget_head


            data["Application"] = {
                "application_id": student_application.pk,
                "request_at": student_application.request_at.date().strftime("%d/%m/%y"),
                "pi_time": student_application.pi_time,
                "rnd_time": student_application.rnd_time,
                "admin_time": student_application.admin_time,
                "pool_allocation":  student_application.pool_allocation,
                "cpu_core_hour":  student_application.cpu_core_hours,
                "gpu_node_hour":  student_application.gpu_node_hours,
                "duration":  student_application.duration,
                "amount": student_application.amount,
                "payment_mode": student_application.payment_mode,
                "project_no": project_no,
                "budget_head": budget_head,
            }

            return JsonResponse(data)

@login_required
def group_member_topup(request, username, resource, account_type_id):
    ip = InstituteProfile.objects.get(user=request.user)
    at = AccountType.objects.get(type_id=account_type_id)
    renew_date = HARSDates.objects.get(parameter='renew_date').value


    data = {
        "account_type": account_type_id,
        "username": username,
        "resource": resource,
        "date": datetime.now().strftime('%d/%m/%Y'),
        "unit": {
            "cpu": "CPU core hours",
            "gpu": "GPU node hours"
        }
    }

    rates = Rate.objects.get(account_type=at)
    data['Rates'] = {
        "per_hour": {
            "cpu": rates.cpu_per_core_hour,
            "gpu": rates.gpu_per_node_hour
        },
        "unit_recharge": {
            "cpu": rates.cpu_unit_recharge,
            "gpu": rates.gpu_unit_recharge
        } 
    }

    at = AccountType.objects.get(type_id=account_type_id)
    data['AccountType'] = {
        "name": at.name,
        "admin": at.admin,
        "default_core_hours": {
            "cpu": at.default_cpu_core_hours,
            "gpu": at.default_gpu_node_hours
        },
        "default_amounts": {
            "cpu": at.default_cpu_core_hours * rates.cpu_per_core_hour,
            "gpu": at.default_gpu_node_hours * rates.gpu_per_node_hour
        }
    }


    student_user = get_object_or_404(get_user_model(), username=username)
    student_ip = get_object_or_404(InstituteProfile, user=student_user)
    student_hpc_profile = get_object_or_404(HPCProfile, institute_profile=student_ip, pi_profile=ip)  # This variable is not used, but used to verity that this is a student of existing PI
    student_user_account = get_object_or_404(UserAccount, institute_profile=student_ip, account_type=at, create_time__gt=renew_date)
    
  
    if request.method == 'POST':
        if not student_user_account:
            return HttpResponse("Please activate your account before applying for Topup.", status=422)


        r = json.loads(request.body)

        student_topup = get_object_or_404(Topup, user_account=student_user_account, pk=r["id"], request_at__gt=renew_date)

        # Naive datetime
        naive_dt = datetime.now()

        # Make it timezone-aware
        aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())

        amount = int(r["hours"]) * data['Rates']["per_hour"][resource]

        if "project_no" in r:
            project_no = r["project_no"]
        else:
            project_no = None

        if "budget_head" in r:
            budget_head = r["budget_head"]
        else:
            budget_head = None

        if "payment_mode" in r and r["payment_mode"] == "Pool":
            hours = 0
            amount = 0

        else:
            hours = int(r["hours"])


        student_topup.pi_time        = aware_dt
        student_topup.hours          = hours
        # student_topup.units          = amount/data['Rates']['unit_recharge'][resource]
        student_topup.amount         = amount
        student_topup.payment_mode   = r["payment_mode"]
        student_topup.project_no     = project_no
        student_topup.budget_head    = budget_head

        student_topup.save()

        if not student_topup.project_no:
            project_no = ""
        else:
            project_no = student_topup.project_no

        if not student_topup.budget_head:
            budget_head = ""
        else:
            budget_head = student_topup.budget_head

        data = {
            "id": student_topup.pk,
            "request_at": student_topup.request_at.date().strftime("%d/%m/%Y"),
            "pi_time": student_topup.pi_time,
            "rnd_time": student_topup.rnd_time,
            "admin_time": student_topup.admin_time,
            "resource": student_topup.resource,
            "hours": student_topup.hours,
            "units": student_topup.units,
            "amount": student_topup.amount,
            "payment_mode": student_topup.payment_mode,
            "project_no": project_no,
            "budget_head": budget_head
        }

        return JsonResponse(data)
    
    else:

        student_topups = Topup.objects.filter(user_account=student_user_account, resource=resource.upper(), request_at__gt=renew_date)

        
        data["Topups"] = []

        for student_topup in student_topups:

            if not student_topup.project_no:
                project_no = ""
            else:
                project_no = student_topup.project_no

            if not student_topup.budget_head:
                budget_head = ""
            else:
                budget_head = student_topup.budget_head

            data["Topups"].append({
                "id": student_topup.pk,
                "request_at": student_topup.request_at.date().strftime("%d/%m/%Y"),
                "pi_time": student_topup.pi_time,
                "rnd_time": student_topup.rnd_time,
                "admin_time": student_topup.admin_time,
                "resource": student_topup.resource,
                "hours": student_topup.hours,
                "units": student_topup.units,
                "amount": student_topup.amount,
                "payment_mode": student_topup.payment_mode,
                "project_no": project_no,
                "budget_head": budget_head
            })

        return JsonResponse(data)


