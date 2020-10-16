#!/bin/bash
set -x #echo on

export CORE_PEER_ADDRESS="peer2:7051"
export CORE_PEER_MSPCONFIGPATH="/root/admin/msp"
export CORE_PEER_TLS_ROOTCERT_FILE="/root/${PEER2_HOST}/tls-msp/tlscacerts/tls-${TLSCA_HOST}-7054.pem"
export CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS
export CORE_PEER_MSPCONFIGPATH=$CORE_PEER_MSPCONFIGPATH
export CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_TLS_ROOTCERT_FILE


peer chaincode invoke -C appchannel -n vialog_dev_cc -c '{"Args":["addVideoEvent", "1", "testVideoToken", "", "2020-06-24T18:10:08", "6.14", "240x400", "", "890", "1", "0", "ef7f9b47-8f8f-4a59-b48a-f97e7571a7d6", "2020-06-24T18:10:08", "", "0", "Created", "Normal"]}' --tls --cafile ${CORE_PEER_TLS_ROOTCERT_FILE}
