>>> from django.contrib.auth.models import User
>>> ashiskl = User.objects.get(username='abhiskl')
>>> from HARS.models import InstituteProfile
>>> ip = InstituteProfile.objects.get(user=abhiskl)
Traceback (most recent call last):
  File "/usr/lib/python3.10/code.py", line 90, in runcode
    exec(code, self.locals)
  File "<console>", line 1, in <module>
NameError: name 'abhiskl' is not defined. Did you mean: 'ashiskl'?
>>> ip = InstituteProfile.objects.get(user=abhislk)
Traceback (most recent call last):
  File "/usr/lib/python3.10/code.py", line 90, in runcode
    exec(code, self.locals)
  File "<console>", line 1, in <module>
NameError: name 'abhislk' is not defined
>>> ip = InstituteProfile.objects.get(user=abhiskl)
Traceback (most recent call last):
  File "/usr/lib/python3.10/code.py", line 90, in runcode
    exec(code, self.locals)
  File "<console>", line 1, in <module>
NameError: name 'abhiskl' is not defined. Did you mean: 'ashiskl'?
>>> abhiskl = User.objects.get(username='abhiskl')
>>> ip = InstituteProfile.objects.get(user=abhiskl)
>>> from HARS.models import AccountType
>>> at = AccountType.objects.get(type-Id=')
Traceback (most recent call last):
  File "/usr/lib/python3.10/code.py", line 63, in runsource
    code = self.compile(source, filename, symbol)
  File "/usr/lib/python3.10/codeop.py", line 153, in __call__
    return _maybe_compile(self.compiler, source, filename, symbol)
  File "/usr/lib/python3.10/codeop.py", line 73, in _maybe_compile
    return compiler(source, filename, symbol)
  File "/usr/lib/python3.10/codeop.py", line 118, in __call__
    codeob = compile(source, filename, symbol, self.flags, True)
  File "<console>", line 1
    at = AccountType.objects.get(type-Id=')
                                         ^
SyntaxError: unterminated string literal (detected at line 1)
>>> at = AccountType.objects.get(type_id='PS-RA')
>>> from HARS.models import Application
>>> application = Application.objects.get(pk=15)
>>> application
<Application: Param Sanganak - Regular Access: ( Abhishek Shukla, 19214261, abhiskl )>
>>> from HARS.models import UserAccount
>>> ua = UserAccount.objects.get(application=application, institute_profile=ip, account_type=at)
>>> ua
<UserAccount: Param Sanganak - Regular Access>
>>> ua.institute_profile.user.user
ua.institute_profile.user.user_permissions(    ua.institute_profile.user.username             ua.institute_profile.user.username_validator(
>>> ua.institute_profile.user.user
Traceback (most recent call last):
  File "/usr/lib/python3.10/code.py", line 90, in runcode
    exec(code, self.locals)
  File "<console>", line 1, in <module>
AttributeError: 'User' object has no attribute 'user'
>>> ua.institute_profile.user.username
'abhiskl'
>>> from HARS.models import Topup
>>> t = Topup(user_account=ua)
>>> t.save()
>>> t = Topup(user_account=ua)
>>> t.save()