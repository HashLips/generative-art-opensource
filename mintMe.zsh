node index.js
pause
metaplex upload ./output --url https://api.devnet.solana.com --keypair dev-wallet.json
pause
metaplex verify
pause
metaplex create_candy_machine -k dev-wallet.json -p 0.666
pause
metaplex set_start_date -k dev-wallet.json -d "10 Sep 2021 00:00:00 GMT"
pause
for x (1 2 3 4 5 6 7 8); do metaplex mint_one_token -k dev-wallet.json; done