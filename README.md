# plotly-challenge
To access HEROKU installation click (https://plotyhw.herokuapp.com/ "here")

The HW was coded and tested on client, and all required functions worked.

Than I tried to published the solution on HEROKO, it crashed during the process.
I had to redo env since HEROKU was crashing due to some Python modules compatibility issues, got help from Tom (thanks!). 
After that I create another environment and republished the solution.
The evironment started but when accesing the app with bowser I got a runtime error.
Asked TA for support again (Tom), we could not make it work.

After further investigation it truned out that the source of the issue was
missmatch between entry in Procfile and the name of application.

The third entry in proc file, here app in: 

>web: gunicorn app:app

MUST match the name of application, in my case app 
This publishing excercise took quite some time.
