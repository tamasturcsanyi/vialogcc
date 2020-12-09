#!/bin/bash
set -x #echo on

CHAINCODE_NAME="vialog_prod_cc"
CHAINCODE_VERSION="1.0"
CHAINCODE_SRC_CODE_PATH="/root/CLI/vialogcc/vialog_chaincode/node"

export PEER_HOST=peer2
export CORE_PEER_ADDRESS=${PEER_HOST}:7051
export CORE_PEER_MSPCONFIGPATH=/root/CLI/${ORGCA_HOST}/${ADMIN_USER}/msp
export CORE_PEER_TLS_ROOTCERT_FILE=/root/CLI/${ORGCA_HOST}/${PEER_HOST}/msp/tls/ca.crt

CORE_PEER_ADDRESS=$CORE_PEER_ADDRESS CORE_PEER_MSPCONFIGPATH=$CORE_PEER_MSPCONFIGPATH CORE_PEER_TLS_ROOTCERT_FILE=$CORE_PEER_TLS_ROOTCERT_FILE peer chaincode install -n $CHAINCODE_NAME -v $CHAINCODE_VERSION -l node -p $CHAINCODE_SRC_CODE_PATH

