export NODE_ENV=testing
forever start -o ../logs/techwizzout.log -e techwizzerr.log app.js
