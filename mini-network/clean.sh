docker compose -f docker-compose.yml down --remove-orphans
# Clean Burn Chain
rm -r burn_vmaster/lib
rm -r burn_vmaster/lob
rm -r burn_vnode1/lib
rm -r burn_vnode1/log
rm -r burn_pnode1/lib
rm -r burn_pnode1/log
# Clean Mint Chain
rm -r mint_vmaster/lib
rm -r mint_vmaster/log
rm -r mint_vnode1/lib
rm -r mint_vnode1/log
