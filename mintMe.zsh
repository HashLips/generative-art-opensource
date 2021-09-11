node index.js
pause
metaplex upload ./output --url https://api.devnet.solana.com --keypair dev-wallet.json
pause
metaplex verify
pause
metaplex create_candy_machine -k kodama-wallet.json -p 0.666 -env mainnet-beta
pause
metaplex set_start_date -k kodama-wallet.json -d "10 Sep 2021 00:00:00 GMT" -env mainnet-beta
pause
for x in {1..20}; do metaplex mint_one_token -k kodama-wallet.json -env mainnet-beta; done

Candy Machine is BQEZ1iX8wFE3EWN5DcsHJN33EraEdEju3SHu9fKxSy5r

93vVEKaBeJC79pi7g1S2wkfHPU5cFG2Ua1tbgzTzNbqi