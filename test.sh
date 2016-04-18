forever stop app.js
export NODE_ENV=testing
rm -rf ../logs/forever.log
forever start -a ../logs/forever.log -e techwizzerr.log app.js
