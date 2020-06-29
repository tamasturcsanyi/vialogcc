/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const util = require('util');


var Chaincode = class {

  // Initialize the chaincode
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('=========== Vialog Chaincode ===========');
    return shim.success();
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.log('no method of name:' + ret.fcn + ' found');
      return shim.success();
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async addVideo(stub, args) {
    if (args.length != 6) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }

    let id = args[0];
    let created = args[1];
    let state = args[2];
    let threadid = args[3];
    let hash = args[4];
    let source = args[5];

    let video = {
      Id: id,
      Created: created,
      State: state,
      ThreadId: threadid,
      Hash: hash,
      Source: source
    };

    let buffer = Buffer.from(JSON.stringify(video));
    await stub.putState(id, buffer);

    return buffer;
  }

  // query callback representing the query of a chaincode
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting id of the video to query')
    }

    let jsonResp = {};
    let id = args[0];

    // Get the state from the ledger
    let Avalbytes = await stub.getState(id);
    if (!Avalbytes) {
      jsonResp.error = 'Failed to get state for ' + id;
      throw new Error(JSON.stringify(jsonResp));
    }

    let video = JSON.parse(Avalbytes.toString());

    console.info('Query Response:');
    console.info(video);
    return video;
  }
};

shim.start(new Chaincode());
