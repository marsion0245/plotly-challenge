# plotly-challenge
Bootcamp homework plotly-challenge

The HW was coded and tested on client.
All required functions work.

I tried to published the solution on HEROKO, it crashed during the process.
I had to redo env since HEROKU was crashing due to some Python modules compatibility issues, got help from Tom. 
After that I create another environment and republished the solution.
The evironment started but when accesing app with bowser I got runtime error.
Asked TA for support again (Tom), we could not make it work.
It was quite a waste of time with this one, and it is still not working.

After further investigation it truned out that the source of the issue was
missmatch between entry in Procfile and the name of application.

The third entry in proc file, here app in: 

>web: gunicorn app:app

MUST match the name of application, in my case app 

App now available at:
[Homerwork](https://plotyhw.herokuapp.com/)
