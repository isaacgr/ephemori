import subprocess

with open('.env.development') as f:
    for line in f.readlines():
        configvar = line.strip()
        s = subprocess.check_call('heroku config:set %s' % configvar, shell=True)

        
