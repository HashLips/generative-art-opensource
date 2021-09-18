#!/bin/bash
# generate the NFT and metadata to the output folder
# call this as follows:
# ./mintMe.bash <number of NFT editions> <how much it costs to mint on Candy Machine> 
# example:
# ./mintMe.bash 10 1
# will create and mint 10 NFTs with a minting cost of 1 SOL
if [ "$1" == "-h" ]; then
  echo "Usage: `basename $0` [number of editions to create] [amount to charge to mint]";
  echo "Example: `basename $0` 100 .666";
  echo "         will mint 100 editions and set up candymachine to sell at .666 SOL from the current date";
  exit 0
fi
echo "<ctrl-c> any time to quit the generator"

# create a new wallet
read -p "Do you need a new wallet? [Y/n]   " NEW_WALLET
if [ $NEW_WALLET == 'Y' ]
then
  read -p "DID YOU BACKUP YOUR OLD WALLET?  If not, and you need to, do it now."
  read -p "What name do you want the wallet to have?   " NEW_WALLET_NAME
  solana-keygen new --outfile "../walletbackups/$NEW_WALLET_NAME" --force
  echo "Wallet $NEW_WALLET_NAME created.  Airdropping 10 SOL to it"
  solana airdrop 10 -u devnet -k ../walletbackups/$NEW_WALLET_NAME
else
  NEW_WALLET_NAME=NEW_HOTNESS.json
fi
WALLET_NAME=$NEW_WALLET_NAME 
PUBLIC_KEY=`solana address -k ../walletbackups/$WALLET_NAME`
echo "Public Key for the generating wallet is $PUBLIC_KEY"

read -p "Go set up Phoenix or Sollet or Solflare with the new wallet.  Create a new wallet (with this passphrase AND THEN import the private key to a new account.  Press any key to continue..."

echo "Creating the output directory if it doesn't exist"
OUTPUT_DIR="./output"

read -p "Would you like to clear out the output directory? [Y/n]   " CLEAR_OUTPUT_DIR
if [ $CLEAR_OUTPUT_DIR == 'Y' ]
then
  rm -Rf output
fi

if [ ! -d "$OUTPUT_DIR" ]; then
  mkdir $OUTPUT_DIR
fi

read -p "Your layers should be prepared at this time.  Are you ready to generate $1 NFTs? [Y/n]   " READY_TO_GENERATE
if [ $READY_TO_GENERATE == 'Y' ]
then
  echo "generating $1 NFTs"
  node index.js $1 $PUBLIC_KEY
else
  echo "OK - quitting now.  Please make sure your layers are ready to go for next time."
fi

read -p "Should we destroy the last .cache directory?  THIS WILL DESTROY THE LAST RUN.  [YES/n]   " DESTROY_CACHE
if [ $DESTROY_CACHE == 'YES' ]
then 
  echo "Destroying the remnants of the last run"
  rm -Rf .cache
  echo "Uploading NFTs to Arweave"
  metaplex upload ./output --env devnet --keypair ../walletbackups/$WALLET_NAME
fi
metaplex verify --env devnet --keypair ../walletbackups/$WALLET_NAME
read -p "Ready to create the candy machine with a minting price of $2? [YES/n]   " CREATE_CANDY_MACHINE
if [ $CREATE_CANDY_MACHINE == 'YES' ]
then
  metaplex create_candy_machine --keypair ../walletbackups/$WALLET_NAME -p $2 --env devnet 
  
  metaplex set_start_date --keypair ../walletbackups/$WALLET_NAME -d $(date --date"=0 day ago" +%y%m%d) --env devnet
  echo "Minting $1 editions now"
  for x in {1..$1}; do metaplex mint_one_token --keypair ../walletbackups/$WALLET_NAME --env devnet json; done
  echo "Your NFTs are ready!"
  exit 0
else
  echo "If you don't want a new candy machine, then time to shut down."
  exit 0
fi  

