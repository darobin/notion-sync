
let { NotionAPI } = require('notion-client')
  , { resolve, join } = require('path')
  , { mkdirSync, readFileSync, writeFileSync } = require('fs')
;

module.exports = class NotionSync {
  constructor (token, dir, spaceId) {
    this.nc = new NotionAPI({ authToken: token });
    this.spaceId = spaceId;
    this.dir = resolve(process.cwd(), dir, spaceId);
    mkdirSync(this.dir, { recurse: true });
    this.indexPath = join(this.dir, 'index.json');
    try {
      this.index = JSON.parse(readFileSync(this.indexPath));
    }
    catch (err) {
      this.saveIndex();
    }
  }
  saveIndex () {
    if (!this.index) {
      this.index = {
        versions: {},
      };
    }
    writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2), 'utf8');
  }
  uuidPath (uuid) {
    uuid = uuid.toLowerCase();
    let pfx = uuid.substr(0, 2);
    return join(this.dir, pfx, `${uuid}.json`);
  }
  readFile (uuid) {
    return JSON.parse(readFileSync(this.uuidPath(uuid)));
  }
  writeFile (uuid, data) {
    writeFileSync(this.uuidPath(uuid), JSON.stringify(data, null, 2));
  }
  async sync () {
    // XXX:
    //  - get the spaceId document
    //  - if we have no cached content for it:
    //    - get all docs in it, and for each doc
    //      - look at their `content`, and filter that from `blocks` to find pages and collections
    //      - for every page, recurse
    //      - for every collection, look at how to get collection stuff
    //      - store all results locally
    //      - in each document, look for binary attachments and download those to store them under
    //        their UUID (look for the Amazon link, really, not the type)
    //      - for each doc, add it to the index with its version number
    //  - if there is already content for it:
    //    - load the cache
    //    - make a syncRecordValues call with all block and versions (paged)
    //    - update local store
  }
};
