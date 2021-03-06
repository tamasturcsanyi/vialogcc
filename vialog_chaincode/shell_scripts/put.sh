#!/bin/bash
set -x #echo on

CHAINCODE_NAME="vialog_dev_cc"
CHANNEL_NAME="appchannel"
INVOKE_PARAMS='{"Args":["addVideoEvent","video","1","Test","testVideoToken","","2020-06-24T18:10:08","6.14","240x400","","890","1","0","ef7f9b47-8f8f-4a59-b48a-f97e7571a7d6","2020-06-24T18:10:08","","0","Created","Normal"]}'

export PEER_HOST=peer2
export CORE_PEER_ADDRESS=${PEER_HOST}:7051
export CORE_PEER_MSPCONFIGPATH=/root/CLI/${ORGCA_HOST}/${ADMIN_USER}/msp
export CORE_PEER_TLS_ROOTCERT_FILE=/root/CLI/${ORGCA_HOST}/${PEER_HOST}/msp/tls/ca.crt

CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS CORE_PEER_MSPCONFIGPATH=/root/CLI/${ORGCA_HOST}/${PEER_HOST}/msp CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_TLS_ROOTCERT_FILE peer chaincode invoke -C $CHANNEL_NAME -n $CHAINCODE_NAME -c $INVOKE_PARAMS -o ${ORDERER_HOST}:7050 --tls --cafile ${CORE_PEER_TLS_ROOTCERT_FILE}
