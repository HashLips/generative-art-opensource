#!/bin/bash
# generate the NFT and metadata to the output folder
# call this as follows:
# ./mintMe.bash <number of NFT editions> <how much it costs to mint on Candy Machine> <date time value>
# example:
# ./mintMe.bash 10 1 '15 Sep 2021 00:00:00 GMT'
# will create and mint 10 NFTs with a minting cost of 1 SOL and 
# make minting available on 9/15/2021.
if [ "$1" == "-h" ]; then
  echo "Usage: `basename $0` [number of editions to create] [amount to charge to mint] [date (use format "%c")]";
  echo "Example: `basename $0` 100 1 date+"%c"";
  echo "         will mint 100 editions and set up candymachine to sell at 1 SOL from the current date";
  exit 0
fi
echo "<ctrl-c> any time to quit the generator"
echo "Creating the output directory if it doesn't exist"
OUTPUT_DIR="./output"

read -p "Would you like to clear out the output directory? [Y/n]" CLEAR_OUTPUT_DIR
if [ $CLEAR_OUTPUT_DIR == 'Y' ]
then
  rm -Rf output
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  mkdir $OUTPUT_DIR
fi

read -p "Your layers should be prepared at this time.  Are you ready to generate $1 NFTs? [Y/n]" READY_TO_GENERATE
if [ $READY_TO_GENERATE == 'Y' ]
then
  echo "generating $1 NFTs"
  node index.js $1
else
  echo "OK - quitting now.  Please make sure your layers are ready to go for next time."
fi

# create a new wallet
read -p "Do you need a new wallet? [Y/n]" NEW_WALLET
if [ $NEW_WALLET == 'Y' ]
then
  read -p "What name do you want the wallet to have?" NEW_WALLET_NAME
  solana-keygen new --outfile `../walletbackups/$NEW_WALLET_NAME.json`
  echo `Wallet $NEW_WALLET_NAME created.  Airdropping 10 SOL to it`
  solana airdrop 10 -u devnet -k ../walletbackups/dev-wallet.json
else
  echo "Using the current wallet"
fi 
# airdrop 10 SOL to the new dev wallet
read -p "Should we destroy the last .cache directory?  THIS WILL DESTROY THE LAST RUN.  [YES/n]" DESTROY_CACHE
if [ $DESTROY_CACHE == 'YES' ]
then 
  echo "Destroying the remnants of the last run"
  rm -Rf .cache
  echo "Uploading NFTs to Arweave"
  metaplex upload ./output --env devnet --keypair ../walletbackups/dev-wallet.json
fi
metaplex verify --env devnet --keypair ../walletbackups/dev-wallet.json
read -p "Ready to create the candy machine with a minting price of $2? [YES/n]" CREATE_CANDY_MACHINE
if [ $CREATE_CANDY_MACHINE == 'YES' ]
then
  metaplex create_candy_machine --keypair ../walletbackups/dev-wallet.json -p $2 --env devnet 
  
  metaplex set_start_date --keypair ../walletbackups/dev-wallet.json -d $3 --env devnet
  echo "Minting $1 editions now"
  for x in {1..$1}; do metaplex mint_one_token --keypair ../walletbackups/dev-wallet.json --env devnet json; done
  echo "Your NFTs are ready!"
  exit 0
else
  echo "If you don't want a new candy machine, then time to shut down."
  exit 0
fi  

