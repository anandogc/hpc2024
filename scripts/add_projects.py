import datetime
from HARS.models import Project

l = []
with open('projects.tsv') as file:
    while line := file.readline():
        l.append(line.rstrip().split('\t'))

for p in l:
    print(p, end="")
    p = Project(pf_no=p[0],
        pi_name=p[1],
        pi_type=p[2],
        project_name=p[3],
        project_title=p[4],
        project_type=p[5],
        start_date=datetime.datetime.strptime(p[6], "%d-%b-%y").date(),
        end_date=datetime.datetime.strptime(p[7], "%d-%b-%y").date()
    )
    try:
        p.save()
        print(" - Added")
    except:
        print(" - Already Exists")
