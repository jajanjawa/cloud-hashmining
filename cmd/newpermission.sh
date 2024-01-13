node=https://api.databisnis.id
account=aiueo
publicKey=VEX...babibu


# buat kunci cron
cleos -u $node set account permission $account cron $publicKey active -p $account

# vexcore::linkauth
cleos -u $node set action permission $account mine.bitvexa hashmining cron -p $account

# vexcore::unlinkauth
#cleos -u $node set action permission $account mine.bitvexa hashmining NULL -p $account