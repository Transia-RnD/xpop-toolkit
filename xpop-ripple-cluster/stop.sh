#! /bin/bash
docker compose -f docker-compose.yml down --remove-orphans
rm -r vnode1/lib
rm -r vnode1/log
rm -r vnode2/lib
rm -r vnode2/log
rm -r vnode3/lib
rm -r vnode3/log
rm -r vnode4/lib
rm -r vnode4/log
rm -r vnode5/lib
rm -r vnode5/log
rm -r vnode6/lib
rm -r vnode6/log
rm -r vnode7/lib
rm -r vnode7/log
rm -r vnode8/lib
rm -r vnode8/log
rm -r vnode9/lib
rm -r vnode9/log
rm -r vnode10/lib
rm -r vnode10/log
rm -r pnode1/lib
rm -r pnode1/log
rm -r pnode1/xpop
