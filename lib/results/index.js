var through = require('through2'),
  path = require('path'),
  bluebird = require('bluebird'),
  gracefulFs = require('graceful-fs'),
  fs = bluebird.promisifyAll(gracefulFs),
  fsExists = gracefulFs.exists,
  mkdirp = require('mkdirp'),
  _ = require('lodash'),
  addBundleResults = require('./add-to-results');

function defaultOptions(opts) {
  var options = {
    dest: './',
    pathPrefix: '',
    fileName: 'bundle.result',
    outputUnprocessed: false,
    unprocessedOutputFileName: 'bundle.source',
    unprocessedOutputPathPrefix: opts.pathPrefix || '',
    sortUnprocessedOutput: true
  };
  if (typeof opts === 'string') {
    options.dest = opts;
  } else {
    _.assign(options, opts);
  }
  return options;
}

module.exports = {
  all: function (opts) {
    var resultJsons = {},
      resultOrder,
      options = defaultOptions(opts);

    function collectResults(file, enc, cb) {
      addBundleResults(resultJsons, file, options.pathPrefix, options.fileName, options.outputUnprocessed && options.unprocessedOutputFileName, options.unprocessedOutputPathPrefix, options.sortUnprocessedOutput);
      if (!resultOrder) {
        try {
          resultOrder = file.bundle.result.bundleOrder; // Any one of these properties could be null
        } catch (err) {}
      }
      this.push(file);
      cb();
    }

    function writeResults(done) {
      mkdirp(options.dest, function (err) {
        if (err) throw err;

        var streams = [];

        _.each(resultJsons, function (result) {
          var sortedContents = {};
          try {
            // order bundle names based on original bundle.config.js ordering
            _.each(resultOrder || Object.keys(result.contents), function (key) {
              // order scripts/styles for consistency
              var sortedBundleTypes = {};
              _.each(Object.keys(result.contents[key]).sort(), function (typeKey) {
                sortedBundleTypes[typeKey] = result.contents[key][typeKey];
              });
              sortedContents[key] = sortedBundleTypes;
            });
          } catch (err) { // any problems sorting? just fall back to what we get out of the stream
            sortedContents = result.contents;
          }
          var filePath = path.join(options.dest, result.filename),
            data = JSON.stringify(sortedContents, null, 2);
          streams.push(fs.writeFileAsync(filePath, data));
        });

        bluebird.all(streams).then(function () {
          done();
        });

      });
    }

    return through.obj(collectResults, writeResults);
  },
  incremental: function (opts) {
    var resultJsons = {},
      options = defaultOptions(opts);

    return through.obj(function (file, enc, cb) {

      var self = this;

      if (file.bundle) {

        addBundleResults(resultJsons, file, options.pathPrefix, options.fileName);

        mkdirp(options.dest, function (err) {
          if (err) throw err;

          var envKey = _.findKey(resultJsons, function () {
            return true;
          });

          var filePath = path.join(options.dest, resultJsons[envKey].filename);

          fsExists(filePath, function (exists) {

            var action;
            if (exists) {
              action = fs.readFileAsync(filePath, 'utf8')
                .then(function (data) {
                  var newData = resultJsons[envKey].contents;
                  var mergedData = _.merge(JSON.parse(data), newData);
                  var sortedData = {};
                  var resultOrder;
                  try {
                    resultOrder = file.bundle.result.bundleOrder; // Any one of these properties could be null
                    // order bundle names based on original bundle.config.js ordering
                    _.each(resultOrder || Object.keys(mergedData), function (key) {
                      // order scripts/styles for consistency
                      var sortedBundleTypes = {};
                      _.each(Object.keys(mergedData[key]).sort(), function (typeKey) {
                        sortedBundleTypes[typeKey] = mergedData[key][typeKey];
                      });
                      sortedData[key] = sortedBundleTypes;
                    });
                  } catch (err) { // any problems sorting? just fall back to what we get out of the stream
                    sortedData = mergedData;
                  }
                  return fs.writeFileAsync(filePath, JSON.stringify(sortedData, null, 2));
                });
            } else {
              var freshData = JSON.stringify(resultJsons[envKey].contents, null, 2);
              action = fs.writeFileAsync(filePath, freshData);
            }
            action.then(function () {
              self.push(file);
              cb();
            });
          });
        });

      } else {
        self.push(file);
        cb();
      }

    });
  }
};
