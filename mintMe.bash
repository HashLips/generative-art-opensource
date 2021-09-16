#!/bin/bash
# generate the NFT and metadata to the output folder
# call this as follows:
# ./mintMe.bash <number of NFT editions> <how much it costs to mint on Candy Machine> <date time value>
# example:
# ./mintMe.bash 10 1 '15 Sep 2021 00:00:00 GMT'
# will create and mint 10 NFTs with a minting cost of 1 SOL and 
# make minting available on 9/15/2021.
node index.js $2
# create a new wallet
# solana-keygen new --outfile ../walletbackups/dev-wallet.json 
# airdrop 10 SOL to the new dev wallet
solana airdrop 10 -u devnet -k ../walletbackups/dev-wallet.json
echo "Destroying the remnants of the last run"
rm -Rf .cache
rm ./output/*
metaplex upload ./output --env devnet --keypair ../walletbackups/dev-wallet.json
metaplex verify --env devnet --keypair ../walletbackups/dev-wallet.json
metaplex create_candy_machine --keypair ../walletbackups/dev-wallet.json -p $3 --env devnet
metaplex set_start_date --keypair ../walletbackups/dev-wallet.json -d $4 --env devnet
for x in {1..$2}; do metaplex mint_one_token --keypair ../walletbackups/dev-wallet.json --env devnet; done
echo 'Your NFTs are ready!'
