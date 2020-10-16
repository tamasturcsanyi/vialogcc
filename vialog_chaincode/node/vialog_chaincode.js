/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const util = require('util');
const { Video } = require('./videoModeration');

let video = new Video();

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

  async addVideoEvent(stub, args) {
    if (args.length != 16) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }

    let [videoId, video_token, replyTo, created, duration, videoResolution, label, threadId, position, views, moderatedBy, moderationDate, communityManagerNotes, rewards, video_state, video_type] = args;

    let video = await video.created(videoId, video_token, replyTo, created, duration, videoResolution, label, threadId, position, views, moderatedBy, moderationDate, communityManagerNotes, rewards, video_state, video_type);
    let id = video.getStateId(video.videoId);

    let buffer = Buffer.from(JSON.stringify(video));
    await stub.putState(id, buffer);

    return buffer;
  }

  // query callback representing the query of a chaincode
  async query(stub, args) {
    let videos = [];
    let jsonResp = {};
    if (args.length == 1) {      
      let id = args[0];

      // Get the state from the ledger
      let Avalbytes = await this.getHistoryForId('video'+ id);
      if (!Avalbytes) {
        jsonResp.error = 'Failed to get state for ' + id;
        throw new Error(JSON.stringify(jsonResp));
      }

      let item = {
        VideoId: Avalbytes.value.videoId,
        History: JSON.parse(Avalbytes.toString())
      };

      videos.push(item);
    } else if (args.length == 2) {
      let jsonResp = {};
      let startId = args[0];
      let endId = args[1];

      // Get the state from the ledger
      let iter = await stub.getStateByRange(startId, endId);
      let results = await this.getAllResults(stub, iter);
      let video = JSON.parse(Avalbytes.toString());
    }

    console.info('Query Response:');
    console.info(videos);
    return videos;
  }

  async assetExists(stub, id) {
    const buffer = await stub.getState(id);
    return (!!buffer && buffer.length > 0);
  }

  async getAllResults(stub, iterator) {
    let allResults = [];

    while (true) {
      let res = await iterator.next();
      if (res && res.value) {
          
          let id = video.getStateId(res.value.videoId);
          let history = await this.getHistoryForId(stub, id)

          let item = {
            VideoId: res.value.videoId,
            History: videoHistory
          };

          allResults.push(item);
      }
      if (res.done) {
          await iterator.close();
          return allResults;
      }
    }
  }

  async getHistoryForId(id) {
    let videoHistory = {};
    let historyIter = stub.GetHistoryForKey(id);
    while(true) {
      let videoHistoryItem = await historyIter.next();
      if (videoHistoryItem && videoHistoryItem.value) {
        videoHistory.push(videoHistoryItem);
      }

      if (res.done) {
        break;
      }
    }

    return videoHistory;
  }

};

shim.start(new Chaincode());
