docker compose -f docker-compose.yml down --remove-orphans
# Clean Burn Chain
rm -r burn_vmaster/lib
rm -r burn_vmaster/log
rm -r burn_vnode1/lib
rm -r burn_vnode1/log
rm -r burn_vnode2/lib
rm -r burn_vnode2/log
rm -r burn_pnode1/lib
rm -r burn_pnode1/log
rm -r burn_pnode1/xpop
# Clean Mint Chain
rm -r mint_vmaster1/lib
rm -r mint_vmaster1/log
rm -r mint_vmaster2/lib
rm -r mint_vmaster2/log
rm -r mint_vnode1/lib
rm -r mint_vnode1/log
rm -r mint_vnode2/lib
rm -r mint_vnode2/log
rm -r mint_vnode3/lib
rm -r mint_vnode3/log
