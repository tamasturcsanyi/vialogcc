/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const { Video } = require('./videoModeration');

let video = new Video();
let mycc;

class Chaincode {

  // Initialize the chaincode
  async Init(stub) {
    mycc = new Chaincode();

    try {
        return shim.success();
    } catch (e) {
        return shim.error(e);
    }
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
    if (args.length != 18) {
      throw new Error('Incorrect number of arguments. Expecting 17');
    }
    console.log("AddVideoEvent Called");
    let [type, videoId, eventName, video_token, replyTo, created, duration, videoResolution, label, threadId, position, views, moderatedBy, moderationDate, communityManagerNotes, rewards, video_state, video_type] = args;
    console.log("VideoId");
    console.log(videoId);
    let newVideo = await video.create(type, videoId, eventName, video_token, replyTo, created, duration, videoResolution, label, threadId, position, views, moderatedBy, moderationDate, communityManagerNotes, rewards, video_state, video_type);
    let id = mycc.getStateId(type,videoId);
    console.log("Before ID");
    console.log(id);
    console.log(typeof id);
    console.log("After ID");
    console.log(newVideo);
    let buffer = Buffer.from(JSON.stringify(newVideo));
    await stub.putState(id, buffer);

    return buffer;
  }

  // query callback representing the query of a chaincode
  async query(stub, args) {
    let videos = [];
    let jsonResp = {};

    console.log("Args: ",args); 

    if (args.length == 2) {      
      let id = mycc.getStateId(args[0],args[1]);

      console.log("Single Id: ", id);
      console.log("Id type: ", typeof id); 

      // Get the state from the ledger
      let Avalbytes = await mycc.getHistoryForId(id);
      if (!Avalbytes) {
        jsonResp.error = 'Failed to get state for ' + id;
        throw new Error(JSON.stringify(jsonResp));
      }
      
      console.log(Avalbytes);

      let item = {
        VideoId: Avalbytes.value.videoId,
        History: JSON.parse(Avalbytes.toString())
      };

      console.log("Item: ", item); 

      videos.push(item);
    } else if (args.length == 3) {
      let type = args[0];
      let startId = mycc.getStateId(type,args[1]);
      console.log("Start Id: ", startId);
      let endId = mycc.getStateId(type,args[2]);
      console.log("End Id: ", endId);

      // Get the state from the ledger
      let iter = await stub.getStateByRange(startId,endId);
      videos = await mycc.getAllResults(stub, iter, type);
    } else {
      let type = args[0];
      let iter = await stub.getStateByPartialCompositeKey(type, null);
      videos = await mycc.getAllResults(stub, iter, type);
    }

    console.log('Query Response:');
    console.log(videos);
    return videos;
  }

  async assetExists(stub, id) {
    const buffer = await stub.getState(id);
    return (!!buffer && buffer.length > 0);
  }

  async getAllResults(stub, iterator, type) {
    let allResults = [];
    console.log("getAllResults Called.");
    while (true) {
      let res = await iterator.next();
      if (res && res.value) {
          
        if (type == 'video') {
          let id = mycc.getStateId(type,res.value.videoId);
          let history = await mycc.getHistoryForId(stub, id)

          let item = {
            VideoId: res.value.videoId,
            History: history
          };

          console.log(item);
          allResults.push(item);
        }
      }
      if (res.done) {
          await iterator.close();
          console.log("getAllResults Ended.");
          console.log(allResults);
          return allResults;
      }
    }
  }

  async getHistoryForId(stub, id) {
    let videoHistory = {};
    console.log("getHistoryForId Called.");
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

    console.log("getHistoryForId Ended.");
    console.log(videoHistory);
    
    return videoHistory;
  }

  getStateId(type,id) {
    return type + id;
  }

};

shim.start(new Chaincode());
